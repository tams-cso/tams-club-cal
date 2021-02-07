import React from 'react';
import CalendarEvent from './calendar-event';
import { getFormattedTime } from '../../functions/util';
import './calendar-day.scss';

class CalendarDay extends React.Component {
    constructor(props) {
        super(props);
        this.state = { events: null };
    }

    componentDidMount() {
        var events = [];
        this.props.events.forEach((e) => {
            events.push(
                <CalendarEvent
                    type={e.type}
                    time={getFormattedTime(e, true)}
                    club={e.club}
                    name={e.name}
                    key={e.objId}
                    onClick={() => {
                        this.props.activatePopup(e.objId);
                    }}
                ></CalendarEvent>
            );
        });
        this.setState({ events });
    }

    render() {
        return (
            <div className={'calendar-day' + (this.props.sideMonth ? ' side-month' : '')}>
                <div className={'calendar-date' + (this.props.currentDay ? ' current-day' : '')}>{this.props.day}</div>
                <div className="calendar-events">{this.state.events}</div>
            </div>
        );
    }
}

export default CalendarDay;
