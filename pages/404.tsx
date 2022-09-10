import styles from '../styles/Home.module.scss';
import Layout from '../components/Layout';

export default function NotFound() {
  return (
    <Layout homepage={false} forks_count={0} stargazers_count={0}>
      <div className={styles.not_found}>404: Not Found</div>
    </Layout>
  );
}
