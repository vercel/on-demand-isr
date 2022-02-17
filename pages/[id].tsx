import jwt from 'jsonwebtoken';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import styles from '../styles/Home.module.scss';
// import { useRouter } from "next/router";
import Layout from '../components/Layout';
import Image from 'next/image';
import { marked } from 'marked';
import hljs from 'highlight.js';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

export async function getStaticPaths() {
  return {
    paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  let d = Date.now();

  const token = getGitHubJWT();
  const installation = await getInstallation(token);
  const accessToken = await getAccessToken(installation.id, token);
  const issue = await getIssue(accessToken, params.id);
  const comments = await getIssueComments(accessToken, params.id);

  console.log(`[Next.js] Running getStaticProps...`);
  console.log(`[Next.js] Fetched issues: ${Date.now() - d}ms`);

  d = Date.now();
  const { stargazers_count, forks_count } = await getRepoDetails(accessToken);
  console.log(`[Next.js] Fetched repo details: ${Date.now() - d}ms`);

  return {
    props: {
      issue,
      comments,
      stargazers_count,
      forks_count,
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
  // const router = useRouter();
  // if (router.isFallback) {
  //   return (
  //     <Layout>
  //       <div className={styles.comments}>
  //         {[0, 1, 2].map((idx: number) => (
  //           <div className={styles.comment} key={idx}>
  //             <div className={styles.image} />
  //             <div className={styles.comment_div}>
  //               <div className={styles.comment_timestamp} />
  //               <div className={styles.comment_body} />
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </Layout>
  //   );
  // }

  return (
    <Layout issue_count={issue.comments}>
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
              src={issue.user.avatar_url}
              alt={issue.user.login}
              layout="fill"
              objectFit="cover"
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
                src={comment.user.avatar_url}
                alt={comment.user.login}
                layout="fill"
                objectFit="cover"
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
