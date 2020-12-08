import './Menu.scss';
import React from 'react';

class Menu extends React.Component {
    render() {
        // TODO: Add react-router links
        return (
            <div className="Menu">
                <div className="menu-list">
                    <div className="menu-item">
                        <div className="menu-logo-tams">TAMS</div>
                        <div className="menu-logo-club">Club Calendar</div>
                    </div>
                    <div className="menu-item">
                        Resources
                    </div>
                    <div className="menu-item">
                        Clubs
                    </div>
                    <div className="menu-item">
                        Add Event
                    </div>
                    <div className="menu-item">
                        About
                    </div>
                    <div className="menu-item menu-search">
                        <input className="search-bar" type="text" placeholder="Search..."></input>
                    </div>
                </div>
            </div>
        );
    }
}

export default Menu;