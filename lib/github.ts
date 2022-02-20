import jwt from 'jsonwebtoken';
import { promises as fs } from 'fs';
import path from 'path';

async function getAccessToken(installationId: number, token: string) {
  const data = await fetchGitHub(
    `/app/installations/${installationId}/access_tokens`,
    token,
    { method: 'POST' }
  );
  return data.token;
}

function getGitHubJWT() {
  return jwt.sign(
    {
      iat: Math.floor(Date.now() / 1000) - 60,
      iss: process.env.GITHUB_APP_ID,
      exp: Math.floor(Date.now() / 1000) + 60 * 10, // 10 minutes is the max
    },
    process.env.GITHUB_APP_PK_PEM,
    {
      algorithm: 'RS256',
    }
  );
}

async function getInstallation(token: string) {
  const installations = await fetchGitHub('/app/installations', token);
  return installations.find((i: any) => i.account.login === 'leerob');
}

export async function fetchGitHub(path: string, token: string, opts: any = {}) {
  const req = await fetch(`https://api.github.com${path}`, {
    ...opts,
    headers: {
      ...opts.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (req.status === 401) {
    // JWT has expired, cache a new one
    await setAccessToken();
  }

  return req.json();
}

export async function readAccessToken() {
  try {
    await fs.access(path.join(process.cwd(), 'token.json'));
  } catch {
    // Cached token does not exist, save to fs
    await setAccessToken();
  }

  const data = await fs.readFile(path.join(process.cwd(), 'token.json'));
  return JSON.parse(data as unknown as string);
}

export async function setAccessToken() {
  const jwt = getGitHubJWT();
  const installation = await getInstallation(jwt);
  const token = await getAccessToken(installation.id, jwt);

  return fs.writeFile(
    path.join(process.cwd(), 'token.json'),
    JSON.stringify(token)
  );
}
