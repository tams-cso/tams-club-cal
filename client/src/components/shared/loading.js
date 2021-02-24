import React from 'react';
import './loading.scss';

class Loading extends React.Component {
    render() {
        return (
            <div className={`loading ${this.props.className}`}>
                <h1 className="loading-text">Loading...</h1>
            </div>
        );
    }
}

export default Loading;
