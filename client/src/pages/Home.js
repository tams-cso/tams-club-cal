import React from 'react';
import DateSection from '../components/DateSection';
import './Home.scss';

class Home extends React.Component {
    render() {
        return (
            <div className="Home">
                <div className="schedule-view">
                    {/* TODO: Replace temp data with GET request from backend */}
                    <DateSection date="Monday 11/9/20"></DateSection>
                    <DateSection date="Wednesday 11/11/20"></DateSection>
                    <DateSection date="Sunday 11/15/20"></DateSection>
                </div>
            </div>
        );
    }
}

export default Home;
