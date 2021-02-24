import React from 'react';
import { connect } from 'react-redux';

import ActionButton from '../shared/action-button';
import ExecCard from './exec-card';
import CommitteeCard from './committee-card';
import Loading from '../shared/loading';

import { getPopupId, getPopupOpen, getPopupType } from '../../redux/selectors';
import { resetPopupState } from '../../redux/actions';
import { getClub } from '../../functions/api';
import { imgUrl, isActive, parseLinks } from '../../functions/util';

import './club-popup.scss';

class ClubPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            execTab: true,
            club: null,
        };
    }

    getClubData = async () => {
        const res = await getClub(this.props.id);
        if (res.status !== 200) {
            this.props.resetPopupState();
            alert(`ERROR ${res.status}: Could not get club :(`);
            return;
        }
        this.setState({ club: res.data });
    };

    switchTab = (tab) => this.setState({ execTab: tab === 'execs' });

    openEdit = () => {
        window.location.href = `${window.location.origin}/edit/clubs?id=${this.state.club.objId}`;
    };

    componentDidMount() {
        if (this.props.id !== null && this.props.id !== '' && this.props.type === 'clubs') this.getClubData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.popupOpen === this.props.popupOpen) return;
        if (this.props.popupOpen && this.props.id !== null && this.props.type === 'clubs') {
            this.getClubData();
        } else {
            this.setState({ club: null });
        }
    }

    render() {
        if (!this.props.popupOpen || this.state.club === null)
            return <Loading className="club-popup-loading"></Loading>;

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
                    <img className="club-popup-image" src={imgUrl(this.state.club.coverImg)} alt="cover image"></img>
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
        type: getPopupType(state),
    };
};
const mapDispatchToProps = { resetPopupState };

export default connect(mapStateToProps, mapDispatchToProps)(ClubPopup);
