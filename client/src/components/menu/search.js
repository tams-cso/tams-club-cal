import React from 'react';
import querystring from 'querystring';
import Fuse from 'fuse.js';
import { connect } from 'react-redux';

import SearchBar from './search-bar';
import SearchResult from './search-result';

import { getEventList } from '../../functions/api';
import { setEventList, setPopupId, setPopupOpen } from '../../redux/actions';
import { getSavedEventList } from '../../redux/selectors';

import './search.scss';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = { results: null, query: '' };
    }

    activatePopup = (id) => {
        this.props.history.push(`/events?id=${id}`);
        this.props.setPopupId(id);
        this.props.setPopupOpen(true);
    };

    componentDidMount() {
        if (window.location.search === '') return;
        const query = querystring.decode(window.location.search.substring(1)).query;
        this.search(query);
    }

    search = async (query) => {
        if (query === '') return;

        if (this.props.eventList === null) {
            const res = await getEventList();
            if (res.status !== 200) {
                alert('Error fetching events list!');
                return;
            }
            this.props.setEventList(res.data);
        }

        this.fuse = new Fuse(this.props.eventList, { keys: ['name', 'club'] });

        const rawResults = this.fuse.search(query);

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
        var defaultMessage = null;
        if (this.state.results === null) defaultMessage = <p className="default-search">Search for an Event here!</p>;
        return (
            <div className="Search">
                <SearchBar search={this.search} default={this.state.query}></SearchBar>
                {defaultMessage}
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
const mapDispatchToProps = { setEventList, setPopupId, setPopupOpen };

export default connect(mapStateToProps, mapDispatchToProps)(Search);
