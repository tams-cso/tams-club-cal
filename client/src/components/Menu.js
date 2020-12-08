import './Menu.scss';
import React from 'react';
import { NavLink } from 'react-router-dom';

class Menu extends React.Component {
    render() {
        // TODO: Add react-router links
        return (
            <div className="Menu">
                <div className="menu-list">
                    <NavLink className="menu-item" activeClassName="active" to="/" exact>
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
                    <div className="menu-item menu-search">
                        <input className="search-bar" type="text" placeholder="Search..."></input>
                    </div>
                </div>
            </div>
        );
    }
}

export default Menu;