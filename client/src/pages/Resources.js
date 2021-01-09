import React from 'react';
import { connect } from 'react-redux';

import LinkBox from '../components/LinkBox';
import Popup from '../components/Popup';
import VolunteeringCard from '../components/VolunteeringCard';
import VolunteeringPopup from '../components/VolunteeringPopup';

import { getOrFetchVolList } from '../functions/util';
import { getSavedVolunteeringList } from '../redux/selectors';
import { setVolunteeringList, setPopupOpen, setPopupId } from '../redux/actions';

import './Resources.scss';

class Resources extends React.Component {
    constructor(props) {
        super(props);
        this.state = { volCards: null, filter: null };
    }

    activatePopup = (id) => {
        this.props.history.push(`/resources?id=${id}`);
        this.props.setPopupId(id);
        this.props.setPopupOpen(true);
    };

    async componentDidMount() {
        await getOrFetchVolList();
        this.createCards(null);
    }

    createCards = (currFilter) => {
        var volCards = [];
        this.props.volunteeringList.forEach((vol) => {
            if (currFilter === null || vol.filters[currFilter])
                volCards.push(
                    <VolunteeringCard
                        vol={vol}
                        key={vol._id}
                        onClick={() => {
                            this.activatePopup(vol._id);
                        }}
                    ></VolunteeringCard>
                );
        });
        this.setState({ volCards, filter: currFilter });
    };

    render() {
        return (
            <div className="Resources">
                <Popup history={this.props.history} noscroll>
                    <VolunteeringPopup></VolunteeringPopup>
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

const mapStateToProps = (state) => {
    return {
        volunteeringList: getSavedVolunteeringList(state),
    };
};
const mapDispatchToProps = { setVolunteeringList, setPopupOpen, setPopupId };

export default connect(mapStateToProps, mapDispatchToProps)(Resources);
