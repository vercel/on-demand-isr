import styles from '../../styles/Home.module.scss';
import Link from 'next/link';
import { GitHubIcon, LinkIcon } from '../icons';
import Explanation from '../explanation';

export default async function IssueLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

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
          / <Link href="/">on-demand-isr</Link> /{' '}
          <a
            href={`https://github.com/vercel/on-demand-isr/issues/${id}`}
            target="_blank"
            rel="noreferrer"
          >
            #{id}
          </a>
        </div>
        <div className={styles.issue_comments}>
          <a
            href={`https://github.com/vercel/on-demand-isr/issues/${id}`}
            target="_blank"
            rel="noreferrer"
          >
            <LinkIcon /> {'Open in GitHub'}
          </a>
        </div>
      </div>
      {children}
    </main>
  );
}
