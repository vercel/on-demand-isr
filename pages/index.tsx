import jwt from 'jsonwebtoken';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import styles from '../styles/Home.module.scss';
import Link from 'next/link';
import Layout from '../components/Layout';
import { IssueIcon } from '../components/icons';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

export async function getStaticProps() {
  let d = Date.now();

  const token = getGitHubJWT();
  const installation = await getInstallation(token);
  const accessToken = await getAccessToken(installation.id, token);
  const issues = await getIssues(accessToken);

  console.log(`[Next.js] Running getStaticProps...`);
  console.log(`[Next.js] Fetched issues: ${Date.now() - d}ms`);

  d = Date.now();
  const { stargazers_count, forks_count } = await getRepoDetails(accessToken);
  console.log(`[Next.js] Fetched repo details: ${Date.now() - d}ms`);

  return {
    props: {
      issues,
      stargazers_count,
      forks_count,
    },
    revalidate: 60,
  };
}

function getIssues(token: string) {
  return fetchGitHub('/repos/leerob/on-demand-isr/issues', token);
}

function getRepoDetails(token: string) {
  return fetchGitHub('/repos/leerob/on-demand-isr', token);
}

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

async function fetchGitHub(path: string, token: string, opts: any = {}) {
  const req = await fetch(`https://api.github.com${path}`, {
    ...opts,
    headers: {
      ...opts.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github.v3+json',
    },
  });

  return req.json();
}

export default function Home({ issues, stargazers_count, forks_count }: any) {
  return (
    <Layout
      homepage={true}
      forks_count={forks_count}
      stargazers_count={stargazers_count}
    >
      <div className={styles.issues}>
        {issues.map((issue: any) => (
          <Link key={issue.number} href={`/${issue.number}`}>
            <a className={styles.issue} key={issue.id}>
              <IssueIcon />
              <div>
                <div className={styles.issue_title}>{issue.title}</div>
                <div className={styles.issue_desc}>
                  #{issue.number} opened{' '}
                  {timeAgo.format(new Date(issue.created_at))} by{' '}
                  {issue.user.login}
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
