import React from 'react';

class Image extends React.Component {
    constructor(props) {
        super(props);
        this.state = { src: this.props.src };
    }

    error = () => {
        this.setState({ src: this.props.default });
    };

    componentDidUpdate(prevProps) {
        if (this.props.src !== prevProps.src) {
            this.setState({ src: this.props.src });
        }
    }

    render() {
        return (
            <img
                id={this.props.id}
                className={this.props.className}
                src={this.state.src}
                alt={this.props.alt}
                onError={this.error}
            ></img>
        );
    }
}

export default Image;
