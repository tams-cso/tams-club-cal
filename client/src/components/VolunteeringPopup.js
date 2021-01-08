import React from 'react';
import { formatVolunteeringFilters } from '../functions/util';
import ActionButton from './ActionButton';
import './VolunteeringPopup.scss';

class VolunteeringPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = { edit: false };
    }

    handleInputChange(event) {
        const target = event.target;
        if (target.name.startsWith('links-')) this.linksInputChange(target);
        else this.setState({ [target.name]: target.value });
    }

    edit = () => {};

    render() {
        var filters = formatVolunteeringFilters(this.props.vol.filters, this.props.vol.signupTime);
        return (
            <div className="VolunteeringPopup">
                <div className={"display" + (!this.state.edit ? ' active' : ' inactive')}>
                    {this.props.vol.filters.open ? (
                        <p className="res-popup-open open">Open</p>
                    ) : (
                        <p className="res-popup-open closed">Closed</p>
                    )}
                    <p className="res-popup-name">{this.props.vol.name}</p>
                    <p className="res-popup-club">{this.props.vol.club}</p>
                    <p className="res-popup-description">{this.props.vol.description}</p>
                    {filters}
                    <ActionButton onClick={this.edit}>Edit</ActionButton>
                </div>
                <div className={"edit" + (this.state.edit ? ' active' : ' inactive')}>
                    
                </div>
            </div>
        );
    }
}

export default VolunteeringPopup;
