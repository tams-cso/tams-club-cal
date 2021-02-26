import React from 'react';
import { getHistoryList } from '../../functions/api';
import { getParams, isActive } from '../../functions/util';
import EditHistoryCard from './edit-history-card';
import './edit-history.scss';

class EditHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showEdit: false,
            valid: false,
            resource: '',
            id: '',
            historyList: null,
        };
    }

    toggleHistory = () => this.setState({ showEdit: !this.state.showEdit });

    async componentDidMount() {
        // Get resource and return if not valid
        const resource = window.location.pathname.substring(6);
        const validResources = ['events', 'clubs', 'volunteering'];
        if (validResources.indexOf(resource) === -1) return;

        // Get id and return if not there
        const id = getParams('id');
        if (id === null) return;

        // If valid, retrieve the history list
        const res = await getHistoryList(resource, id);
        var history = null;
        if (res.status !== 200) alert('Could not retrieve history list!');
        else history = res.data.list;

        // Set valid state if both resource and id are valid
        this.setState({ valid: true, resource, id, historyList: history });
    }

    componentDidUpdate() {
        if (!this.state.valid) return;
    }

    render() {
        if (!this.state.valid) return null;

        const showText = this.state.showEdit ? 'hide' : 'show';

        // Create list of edit histoy components
        var historyComponents = [];
        if (this.state.showEdit && this.state.historyList !== null) {
            historyComponents = this.state.historyList
                .slice()
                .reverse()
                .map((h, i) => (
                    <EditHistoryCard
                        data={h}
                        resource={this.state.resource}
                        key={i}
                        index={this.state.historyList.length - i - 1}
                        id={this.state.id}
                    ></EditHistoryCard>
                ));
        }

        return (
            <div className="edit-history">
                <p className="edit-history-toggle" onClick={this.toggleHistory}>
                    {`Click to ${showText} edit history`}
                </p>
                <div className={isActive('edit-history-list', this.state.showEdit)}>{historyComponents}</div>
            </div>
        );
    }
}

export default EditHistory;
