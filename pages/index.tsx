import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import styles from '../styles/Home.module.scss';
import Link from 'next/link';
import Layout from '../components/Layout';
import { CommentIcon, IssueIcon } from '../components/icons';
import { fetchGitHub, readAccessToken } from '../lib/github';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

export async function getStaticProps() {
  const accessToken = await readAccessToken();
  const [issues, repoDetails] = await Promise.all([
    getIssues(accessToken),
    getRepoDetails(accessToken),
  ]);

  console.log('[Next.js] Running getStaticProps for /');
  console.log(`[Next.js] Issues: ${issues.length}`);
  return {
    props: {
      issues,
      stargazers_count: repoDetails.stargazers_count,
      forks_count: repoDetails.forks_count,
    },
  };
}

function getIssues(token: string) {
  return fetchGitHub('/repos/leerob/on-demand-isr/issues', token);
}

function getRepoDetails(token: string) {
  return fetchGitHub('/repos/leerob/on-demand-isr', token);
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
            <a className={styles.issue}>
              <IssueIcon />
              <div>
                <div className={styles.issue_title}>{issue.title}</div>
                <div className={styles.issue_desc}>
                  #{issue.number} opened{' '}
                  {timeAgo.format(new Date(issue.created_at))} by{' '}
                  {issue.user.login}
                </div>
              </div>
              {issue.comments > 0 && (
                <div className={styles.comment_count}>
                  <CommentIcon /> {new Number(issue.comments).toLocaleString()}
                </div>
              )}
            </a>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
