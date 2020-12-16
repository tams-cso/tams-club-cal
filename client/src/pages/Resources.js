import React from 'react';
import LinkBox from '../components/LinkBox';
import VolunteeringCard from '../components/VolunteeringCard';
import './Resources.scss';

class Resources extends React.Component {
    render() {
        // TODO: Replace with fetched data from backend/cache
        var volEvents = [
            {
                name: 'Elm Fork',
                club: 'HOPE',
                description: 'Demonstrate hands-on science experiments for homeschoolers',
                filters: { limited: true, semester: false, setTimes: true, weekly: true, open: true },
                signupTime: 'Sunday 11:00pm',
            },
            {
                name: 'Denton Tutoring',
                club: 'TAS',
                description: 'Tutor denton high schoolers',
                filters: { limited: true, semester: true, setTimes: true, weekly: false, open: true },
                signupTime: null,
            },
            {
                name: 'SciVids',
                club: 'JETS x RO',
                description: 'plan, record, and edit videos of science experiments',
                filters: { limited: true, semester: false, setTimes: false, weekly: false, open: false },
                signupTime: null,
            },
        ];

        var volCards = [];
        volEvents.forEach((event) => {
            volCards.push(
                <VolunteeringCard
                    name={event.name}
                    club={event.club}
                    description={event.description}
                    filters={event.filters}
                    signupTime={event.signupTime}
                    key={event.name}
                ></VolunteeringCard>
            );
        });
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
                    {volCards}
                </div>
            </div>
        );
    }
}

export default Resources;
