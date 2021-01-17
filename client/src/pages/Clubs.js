import React from 'react';
import { connect } from 'react-redux';

import ClubCard from '../components/ClubCard';
import ClubPopup from '../components/ClubPopup';
import Popup from '../components/Popup';

import { getClubList } from '../functions/api';
import { getSavedClubList } from '../redux/selectors';
import { setClubList, setPopupOpen, setPopupId } from '../redux/actions';

import './Clubs.scss';

class Clubs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    activatePopup = (id) => {
        this.props.history.push(`/clubs?id=${id}`);
        this.props.setPopupId(id);
        this.props.setPopupOpen(true);
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
            clubList = await getClubList();
            this.props.setClubList(clubList);
        }
        this.createCards(clubList);
    }

    render() {
        return (
            <div className="Clubs">
                <Popup history={this.props.history}>
                    <ClubPopup></ClubPopup>
                </Popup>
                <div className="club-card-list">{this.state.clubCards}</div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        clubList: getSavedClubList(state),
    };
};
const mapDispatchToProps = { setClubList, setPopupOpen, setPopupId };

export default connect(mapStateToProps, mapDispatchToProps)(Clubs);
