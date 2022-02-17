import styles from '../styles/Home.module.scss';
import {
  StarIcon,
  ForkIcon,
  GitHubIcon,
  CommentIcon,
} from '../components/icons';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Layout({
  children,
  homepage,
  forks_count,
  stargazers_count,
  issue_count,
}: any) {
  const router = useRouter();
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
              on-demand-isr
            </a>
            ` repo change (get created, commented on, deleted, etc), GitHub
            fires off a webhook and the impacted pages get re-rendered and
            pushed to the edge, on demand. The webhook on the Next.js app side
            executes a new{' '}
            <a
              href="https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration.md#on-demand-revalidation-beta"
              target="_blank"
              rel="noreferrer"
            >
              <code>`res.unstable_revalidate()`</code>
            </a>{' '}
            API call.
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
            or commenting, and refresh this page to see the regenerated one!_
          </em>{' '}
          <br />
          <span className={styles.explanation_notes}>
            Pages take about <b>*300ms~*</b> to fully propagate to the global
            Vercel Edge Network after the regeneration completes.
          </span>
        </p>
      </div>

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
          /{' '}
          <Link href="/">
            <a>on-demand-isr</a>
          </Link>
          {router.query.id && (
            <>
              {' '}
              /{' '}
              <a
                href={`https://github.com/leerob/on-demand-isr/issues/${router.query.id}`}
                target="_blank"
                rel="noreferrer"
              >
                #{router.query.id}
              </a>
            </>
          )}
        </div>
        {homepage ? (
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
        ) : (
          <div className={styles.forks_stars}>
            <a
              href="https://github.com/leerob/on-demand-isr"
              target="_blank"
              rel="noreferrer"
            >
              <CommentIcon /> {new Number(issue_count).toLocaleString()}
            </a>
          </div>
        )}
      </div>

      {children}
    </main>
  );
}
