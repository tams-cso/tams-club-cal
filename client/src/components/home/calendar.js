import React from 'react';
import Loading from '../shared/loading';
import dayjs from 'dayjs';
import CalendarDay from './calendar-day';

import { generateCalendarDays, pad } from '../../functions/util';

import data from '../../files/data.json';
import './calendar.scss';

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
        const calData = generateCalendarDays(this.props.monthOffset);
        var date = calData.dateObj;

        var month = date.month(),
            year = date.year();
        // Index the beginning of the events to add to calendar
        var i;
        if (calData.previous.length === 0) {
            date = date.add(1, 'month');
            month = date.month();
            year = date.year();
        }
        const first = dayjs([year, month, calData.previous.length === 0 ? 1 : calData.previous[0]]);
        for (i = 0; i < this.props.eventList.length; i++) {
            const day = this.props.eventList[i].startDayjs;
            if (day.isAfter(first)) break;
        }

        var calendarComponents = [];
        // Add events for previous month
        calData.previous.forEach((currDay) => {
            var calEvents = [];
            while (i < this.props.eventList.length) {
                const day = this.props.eventList[i].startDayjs;
                if (dayjs(day).year() === year && dayjs(day).month() === month && dayjs(day).date() === currDay) {
                    calEvents.push(this.props.eventList[i]);
                    i++;
                } else break;
            }
            calendarComponents.push(
                <CalendarDay
                    day={pad(currDay)}
                    key={month + year + '-' + currDay}
                    events={calEvents}
                    activatePopup={this.props.activatePopup}
                    currentDay={currDay === dayjs().date() && month === dayjs().month() && year == dayjs().year()}
                    sideMonth={true}
                ></CalendarDay>
            );
        });
        if (calData.previous.length > 0) {
            date = date.add(1, 'month');
            month = date.month();
            year = date.year();
        }
        calData.current.forEach((currDay) => {
            var calEvents = [];
            while (i < this.props.eventList.length) {
                const day = this.props.eventList[i].startDayjs;
                if (dayjs(day).year() === year && dayjs(day).month() === month && dayjs(day).date() === currDay) {
                    calEvents.push(this.props.eventList[i]);
                    i++;
                } else break;
            }
            calendarComponents.push(
                <CalendarDay
                    day={pad(currDay)}
                    key={month + year + '-' + currDay}
                    events={calEvents}
                    activatePopup={this.props.activatePopup}
                    currentDay={currDay === dayjs().date() && month === dayjs().month() && year == dayjs().year()}
                    sideMonth={false}
                ></CalendarDay>
            );
        });
        date = date.add(1, 'month');
        month = date.month();
        year = date.year();
        calData.next.forEach((currDay) => {
            var calEvents = [];
            while (i < this.props.eventList.length) {
                const day = this.props.eventList[i].startDayjs;
                if (dayjs(day).year() === year && dayjs(day).month() === month && dayjs(day).date() === currDay) {
                    calEvents.push(this.props.eventList[i]);
                    i++;
                } else break;
            }
            calendarComponents.push(
                <CalendarDay
                    day={pad(currDay)}
                    key={month + year + '-' + currDay}
                    events={calEvents}
                    activatePopup={this.props.activatePopup}
                    currentDay={currDay === dayjs().date() && month === dayjs().month() && year == dayjs().year()}
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
