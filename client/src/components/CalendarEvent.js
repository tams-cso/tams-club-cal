import React from 'react';
import './CalendarEvent.scss';

class CalendarEvent extends React.Component {
    render() {
        return (
            <div className="CalendarEvent">
                <div className={'calendar-event-type event-type-' + this.props.type}></div>
                <div className="calendar-event-time">{this.props.time}</div>
                <div className="calendar-event-club-name">{this.props.club}</div>
                <div className="calendar-event-name">{this.props.name}</div>
            </div>
        );
    }
}

export default CalendarEvent;
