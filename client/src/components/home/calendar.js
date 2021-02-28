import React from 'react';
import Loading from '../shared/loading';
import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
import CalendarDay from './calendar-day';

import { generateCalendarDays, pad } from '../../functions/util';

import data from '../../files/data.json';
import './calendar.scss';

dayjs.extend(objectSupport);

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    createCalendarHeader = () => {
        return data.daysOfTheWeek.map((day) => {
            return (
                <div className="calendar-day-names" key={day}>
                    {day}
                </div>
            );
        });
    };

    createEvents = () => {
        // Generate the list of all elements
        const calData = generateCalendarDays(this.props.monthOffset);

        // Store the current date, month, and year to compare events with
        var currDateObj = dayjs().subtract(1, 'month');
        var currMonth = currDateObj.month();
        var currYear = currDateObj.year();

        // If there is no previous month, skip it and only consider the current and next month
        if (calData.previous.length === 0) {
            currDateObj = currDateObj.add(1, 'month');
            currMonth = currDateObj.month();
            currYear = currDateObj.year();
        }

        // Index the beginning of the events to add to calendar
        const startingDate = calData.previous.length === 0 ? 1 : calData.previous[0];
        const first = dayjs({ year: currYear, month: currMonth, day: startingDate });
        let eventCount = 0;

        // Go to the first event after the first date on the calendar
        for (eventCount = 0; eventCount < this.props.eventList.length; eventCount++) {
            const day = this.props.eventList[eventCount].startDayjs;
            if (day.isAfter(first)) break;
        }

        // Instantiate a list to hold all elements
        var calendarComponents = [];

        // Add events for previous month
        // TODO: Cleanup and encapsulate parts into functions
        calData.previous.forEach((currDay) => {
            var calEvents = [];
            while (eventCount < this.props.eventList.length) {
                const day = this.props.eventList[eventCount].startDayjs;
                if (dayjs(day).year() === currYear && dayjs(day).month() === currMonth && dayjs(day).date() === currDay) {
                    calEvents.push(this.props.eventList[eventCount]);
                    eventCount++;
                } else break;
            }
            calendarComponents.push(
                <CalendarDay
                    day={pad(currDay)}
                    key={currMonth + currYear + '-' + currDay}
                    events={calEvents}
                    activatePopup={this.props.activatePopup}
                    currentDay={currDay === dayjs().date() && currMonth === dayjs().month() && currYear == dayjs().year()}
                    sideMonth={true}
                ></CalendarDay>
            );
        });
        if (calData.previous.length > 0) {
            currDateObj = currDateObj.add(1, 'month');
            currMonth = currDateObj.month();
            currYear = currDateObj.year();
        }
        calData.current.forEach((currDay) => {
            var calEvents = [];
            while (eventCount < this.props.eventList.length) {
                const day = this.props.eventList[eventCount].startDayjs;
                if (dayjs(day).year() === currYear && dayjs(day).month() === currMonth && dayjs(day).date() === currDay) {
                    calEvents.push(this.props.eventList[eventCount]);
                    eventCount++;
                } else break;
            }
            calendarComponents.push(
                <CalendarDay
                    day={pad(currDay)}
                    key={currMonth + currYear + '-' + currDay}
                    events={calEvents}
                    activatePopup={this.props.activatePopup}
                    currentDay={currDay === dayjs().date() && currMonth === dayjs().month() && currYear == dayjs().year()}
                    sideMonth={false}
                ></CalendarDay>
            );
        });
        currDateObj = currDateObj.add(1, 'month');
        currMonth = currDateObj.month();
        currYear = currDateObj.year();
        calData.next.forEach((currDay) => {
            var calEvents = [];
            while (eventCount < this.props.eventList.length) {
                const day = this.props.eventList[eventCount].startDayjs;
                if (dayjs(day).year() === currYear && dayjs(day).month() === currMonth && dayjs(day).date() === currDay) {
                    calEvents.push(this.props.eventList[eventCount]);
                    eventCount++;
                } else break;
            }
            calendarComponents.push(
                <CalendarDay
                    day={pad(currDay)}
                    key={currMonth + currYear + '-' + currDay}
                    events={calEvents}
                    activatePopup={this.props.activatePopup}
                    currentDay={currDay === dayjs().date() && currMonth === dayjs().month() && currYear == dayjs().year()}
                    sideMonth={true}
                ></CalendarDay>
            );
        });
        return calendarComponents;
    };

    render() {
        // Return if events undefined
        if (this.props.eventList === null) return <Loading className={`calendar ${this.props.className}`}></Loading>;

        // Create the header (Sun, Mon, etc.)
        const calendarHeader = this.createCalendarHeader();
        const calendarComponents = this.createEvents();

        return (
            <div className={`calendar ${this.props.className}`}>
                <div className="calendar-header">{calendarHeader}</div>
                <div className="calendar-days">{calendarComponents}</div>
            </div>
        );
    }
}

export default Calendar;
