import React from 'react';
import DateSection from '../components/DateSection';
import ScheduleEvent from '../components/ScheduleEvent';
import './Home.scss';

class Home extends React.Component {
    render() {
        return (
            <div className="Home">
                <div className="schedule-view">
                    {/* TODO: Replace temp data with GET request from backend */}
                    <DateSection date="Monday 11/9/20"></DateSection>
                    <ScheduleEvent
                        type="event"
                        time="7:00pm - 8:00pm"
                        club="HOPE"
                        description="New Committee GA"
                    ></ScheduleEvent>
                    <DateSection date="Wednesday 11/11/20"></DateSection>
                    <ScheduleEvent
                        type="event"
                        time="8:00pm - 9:00pm"
                        club="Eureka!"
                        description="CRT GA + TARC Info"
                    ></ScheduleEvent>
                    <ScheduleEvent
                        type="event"
                        time="8:00pm - 9:00pm"
                        club="FACES"
                        description="It's Complex Workshop"
                    ></ScheduleEvent>
                    <ScheduleEvent
                        type="event"
                        time="9:00pm - 10:00pm"
                        club="TCS"
                        description="TCS Intro GA"
                    ></ScheduleEvent>
                    <DateSection date="Thursday 11/12/20"></DateSection>
                    <ScheduleEvent
                        type="event"
                        time="6:00pm - 7:00pm"
                        club="Active Minds"
                        description="Mind Talk"
                    ></ScheduleEvent>
                    <ScheduleEvent
                        type="event"
                        time="8:00pm - 9:00pm"
                        club="CSO USACO"
                        description="How to Pass USACO Bronze"
                    ></ScheduleEvent>
                    <DateSection date="Friday 11/13/20"></DateSection>
                    <ScheduleEvent
                        type="event"
                        time="6:00pm - 7:00pm"
                        club="FACES"
                        description="Bills of Fare"
                    ></ScheduleEvent>
                    <DateSection date="Saturday 11/14/20"></DateSection>
                    <ScheduleEvent
                        type="event"
                        time="6:00pm - 7:00pm"
                        club="TAS Comp."
                        description="Intro to USABO"
                    ></ScheduleEvent>
                    <DateSection date="Sunday 11/15/20"></DateSection>
                    <ScheduleEvent
                        type="event"
                        time="3:00pm - 4:00pm"
                        club="TAS Phyiscs"
                        description="Physics Exam 3 Review"
                    ></ScheduleEvent>
                    <ScheduleEvent
                        type="event"
                        time="7:00pm - 9:00pm"
                        club="TAS CS"
                        description="CS Exam 3 Office Hours"
                    ></ScheduleEvent>
                    <ScheduleEvent
                        type="signup"
                        time="11:00pm"
                        club="Elm Fork"
                        description="Elm Fork Signups"
                    ></ScheduleEvent>
                </div>
            </div>
        );
    }
}

export default Home;
