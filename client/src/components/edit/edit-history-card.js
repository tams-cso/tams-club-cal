import React from 'react';
import { getHistoryData } from '../../functions/api';
import { calculateEditDate, isActive } from '../../functions/util';
import './edit-history-card.scss';

class EditHistoryCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false, historyData: null };
    }

    getHistory = async () => {
        // Simply change state if closing or history already gotten
        if (this.state.open || this.state.historyData !== null) {
            this.setState({ open: !this.state.open });
            return;
        }

        // Fetch history
        const res = await getHistoryData(this.props.resource, this.props.id, this.props.index);
        if (res.status !== 200) {
            alert('Could not get current history data!');
            return;
        }

        this.setState({ open: true, historyData: res.data });
    };

    createDataObject = () => {
        return (
            <pre className={isActive('edit-history-card-open', this.state.open)}>
                {JSON.stringify(this.state.historyData, null, 2)}
            </pre>
        );
    };

    render() {
        const editDate = calculateEditDate(this.props.data.time);

        var data = null;
        if (this.state.historyData !== null) data = this.createDataObject();

        return (
            <div className="edit-history-card">
                <div className="edit-history-card-display" onClick={this.getHistory}>
                    <div className="edit-history-card-display-field edit-history-card-date">{editDate}</div>
                    <div className="edit-history-card-display-field edit-history-card-editor">
                        {this.props.data.editor}
                    </div>
                </div>
                {data}
            </div>
        );
    }
}

export default EditHistoryCard;
