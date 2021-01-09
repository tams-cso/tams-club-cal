import React from 'react';
import { connect } from 'react-redux';
import DateSection from '../components/DateSection';
import ScheduleEvent from '../components/ScheduleEvent';
import CalendarDay from '../components/CalendarDay';
import './Home.scss';
import Popup from '../components/Popup';
import { getEvent, getEventList } from '../functions/api';
import { setEventList } from '../redux/actions';
import dayjs from 'dayjs';
import arraySupport from 'dayjs/plugin/arraySupport';
dayjs.extend(arraySupport);
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
import { getSavedEventList } from '../redux/selectors';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.popup = React.createRef();
        this.state = { schedule: true, eventComponents: null, calendarComponents: null };
    }

    // Pads a date to 2 digits (eg. 1 => '01')
    pad = (num) => {
        if (num < 10) return `0${num}`;
        return `${num}`;
    };

    switchView = () => {
        this.setState({ schedule: !this.state.schedule });
        console.log(this.props.eventList);
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

    setCalendar = (eventList) => {
        var { calendar, previous, after, date } = calendarDays();
        var month = date.month(),
            year = date.year();
        // Index the beginning of the events to add to calendar
        var i;
        console.log(date.format('D M YY'));
        if (previous.length === 0) {
            date = date.add(1, 'month');
            month = date.month();
            year = date.year();
        }
        const first = dayjs([year, month, previous.length === 0 ? 1 : previous[0]]);
        for (i = 0; i < eventList.length; i++) {
            const day = dayjs(eventList[i].start);
            console.log(day.format('D M YY'));
            if (day.isAfter(first)) break;
        }
        console.log(i);

        var calendarComponents = [];
        // Add events for previous month
        previous.forEach((currDay) => {
            var calEvents = [];
            while (i < eventList.length) {
                const day = dayjs(eventList[i].start);
                if (dayjs(day).year() === year && dayjs(day).month() === month && dayjs(day).date() === currDay) {
                    calEvents.push(eventList[i]);
                    i++;
                } else break;
            }
            calendarComponents.push(
                <CalendarDay
                    day={this.pad(currDay)}
                    key={date.month() + '-' + currDay}
                    events={calEvents}
                ></CalendarDay>
            );
        });
        if (previous.length > 0) {
            date = date.add(1, 'month');
            month = date.month();
            year = date.year();
        }
        calendar.forEach((currDay) => {
            var calEvents = [];
            while (i < eventList.length) {
                const day = dayjs(eventList[i].start);
                if (dayjs(day).year() === year && dayjs(day).month() === month && dayjs(day).date() === currDay) {
                    calEvents.push(eventList[i]);
                    i++;
                } else break;
            }
            calendarComponents.push(
                <CalendarDay
                    day={this.pad(currDay)}
                    key={date.month() + '-' + currDay}
                    events={calEvents}
                ></CalendarDay>
            );
        });
        date = date.add(1, 'month');
        month = date.month();
        year = date.year();
        after.forEach((currDay) => {
            var calEvents = [];
            while (i < eventList.length) {
                const day = dayjs(eventList[i].start);
                if (dayjs(day).year() === year && dayjs(day).month() === month && dayjs(day).date() === currDay) {
                    calEvents.push(eventList[i]);
                    i++;
                } else break;
            }
            calendarComponents.push(
                <CalendarDay
                    day={this.pad(currDay)}
                    key={date.month() + '-' + currDay}
                    events={calEvents}
                ></CalendarDay>
            );
        });
        this.setState({ calendarComponents });
    };

    async componentDidMount() {
        var eventList = this.props.eventList;
        // Check if there is already events saved
        if (this.props.eventList === null) {
            // Get event list from backend
            eventList = await getEventList();
            this.props.setEventList(eventList);
        }
        const events = [...eventList];
        // Create a dayjs object for each event
        events.forEach((e) => addDayjsElement(e));

        // Sort the days
        events.sort((a, b) => a.start - b.start);

        this.setCalendar([...events]);

        // Insert the date objects
        divideByDate(events);

        // Generate the list of events
        var eventComponents = [];
        events.forEach((e) => {
            if (e.isDate) {
                eventComponents.push(<DateSection date={createDateHeader(e.day)} key={e.day}></DateSection>);
            } else {
                eventComponents.push(
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
        this.setState({ eventComponents });
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
                <div className={'schedule-view' + (this.state.schedule ? ' view-active' : '')}>
                    {this.state.eventComponents}
                </div>
                <div className={'calendar-view' + (!this.state.schedule ? ' view-active' : '')}>
                    <div className="calendar">
                        {calendarHeader}
                        {this.state.calendarComponents}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        eventList: getSavedEventList(state),
    };
};
const mapDispatchToProps = { setEventList };

export default connect(mapStateToProps, mapDispatchToProps)(Home);
