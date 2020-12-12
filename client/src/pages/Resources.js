import React from 'react';
import LinkBox from '../components/LinkBox';
import VolunteeringCard from '../components/VolunteeringCard';
import './Resources.scss';

class Resources extends React.Component {
    render() {
        return (
            <div className="Resources">
                <h1 className="links-title">Links</h1>
                <div className="link-container">
                    <LinkBox href="https://docs.google.com/presentation/d/18ZPbYD5iH_2faGDtRRZUGOd70fmo8aRlWDb08qHxGas/edit?usp=sharing">
                        Exam Calendar
                    </LinkBox>
                    <LinkBox href="https://docs.google.com/document/d/1gi7-K81MN4KLEBPCF9bv-nVxg2HMnH8ub5IXKeFM7fc/edit?usp=sharing">
                        Academics Guide
                    </LinkBox>
                    <LinkBox href="https://tams.unt.edu/studentlife/clubs#clubresources">Club Leader Resources</LinkBox>
                </div>
                <h1>Volunteering</h1>
                <div className="volunteering-section">
                    <VolunteeringCard
                        name="Elm Fork"
                        club="HOPE"
                        description="Demonstrate hands-on science experiments for homeschoolers"
                        filters={{ limited: true, semester: false, setTimes: true, weekly: true, open: true }}
                        signupTime="Sunday 11:00pm"
                    ></VolunteeringCard>
                    <VolunteeringCard
                        name="Denton Tutoring"
                        club="TAS"
                        description="Tutor denton high schoolers"
                        filters={{ limited: true, semester: true, setTimes: true, weekly: false, open: true }}
                        signupTime="Sunday 11:00pm"
                    ></VolunteeringCard>
                    <VolunteeringCard
                        name="SciVids"
                        club="JETS x RO"
                        description="plan, record, and edit videos of science experiments"
                        filters={{ limited: true, semester: false, setTimes: false, weekly: false, open: false }}
                        signupTime="Sunday 11:00pm"
                    ></VolunteeringCard>
                </div>
            </div>
        );
    }
}

export default Resources;
