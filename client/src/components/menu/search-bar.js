import React from 'react';
import querystring from 'querystring';
import { withRouter } from 'react-router';
import { ReactComponent as SearchIcon } from '../../files/magnifying-glass.svg';
import './search-bar.scss';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { query: '' };
    }

    search = () => {
        this.props.history.push(`/search?${querystring.encode({ query: this.state.query })}`);
        this.setState({ query: '' });
    };

    handleClick = (e) => {
        if (e.key.toLowerCase() === 'enter') {
            if (this.props.search !== undefined) {
                this.props.search(this.state.query);
                this.props.history.push(`/search?${querystring.encode({ query: this.state.query })}`);
            } else this.search();
        }
    };

    handleInputChange = (e) => {
        this.setState({ query: e.target.value });
    };

    componentDidUpdate(prevProps) {
        if (this.props.default !== prevProps.default && this.props.default !== undefined)
            this.setState({ query: this.props.default });
    }

    render() {
        return (
            <div className={`SearchBar ${this.props.className}`}>
                <input
                    name="query"
                    className="search-bar"
                    type="text"
                    placeholder="Search events..."
                    onKeyDown={(e) => {
                        this.handleClick(e);
                    }}
                    onChange={this.handleInputChange}
                    value={this.state.query}
                ></input>
                <SearchIcon onClick={this.search}></SearchIcon>
            </div>
        );
    }
}

export default withRouter(SearchBar);
