import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import styles from '../styles/Home.module.scss';
import Layout from '../components/Layout';
import Image from 'next/image';
import { marked } from 'marked';
import hljs from 'highlight.js';
import { fetchGitHub, readAccessToken } from '../lib/github';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

export async function getStaticPaths() {
  console.log('[Next.js] Running getStaticPaths for issue page');
  return {
    paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const accessToken = await readAccessToken();
  const [issue, comments, repoDetails] = await Promise.all([
    getIssue(accessToken, params.id),
    getIssueComments(accessToken, params.id),
    getRepoDetails(accessToken),
  ]);

  console.log(`[Next.js] Running getStaticProps for /${params.id}`);
  console.log(`[Next.js] [${params.id}] Comments: ${comments.length}`);

  if (issue.message === 'Not Found') {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      issue,
      comments,
      stargazers_count: repoDetails.stargazers_count,
      forks_count: repoDetails.forks_count,
    },
  };
}

function getIssue(token: string, issue: string) {
  return fetchGitHub(`/repos/leerob/on-demand-isr/issues/${issue}`, token);
}

function getIssueComments(token: string, issue: string) {
  return fetchGitHub(
    `/repos/leerob/on-demand-isr/issues/${issue}/comments`,
    token
  );
}

function getRepoDetails(token: string) {
  return fetchGitHub('/repos/leerob/on-demand-isr', token);
}

function markdownToHtml(markdown) {
  if (!markdown) {
    return null;
  }

  marked.setOptions({
    highlight: function (code, language) {
      return hljs.highlight(code, { language }).value;
    },
  });

  return marked(markdown);
}

export default function Issue({ issue, comments }: any) {
  return (
    <Layout>
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
              src={issue.user?.avatar_url || '/avatar.png'}
              alt={issue.user.login}
              className={styles.rounded}
              objectFit="cover"
              height={32}
              width={32}
            />
          </div>
          <div className={styles.comment_div}>
            <div className={styles.comment_timestamp}>
              <b>{issue.user.login}</b> commented{' '}
              {timeAgo.format(new Date(issue.created_at))}
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  markdownToHtml(issue.body) ||
                  '<i>No description provided.</i>',
              }}
              className={styles.comment_body}
            />
          </div>
        </a>
        {comments.map((comment: any) => (
          <a
            href={comment.html_url}
            target="_blank"
            rel="noreferrer"
            className={styles.comment}
            key={comment.id}
          >
            <div className={styles.image}>
              <Image
                src={comment.user?.avatar_url || '/avatar.png'}
                alt={comment.user.login}
                className={styles.rounded}
                objectFit="cover"
                height={32}
                width={32}
              />
            </div>
            <div className={styles.comment_div}>
              <div className={styles.comment_timestamp}>
                <b>{comment.user.login}</b> commented{' '}
                {timeAgo.format(new Date(comment.created_at))}
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html: markdownToHtml(comment.body),
                }}
                className={styles.comment_body}
              />
            </div>
          </a>
        ))}
      </div>
    </Layout>
  );
}
