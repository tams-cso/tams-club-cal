import React from 'react';
import './ClubCard.scss';

class ClubCard extends React.Component {
    render() {
        return (
            <div className="ClubCard">
                <div className="image-box">
                    {/* TODO: Detect bad image url */}
                    <div className="image-placeholder" style={this.props.img != '' ? { display: 'none' } : {}}>
                        Club Image here
                    </div>
                    <img className="club-image" src={this.props.img} alt="club image"></img>
                </div>
                <div className={'club-type' + (this.props.advised != 'true' ? ' club-indp' : '')}>
                    {this.props.advised == 'true' ? 'Advised' : 'Independent'}
                </div>
                <div className="club-name">{this.props.name}</div>
                {/* TODO: Replace temp svgs */}
                <svg
                    className="icon-fb"
                    viewBox="0 0 30 30"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => {
                        if (this.props.fb != '') window.open(this.props.fb);
                    }}
                >
                    <path
                        d="M16.3107 9.31633V14.4123H12.5243V18.609H16.3107V30H5.24272C1.28155 30 0.0970874 26.4028 0 24.6043V6.31869C0 0.803045 4.07767 -0.176182 6.11651 0.0236601H24.7573C28.835 0.0236601 30 2.122 30 5.4194V24.6043C30 28.2014 26.5049 29.7002 24.7573 30H21.2621V18.609H24.7573L25.6311 14.4123H21.2621V10.5154C21.2621 9.31633 22.4272 8.81672 23.0097 8.7168H25.6311V4.81987H20.6796C16.3107 4.81987 16.3107 9.31633 16.3107 9.31633Z"
                        fill="#808080"
                    />
                </svg>
                <img
                    className="icon-web"
                    src="https://api.michaelzhao.xyz/static/club-cal/website.svg"
                    onClick={() => {
                        if (this.props.website != '') window.open(this.props.website);
                    }}
                    e
                ></img>
            </div>
        );
    }
}

export default ClubCard;
