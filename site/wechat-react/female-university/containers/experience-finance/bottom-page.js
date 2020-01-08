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
import FinancePayment from '../../components/finance-payment';
import PayTimer from './components/pay-timer' 
import BasicData from './basic-data'

@BasicData
@autobind
class ExperienceBottomPage extends Component { 
    state={
        d: "0",
        h: "00",
        m: "00",
        s: "00",
        t: "0",
        totalPrice:0
    }
    get campId(){ 
        return getUrlParams('campId', '')
    }
    async componentDidMount() {
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('un-experience-camp-box');
    } 
    
    updatTime({d,h,m,s,t}){ 
        this.setState({
            d,h,m,s,t
        })
    }

    updateCharge(totalPrice){
        this.setState({totalPrice})
    }
    render(){
        const {   
            totalPrice,
            h,m, s,t
        } = this.state
        const { financialCamp, payBtn  } = this.props 
        if(!financialCamp) return null;
        if(financialCamp.buyStatus=='Y') {locationTo(`/wechat/page/experience-finance?campId=${this.campId}`)};
        return (
            <Page title={ financialCamp.name || '' } className="un-experience-camp-box">
                <div className="uec-main"> 
                    <div className="uec-list">
                        <div className="uec-item"  onClick={ () => {
                            financialCamp.bottomUrl && locationTo(financialCamp.bottomUrl)
                        } }>
                            <img src={financialCamp?.bottomImg} /> 
                        </div> 
                    </div>
                </div> 
                 
                
                <PortalCom className={ `experience-pay-btn` }>
                    <PayTimer {...this.state}/> 
                    {
                        <div className="experience-one"> 
                            <div className="uni-pay-com uni-pay-red experience-bottom-btn">
                                <FinancePayment isDou region={'experience-finance-bottom'} updateCharge={this.updateCharge} updatTime={this.updatTime} {...financialCamp}>
                                    立即抢购
                                </FinancePayment> 
                            </div>
                        </div>
                    }
                </PortalCom>
            
            </Page> 
        )
    }
}

const mapStateToProps = (state) => ({
    sysTime: state.common.sysTime,
});

const mapActionToProps = { 
    doPay
};

module.exports = connect(mapStateToProps, mapActionToProps)(ExperienceBottomPage);