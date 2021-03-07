import React from 'react';
import { connect } from 'react-redux';
import dayjs from 'dayjs';

import DateSection from './date-section';
import ScheduleEvent from './schedule-event';
import Popup from '../shared/popup';
import EventPopup from './event-popup';
import Calendar from './calendar';
import Loading from '../shared/loading';
import AddButton from '../shared/add-button';

import { createDateHeader, insertDateDividers, getMonthAndYear, isActive } from '../../functions/util';
import { openPopup } from '../../redux/actions';
import { getSavedEventList } from '../../redux/selectors';

import './home.scss';
import ActionButton from '../shared/action-button';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = { scheduleView: true, monthOffset: 0 };
    }

    switchView = () => {
        this.setState({ scheduleView: !this.state.scheduleView, monthOffset: 0 });
    };

    resetMonthOffset = () => {
        this.setState({ monthOffset: 0 });
    };

    changeMonthOffset = (isDecrement) => {
        this.setState({ monthOffset: this.state.monthOffset + (isDecrement ? -1 : 1) });
    };

    activatePopup = (id) => {
        this.props.history.push(`/events?id=${id}`);
        this.props.openPopup(id, 'events');
    };

    createEventComponents = () => {
        // TODO: Change the eventsList fetch so only events in the current, next, and previous month are pulled,
        //       but this would be an issue for the search functionality so idk => The search could be moved to backend (?)

        // Create a copy of the state object
        var events = [...this.props.eventList];

        // Remove events that have already passed by iterating through the sorted listuntil a future event is found
        // All events before the first event will be removed from the list
        while (events.length > 0) {
            if (dayjs(events[0].end === null ? events[0].start : events[0].end).isBefore(dayjs())) events.shift();
            else break;
        }

        // Insert the DateSection objects to the list
        insertDateDividers(events);

        // Generate the list of EventCard and DateSection components
        var eventComponents = [];
        var groupComponents = [];

        // Iterate through the events
        events.forEach((e) => {
            // If this is a date section, push the previous group of events in a sticky container
            // This is so the 'position: sticky' works for the date section
            if (e.objId === '') {
                eventComponents.push(
                    <div className="schedule-view-sticky-container" key={eventComponents.length}>
                        {groupComponents}
                    </div>
                );
                // Reset the group array for the next group
                groupComponents = [];
                groupComponents.push(<DateSection date={createDateHeader(e.date)} key={e.date}></DateSection>);
            } else {
                // If it is not a date section, simply add the event card component to the group list
                groupComponents.push(
                    <ScheduleEvent
                        event={e}
                        key={e.objId}
                        onClick={() => {
                            this.activatePopup(e.objId);
                        }}
                    ></ScheduleEvent>
                );
            }
        });

        // Add the final group of events to the eventComponents array
        eventComponents.push(
            <div className="schedule-view-sticky-container" key={eventComponents.length}>
                {groupComponents}
            </div>
        );
        // Remove the empty group of events at the beginning of the list
        eventComponents.shift();

        return eventComponents;
    };

    render() {
        // Return loading screen if eventList is not fetched
        if (this.props.eventList === null) return <Loading className="home"></Loading>;

        // Create event components
        const eventComponents = this.createEventComponents();

        return (
            <div className="home">
                <Popup history={this.props.history}>
                    <EventPopup></EventPopup>
                </Popup>
                <AddButton type="Event"></AddButton>
                <div className="home-top">
                    <ActionButton
                        className={isActive('home-top-item today', !this.state.scheduleView)}
                        onClick={this.resetMonthOffset}
                    >
                        Today
                    </ActionButton>
                    <ActionButton
                        className={isActive('home-top-item month-change backward', !this.state.scheduleView)}
                        onClick={this.changeMonthOffset.bind(this, true)}
                    >
                        {'<'}
                    </ActionButton>
                    <h1 className="home-top-item month-year">{getMonthAndYear(this.state.monthOffset)}</h1>
                    <ActionButton
                        className={isActive('home-top-item month-change forward', !this.state.scheduleView)}
                        onClick={this.changeMonthOffset.bind(this, false)}
                    >
                        {'>'}
                    </ActionButton>
                    <ActionButton className="home-top-item view-switch" onClick={this.switchView}>
                        {`Show ${this.state.scheduleView ? 'Calendar' : 'Schedule'}`}
                    </ActionButton>
                </div>
                <div className={isActive('home-schedule-view', this.state.scheduleView)}>
                    <div className={isActive('home-schedule-view-empty', eventComponents.length === 0)}>
                        No upcoming events... Well, you can
                        <a href={`${window.origin}/edit/events`}> add one</a>!
                    </div>
                    {eventComponents}
                </div>
                <Calendar
                    className={isActive('home-calendar', !this.state.scheduleView)}
                    eventList={this.props.eventList}
                    monthOffset={this.state.monthOffset}
                    activatePopup={this.activatePopup}
                ></Calendar>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        eventList: getSavedEventList(state),
    };
};

const mapDispatchToProps = { openPopup };

export default connect(mapStateToProps, mapDispatchToProps)(Home);
