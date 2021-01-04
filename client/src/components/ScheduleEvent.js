import React from 'react';
import './ScheduleEvent.scss';

class ScheduleEvent extends React.Component {
    render() {
        return (
            <div className="ScheduleEvent" onClick={this.props.onClick}>
                <div className={"event-type event-type-" + this.props.type}></div>
                <div className="event-time">{this.props.time}</div>
                <div className="event-club-name">{this.props.club}</div>
                <div className="event-name">{this.props.name}</div>
            </div>
        );
    }
}

export default ScheduleEvent;