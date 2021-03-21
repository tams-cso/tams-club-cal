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
        const sideMonth = this.props.sideMonth ? 'side-month' : '';
        const currentDay = this.props.currentDay ? 'current-day' : '';
        return (
            <div className={`calendar-day ${sideMonth} ${currentDay}`}>
                <p className={`calendar-date ${currentDay}`}>{this.props.day}</p>
                <div className="calendar-events">{this.state.events}</div>
            </div>
        );
    }
}

export default CalendarDay;
