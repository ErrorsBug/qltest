const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Page from 'components/page';
import { locationTo, isNumberValid } from 'components/util';
import { share } from 'components/wx-utils';

// actions
import { saveAddDistributionUser, channelProfit } from '../../actions/channel-distribution';

class ChannelDistributionAdd extends Component {

    state = {
        percent:80,
        restPercent:19.4,
        count:0,
        isRelay: false,
        profit: null,
        relayPercent: null,
    }

    data = {
        intRegExp: /^[1-9][0-9]*?$/,
    }

    // async componentDidMount() {
    //     const res = await this.props.channelProfit(this.props.params.channelId);
    //     this.setState({
    //         profit: res.data.knowledgeProfit,
    //         isRelay: res.data.isRelay === 'Y', 
    //     });
    // }
    
    async componentWillMount() {
        const res = await this.props.channelProfit(this.props.params.channelId);
        this.setState({
            percent: res.data.isRelay === 'Y' ? 0 : 80,
            profit: res.data.knowledgeProfit,
            isRelay: res.data.isRelay === 'Y',
            relayPercent: res.data.knowledgePercent,
        });
    }

    async changePercentFunc(e){
        var percent = e.currentTarget.value;
        var upperLimit = this.state.isRelay ? 100 : 80;
        if(!percent || (this.data.intRegExp.test(percent) && (+percent) <= upperLimit)) {
            this.setState({
                percent: +percent,
                restPercent: (99.4-percent).toFixed(2),
            });
        } else {
            window.toast('比例超出分销范围');
        }
    }

    async changeCountFunc(e){
         var number=e.currentTarget.value;
         if(isNumberValid(number,1,20,'课代表数量')){
            this.setState({
                count:number,
            });
         }
    }
    async saveAddDistribution(){
        const upperLimit = this.state.isRelay ? 100 : 80;
        if(isNumberValid(this.state.count,1,20,'课代表数量')&&isNumberValid(this.state.percent,1,upperLimit,'课代表分成比例')){
            var result=await this.props.saveAddDistributionUser(this.state.percent,this.state.count,this.props.params.channelId);
            window.toast(result.state.msg);
            if (result.state.code === 0) {
                window.history.go(-1);
            }
        }

    }

    render() {
        const {percent, profit, isRelay, relayPercent} = this.state;
        const actualPercent = percent * relayPercent / 100;
        const classPresidentProfit = Math.floor(profit * percent) / 100;
        const yourProfit = Math.floor((profit - classPresidentProfit) * 100) / 100;
        return (
            <Page title="添加课代表" className='distribution-set-page'>
                <section className="setting-percent">
                    <div className="setClass-percent">
                        <span className="setClass-percent-span"><i>%</i></span>
                        <span className="setClass-percent-span1">设置系列课分成比例</span>
                    </div>
                    <div className="percent-input" >
                        <span className="s-2"><input id="percent-input" placeholder={`请输入分成比例(1-${isRelay ? 100 : 80})`} type="number" value={this.state.percent || ''} onChange={this.changePercentFunc.bind(this)}/></span>
                        <span className="s-1">%</span>
                        {
                            isRelay ?
                                <div className="input-tips">
                                    <div>该课为转载课，即课代表实际分成比例为<strong>{actualPercent || '--'}</strong>%</div>
                                    <div>您的单课收益为<strong>{profit || '--'}</strong>元，分销后课代表得<strong>{classPresidentProfit || '--'}</strong>元，您得<strong>{yourProfit || '--'}</strong>元</div>
                                </div>
                            :
                            <div className="input-tips">课代表得{this.state.percent}%，微信得0.6%，剩下{this.state.restPercent}%归你所有</div>
                        }
                    </div>
                    <div className="percent-input" >
                        <span className=""><input id="count-input" placeholder="设置生成数量，每次最多20个" type="number" onChange={this.changeCountFunc.bind(this)}/></span>
                        <div className="input-tips">一个系列课最多生成500个分销授权，每次生成不能超过20个</div>
                    </div>
                    <a href="javascript:;"  className="percent-submit" onClick={this.saveAddDistribution.bind(this)}>生成分销授权链接</a>
                </section>
                <section className="process-detail">
                    <h1>具体流程</h1>
                    <p>1.生成分销授权链接，发送给意向招募的分销用户</p>
                    <p>2.对方点击后即成为本次系列课的课代表</p>
                    <p>3.课代表分享专属邀请卡或链接，产生交易即可的收益分成</p>
                </section>
            </Page>
        );

    }
}

function mapStateToProps (state) {
    return {

    }
}

const mapActionToProps = {
    saveAddDistributionUser,
    channelProfit,
}

module.exports = connect(mapStateToProps, mapActionToProps)(ChannelDistributionAdd);
