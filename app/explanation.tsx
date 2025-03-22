import styles from '../styles/Home.module.scss';

export default function Explanation() {
  return (
    <div className={styles.explanation}>
      <p>
        This app demonstrates <b>*On-Demand ISR support*</b> in Next.js (
        <a
          href="https://github.com/vercel/on-demand-isr"
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
            href="https://github.com/vercel/on-demand-isr"
            target="_blank"
            rel="noreferrer"
          >
            on-demand-isr
          </a>
          ` repo change (get created, commented on, deleted, etc), GitHub fires
          off a webhook and the impacted pages get re-rendered and pushed to the
          edge, on demand. The webhook on the Next.js app side executes a new{' '}
          <a
            href="https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#revalidating-data"
            target="_blank"
            rel="noreferrer noopener"
          >
            <code>`revalidatePath()`</code>
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
            href="https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#time-based-revalidation"
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
            href="https://github.com/vercel/on-demand-isr/issues/new"
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
  );
}
