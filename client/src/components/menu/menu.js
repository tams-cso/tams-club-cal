import React from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import SearchBar from './search-bar';

import { getMobileDropdown } from '../../redux/selectors';
import { setMobileDropdown } from '../../redux/actions';
import { ReactComponent as Logo } from '../../files/logo-small.svg';
import './menu.scss';

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = { searchBar: <SearchBar className="menu-item"></SearchBar> };
    }

    clickDropdown = () => {
        this.props.setMobileDropdown(!this.props.mobileDropdown);
    };

    navHome = () => {
        this.props.history.push('/');
    };

    logoActive = () => {
        return ['/', '/events', '/edit/events', '/edit/volunteering', '/edit/clubs'].includes(window.location.pathname);
    };

    componentDidMount() {
        if (location.pathname.includes('/search')) this.setState({ searchBar: null });
    }

    componentDidUpdate(prevProps) {
        if (this.props.location === prevProps.location) return;

        if (this.props.location.pathname.includes('/search')) this.setState({ searchBar: null });
        else this.setState({ searchBar: <SearchBar className="menu-item"></SearchBar> });
        if (this.props.location.search === '' && this.props.location.pathname !== prevProps.location.pathname) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        return (
            <div className="menu">
                <div className="menu-list">
                    <NavLink
                        className="menu-item menu-logo"
                        activeClassName="active"
                        to="/"
                        isActive={this.logoActive}
                        exact
                    >
                        <div className="menu-logo-tams">TAMS</div>
                        <div className="menu-logo-club">Club Calendar</div>
                    </NavLink>
                    <NavLink className="menu-item" activeClassName="active" to="/volunteering" exact>
                        Volunteering
                    </NavLink>
                    <NavLink className="menu-item" activeClassName="active" to="/clubs" exact>
                        Clubs
                    </NavLink>
                    <NavLink className="menu-item" activeClassName="active" to="/resources" exact>
                        Resources
                    </NavLink>
                    <NavLink className="menu-item" activeClassName="active" to="/about" exact>
                        About
                    </NavLink>
                    <div className="search-bar-wrapper menu-item">{this.state.searchBar}</div>
                </div>
                <div className="mobile-menu">
                    <Logo className="mobile-menu-logo" onClick={this.navHome}></Logo>
                    <svg
                        className={'hamburger' + (this.props.mobileDropdown ? ' ham-active' : '')}
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
                <div className={'mobile-menu-dropdown' + (this.props.mobileDropdown ? ' drop-active' : '')}>
                    <NavLink
                        className="menu-item mob-item"
                        activeClassName="active"
                        isActive={() => ['/', '/events'].includes(window.location.pathname)}
                        to="/"
                        exact
                    >
                        Home
                    </NavLink>
                    <NavLink className="menu-item mob-item" activeClassName="active" to="/volunteering" exact>
                        Volunteering
                    </NavLink>
                    <NavLink className="menu-item mob-item" activeClassName="active" to="/clubs" exact>
                        Clubs
                    </NavLink>
                    <NavLink className="menu-item mob-item" activeClassName="active" to="/resources" exact>
                        Resources
                    </NavLink>
                    <NavLink className="menu-item mob-item" activeClassName="active" to="/about" exact>
                        About
                    </NavLink>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        mobileDropdown: getMobileDropdown(state),
    };
};
const mapDispatchToProps = { setMobileDropdown };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Menu));
