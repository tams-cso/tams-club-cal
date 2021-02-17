import React from 'react';
import { connect } from 'react-redux';

import ActionButton from '../shared/action-button';
import ExecCard from './exec-card';
import CommitteeCard from './committee-card';

import { getPopupEdit, getPopupId, getPopupNew, getPopupOpen } from '../../redux/selectors';
import {
    setPopupOpen,
    setPopupId,
    setPopupEdit,
    updateClub,
    setPopupNew,
    addClub,
    deleteSavedClub,
    setPopupDeleted,
    resetPopupState,
} from '../../redux/actions';
import { getClub } from '../../functions/api';
import { Club } from '../../functions/entries';
import { imgUrl, isActive, parseLinks } from '../../functions/util';

import './club-popup.scss';

class ClubPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            execTab: true,
            club: null,
            name: '',
            advised: false,
            fb: '',
            website: '',
            coverImg: '',
            description: '',
            execs: null,
            committees: null,
            compressed: null,
            execBlobs: null,
        };
    }

    getClubData = async () => {
        const res = await getClub(this.props.id);
        if (res.status !== 200) {
            this.props.resetPopupState();
            alert(`ERROR ${res.status}: Could not get club :(`);
            return;
        }
        this.resetState(res.data);
    };

    switchTab = (tab) => this.setState({ execTab: tab === 'execs' });

    openEdit = () => {
        window.location.href = `${window.location.origin}/edit/clubs?id=${this.state.club.objId}`;
    };

    checkOpenAndSetState = () => {
        if (this.props.popupOpen && this.props.id !== null) {
            if (this.props.new) {
                this.resetState(new Club());
            } else {
                this.getClubData();
            }
        } else {
            this.setState({ club: null });
        }
    };

    resetState = (club = null) => {
        if (club === null) club = this.state.club;
        this.setState({
            club,
            name: club.name,
            advised: club.advised,
            fb: club.fb,
            website: club.website,
            coverImg: club.coverImg,
            description: club.description,
            execs: [...club.execs],
            committees: [...club.committees],
            editedBy: '',
            execBlobs: Array(club.execs.length),
            compressed: null,
        });
    };

    componentDidMount() {
        this.checkOpenAndSetState();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.popupOpen === this.props.popupOpen) return;
        this.checkOpenAndSetState();
    }

    render() {
        if (!this.props.popupOpen || this.state.club === null) return <div className="club-popup"></div>;

        var execList = [];
        this.state.club.execs.forEach((exec) => {
            execList.push(<ExecCard exec={exec} key={exec.name}></ExecCard>);
        });

        var committeeList = [];
        this.state.club.committees.forEach((committee) => {
            committeeList.push(<CommitteeCard committee={committee} key={committee.name}></CommitteeCard>);
        });

        const description = parseLinks('club-popup-description', this.state.club.description);

        return (
            <div className="club-popup">
                <div className={isActive('club-popup-view', !this.props.edit)}>
                    <img className="club-popup-image" src={imgUrl(this.state.coverImg)} alt="cover image"></img>
                    <p className={isActive('club-popup-advised', this.state.club.advised)}>
                        {this.state.club.advised ? 'Advised' : 'Independent'}
                    </p>
                    <p className="club-popup-name">{this.state.club.name}</p>
                    {description}
                    <div className="club-popup-links">
                        <p className="club-popup-link fb" onClick={() => window.open(this.state.club.website)}>
                            {this.state.club.website}
                        </p>
                        <p className="club-popup-link website" onClick={() => window.open(this.state.club.fb)}>
                            {this.state.club.fb}
                        </p>
                    </div>
                    <div className="club-popup-tab-container">
                        <div
                            className={isActive('club-popup-tab-item', this.state.execTab)}
                            onClick={() => this.switchTab('execs')}
                        >
                            Execs
                        </div>
                        <div
                            className={isActive('club-popup-tab-item', !this.state.execTab)}
                            onClick={() => this.switchTab('committees')}
                        >
                            Committees
                        </div>
                    </div>
                    {this.state.execTab ? (
                        <div className="club-popup-execs">{execList}</div>
                    ) : (
                        <div className="club-popup-committees">{committeeList}</div>
                    )}
                    <ActionButton className="club-popup-edit-button" onClick={this.openEdit}>
                        Edit
                    </ActionButton>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        popupOpen: getPopupOpen(state),
        id: getPopupId(state),
        edit: getPopupEdit(state),
        new: getPopupNew(state),
    };
};
const mapDispatchToProps = {
    setPopupOpen,
    setPopupId,
    setPopupEdit,
    updateClub,
    setPopupNew,
    addClub,
    deleteSavedClub,
    setPopupDeleted,
    resetPopupState,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClubPopup);
