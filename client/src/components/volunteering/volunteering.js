import React from 'react';
import { connect } from 'react-redux';

import LinkBox from '../shared/link-box';
import Popup from '../shared/popup';
import VolunteeringCard from './volunteering-card';
import VolunteeringPopup from './volunteering-popup';
import ActionButton from '../shared/action-button';

import { getSavedVolunteeringList } from '../../redux/selectors';
import { setVolunteeringList, openPopup } from '../../redux/actions';

import './volunteering.scss';
import Loading from '../shared/loading';

class Volunteering extends React.Component {
    constructor(props) {
        super(props);
        this.state = { volCards: null, filter: null };
    }

    activatePopup = (id) => {
        this.props.history.push(`/volunteering?id=${id}`);
        this.props.openPopup(id, 'volunteering');
    };

    updateFilter = (filter) => {
        this.setState({ filter });
    };

    createCards = () => {
        var volCards = [];
        this.props.volunteeringList.forEach((vol) => {
            if (this.state.filter === null || vol.filters[this.state.filter])
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
        return volCards;
    };

    render() {
        if (this.props.volunteeringList === null) return <Loading className="resources"></Loading>;

        // Create volunteering cards
        const volCards = this.createCards();

        return (
            <div className="Resources">
                <Popup history={this.props.history} noscroll>
                    <VolunteeringPopup></VolunteeringPopup>
                </Popup>
                <div className="volunteering-filters">
                    <button
                        onClick={this.updateFilter.bind(this, null)}
                        className={'vol-filter all' + (this.state.filter === null ? ' active' : '')}
                    >
                        All
                    </button>
                    <button
                        onClick={this.updateFilter.bind(this, 'limited')}
                        className={'vol-filter limited' + (this.state.filter === 'limited' ? ' active' : '')}
                    >
                        Limited Slots
                    </button>
                    <button
                        onClick={this.updateFilter.bind(this, 'semester')}
                        className={'vol-filter semester' + (this.state.filter === 'semester' ? ' active' : '')}
                    >
                        Semester Long
                    </button>
                    <button
                        onClick={this.updateFilter.bind(this, 'setTimes')}
                        className={'vol-filter set-times' + (this.state.filter === 'setTimes' ? ' active' : '')}
                    >
                        Set Volunteering Times
                    </button>
                    <button
                        onClick={this.updateFilter.bind(this, 'weekly')}
                        className={'vol-filter weekly' + (this.state.filter === 'weekly' ? ' active' : '')}
                    >
                        Weekly Signups
                    </button>
                    <button
                        onClick={this.updateFilter.bind(this, 'open')}
                        className={'vol-filter open' + (this.state.filter === 'open' ? ' active' : '')}
                    >
                        Open
                    </button>
                </div>
                <div className="volunteering-section">{volCards}</div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        volunteeringList: getSavedVolunteeringList(state),
    };
};
const mapDispatchToProps = { setVolunteeringList, openPopup };

export default connect(mapStateToProps, mapDispatchToProps)(Volunteering);
