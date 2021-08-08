import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

export default function Home() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout description="The TAMS Club Calendar is a fully contained event tracker, club/volunteering database, and general resource center. This is the unofficial club event calendar for the Texas Academy of Mathematics and Science!">
            <div className={styles.container}>
                <h1 className="hero__title">{siteConfig.title}</h1>
                <p className="hero__subtitle">{siteConfig.tagline}</p>
                <div className={styles.buttons}>
                    <Link className="button button--secondary button--lg" to="/docs/intro">
                        Go to Documentation
                    </Link>
                </div>
            </div>
        </Layout>
    );
}
