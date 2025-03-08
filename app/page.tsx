import styles from '../styles/Home.module.scss';
import Link from 'next/link';
import {
  CommentIcon,
  IssueIcon,
  StarIcon,
  ForkIcon,
  GitHubIcon
} from './icons';
import { fetchIssueAndRepoData } from '../lib/github';
import Explanation from './explanation';
import { Time } from './time-ago';

export default async function Page() {
  try {
    const { issues, forks_count, stargazers_count } =
      await fetchIssueAndRepoData();

    return (
      <main className={styles.main}>
        <Explanation />
        <div className={styles.repo}>
          <div className={styles.repo_title}>
            <GitHubIcon />{' '}
            <a
              href="https://github.com/vercel/on-demand-isr"
              target="_blank"
              rel="noreferrer"
            >
              vercel
            </a>{' '}
            / <Link href="/">on-demand-isr</Link>
          </div>
          <div className={styles.forks_stars}>
            <a
              href="https://github.com/vercel/on-demand-isr/fork"
              target="_blank"
              rel="noreferrer"
            >
              <ForkIcon /> {new Number(forks_count).toLocaleString()}
            </a>
            <a
              href="https://github.com/vercel/on-demand-isr"
              target="_blank"
              rel="noreferrer"
            >
              <StarIcon /> {new Number(stargazers_count).toLocaleString()}
            </a>
          </div>
        </div>
        <div className={styles.issues}>
          {issues.map((issue: any) => (
            <IssueLink key={issue.number} issue={issue} />
          ))}
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error fetching issue and repository data:', error);
    return <div>Error loading data. Please try again later.</div>;
  }
}

function IssueLink({ issue }: { issue: any }) {
  return (
    <Link href={`/${issue.number}`} className={styles.issue}>
      <div className={styles.left}>
        <IssueIcon />
        <div>
          <div className={styles.issue_title}>{issue.title}</div>
          <div className={styles.issue_desc}>
            {`#${issue.number} opened `}
            {` by ${issue.user.login}`}
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <Time time={issue.created_at} />
        <div className={styles.comment_count}>
          <CommentIcon /> {new Number(issue.comments).toLocaleString()}
        </div>
      </div>
    </Link>
  );
}
