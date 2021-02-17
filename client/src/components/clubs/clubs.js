import React from 'react';
import { connect } from 'react-redux';

import ClubCard from './club-card';
import ClubPopup from './club-popup';
import Popup from '../shared/popup';

import { getSavedClubList } from '../../redux/selectors';
import { setClubList, setPopupOpen, setPopupId, setPopupNew, setPopupEdit, setPopupType } from '../../redux/actions';

import './clubs.scss';
import Loading from '../shared/loading';

class Clubs extends React.Component {
    activatePopup = (id) => {
        this.props.history.push(`/clubs?id=${id}`);
        this.props.setPopupId(id);
        this.props.setPopupType('club');
        this.props.setPopupOpen(true);
    };

    addClub = () => {
        this.props.setPopupNew(true);
        this.props.setPopupEdit(true);
        this.activatePopup('new');
    };

    createCards = () => {
        return this.props.clubList.map((c) => {
            return <ClubCard club={c} key={c.name} onClick={this.activatePopup.bind(this, c.objId)}></ClubCard>;
        });
    };

    render() {
        if (this.props.clubList === null) return <Loading className="clubs"></Loading>;

        const cards = this.createCards();

        return (
            <div className="Clubs">
                <Popup history={this.props.history}>
                    <ClubPopup></ClubPopup>
                </Popup>
                <div className="club-card-list">{cards}</div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        clubList: getSavedClubList(state),
    };
};
const mapDispatchToProps = { setClubList, setPopupOpen, setPopupId, setPopupNew, setPopupEdit, setPopupType };

export default connect(mapStateToProps, mapDispatchToProps)(Clubs);
