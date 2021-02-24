import React from 'react';
import { connect } from 'react-redux';
import ActionButton from '../shared/action-button';
import Loading from '../shared/loading';

import { formatVolunteeringFilters, parseLinks } from '../../functions/util';
import { getPopupId, getPopupOpen, getPopupType, getSavedVolunteeringList } from '../../redux/selectors';
import { openPopup } from '../../redux/actions';

import './volunteering-popup.scss';

class VolunteeringPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = { vol: null };
    }

    openEdit = () => {
        window.location.href = `${window.location.origin}/edit/volunteering?id=${this.state.vol._id}`;
    };

    getVol = async () => {
        const vol = this.props.volList.find((v) => v._id === this.props.id);
        this.setState({ vol });
    };

    componentDidMount() {
        if (this.props.volList !== null && this.props.id !== '' && this.props.type === 'volunteering') this.getVol();
    }

    componentDidUpdate(prevProps) {
        // TODO: Simplify this if possible because it's really confusing rn

        // If id or type not valid, ignore updates
        if (this.props.id === '' || this.props.type !== 'volunteering') return;

        // On volunteering list or id change, update the current volunteering
        if (
            (prevProps.volList !== this.props.volList && this.props.volList !== null) ||
            (prevProps.id !== this.props.id && this.props.id !== null)
        ) {
            if (this.props.volList === null) return;
            else this.getVol();
        }
    }

    render() {
        // Return 'loading' if the current popup is not defined
        if (this.state.vol === null || this.state.vol === undefined)
            return <Loading className="VolunteeringPopup"></Loading>;

        // Get a list of filters
        const filters = formatVolunteeringFilters(this.state.vol.filters, this.state.vol.signupTime);

        // Parse description links
        const description = parseLinks('res-popup-description', this.state.vol.description);

        return (
            <div className="VolunteeringPopup">
                <div className={'display' + (!this.props.edit ? ' active' : ' inactive')}>
                    {this.state.vol.filters.open ? (
                        <p className="res-popup-open open">Open</p>
                    ) : (
                        <p className="res-popup-open closed">Closed</p>
                    )}
                    <p className="res-popup-name">{this.state.vol.name}</p>
                    <p className="res-popup-club">{this.state.vol.club}</p>
                    {description}
                    {filters}
                    <ActionButton className="res-popup-edit" onClick={this.openEdit}>
                        Edit
                    </ActionButton>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        volList: getSavedVolunteeringList(state),
        type: getPopupType(state),
        open: getPopupOpen(state),
        id: getPopupId(state),
    };
};
const mapDispatchToProps = { openPopup };

export default connect(mapStateToProps, mapDispatchToProps)(VolunteeringPopup);
