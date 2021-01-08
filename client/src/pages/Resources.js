import React from 'react';
import LinkBox from '../components/LinkBox';
import Popup from '../components/Popup';
import VolunteeringCard from '../components/VolunteeringCard';
import VolunteeringPopup from '../components/VolunteeringPopup';
import { getVolunteering } from '../functions/api';
import './Resources.scss';

class Resources extends React.Component {
    constructor(props) {
        super(props);
        this.popup = React.createRef();
        this.popupContent = React.createRef();
        this.volList = [];
        this.state = { vol: null };
    }

    createCards = (currFilter) => {
        var volCards = [];
        this.volList.forEach((volunteering) => {
            if (currFilter === null || volunteering.filters[currFilter])
                volCards.push(
                    <VolunteeringCard
                        name={volunteering.name}
                        club={volunteering.club}
                        description={volunteering.description}
                        filters={volunteering.filters}
                        signupTime={volunteering.signupTime}
                        key={volunteering.name}
                        onClick={() => {
                            this.popup.current.activate(volunteering._id);
                        }}
                    ></VolunteeringCard>
                );
        });
        this.setState({ volCards, filter: currFilter });
    };

    activatePopup = async () => {
        const id = this.popup.current.state.id;
        if (this.volList.length === 0) {
            await getVolunteering().then((data) => {
                this.volList = data;
            });
        }
        var vol = this.volList.find((v) => v._id === id);
        this.setState({ vol });
    };

    componentDidMount() {
        if (this.volList.length === 0) {
            getVolunteering().then((data) => {
                this.volList = data;
                this.createCards(null);
            });
        } else this.createCards(null);
    }

    render() {
        return (
            <div className="Resources">
                <Popup
                    history={this.props.history}
                    ref={this.popup}
                    activateCallback={this.activatePopup}
                    edit="false"
                    scroll="hidden"
                    closeCallback={() => {
                        this.popupContent.current.closeEdit();
                    }}
                >
                    <VolunteeringPopup vol={this.state.vol} ref={this.popupContent}></VolunteeringPopup>
                </Popup>
                <h1 className="links-title">Links</h1>
                <div className="link-container">
                    <LinkBox href="https://docs.google.com/presentation/d/18ZPbYD5iH_2faGDtRRZUGOd70fmo8aRlWDb08qHxGas/edit?usp=sharing">
                        Exam Calendar
                    </LinkBox>
                    <LinkBox href="https://docs.google.com/document/d/1gi7-K81MN4KLEBPCF9bv-nVxg2HMnH8ub5IXKeFM7fc/edit?usp=sharing">
                        Academics Guide
                    </LinkBox>
                    <LinkBox href="https://tams.unt.edu/studentlife/clubs#clubresources">Club Leader Resources</LinkBox>
                </div>
                <h1>Volunteering</h1>
                <div className="volunteering-filters">
                    <button
                        onClick={() => this.createCards(null)}
                        className={'vol-filter all' + (this.state.filter === null ? ' active' : '')}
                    >
                        All
                    </button>
                    <button
                        onClick={() => this.createCards('limited')}
                        className={'vol-filter limited' + (this.state.filter === 'limited' ? ' active' : '')}
                    >
                        Limited Slots
                    </button>
                    <button
                        onClick={() => this.createCards('semester')}
                        className={'vol-filter semester' + (this.state.filter === 'semester' ? ' active' : '')}
                    >
                        Semester Long
                    </button>
                    <button
                        onClick={() => this.createCards('setTimes')}
                        className={'vol-filter set-times' + (this.state.filter === 'setTimes' ? ' active' : '')}
                    >
                        Set Volunteering Times
                    </button>
                    <button
                        onClick={() => this.createCards('weekly')}
                        className={'vol-filter weekly' + (this.state.filter === 'weekly' ? ' active' : '')}
                    >
                        Weekly Signups
                    </button>
                    <button
                        onClick={() => this.createCards('open')}
                        className={'vol-filter open' + (this.state.filter === 'open' ? ' active' : '')}
                    >
                        Open
                    </button>
                </div>
                <div className="volunteering-section">{this.state.volCards}</div>
            </div>
        );
    }
}

export default Resources;
