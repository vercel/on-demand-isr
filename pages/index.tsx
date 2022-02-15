import jwt from 'jsonwebtoken';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import styles from '../styles/Home.module.scss';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

export async function getStaticProps() {
  const d = Date.now();
  const token = getGitHubJWT();
  const installation = await getInstallation(token);
  const accessToken = await getAccessToken(installation.id, token);
  const issues = await getIssues(accessToken);

  console.log(`[Next.js] Running getStaticProps...`);
  console.log(`[Next.js] Fetched issues: ${Date.now() - d}ms`);

  return {
    props: {
      issues,
    },
    revalidate: 60,
  };
}

function getIssues(token: string) {
  return fetchGitHub('/repos/leerob/on-demand-isr/issues', token);
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

export default function Home({ issues }: any) {
  return (
    <main className={styles.main}>
      <div className={styles.explanation}>
        <p>
          This app demonstrates the new <b>*On-Demand ISR support*</b> in
          Next.js 12.1 (
          <a
            href="https://github.com/leerob/on-demand-isr"
            target="_blank"
            rel="noreferrer"
          >
            view source
          </a>
          ).
        </p>

        <details className={styles.details}>
          <summary>
            <span>How does this work?</span>
          </summary>
          <p>
            When issues on the `
            <a
              href="https://github.com/leerob/on-demand-isr"
              target="_blank"
              rel="noreferrer"
            >
              isr-issues-test
            </a>
            ` repo change (get created, reacted to, deleted, etc), GitHub fires
            off a webhook and the impacted pages get re-rendered and pushed to
            the edge, on demand. The webhook on the Next.js app side executes a
            new <code>`res.unstable_revalidate()`</code> API call.
          </p>
        </details>

        <details className={styles.details}>
          <summary>
            <span>Didn&#39;t this exist already?</span>
          </summary>

          <p>
            Unlike <code>`revalidate`</code>{' '}
            <a
              href="https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration"
              target="_blank"
              rel="noreferrer"
            >
              with a time interval
            </a>
            , a Serverless Function is invoked{' '}
            <em>_only when content changes_</em>, making it faster for the user
            (they see changes immediately), and more cost-efficient for owners.
          </p>
        </details>

        <p>
          <em>
            _💡 Try{' '}
            <a
              href="https://github.com/leerob/on-demand-isr/issues/new"
              target="_blank"
              rel="noreferrer"
            >
              creating a new issue
            </a>{' '}
            or reacting to one, and refresh this page to see the regenerated
            one!_
          </em>{' '}
          <br />
          <span className={styles.explanation_notes}>
            Pages take about <b>*300ms~*</b> to fully propagate to the global
            Vercel Edge Network after the regeneration completes.
          </span>
        </p>
      </div>

      <div className={styles.repo_title}>
        <GitHubIcon />{' '}
        <a href="https://github.com/leerob" target="_blank" rel="noreferrer">
          leerob
        </a>{' '}
        /{' '}
        <a
          href="https://github.com/leerob/on-demand-isr"
          target="_blank"
          rel="noreferrer"
        >
          on-demand-isr
        </a>
      </div>

      <div className={styles.issues}>
        {issues.map((issue: any) => (
          <div className={styles.issue} key={issue.id}>
            <div className={styles.issue_reactions}></div>
            <div className={styles.issue_title}>
              <IssueIcon /> <a href="#">{issue.title}</a>
            </div>
            <div className={styles.issue_desc}>
              #{issue.number} opened{' '}
              {timeAgo.format(new Date(issue.created_at))} by {issue.user.login}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function GitHubIcon() {
  return (
    <svg
      className={styles.github_icon}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
    >
      <path d="M16 .4a16 16 0 00-5 31.2c.7.1 1-.4 1-.8v-2.7c-4.4 1-5.4-2.2-5.4-2.2-.7-1.8-1.8-2.3-1.8-2.3-1.4-1 .2-1 .2-1 1.6.1 2.4 1.7 2.4 1.7 1.4 2.4 3.7 1.7 4.7 1.3a3 3 0 011-2.1c-3.6-.4-7.3-1.8-7.3-8a6 6 0 011.6-4.2c-.1-.4-.7-2 .2-4.3 0 0 1.3-.4 4.4 1.7a15.4 15.4 0 018 0C23 6.6 24.4 7 24.4 7a6 6 0 01.1 4.3 6 6 0 011.7 4.3c0 6.1-3.8 7.5-7.3 7.9.5.4 1 1.4 1 3v4.3c0 .4.3 1 1.1.8A16 16 0 0016 .4z" />
    </svg>
  );
}

function IssueIcon() {
  return (
    <svg
      className={styles.issue_icon}
      viewBox="0 0 16 16"
      version="1.1"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
      <path
        fillRule="evenodd"
        d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"
      ></path>
    </svg>
  );
}
