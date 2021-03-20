import React from 'react';
import './calendar-event.scss';

class CalendarEvent extends React.Component {
    render() {
        return (
            <div className="calendar-event" onClick={this.props.onClick}>
                <div className={`calendar-event-type ${this.props.type}`}></div>
                <div className="calendar-event-time">{this.props.time}</div>
                <div className="calendar-event-name">{this.props.name}</div>
            </div>
        );
    }
}

export default CalendarEvent;
