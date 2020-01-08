import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';  
import { share } from 'components/wx-utils';
import {  fillParams ,getUrlParams} from 'components/url-utils';
import Barrage from './components/barrage';
import { createPortal } from 'react-dom';
import PayInfo from '../../components/pay-info'
import { getActStatus,getWithChildren } from '../../actions/home'
import PortalCom from '../../components/portal-com';
import { doPay } from 'common_actions/common'
import { formatDate, locationTo } from 'components/util';
import PayHoc from './pay-hoc'
import { getWxConfig } from '../../actions/common';
import countdownHoc from '../../hoc/countdown'
import HandleAppFunHoc from 'components/app-sdk-hoc'
import AppEventHoc from '../../components/app-event'
import { uploadImage } from '../../actions/common';

const Countdown = ({ h, m, s, sm }) => {
    return (
        <>
        { `00:${m}:${s}` }
        </>
    )
}

const CountComp = countdownHoc(Countdown)

@HandleAppFunHoc
@AppEventHoc
@PayHoc
@autobind
class ExperienceBottomPage extends Component { 
    get campId(){ 
        return getUrlParams('campId', '')
    }
    async componentDidMount() {
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('uni-camp-box');
    } 

    render(){
        const { campObj, payBtn,countEndTime,campConfig } = this.props 
        if(!campObj) return null;
        return (
            <Page title={ campObj.title || '' } className="uni-camp-box">
                <section className="un-experience-scroll">
                    <div className="uec-main"> 
                        <div className="uec-list">
                            <div className={ `uec-item uec-first` }>
                                <img src={ require('./img/collegehome_bg_big.png') } /> 
                                <div className="uec-count">
                                    <h4>距离优惠结束仅剩</h4>
                                    <p><CountComp endTime={countEndTime}/></p>
                                </div>
                            </div> 
                        </div>
                    </div> 
                    <div className="uec-main"> 
                        <div className="uec-list">
                            <div className="uec-item"  onClick={ () => {
                                campObj.bottomUrl && locationTo(campObj.bottomUrl)
                            } }>
                                <img src={campObj?.bottomImgUrl} /> 
                            </div> 
                        </div>
                    </div> 
                </section>
                {
                    createPortal(
                        <Barrage  
                            className={ 'uni-pay-btn-status'}
                            actId={ this.campId }
                            doingSt={['正在学', '已开始学习','5秒前下单','邀你一起学','刚刚下单','下单成功']}
                        />
                        ,document.getElementById('app'))
                }  
                <PortalCom className="uni-pay-btn">
                    <div>
                        <Fragment>
                            <div className="uni-pay-com uni-pay-info">
                                <p><strong>仅需￥{ campObj.bestPrice || campObj.price  }</strong>{ !!campObj.bestPrice && <em>原价￥{ campObj.price || 0 }</em> }</p>
                                <span>
                                    { campObj.studyDays && <>{ campObj.studyDays || 0 }天带学 | </> }
                                    { campObj.startTime && <>{ formatDate(campObj.startTime, 'MM/dd') }开营</> }
                                </span>
                            </div>
                            <div className="uni-pay-com uni-pay-red" onClick={ () => payBtn(false) }>继续支付</div>
                        </Fragment>
                    </div>
                </PortalCom>
            </Page> 
        )
    }
}

const mapStateToProps = (state) => ({
    sysTime: state.common.sysTime,
});

const mapActionToProps = { 
    doPay,
    getWxConfig,
    uploadImage
};

module.exports = connect(mapStateToProps, mapActionToProps)(ExperienceBottomPage);