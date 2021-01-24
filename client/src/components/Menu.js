import './Menu.scss';
import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import SearchBar from './SearchBar';

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = { mobileDropdown: false, searchBar: <SearchBar className="menu-item"></SearchBar> };
    }

    clickDropdown = () => {
        this.setState({ mobileDropdown: !this.state.mobileDropdown });
    };

    componentDidMount() {
        if (location.pathname.includes('/search')) this.setState({ searchBar: null });
    }

    componentDidUpdate(prevProps) {
        if (this.props.location === prevProps.location) return;

        if (this.props.location.pathname.includes('/search')) this.setState({ searchBar: null });
        else this.setState({ searchBar: <SearchBar className="menu-item"></SearchBar> });
        if (this.props.location.search === '') window.scrollTo(0, 0);
    }

    render() {
        return (
            <div className="Menu">
                <div className="menu-list">
                    <NavLink
                        className="menu-item menu-logo"
                        activeClassName="active"
                        to="/"
                        isActive={() => ['/', '/events'].includes(window.location.pathname)}
                        exact
                    >
                        <div className="menu-logo-tams">TAMS</div>
                        <div className="menu-logo-club">Club Calendar</div>
                    </NavLink>
                    <NavLink className="menu-item" activeClassName="active" to="/resources" exact>
                        Resources
                    </NavLink>
                    <NavLink className="menu-item" activeClassName="active" to="/clubs" exact>
                        Clubs
                    </NavLink>
                    <NavLink className="menu-item" activeClassName="active" to="/add" exact>
                        Add Event
                    </NavLink>
                    <NavLink className="menu-item" activeClassName="active" to="/about" exact>
                        About
                    </NavLink>
                    <div className="search-bar-wrapper menu-item">{this.state.searchBar}</div>
                </div>
                <div className="mobile-menu">
                    <div className="mobile-menu-title">TAMS Club Calendar</div>
                    <svg
                        className={'hamburger' + (this.state.mobileDropdown ? ' ham-active' : '')}
                        viewBox="0 0 100 80"
                        width="30"
                        height="30"
                        onClick={this.clickDropdown}
                    >
                        <rect width="80" height="15"></rect>
                        <rect y="30" width="80" height="15"></rect>
                        <rect y="60" width="80" height="15"></rect>
                    </svg>
                </div>
                <div className={'mobile-menu-dropdown' + (this.state.mobileDropdown ? ' drop-active' : '')}>
                    <NavLink className="menu-item mob-item" activeClassName="active" to="/" exact>
                        Home
                    </NavLink>
                    <NavLink className="menu-item mob-item" activeClassName="active" to="/resources" exact>
                        Resources
                    </NavLink>
                    <NavLink className="menu-item mob-item" activeClassName="active" to="/clubs" exact>
                        Clubs
                    </NavLink>
                    <NavLink className="menu-item mob-item" activeClassName="active" to="/add" exact>
                        Add Event
                    </NavLink>
                    <NavLink className="menu-item mob-item" activeClassName="active" to="/about" exact>
                        About
                    </NavLink>
                </div>
            </div>
        );
    }
}

export default withRouter(Menu);
