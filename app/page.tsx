import styles from '../styles/Home.module.scss';
import Link from 'next/link';
import {
  CommentIcon,
  IssueIcon,
  StarIcon,
  ForkIcon,
  GitHubIcon,
} from './icons';
import { fetchIssueAndRepoData } from '../lib/github';
import Explanation from './explanation';
import getFormattedTime from './time-ago';

export default async function Page() {
  const { issues, forks_count, stargazers_count } =
    await fetchIssueAndRepoData();

  return (
    <main className={styles.main}>
      <Explanation />
      <div className={styles.repo}>
        <div className={styles.repo_title}>
          <GitHubIcon />{' '}
          <a
            href="https://github.com/leerob/on-demand-isr"
            target="_blank"
            rel="noreferrer"
          >
            leerob
          </a>{' '}
          / <Link href="/">on-demand-isr</Link>
        </div>
        <div className={styles.forks_stars}>
          <a
            href="https://github.com/leerob/on-demand-isr/fork"
            target="_blank"
            rel="noreferrer"
          >
            <ForkIcon /> {new Number(forks_count).toLocaleString()}
          </a>
          <a
            href="https://github.com/leerob/on-demand-isr"
            target="_blank"
            rel="noreferrer"
          >
            <StarIcon /> {new Number(stargazers_count).toLocaleString()}
          </a>
        </div>
      </div>
      <div className={styles.issues}>
        {issues.map((issue: any) => (
          <Link
            key={issue.number}
            href={`/${issue.number}`}
            className={styles.issue}
          >
            <IssueIcon />
            <div>
              <div className={styles.issue_title}>{issue.title}</div>
              <div className={styles.issue_desc}>
                #{issue.number} opened {getFormattedTime(issue.created_at)} by{' '}
                {issue.user.login}
              </div>
            </div>
            {issue.comments > 0 && (
              <div className={styles.comment_count}>
                <CommentIcon /> {new Number(issue.comments).toLocaleString()}
              </div>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
