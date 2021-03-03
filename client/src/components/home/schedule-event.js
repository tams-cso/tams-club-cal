import React from 'react';
import { getFormattedTime } from '../../functions/util';
import './schedule-event.scss';

class ScheduleEvent extends React.Component {
    render() {
        return (
            <div className="schedule-event" onClick={this.props.onClick}>
                <p className={`schedule-event-type ${this.props.event.type}`}>
                    <span className={`schedule-event-type-tooltip ${this.props.event.type}`}>
                        {this.props.event.type}
                    </span>
                </p>
                <p className="schedule-event-time">{getFormattedTime(this.props.event)}</p>
                <p className="schedule-event-club-name">{this.props.event.club}</p>
                <p className="schedule-event-name">{this.props.event.name}</p>
            </div>
        );
    }
}

export default ScheduleEvent;
