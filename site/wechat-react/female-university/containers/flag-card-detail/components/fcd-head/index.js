import React, { PureComponent, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { autobind } from 'core-decorators';
import { formatMoney, locationTo, imgUrlFormat, formatDate } from 'components/util';
import FcdImg from '../fcd-img'


@autobind
export default class extends PureComponent {
    state = {
        isShowProcess: false,
        clientWidthApp:750
    }

    componentDidMount = () => {
        this.setState({
            clientWidthApp:document.getElementById('app').clientWidth
        }) 
    };

    render() {
        const {clientWidthApp} =this.state
        const {
            isShowWithdraw,
            className,
            id,
            userId,
            status,
            money,
            desc,
            helpNum,
            cardDate,
            cardTime,
            createTime,
            updateTime,
            userName,
            userHeadImg,
            flagCardBg } = this.props; 
        const cardDateArr=formatDate( cardDate ).split('-') 
        return (
            <Fragment>
                <div className="fcd-head" style={{
                            backgroundImage:`url(${flagCardBg})`,
                            backgroundSize:`${clientWidthApp}px`
                        }}>
                    <div className="fcd-date"> 
                        <div className="fcd-d-bg" style={{
                            backgroundImage:`url(${flagCardBg})`,
                            backgroundSize:`${clientWidthApp}px`
                        }}></div>
                        <div className="fcd-content"> 
                            <div className="fcd-day">{cardDateArr[2]}</div>
                            <div className="fcd-line"></div>
                            <div className="fcd-month">{cardDateArr[0]}/{cardDateArr[1]}</div>
                        </div>
                    </div>
                    <div className="fcd-info">
                        <div className="fcd-name">{userName}</div>
                        <FcdImg userHeadImg={userHeadImg}/> 
                    </div>
                </div>
            </Fragment>
        )
    }
}
