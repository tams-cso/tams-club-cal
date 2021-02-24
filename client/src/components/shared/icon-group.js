import React from 'react';
import { ReactComponent as WebIcon } from '../../files/web.svg';
import { ReactComponent as FbIcon } from '../../files/fb.svg';
import './icon-group.scss';
import { isActive } from '../../functions/util';

class IconGroup extends React.Component {
    openSite = (site) => {
        if (site !== '') window.open(site);
    };
    render() {
        return (
            <div className={`icon-group ${this.props.className}`}>
                <WebIcon
                    onClick={this.openSite.bind(this, this.props.website)}
                    className={isActive('', this.props.website !== '')}
                ></WebIcon>
                <FbIcon
                    onClick={this.openSite.bind(this, this.props.fb)}
                    className={isActive('', this.props.fb !== '')}
                ></FbIcon>
            </div>
        );
    }
}

export default IconGroup;
