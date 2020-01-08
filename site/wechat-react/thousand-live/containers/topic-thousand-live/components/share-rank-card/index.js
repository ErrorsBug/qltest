import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Detect from 'components/detect';
// import shallowCompare from 'react-addons-shallow-compare';

import { locationTo, imgUrlFormat, formatMoney, isFromLiveCenter } from 'components/util';
/**
 * 分享榜（影响力排行榜）
 */
@autobind
class ShareRankCard extends PureComponent {

    async componentDidMount(){
        // 手动触发打曝光日志
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0);
    }

    // 跳转到邀请卡
    share(){
        // 系列课下的话题，都跳转到系列课分享卡页面，其余跳转到话题分享卡页面
        let type = 'topic'
        if (isFromLiveCenter() && this.props.platformShareRate) {
            if (this.props.topicInfo.channelId && this.props.topicInfo.isSingleBuy !== 'Y' && this.props.channelCharge[0]) {
                type = 'channel'
            }
        }else if(this.props.topicInfo.channelId){
            type = 'channel'
        }
        let channel = ''
        if(type == 'channel' && this.props.coralInfo && this.props.coralInfo.isPersonCourse === 'Y' && this.props.coralInfo.sharePercent && !this.props.power.allowMGLive){
            channel = '&channel=personShareCard';//*** logtodo */
        }
        let url = `/wechat/page/sharecard?type=${type}&${type}Id=${type === 'topic' ? this.props.topicInfo.id : this.props.topicInfo.channelId}&liveId=${this.props.topicInfo.liveId}${channel}`;
        
        if (isFromLiveCenter() && this.props.platformShareRate) {
            url = url + "&psKey=" + this.props.userId;
        }
        if (isFromLiveCenter()) {
            url = url + "&isCenter=Y";
        }

        // 拉人返现
        if (this.props.missionId) {
            url += `&missionId=${this.props.missionId}`;
        }
        
        locationTo(url)
    }

    // 跳转到分销设置页面
    distributionSet(){
        if(this.props.topicInfo.channelId){
            locationTo(`/wechat/page/channel-distribution-set/${this.props.topicInfo.channelId}`)
        }else {
            locationTo(`/wechat/page/topic-distribution-set/${this.props.topicInfo.id}`)
        }
    }

    get isWeapp() {
        return typeof window != 'undefined' && window.__wxjs_environment === 'miniprogram'
    }

    render() {
        // 是否是珊瑚计划课程和会员
        // const isCoral = (this.props.qlsharekey.lsharekey && this.props.coralIdentity.identity) ? 'Y' : 'N';
        let {power,topicInfo,shareData,cardItems,distributionPercent, coralInfo, missionId} = this.props
        let money
        if(!shareData || !coralInfo){
            return null
        }
        // 是否是C端珊瑚会员且是珊瑚课程
        let coral = false
        if(coralInfo && coralInfo.isPersonCourse === 'Y' && coralInfo.sharePercent && !power.allowMGLive){
            coral = true
        }
        


        if (isFromLiveCenter() && this.props.platformShareRate) {
            // 如果是平台分销，则优先单课价格。
            if (this.props.topicInfo.channelId && this.props.topicInfo.isSingleBuy !== 'Y' && this.props.channelCharge[0]) {
                // 如果没有开启单节购买
                if (this.props.channelCharge[0].discountStatus === 'N') {
                    money = this.props.channelCharge[0].amount*100;
                } else {
                    money = this.props.channelCharge[0].discount*100
                }
            } else {
                money = this.props.topicInfo.money;
            }
            
            money = money * (this.props.platformShareRate / 100)
        } else {
            if(topicInfo.channelId && shareData.discountStatus && shareData.discountStatus !== 'N' && shareData.discountStatus !== 'K'){
                money = shareData.discount
            } else {
                money = shareData.amount
            }
            // C端珊瑚会员要按珊瑚比例计算
            if(coral){
                money = money * (coralInfo.sharePercent / 100)
            }else {
                money = money * (shareData.shareEarningPercent / 100)
            }
        }


        return (
            <div className={`share-rank-card ${cardItems.length > 0 ? 'rank' : 'no-rank'}`}>
                <div className="head" onClick={(e) => locationTo(`/wechat/page/distribution/promo-rank?businessId=${topicInfo.channelId ? topicInfo.channelId : topicInfo.id}&businessType=${topicInfo.channelId ? 'channel' : 'topic'}${missionId?`&missionId=${this.props.missionId}`:''}`)}>
                    <span className="icon-rank"></span>
                    <div className="title">影响力排行榜</div>
                </div>
                {
                    cardItems.length > 0 ? 
                    <div className="link on-log on-visible"
                        onClick={(e) => locationTo(`/wechat/page/distribution/promo-rank?businessId=${topicInfo.channelId ? topicInfo.channelId : topicInfo.id}&businessType=${topicInfo.channelId ? 'channel' : 'topic'}${missionId?`&missionId=${this.props.missionId}`:''}`)}
                        data-log-region="share-rand-card"
                        data-log-pos={shareData.shareEarningPercent ? 'rank-btn-earn' : 'rank-btn'}
                        >
                        {
                            cardItems.map((item, index) => {
                                if(index < 5){
                                    return (
                                        <div className={`share-item`} key={`share-item-${index}`}>
                                            <img src={imgUrlFormat(item.headImgUrl, '?x-oss-process=image/resize,h_90,w_90,m_fill')} />
                                        </div>
                                    )
                                }
                            })
                        }
                        { cardItems.length > 5 && <div className="ellipsis"></div> }
                    </div> :null
                }
                {
                    power.allowMGLive?
                    (
                        shareData.amount ? 
                        (
                            topicInfo.type === 'charge' && distributionPercent ? 
                            <div className="tip">您设置的课程分销奖励为{distributionPercent}%</div>:
                            <div className="tip">课程分销奖励为0%，不利于课程推广</div>
                        ):
                        <div className="tip">动员更多人推广课程吧</div> 
                    ):
                    (
                        (isFromLiveCenter() && this.props.platformShareRate) ?
                        <div className="tip">每人邀请一位朋友，可获得{this.props.platformShareRate}% 的收益</div>:
                        coral ?
                        <div className="tip">每人邀请一位朋友，可获得{coralInfo.sharePercent}% 的收益</div>:
                        (shareData && shareData.amount && shareData.shareEarningPercent?
                        <div className="tip">每人邀请一位朋友，可获得{shareData.shareEarningPercent}% 的收益</div>:
                        <div className="tip">老师精心准备的课程，希望得到你的传播</div>)
                    )
                }
                {/* 小程序内嵌页面不显示 */}
                {
                    (this.isWeapp && Detect.os.ios) ?
                    null
                    :power.allowMGLive ? 
                    (
                        shareData.amount && !distributionPercent ? 
                        <div className={`share on-log on-visible`} data-log-region="b-distribution-set" data-log-pos="distribution-set-btn" onClick={this.distributionSet}><span>设置分销比例，刺激用户分享课程</span></div>:
                        <div className={`share on-log on-visible`} data-log-pos="b-share-rand-card" data-log-region="b-invite-btn" onClick={this.share}><span>生成邀请卡，推广课程</span></div>
                    ):
                    (
                        (isFromLiveCenter() && this.props.platformShareRate )?
                        <div className={`share on-log on-visible`} data-log-pos="invite-btn-earn" data-log-region="share-rand-card" onClick={this.share}>
                            <span>推广课程，为老师打Call</span>
                            {/*<span>推广课程 赚{formatMoney(money)}元</span>*/}
                        </div>
                        :coral ?
                        <div className={`share on-log on-visible`} data-log-pos="invite-btn-earn" data-log-region="share-rand-card" onClick={this.share}>
                            <span>推广课程，为老师打Call</span>
                            {/*<span>推广课程 赚{formatMoney(money)}元</span>*/}
                        </div>
                        :shareData && shareData.amount && shareData.shareEarningPercent?
                        <div className={`share on-log on-visible`} data-log-pos="invite-btn-earn" data-log-region="share-rand-card" onClick={this.share}>
                            <span>推广课程，为老师打Call</span>
                            {/*<span>推广课程 赚{formatMoney(money)}元</span>*/}
                        </div>
                        :<div className={`share on-log on-visible`} data-log-region="share-rand-card" data-log-pos="invite-btn" onClick={this.share}><span>推广课程 为老师打call</span></div>
                    )
                }
            </div>
        )
    }
}

ShareRankCard.propTypes = {
    cardItems: PropTypes.array,
};

function mapStateToProps(state) {
    return {
        qlsharekey: state.common.qlsharekey || {},
        coralIdentity: state.common.coralIdentity || {},
    }
}

const mapActionToProps = {
}

export default connect(mapStateToProps, mapActionToProps)(ShareRankCard);
