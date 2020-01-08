import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Page from 'components/page';
import { doPay,getDomainUrl } from 'common_actions/common'
import { locationTo } from 'components/util';
import { getUrlParams } from 'components/url-utils';
import Detect from 'components/detect';

class Payment extends Component {

    state = {
        type: this.props.location.query.type,
        activityId : this.props.location.query.activityId,
        reqParams: this.props.location.query.reqParams,
    }

    componentDidMount() {
        if(Detect.os.weixin){
            window.wx.ready( ()=> {
                this.doPay();
            })
        }else{
            this.doPay();
        }
        
        this.getDomainUrl();
    }

    doPay() {
        let type = this.state.type;
        let activityId = this.state.activityId;
        let params = this.state.reqParams; //请求支付的参数
        params = JSON.parse(params);

        switch (type) {
            case 'flag-all'://女性大学的支付接口
                params.url = '/api/wechat/transfer/baseApi/h5/pay/universityCardOrder'
                break;
        }

        this.props.doPay({
            ...params,
            activityId,
            type,
            total_fee: 0,
            onPayFree: () => {
                this.onPaySuccess()
            },
            callback: () => {
                this.onPaySuccess()
            },
            onCancel: () => {
                this.onCancel()
            },
        });
    }

    async getDomainUrl() {
        let type = this.state.type;
        let domainType = ''
        switch (type) {
            case 'PACKAGE':
                domainType = 'activityPackage'
                break;

            case 'flag-all'://女性大学全量补卡用与短知识同一个类型
                domainType = 'shortKnowledge'
                break;
            
        }
        if (domainType) {
            let domainResult = await this.props.getDomainUrl({
                type: domainType,
            })
            this.setState({
                domain:domainResult?.data?.domainUrl
            })
        }
    }

    onPaySuccess() {
        let url = document.referrer;
        let type = this.state.type;
        switch (type) {
            case 'PACKAGE':
                let search = window.location.href.replace(/.*\?/, '');
                url = `${this.state.domain}activity/page/common-course?` + search + '&payStatus=y'
                break;
            case 'flag-all':
                url = `${this.state.domain || '/'}wechat/page/flag-home?recard=all`;
                break;
        }
        locationTo(url)
    }

    onCancel() {
        let type = this.state.type;
        let url = ''
        switch (type) {
            case 'PACKAGE':
                let search =  window.location.href.replace(/.*\?/, '');
                url = `${this.state.domain}activity/page/common-reveal?`+search
                break;
            // case 'flag-all':
            //         url = `${this.state.domain}wechat/page/flag-home`;
            //         break;
        }
        if(url){
            locationTo(url)
        }else{
            history.go(-1); //没有定义重定向，即返回
        }
        
    }
    

    render() {
        return (
            <Page title={'安全支付中'}  className="common-payment-page">
                
                <div className="logo-box">
                    <img src={require('./img/icon-safe.png')}/>
                    <span className="tips">为你保障安全支付…</span>
                </div>
                

            </Page>
        );
    }
}

Payment.propTypes = {

};

function mapStateToProps(state) {
    return {
        sysTime: state.common.sysTime,
        userInfo: state.common.userInfo.user,
    };
}

const mapActionToProps = {
    doPay,
    getDomainUrl
};

module.exports = connect(mapStateToProps,mapActionToProps)(Payment);