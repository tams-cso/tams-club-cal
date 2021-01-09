import React from 'react';
import './CalendarEvent.scss';

class CalendarEvent extends React.Component {
    render() {
        return (
            <div className="CalendarEvent">
                <div className={'event-type event-type-' + this.props.type}></div>
                <div className="event-time">{this.props.time}</div>
                <div className="event-club-name">{this.props.club}</div>
                <div className="event-name">{this.props.name}</div>
            </div>
        );
    }
}

export default CalendarEvent;
