import React from 'react';
import ClubCard from '../components/ClubCard';
import CommitteeCard from '../components/CommitteeCard';
import ExecCard from '../components/ExecCard';
import Popup from '../components/Popup';
import { getClub, getClubList } from '../functions/api';
import './Clubs.scss';

class Clubs extends React.Component {
    constructor(props) {
        super(props);
        this.popup = React.createRef();
        this.state = { activeClub: null };
    }

    activatePopup = async () => {
        const id = this.popup.current.state.id;
        const club = await getClub(id);
        if (club === null) {
            this.setState({
                popupContent: <div className="clubs-popup-content no-content">Error: No club data for this club</div>,
            });
            return;
        } else {
            var popupContent = this.createClubPopup(club, true);
            this.setState({
                activeClub: club,
                popupContent,
            });
        }
    };

    createClubPopup = (club, execTab) => {
        var execList = [];
        club.execs.forEach((exec) => {
            execList.push(<ExecCard exec={exec} key={exec.name}></ExecCard>);
        });

        var committeeList = [];
        club.committees.forEach((committee) => {
            committeeList.push(<CommitteeCard committee={committee}></CommitteeCard>);
        });

        return (
            <div className="clubs-popup-content">
                <img className="clubs-popup-img" src={club.coverImg} alt="cover image"></img>
                <p className="clubs-popup-name">{club.name}</p>
                <p className="clubs-popup-description">{club.description}</p>
                <div className="links">
                    <p className="clubs-popup-link fb" onClick={() => window.open(club.website)}>
                        {club.website}
                    </p>
                    <p className="clubs-popup-link website" onClick={() => window.open(club.fb)}>
                        {club.fb}
                    </p>
                </div>
                <div className="clubs-popup-tab-container">
                    <div
                        className={'clubs-popup-tab-item' + (execTab ? ' active' : '')}
                        onClick={() => this.switchTab('execs')}
                    >
                        Execs
                    </div>
                    <div
                        className={'clubs-popup-tab-item' + (!execTab ? ' active' : '')}
                        onClick={() => this.switchTab('committees')}
                    >
                        Committees
                    </div>
                </div>
                {execTab ? (
                    <div className="clubs-popup-execs">{execList}</div>
                ) : (
                    <div className="clubs-popup-committees">{committeeList}</div>
                )}
            </div>
        );
    };

    switchTab = (tab) => {
        this.setState({ popupContent: this.createClubPopup(this.state.activeClub, tab === 'execs') });
    };

    createCards = (data) => {
        var clubCards = [];
        data.forEach((club) => {
            clubCards.push(
                <ClubCard
                    objId={club.objId}
                    name={club.name}
                    advised={club.advised}
                    fb={club.fb}
                    website={club.website}
                    coverImgThumbnail={club.coverImgThumbnail}
                    key={club.name}
                    onClick={() => this.popup.current.activate(club.objId)}
                ></ClubCard>
            );
        });
        this.setState({ clubCards });
    };

    componentDidMount() {
        getClubList().then((data) => {
            this.createCards(data);
        });
    }

    render() {
        return (
            <div className="Clubs">
                <Popup history={this.props.history} ref={this.popup} activateCallback={this.activatePopup}>
                    {this.state.popupContent}
                </Popup>
                <div className="club-card-list">{this.state.clubCards}</div>
            </div>
        );
    }
}

export default Clubs;
