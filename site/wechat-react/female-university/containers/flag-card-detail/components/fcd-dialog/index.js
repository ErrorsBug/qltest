import React, { PureComponent, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { autobind } from 'core-decorators';
import { formatMoney, locationTo, imgUrlFormat } from 'components/util';
import FcdImg from '../fcd-img'
import { BottomDialog } from 'components/dialog';
import ToggleContent from '../../../../components/toggle-content'


@autobind
export default class extends PureComponent {
    state = {
        isShow: true
    }

    componentDidMount = () => {
    };
    toggle(){

    }
    render() {
        const {
            isShow,
            userName,
            userHeadImg,
              } = this.props;
        const {  } = this.state
        return (
            <Fragment> 
            </Fragment>
        )
    }
}
