import React from 'react';
import ClubCard from '../components/ClubCard';
import './Clubs.scss';

class Clubs extends React.Component {
    render() {
        return (
            <div className="Clubs">
                <div className="club-card-list">
                    <ClubCard
                        img="https://api.michaelzhao.xyz/static/club-cal/cso.png"
                        website="https://cso.tams.club"
                        fb="https://www.facebook.com/groups/cso2021"
                        advised="true"
                        name="CSO (Computer Science Organization)"
                    ></ClubCard>
                    <ClubCard
                        img="https://api.michaelzhao.xyz/static/club-cal/hope.png"
                        website="https://tamshope.org"
                        fb="https://www.facebook.com/groups/hope2021"
                        advised="true"
                        name="HOPE (Helping Other People Everywhere)"
                    ></ClubCard>
                    <ClubCard
                        img="https://api.michaelzhao.xyz/static/club-cal/ambassadors.png"
                        website=""
                        fb="https://www.facebook.com/groups/435813770636084"
                        advised="true"
                        name="Ambassadors"
                    ></ClubCard>
                    <ClubCard
                        img="https://api.michaelzhao.xyz/static/club-cal/tcs.png"
                        website=""
                        fb="https://www.facebook.com/groups/481790829408149"
                        advised="false"
                        name="TCS (TAMS Culinary Society)"
                    ></ClubCard>
                    <ClubCard
                        img="https://api.michaelzhao.xyz/static/club-cal/nacra.png"
                        website=""
                        fb="https://www.facebook.com/groups/416640248899431"
                        advised="false"
                        name="NACRA (Nihon Arts and Culture Research)"
                    ></ClubCard>
                </div>
            </div>
        );
    }
}

export default Clubs;
