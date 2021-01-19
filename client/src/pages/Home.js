import React from 'react';
import { connect } from 'react-redux';
import dayjs from 'dayjs';

import DateSection from '../components/DateSection';
import ScheduleEvent from '../components/ScheduleEvent';
import CalendarDay from '../components/CalendarDay';
import Popup from '../components/Popup';

import { getEventList } from '../functions/api';
import { setEventList, setPopupOpen, setPopupId } from '../redux/actions';
import arraySupport from 'dayjs/plugin/arraySupport';

import './Home.scss';

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
        this.state = { schedule: true, eventComponents: null, calendarComponents: null, currentDate: dayjs() };
    }

    // Pads a date to 2 digits (eg. 1 => '01')
    pad = (num) => {
        if (num < 10) return `0${num}`;
        return `${num}`;
    };

    switchView = () => {
        this.setState({ schedule: !this.state.schedule, currentDate: dayjs() });
    };

    changeMonth = (amount = null) => {
        var currentDate;
        if (amount === null) {
            currentDate = dayjs();
        } else {
            if (amount < 0) currentDate = this.state.currentDate.subtract(-amount, 'month');
            else currentDate = this.state.currentDate.add(amount, 'month');
        }
        this.setState({ currentDate });
    };

    activatePopup = (id) => {
        this.props.history.push(`/events?id=${id}`);
        this.props.setPopupId(id);
        this.props.setPopupOpen(true);
    };

    setCalendar = (eventList) => {
        var { calendar, previous, after, date } = calendarDays(this.state.currentDate);
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
            const day = eventList[i].startDayjs;
            if (day.isAfter(first)) break;
        }

        var calendarComponents = [];
        // Add events for previous month
        previous.forEach((currDay) => {
            var calEvents = [];
            while (i < eventList.length) {
                const day = eventList[i].startDayjs;
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
                    activatePopup={this.activatePopup}
                    currentDay={currDay === dayjs().date() && month === dayjs().month() && year == dayjs().year()}
                    sideMonth={true}
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
                const day = eventList[i].startDayjs;
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
                    activatePopup={this.activatePopup}
                    currentDay={currDay === dayjs().date() && month === dayjs().month() && year == dayjs().year()}
                    sideMonth={false}
                ></CalendarDay>
            );
        });
        date = date.add(1, 'month');
        month = date.month();
        year = date.year();
        after.forEach((currDay) => {
            var calEvents = [];
            while (i < eventList.length) {
                const day = eventList[i].startDayjs;
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
                    activatePopup={this.activatePopup}
                    currentDay={currDay === dayjs().date() && month === dayjs().month() && year == dayjs().year()}
                    sideMonth={true}
                ></CalendarDay>
            );
        });
        this.setState({ calendarComponents });
    };

    createEventComponents = (eventList) => {
        const events = [...eventList];
        // Create a dayjs object for each event
        events.forEach((e) => addDayjsElement(e));

        // Sort the days
        events.sort((a, b) => a.start - b.start);

        this.setCalendar([...events]);

        // Remove events that have already passed
        while (events.length > 0)
            if (dayjs(events[0].end === null ? events[0].start : events[0].end).isBefore(dayjs())) events.shift();
            else break;

        // Insert the date objects
        divideByDate(events);

        // Generate the list of events
        var eventComponents = [];

        var tempComponents = [];
        events.forEach((e) => {
            if (e.isDate) {
                eventComponents.push(
                    <div className="schedule-view-sticky-container" key={eventComponents.length}>
                        {tempComponents}
                    </div>
                );
                tempComponents = [];
                tempComponents.push(<DateSection date={createDateHeader(e.day)} key={e.day}></DateSection>);
            } else {
                tempComponents.push(
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
        eventComponents.push(
            <div className="schedule-view-sticky-container" key={eventComponents.length}>
                {tempComponents}
            </div>
        );
        eventComponents.shift();
        this.setState({ eventComponents });
    };

    async componentDidMount() {
        var eventList = this.props.eventList;
        // Check if there is already events saved
        if (this.props.eventList === null) {
            // Get event list from backend
            eventList = await getEventList();
            this.props.setEventList(eventList);
        }
        this.createEventComponents(eventList);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.eventList !== prevProps.eventList || this.state.currentDate !== prevState.currentDate)
            this.createEventComponents(this.props.eventList);
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
                    <div className={'dummy' + (this.state.schedule ? ' view-active' : '')}></div>
                    <button
                        className={'today' + (!this.state.schedule ? ' view-active' : '')}
                        onClick={() => {
                            this.changeMonth();
                        }}
                    >
                        Today
                    </button>
                    <div className={'dummy-today' + (!this.state.schedule ? ' view-active' : '')}></div>
                    <div
                        className={'dummy-change-month month-back' + (this.state.schedule ? ' view-active' : '')}
                    ></div>
                    <button
                        className={'change-month month-back' + (!this.state.schedule ? ' view-active' : '')}
                        onClick={() => {
                            this.changeMonth(-1);
                        }}
                    >
                        {'<'}
                    </button>
                    <div className="month-year">{getMonthAndYear(this.state.currentDate)}</div>
                    <div
                        className={'dummy-change-month month-forward' + (this.state.schedule ? ' view-active' : '')}
                    ></div>
                    <button
                        className={'change-month month-forward' + (!this.state.schedule ? ' view-active' : '')}
                        onClick={() => {
                            this.changeMonth(1);
                        }}
                    >
                        {'>'}
                    </button>
                    <button className="view-switch" onClick={this.switchView}>
                        {`Switch to ${this.state.schedule ? 'Calendar' : 'Schedule'} View`}
                    </button>
                </div>
                <div className={'schedule-view' + (this.state.schedule ? ' view-active' : '')}>
                    {this.state.eventComponents}
                </div>
                <div className={'calendar-view' + (!this.state.schedule ? ' view-active' : '')}>
                    <div className="calendar-header">{calendarHeader}</div>
                    <div className="calendar-days">{this.state.calendarComponents}</div>
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
