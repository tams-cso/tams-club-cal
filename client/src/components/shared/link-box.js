import React from 'react';
import './link-box.scss';

class LinkBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div
                className={`link-box ${this.props.className}`}
                onClick={() => {
                    window.open(this.props.href);
                }}
            >
                {this.props.children}
            </div>
        );
    }
}

export default LinkBox;
