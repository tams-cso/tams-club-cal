import React from 'react';
import { addDayjsElement, getFormattedDate, getFormattedTime } from '../../functions/util';
import './search-result.scss';

class SearchResult extends React.Component {
    render() {
        addDayjsElement(this.props.event);
        var date = getFormattedDate(this.props.event, true);
        var time = getFormattedTime(this.props.event);

        return (
            <div className="SearchResult" onClick={this.props.onClick}>
                <div className={'event-type event-type-' + this.props.event.type}></div>
                <div className="search-result-right">
                    <p className="event-name">{this.props.event.name}</p>
                    <div className="search-result-bottom">
                        <p className="event-club-name">{this.props.event.club}</p>
                        <p className="event-datetime">
                            {date}
                            <span>&nbsp; • &nbsp;</span>
                            {time}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default SearchResult;
