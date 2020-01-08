import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import classnames from 'classnames';

@autobind
export default class extends PureComponent {
    render() { 
        const {className} =this.props
        return (
            <div className={classnames("uni-coupon-load",className)}>稍等，正在帮你找优惠券<div className="dynamic-ellipsis">...</div></div>
        )
    }
}