import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators'; 

@autobind
export default class extends PureComponent {
    render() {
        const {title} = this.props
        return (
            <div className="clt-title">
                <span></span>
                {title}
                <span></span>
            </div>
        )
    }
}