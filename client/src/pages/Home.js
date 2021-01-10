import React from 'react';
import { connect } from 'react-redux';
import DateSection from '../components/DateSection';
import ScheduleEvent from '../components/ScheduleEvent';
import CalendarDay from '../components/CalendarDay';
import './Home.scss';
import Popup from '../components/Popup';
import { getEventList } from '../functions/api';
import { setEventList, setPopupOpen, setPopupId } from '../redux/actions';
import dayjs from 'dayjs';
import arraySupport from 'dayjs/plugin/arraySupport';

import {
    createDateHeader,
    divideByDate,
    addDayjsElement,
    getMonthAndYear,
    calendarDays,
    daysOfWeek,
} from '../functions/util';
import { getSavedEventList } from '../redux/selectors';
import EventPopup from '../components/EventPopup';

class Home extends React.Component {
    constructor(props) {
        super(props);
        dayjs.extend(arraySupport);
        this.state = { schedule: true, eventComponents: null, calendarComponents: null };
    }

    // Pads a date to 2 digits (eg. 1 => '01')
    pad = (num) => {
        if (num < 10) return `0${num}`;
        return `${num}`;
    };

    switchView = () => {
        this.setState({ schedule: !this.state.schedule });
    };

    activatePopup = (id) => {
        this.props.history.push(`/events?id=${id}`);
        this.props.setPopupId(id);
        this.props.setPopupOpen(true);
    };

    setCalendar = (eventList) => {
        var { calendar, previous, after, date } = calendarDays();
        var month = date.month(),
            year = date.year();
        // Index the beginning of the events to add to calendar
        var i;
        if (previous.length === 0) {
            date = date.add(1, 'month');
            month = date.month();
            year = date.year();
        }
        const first = dayjs([year, month, previous.length === 0 ? 1 : previous[0]]);
        for (i = 0; i < eventList.length; i++) {
            const day = dayjs(eventList[i].start);
            if (day.isAfter(first)) break;
        }

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
                        event={e}
                        key={e.objId}
                        onClick={() => {
                            this.activatePopup(e.objId);
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
                <Popup history={this.props.history}>
                    <EventPopup></EventPopup>
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
const mapDispatchToProps = { setEventList, setPopupOpen, setPopupId };

export default connect(mapStateToProps, mapDispatchToProps)(Home);
