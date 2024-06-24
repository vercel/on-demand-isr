import { Suspense } from 'react';
import Image from 'next/image';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import styles from '../../styles/Home.module.scss';
import { fetchIssuePageData } from '../../lib/github';
import avatar from '../avatar.png';
import { Time } from '../time-ago';

function markdownToHtml(markdown) {
  if (!markdown) {
    return '';
  }

  const marked = new Marked(
    markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
    })
  );

  return marked.parse(markdown) as string;
}

export default async function IssuePage({
  params,
}: {
  params: { id: string };
}) {
  const { issue, comments } = await fetchIssuePageData(params.id);

  // Filter out comments that contain "bot" in the title
  const filteredComments = comments.filter(
    (comment) => !comment.user.login.toLowerCase().includes('bot')
  );

  return (
    <div className={styles.comments}>
      <a
        href={issue.html_url}
        target="_blank"
        rel="noreferrer"
        className={styles.comment}
        key={issue.id}
      >
        <div className={styles.image}>
          <Image
            alt={issue.user.login}
            src={issue.user?.avatar_url || avatar}
            className={styles.rounded}
            height={32}
            width={32}
          />
        </div>
        <div className={styles.comment_div}>
          <Suspense>
            <div className={styles.comment_timestamp}>
              <b>{issue.user.login}</b> commented{' '}
              <Time time={issue.created_at} />
            </div>
          </Suspense>
          <section
            dangerouslySetInnerHTML={{
              __html:
                markdownToHtml(issue.body) || '<i>No description provided.</i>',
            }}
            className={styles.comment_body}
          />
        </div>
      </a>
      {filteredComments.map((comment: any) => (
        <a
          href={comment.html_url}
          target="_blank"
          rel="noreferrer"
          className={styles.comment}
          key={comment.id}
        >
          <div className={styles.image}>
            <Image
              alt={comment.user.login}
              src={comment.user?.avatar_url || avatar}
              className={styles.rounded}
              height={32}
              width={32}
            />
          </div>
          <div className={styles.comment_div}>
            <Suspense>
              <div className={styles.comment_timestamp}>
                <b>{comment.user.login}</b> commented{' '}
                <Time time={comment.created_at} />
              </div>
            </Suspense>
            <section
              dangerouslySetInnerHTML={{
                __html: markdownToHtml(comment.body),
              }}
              className={styles.comment_body}
            />
          </div>
        </a>
      ))}
    </div>
  );
}
