import React from 'react';
import DateSection from '../components/DateSection';
import ScheduleEvent from '../components/ScheduleEvent';
import CalendarDay from '../components/CalendarDay';
import './Home.scss';

class Home extends React.Component {
    pad(num) {
        if (num < 10) return `0${num}`;
        return `${num}`;
    }
    switchView() {
        //TODO this is suppose to switch views when you click the button
        
        // console.log(document.getElementsByClassName("schedule-view")[0]);
        // if (document.getElementsByClassName("schedule-view")[0].display == "none") {
        //     document.getElementsByClassName("schedule-view")[0].display = "block";
        //     document.getElementsByClassName("calendar-view")[0].display = "none";
        // }
        // else {
        //     document.getElementsByClassName("schedule-view")[0].display = "none";
        //     document.getElementsByClassName("calendar-view")[0].display = "block";
        // }
    }
    render() {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var calendarHeader = [];
        daysOfWeek.forEach((day) => {
            calendarHeader.push(<div className="days-of-week" key={day}>{day}</div>);
        });
        var calendar = [];
        for (let i = 1; i <= 30; i++)
            calendar.push(<CalendarDay day={this.pad(i)} events={[]}></CalendarDay>);
        for (let i = 1; i <= 5; i++)
            calendar.push(<CalendarDay day={this.pad(i)} events={[]}></CalendarDay>);
        
        return (
            <div className="Home">
                <div className="schedule-view">
                    {/* TODO: Replace temp data with GET request from backend */}
                    <div className="month-year">November 2020</div>
                    <button className="view-switch" onClick={() => this.switchView()}>
                        {"Switch to Calendar View"}
                    </button>
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
                <div className="calendar-view">
                    <div className="month-year">November 2020</div>
                    <button className="view-switch" onClick={() => this.switchView()}>
                        {"Switch to Schedule View"}
                    </button>
                    <div className="calendar">
                        {calendarHeader}
                        {calendar}
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
