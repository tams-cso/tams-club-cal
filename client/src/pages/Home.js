import React from 'react';
import DateSection from '../components/DateSection';
import ScheduleEvent from '../components/ScheduleEvent';
import CalendarDay from '../components/CalendarDay';
import './Home.scss';
import Popup from '../components/Popup';
import { getEvent, getEventList } from '../functions/api';
import {
    createDateHeader,
    divideByDate,
    getFormattedDate,
    getFormattedTime,
    addDayjsElement,
    getMonthAndYear,
    calendarDays,
    daysOfWeek,
} from '../functions/util';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.popup = React.createRef();
        this.state = { schedule: true, events: null };
    }

    // Pads a date to 2 digits (eg. 1 => '01')
    pad = (num) => {
        if (num < 10) return `0${num}`;
        return `${num}`;
    };

    switchView = () => {
        this.setState({ schedule: !this.state.schedule });
    };

    activatePopup = () => {
        const id = this.popup.current.state.id;
        // TODO: Add check for errors (invalid ID or no ID could be found) -> redirect user to 404 page
        getEvent(id).then((event) => {
            addDayjsElement(event);
            var linkData = [];
            event.links.forEach((link) =>
                linkData.push(
                    <a className="popup-event-link" key={link} href={link}>
                        {link}
                    </a>
                )
            );
            this.setState({
                popupContent: (
                    <div className="home-popup-content">
                        <div className="popup-event-left home-popup-side">
                            {event.type === 'event' ? (
                                <p className="popup-event-type event">Event</p>
                            ) : (
                                <p className="popup-event-type signup">Signup</p>
                            )}
                            <p className="popup-event-name">{event.name}</p>
                            <p className="popup-event-club">{event.club}</p>
                            <p className="popup-event-date">{getFormattedDate(event)}</p>
                            <p className="popup-event-time">{getFormattedTime(event)}</p>
                            {linkData}
                            <p className="popup-event-added-by">{'Added by: ' + event.addedBy}</p>
                        </div>
                        <div className="popup-event-right home-popup-side">
                            <p className="popup-event-description">{event.description}</p>
                        </div>
                    </div>
                ),
            });
        });
    };

    componentDidMount() {
        getEventList().then((events) => {
            // Create a dayjs object for each event
            events.forEach((e) => addDayjsElement(e));

            // Sort the days
            events.sort((a, b) => a.start - b.start);

            // Insert the date objects
            divideByDate(events);

            // Generate the list of events
            var eventList = [];
            events.forEach((e) => {
                if (e.isDate) {
                    eventList.push(<DateSection date={createDateHeader(e.day)} key={e.day}></DateSection>);
                } else {
                    eventList.push(
                        <ScheduleEvent
                            type={e.type}
                            time={getFormattedTime(e)}
                            club={e.club}
                            name={e.name}
                            key={e.objId}
                            onClick={() => {
                                this.popup.current.activate(e.objId);
                            }}
                        ></ScheduleEvent>
                    );
                }
            });
            this.setState({ events: eventList });
        });
    }

    render() {
        const calendarHeader = [];
        daysOfWeek().forEach((day) => {
            calendarHeader.push(
                <div className="days-of-week" key={day}>
                    {day}
                </div>
            );
        });
        const calendar = calendarDays();
        for (let i = 0; i < calendar.length; i++)
            calendar[i] = (
                <CalendarDay day={this.pad(calendar[i])} key={i + '-' + calendar[i]} events={[]}></CalendarDay>
            );
        // for (let i = 1; i <= 7; i++)
        //     calendar.shift();

        return (
            <div className="Home">
                <Popup history={this.props.history} ref={this.popup} activateCallback={this.activatePopup}>
                    {this.state.popupContent}
                </Popup>
                <div className="home-top">
                    <div className="dummy"></div>
                    <div className="month-year">{getMonthAndYear()}</div>
                    <button className="view-switch" onClick={this.switchView}>
                        {`Switch to ${this.state.schedule ? 'Calendar' : 'Schedule'} View`}
                    </button>
                </div>
                <div className={'schedule-view' + (this.state.schedule ? ' view-active' : '')}>{this.state.events}</div>
                <div className={'calendar-view' + (!this.state.schedule ? ' view-active' : '')}>
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
