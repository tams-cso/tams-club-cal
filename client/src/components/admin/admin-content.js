import React from 'react';
import ActionButton from '../shared/action-button';
import databaseInfo from './databaseInfo.json';
import './admin-content.scss';

class AdminContent extends React.Component {
    createDatabaseList = () => {
        let output = '';
        databaseInfo.databases.forEach((db) => {
            output += `<br/>${db}: `;
            databaseInfo.collections[db].forEach((c) => {
                output += `${c}, `;
            });
            output = output.substring(0, output.length - 2);
        });
        return output.substring(5);
    };

    render() {
        const databaseList = this.createDatabaseList();
        return (
            <div className="admin-content">
                <div className="admin-db-input-box">
                    <div className="admin-db-input-box-item">
                        <label htmlFor="admin-db-input">Database</label>
                        <input className="line-in admin-db-input" name="admin-db-input"></input>
                        <br />
                        <label htmlFor="admin-collection-input">Collection</label>
                        <input className="line-in admin-db-input" name="admin-collection-input"></input>
                        <br />
                    </div>
                    <div className="admin-db-input-box-item">
                        <p className="admin-db-list" dangerouslySetInnerHTML={{ __html: databaseList }}></p>
                    </div>
                </div>
                <div className="admin-export-button-box">
                    <ActionButton className="admin-export-button">Export from Database</ActionButton>
                    <ActionButton className="admin-export-button">Import from Database</ActionButton>
                </div>
                <textarea name="export" className="admin-export-box"></textarea>
            </div>
        );
    }
}

export default AdminContent;