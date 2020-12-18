import React from 'react';
import ClubCard from '../components/ClubCard';
import './Clubs.scss';

class Clubs extends React.Component {
    constructor(props) {
        super(props);

        // TODO: Replace with fetched data from backend/cache
        this.clubList = [
            {
                name: 'CSO (Computer Science Organization)',
                advised: 'true',
                fb: 'https://www.facebook.com/groups/cso2021',
                website: 'https://cso.tams.club',
                coverImg: 'https://api.michaelzhao.xyz/static/club-cal/cso.png',
            },
            {
                name: 'HOPE (Helping Other People Everywhere)',
                advised: 'true',
                fb: 'https://www.facebook.com/groups/hope2021',
                website: 'https://tamshope.org',
                coverImg: 'https://api.michaelzhao.xyz/static/club-cal/hope.png',                
            },
            {
                name: 'Ambassadors',
                advised: 'true',
                fb: 'https://www.facebook.com/groups/435813770636084',
                website: '',
                coverImg: 'https://api.michaelzhao.xyz/static/club-cal/ambassadors.png',                
            },
            {
                name: 'TCS (TAMS Culinary Society)',
                advised: 'false',
                fb: 'https://www.facebook.com/groups/481790829408149',
                website: '',
                coverImg: 'https://api.michaelzhao.xyz/static/club-cal/tcs.png',                
            },
            {
                name: 'NACRA (Nihon Arts and Culture Research)',
                advised: 'false',
                fb: 'https://www.facebook.com/groups/416640248899431',
                website: '',
                coverImg: 'https://api.michaelzhao.xyz/static/club-cal/nacra.png',                
            },
        ];

        this.state = {};
    }

    createCards = () => {
        var clubCards = [];
        this.clubList.forEach((club) => {
            clubCards.push(
                <ClubCard
                    name={club.name}
                    advised={club.advised}
                    fb={club.fb}
                    website={club.website}
                    coverImg={club.coverImg}
                ></ClubCard>
            );
        });
        this.setState({ clubCards });
    };

    componentDidMount() {
        this.createCards();
    }

    render() {
        return (
            <div className="Clubs">
                <div className="club-card-list">
                    {this.state.clubCards}
                </div>
            </div>
        );
    }
}

export default Clubs;
