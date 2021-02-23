import React from 'react';
import ActionButton from '../shared/action-button';
import databaseInfo from './databaseInfo.json';
import './admin-content.scss';
import Cookies from 'universal-cookie';
import { getDb } from '../../functions/api';

class AdminContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            db: '',
            collection: '',
            text: '',
        };
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange = (event) => {
        const target = event.target;
        this.setState({ [target.name]: target.value });
    };

    createDatabaseList = () => {
        // TODO: Make this into a table LMAO
        let output = '<u><b>Database</b>: Collection</u>';
        databaseInfo.databases.forEach((db) => {
            output += `<br/><b>${db}</b>: `;
            databaseInfo.collections[db].forEach((c) => {
                output += `${c}, `;
            });
            output = output.substring(0, output.length - 2);
        });
        return output;
    };

    export = async () => {
        if (!this.isValid()) return;

        // Get email
        const cookies = new Cookies();
        const email = cookies.get('auth_email');

        // Get data and send error if bad
        const res = await getDb(this.state.db, this.state.collection, email);
        if (res.status !== 200) {
            alert(`Could not get collection ${this.state.db}.${this.state.collection}`);
            return;
        }

        // Set the value of the text box to the data
        this.setState({ text: JSON.stringify(res.data) });
    };

    add = async () => {
        if (!this.isValid()) return;
    };

    isValid = () => {
        // Check for valid database and collection names
        if (
            databaseInfo.collections[this.state.db] !== undefined &&
            databaseInfo.collections[this.state.db].includes(this.state.collection)
        )
            return true;

        // If invalid
        alert('Invalid database name or collection!');
        return false;
    };

    render() {
        const databaseList = this.createDatabaseList();
        return (
            <div className="admin-content">
                <div className="admin-db-input-box">
                    <div className="admin-db-input-box-item">
                        <label htmlFor="db">Database</label>
                        <input
                            className="line-in admin-db-input"
                            name="db"
                            value={this.state.db}
                            onChange={this.handleInputChange}
                        ></input>
                        <br />
                        <label htmlFor="collection">Collection</label>
                        <input
                            className="line-in admin-db-input"
                            name="collection"
                            value={this.state.collection}
                            onChange={this.handleInputChange}
                        ></input>
                        <br />
                    </div>
                    <div className="admin-db-input-box-item">
                        <p className="admin-db-list" dangerouslySetInnerHTML={{ __html: databaseList }}></p>
                    </div>
                </div>
                <div className="admin-export-button-box">
                    <ActionButton className="admin-export-button" onClick={this.export}>
                        Export Collection
                    </ActionButton>
                    <ActionButton className="admin-export-button" onClick={this.add}>
                        Add to Collection
                    </ActionButton>
                </div>
                <textarea
                    name="export"
                    className="admin-export-box"
                    name="text"
                    value={this.state.text}
                    onChange={this.handleInputChange}
                ></textarea>
            </div>
        );
    }
}

export default AdminContent;
