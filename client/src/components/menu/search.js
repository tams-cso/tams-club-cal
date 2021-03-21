import React from 'react';
import querystring from 'querystring';
import Fuse from 'fuse.js';
import { connect } from 'react-redux';

import SearchBar from './search-bar';
import SearchResult from './search-result';

import { getEventList } from '../../functions/api';
import { setEventList, openPopup } from '../../redux/actions';
import { getSavedEventList } from '../../redux/selectors';

import './search.scss';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = { results: null, query: '' };
    }

    activatePopup = (id) => {
        this.props.history.push(`/events?id=${id}`);
        this.props.openPopup(id, 'events');
    };

    componentDidMount() {
        if (window.location.search === '') return;
        const query = querystring.decode(window.location.search.substring(1)).query;
        this.search(query);
    }

    search = async (query) => {
        if (query === '') {
            this.setState({ results: null, query: '' });
            return;
        }

        var eventList = this.props.eventList;
        if (eventList === null) {
            const res = await getEventList();
            if (res.status !== 200) {
                alert('Error fetching events list!');
                return;
            }
            eventList = res.data;
        }

        this.fuse = new Fuse(eventList, { useExtendedSearch: true, keys: ['name', 'club'] });

        const rawResults = this.fuse.search(`'${query}`);

        var results = [];
        rawResults.forEach((r) => {
            results.push(
                <SearchResult
                    event={r.item}
                    key={r.item.objId}
                    onClick={() => {
                        this.activatePopup(r.item.objId);
                    }}
                ></SearchResult>
            );
        });
        this.setState({ results, query });
    };

    render() {
        // Create the message - no searches, 0 results, or n results
        var message;
        if (this.state.results === null) message = 'Search for an Event here!';
        else if (this.state.results.length === 0) message = 'No results found :(';
        else message = `${this.state.results.length} results found!`;

        return (
            <div className="search">
                <SearchBar className="search-page-bar" search={this.search} default={this.state.query}></SearchBar>
                <p className="search-message">{message}</p>
                <div className="search-result-list">{this.state.results}</div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        eventList: getSavedEventList(state),
    };
};
const mapDispatchToProps = { setEventList, openPopup };

export default connect(mapStateToProps, mapDispatchToProps)(Search);
