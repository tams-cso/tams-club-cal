import React from 'react';
import ClubCard from '../components/ClubCard';
import { getClubList } from '../functions/api';
import './Clubs.scss';

class Clubs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

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
                    coverImg={club.coverImg}
                    key={club.name}
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
                <div className="club-card-list">{this.state.clubCards}</div>
            </div>
        );
    }
}

export default Clubs;
