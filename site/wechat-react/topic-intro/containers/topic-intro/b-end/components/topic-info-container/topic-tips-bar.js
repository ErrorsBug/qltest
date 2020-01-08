import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import TopicTipsDialog from './topic-tips-dialog'

@autobind
class TopicTipBar extends Component {
    state = {
        showDialog:false,
    }

    show(){
        this.setState({
            showDialog:true,
        })
    }

    hide() {
        this.setState({
            showDialog:false
        })
    }

    ifShowPermanentPlayback(){//判断是否显示支持回听，包月反复听，还是为空
        if (this.props.topicInfo.type == 'charge' && this.props.userVipInfo.isVip == 'Y' && Number(this.props.userVipInfo.expiryTime) > new Date().getTime() && this.props.topicInfo.isRelay != "Y") {
            return '';
        }
        if (this.props.channelId && this.props.chargeType == 'flexible') {
            return 'month'
        }
        return 'permanent'
    }

    render() {
        let arr = {};
        if (this.ifShowPermanentPlayback()) {
            arr.tip1 = true;
        }
        if (  
            /* 
                1. 非收费单课显示
                2. 免费系列课显示
                3. 训练营内话题显示
            */
            this.props.topicInfo.type != 'charge'
            ||
            (this.props.chargeConfigs.length && this.props.chargeConfigs[0].amount == 0)
            ||
            this.props.topicInfo.campId
        ) {
            arr.tip2 = true;
        } 
        if (
            /* 
                1. 普通收费单课显示
                2. 系列课的单节付费话题显示
                3. 转播话题不显示
                4. 训练营内话题不显示
            */
            this.props.topicInfo.isRelay!="Y" &&
            (
                (!this.props.topicInfo.channelId && !this.props.topicInfo.campId && this.props.topicInfo.type == 'charge')
                ||
                (this.props.topicInfo.channelId && this.props.topicInfo.isSingleBuy == 'Y')
            )
        ) {
            arr.tip3 = true;
        }
        if (
            /* 
                显示’会员免费听‘
                1. 普通收费单课显示
                2. 系列课的单节付费话题显示
                3. 非转播话题显示
            */
            this.props.topicInfo.isRelay!="Y" &&
            (
                (!this.props.topicInfo.channelId && !this.props.topicInfo.campId && this.props.topicInfo.type == 'charge')
                ||
                (this.props.topicInfo.channelId && this.props.topicInfo.isSingleBuy == 'Y')
            ) &&
            this.props.isOpenVip
        ) {
            arr.tip4 = 'free';
        }
        if (
            /*
                转播话题显示‘会员不可用‘
            */
           this.props.topicInfo.type == 'charge' && this.props.topicInfo.isRelay == 'Y'
        ){
             arr.tip4 = 'unuse'
        }
        return (
            [
                Object.keys(arr).length > 0 &&
                (<div className="topic-tag-bar icon_enter on-log"
                      key='topic-tag-bar'
                      onClick={this.show}
                      data-log-name="课程说明条"
                      data-log-region="topic-tag-bar"
                >
                    {
                    arr.tip1 ? 
                    <span>
                        <img src={require('./img/icon-forever.png')} alt="" />{this.ifShowPermanentPlayback() === 'month' ? '支持回听' : '支持回听'}
                    </span> : null
                    }  
                    {/* 
                        1. 非收费单课显示
                        2. 免费系列课显示
                        3. 训练营内话题显示
                    */}
                    {
                        arr.tip2 ?
                            <span>
                                <img src={require('./img/icon-status.png')} alt="" />
                                {
                                    this.props.topicInfo.status == 'ended' ?
                                        '课程已结束'
                                        : this.props.topicInfo.startTime <= this.props.sysTime ?
                                            '课程进行中'
                                            : '课程未开始'
                                }
                            </span>
                        :null    
                    }
                    {/* 
                        1. 普通收费单课显示
                        2. 系列课的单节付费话题显示
                        3. 转播话题不显示
                        4. 训练营内话题不显示
                    */}
                    {
                        arr.tip3 ?
                            <span key='charge-type-coupon'>
                                <img src={require('./img/icon-coupon.png')} alt="" />支持优惠
                            </span>
                        :null
                    }
                    {/* 
                        显示’会员免费听‘
                            1. 普通收费单课显示
                            2. 系列课的单节付费话题显示
                            3. 转播话题不显示
                        转播话题显示’会员不可用‘
                    */}
                    {
                        arr.tip4 ?
                        (arr.tip4 == 'free' ?
                            <span key='charge-type-vip-free'>
                                <img src={require('./img/icon-vip.png')} alt="" />会员免费听
                            </span> :
                            <span key='charge-type-vip-free'>
                                <img src={require('./img/icon-vip-unuse.png')} alt="" />会员不可用
                            </span>
                        )
                        :null    
                    }
                </div>),
            
                (this.state.showDialog ?
                    <TopicTipsDialog 
                        key='TopicTipsDialog'    
                        isOpenVip = {this.props.isOpenVip}
                        topicInfo = {this.props.topicInfo}
                        power = {this.props.power}
                        isAuthTopic = {this.props.isAuthTopic}
                        hide = {this.hide}
                        ifShowPermanentPlayback = {this.ifShowPermanentPlayback}
                        />
                    :null    
                ) 
            ]
        );
    }
}

TopicTipBar.propTypes = {

};

export default TopicTipBar;