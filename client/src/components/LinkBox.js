import React from 'react';
import './LinkBox.scss';

class LinkBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="LinkBox" onClick={() => {window.open(this.props.href)}}>
                {this.props.children}
            </div>
        )
    }
}

export default LinkBox;