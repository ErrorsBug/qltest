import React, { PureComponent, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { autobind } from 'core-decorators';
import { formatMoney, locationTo, imgUrlFormat } from 'components/util';



@autobind
export default class extends PureComponent {
    state = {
        isShowProcess: false
    }

    componentDidMount = () => {
    };

    render() {
        const { 
            userHeadImg } = this.props;
        // const status = 'fail'  
        return (
            <Fragment>
                <div className="fcd-img"><img src={userHeadImg}/></div>
            </Fragment>
        )
    }
}
