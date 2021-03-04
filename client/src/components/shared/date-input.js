import React from 'react';
import { generateCalendarDays, getDefaulEditDate, getEditDate, getEditMonthAndYear, guessDateInput, isActive } from '../../functions/util';
import data from '../../files/data.json';
import './date-input.scss';

// TODO: Make this entire component NOT update so much -> too slow rn lmao
class DateInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
            lastValid: this.props.value,
            dropdown: false,
            mouse: false,
            offset: 0,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.inputRef = React.createRef();
    }

    handleInputChange = (event) => {
        const value = event.target.value;
        this.props.onChange(this.props.name, value);
        this.setState({ value });
    };

    handleBlur = (event) => {
        var value = event.target.value;
        value = guessDateInput(value);
        var mouse = this.state.mouse;
        if (event.relatedTarget !== null && event.relatedTarget.nodeName.toLowerCase() === 'input') mouse = false;

        if (value === 'Invalid Date') value = this.state.lastValid;
        this.props.onChange(this.props.name, value);
        this.setState({ value, lastValid: value, dropdown: false, mouse });
    };

    handleMouseEvent = (enter) => {
        this.setState({ mouse: enter });
    };

    handleDropdownClick = () => {
        this.inputRef.current.focus();
    };

    activateDropdown = () => {
        this.setState({ dropdown: true });
    };

    changeMonth = (increment) => {
        console.log(this.state.offset)
        this.setState({ offset: this.state.offset + (increment ? 1 : -1) });
    };

    selectDate = (date, month, year) => {
        const value = guessDateInput(`${month} ${date}, ${year}`);
        console.log(value);
        this.props.onChange(this.props.name, value);
        this.setState({ value, lastValid: value, offset: 0 });
    };

    createCalendar = () => {
        var calData = generateCalendarDays(this.state.offset, this.state.lastValid);

        // Create a list of objects with each number's date, month, and year
        var month = calData.dayObj.subtract(1, 'month').format('MMM');
        var year = calData.dayObj.subtract(1, 'month').format('YYYY');
        var numList = calData.previous.map((c) => ({ date: c, month, year }));

        var month = calData.dayObj.format('MMM');
        if (month === 'Jan') calData.dayObj.format('YYYY');
        numList = numList.concat(calData.current.map((c) => ({ date: c, month, year })));

        var month = calData.dayObj.add(1, 'month').format('MMM');
        if (month === 'Jan') calData.dayObj.format('YYYY');
        numList = numList.concat(calData.next.map((c) => ({ date: c, month, year })));

        year = calData.dayObj.format('YYYY');
        month = calData.dayObj.format('MMM');
        var date = getEditDate(this.state.lastValid);

        // Create the list of components in a grid
        var componentList = numList.map((i) => {
            var current =
                i.year === year && i.month === month && i.date === date && this.state.offset === 0 ? 'current' : '';
            var diffMonth = i.month !== month ? 'diff-month' : '';
            return (
                <div
                    className={`date-input-num ${diffMonth} ${current}`}
                    key={`${i.date} ${i.month}`}
                    onClick={this.selectDate.bind(this, i.date, i.month, i.year)}
                >
                    {i.date}
                </div>
            );
        });

        return componentList;
    };

    render() {
        // Create header of week day letters
        const weekdayList = data.charsOfTheWeek.map((c, i) => (
            <div className="date-input-weekday" key={i}>
                {c}
            </div>
        ));

        // Create list of clickable dates
        var calendarList = null;
        if (this.state.dropdown || this.state.mouse) calendarList = this.createCalendar();

        return (
            <div className={`date-input ${this.props.className}`}>
                <input
                    name={this.props.name}
                    className="line-in date-input-line"
                    type="text"
                    placeholder={getDefaulEditDate()}
                    value={this.state.value}
                    onChange={this.handleInputChange}
                    onBlur={this.handleBlur}
                    onFocus={this.activateDropdown}
                    ref={this.inputRef}
                ></input>
                <div
                    className={isActive('date-input-dropdown', this.state.dropdown || this.state.mouse)}
                    onMouseEnter={this.handleMouseEvent.bind(this, true)}
                    onMouseLeave={this.handleMouseEvent.bind(this, false)}
                    onClick={this.handleDropdownClick}
                >
                    <div className="date-input-header">
                        <p className="date-input-month">{getEditMonthAndYear(this.state.value, this.state.offset)}</p>
                        <div className="date-input-change-month" onClick={this.changeMonth.bind(this, false)}>
                            {'<'}
                        </div>
                        <div className="date-input-change-month" onClick={this.changeMonth.bind(this, true)}>
                            {'>'}
                        </div>
                    </div>
                    <div className="date-input-weekday-list">{weekdayList}</div>
                    <div className="date-input-calendar">{calendarList}</div>
                </div>
            </div>
        );
    }
}

export default DateInput;
