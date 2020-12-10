import React from 'react';
import './DateSection.scss';

class DateSection extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="DateSection">
                <div className="line left-line"></div>
                <div className="schedule-date">{this.props.date}</div>
                <div className="line right-line"></div>
            </div>
        );
    }
}

export default DateSection;
