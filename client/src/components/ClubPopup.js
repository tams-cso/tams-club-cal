import React from 'react';
import { connect } from 'react-redux';
import ExecCard from './ExecCard';
import CommitteeCard from './CommitteeCard';
import { getPopupEdit, getPopupId, getPopupOpen, getPopupClub } from '../redux/selectors';
import { setPopupOpen, setPopupId, setPopupEdit } from '../redux/actions';
import './ClubPopup.scss';
import { getClub } from '../functions/api';

class ClubPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = { execTab: true, club: null };
    }

    switchTab = (tab) => {
        this.setState({ execTab: tab === 'execs' });
    };

    getClubData = async () => {
        const club = await getClub(this.props.club.objId);
        this.setState({ club });
    };

    componentDidUpdate(prevProps) {
        if (prevProps.id !== this.props.id && this.props.popupOpen) {
            this.getClubData();
        }
        if (prevProps.popupOpen !== this.props.popupOpen && !this.props.popupOpen) {
            this.setState({ club: null });
        }
    }

    render() {
        if (!this.props.popupOpen || this.state.club === null) return <div className="ClubPopup"></div>;

        var execList = [];
        this.state.club.execs.forEach((exec) => {
            execList.push(<ExecCard exec={exec} key={exec.name}></ExecCard>);
        });

        var committeeList = [];
        this.state.club.committees.forEach((committee) => {
            committeeList.push(<CommitteeCard committee={committee}></CommitteeCard>);
        });
        return (
            <div className="ClubPopup">
                <img className="clubs-popup-img" src={this.state.club.coverImg} alt="cover image"></img>
                <p className="clubs-popup-name">{this.state.club.name}</p>
                <p className="clubs-popup-description">{this.state.club.description}</p>
                <div className="links">
                    <p className="clubs-popup-link fb" onClick={() => window.open(this.state.club.website)}>
                        {this.state.club.website}
                    </p>
                    <p className="clubs-popup-link website" onClick={() => window.open(this.state.club.fb)}>
                        {this.state.club.fb}
                    </p>
                </div>
                <div className="clubs-popup-tab-container">
                    <div
                        className={'clubs-popup-tab-item' + (this.state.execTab ? ' active' : '')}
                        onClick={() => this.switchTab('execs')}
                    >
                        Execs
                    </div>
                    <div
                        className={'clubs-popup-tab-item' + (!this.state.execTab ? ' active' : '')}
                        onClick={() => this.switchTab('committees')}
                    >
                        Committees
                    </div>
                </div>
                {this.state.execTab ? (
                    <div className="clubs-popup-execs">{execList}</div>
                ) : (
                    <div className="clubs-popup-committees">{committeeList}</div>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        popupOpen: getPopupOpen(state),
        id: getPopupId(state),
        edit: getPopupEdit(state),
        club: getPopupClub(state),
    };
};
const mapDispatchToProps = { setPopupOpen, setPopupId, setPopupEdit };

export default connect(mapStateToProps, mapDispatchToProps)(ClubPopup);
