import React from 'react';
import './date-section.scss';

class DateSection extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="date-section">
                <div className="date-section-line left"></div>
                <p className="date-section-date">{this.props.date}</p>
                <div className="date-section-line right"></div>
            </div>
        );
    }
}

export default DateSection;
