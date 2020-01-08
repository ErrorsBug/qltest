import * as React from 'react';
import { createPortal } from 'react-dom';
import { autobind } from 'core-decorators';

import './style.scss'

interface IProps {
    /** 是否显示tip */
    show: boolean
    /** 显示加了（减了）多少碗饭 */
    num: number
}

@autobind
export default class ToastTip extends React.Component<IProps, {}> {

    render() {
        return createPortal(
            <section className={`do-help-tip ${this.props.show ? '' : 'hide'}`}>
                <img src={require('./images/bowl-tip.png')} className='tip-icon'/>

                <span className='tip-text'>帮助好友添加了</span>
                <span className='tip-content'>{ this.props.num }碗饭</span>
            </section>,
            document.body
        )
    }
}