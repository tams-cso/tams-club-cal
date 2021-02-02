import React from 'react';
import { connect } from 'react-redux';

import ClubCard from '../components/ClubCard';
import ClubPopup from '../popups/ClubPopup';
import Popup from '../popups/Popup';

import { getClubList } from '../functions/api';
import { getSavedClubList } from '../redux/selectors';
import { setClubList, setPopupOpen, setPopupId, setPopupNew, setPopupEdit, setPopupType } from '../redux/actions';

import './Clubs.scss';
import ActionButton from '../components/ActionButton';

class Clubs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

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

    createCards = (data) => {
        var clubCards = [];
        data.forEach((club) => {
            clubCards.push(
                <ClubCard club={club} key={club.name} onClick={() => this.activatePopup(club.objId)}></ClubCard>
            );
        });
        this.setState({ clubCards });
    };

    async componentDidMount() {
        var clubList = this.props.clubList;
        if (clubList === null) {
            const res = await getClubList();
            if (res.status !== 200) {
                alert(`ERROR ${res.status}: Could not get club list :(`);
                return;
            }
            clubList = res.data;
            this.props.setClubList(clubList);
        }
        this.createCards(clubList);
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.clubList !== this.props.clubList) {
            this.createCards(this.props.clubList);
        }
    }

    render() {
        return (
            <div className="Clubs">
                <Popup history={this.props.history}>
                    <ClubPopup></ClubPopup>
                </Popup>
                <div className="club-card-list">{this.state.clubCards}</div>
                <div className="clubs-add-club-container">
                    <ActionButton className="clubs-add-club" onClick={this.addClub}>
                        Add Club
                    </ActionButton>
                </div>
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
