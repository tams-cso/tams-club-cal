import React from 'react';
import LinkBox from '../components/LinkBox';
import './Resources.scss';

class Resources extends React.Component {
    render() {
        return (
            <div className="Resources">
                <h1>Links</h1>
                <div className="link-container">
                    <LinkBox href="https://docs.google.com/presentation/d/18ZPbYD5iH_2faGDtRRZUGOd70fmo8aRlWDb08qHxGas/edit?usp=sharing">
                        Exam Calendar
                    </LinkBox>
                    <LinkBox href="https://docs.google.com/document/d/1gi7-K81MN4KLEBPCF9bv-nVxg2HMnH8ub5IXKeFM7fc/edit?usp=sharing">
                        Academics Guide
                    </LinkBox>
                    <LinkBox href="https://tams.unt.edu/studentlife/clubs#clubresources">Club Leader Resources</LinkBox>
                </div>
            </div>
        );
    }
}

export default Resources;
