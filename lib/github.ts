import jwt from 'jsonwebtoken';

let accessToken;

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

function createGitHubRequest(path: string, token: string, opts: any = {}) {
  return fetch(`https://api.github.com${path}`, {
    ...opts,
    headers: {
      ...opts.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3+json',
    },
  });
}

export async function fetchGitHub(path: string, token: string, opts: any = {}) {
  let req = await createGitHubRequest(path, token, opts);

  if (req.status === 401) {
    // JWT has expired, cache a new token
    await setAccessToken();
    // Retry request with new cached access token
    req = await createGitHubRequest(path, accessToken, opts);
  }

  return req.json();
}

export async function readAccessToken() {
  // check if exists
  if (!accessToken) {
    await setAccessToken();
  }

  return accessToken;
}

export async function setAccessToken() {
  const jwt = getGitHubJWT();
  const installation = await getInstallation(jwt);
  accessToken = await getAccessToken(installation.id, jwt);

  return accessToken;
}
