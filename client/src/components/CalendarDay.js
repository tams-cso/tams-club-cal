import React from 'react';
import './CalendarDay.scss';

class CalendarDay extends React.Component {
    render() {
        return (
            <div className="CalendarDay">
                <div className="day">{this.props.day}</div>
                <div className="calendar-event">
                    {/* TODO add events from props */}
                </div>
            </div>
        );
    }
}

export default CalendarDay;