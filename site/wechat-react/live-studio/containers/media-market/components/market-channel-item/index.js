import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChannelItemCard from '../channel-item-card';
import { autobind } from 'core-decorators';

@autobind
export default class MarketChannelItem extends Component {
    static propTypes = {
        tweetId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        // 三方推文链接
        tweetUrl: PropTypes.string,
        // 当前直播间 liveId
        liveId: PropTypes.string,
        // 被转播的课程直播间 liveId
        reprintLiveId: PropTypes.string,
        // 被转播的系列课 id
        reprintChannelId: PropTypes.string,
        // 被转播的系列课名称
        reprintChannelName: PropTypes.string,
        // 被转播的系列课头图
        reprintChannelImg: PropTypes.string,
        // 被转播的系列课原价
        reprintChannelAmount: PropTypes.number,
        // 当前直播间分成比例
        selfMediaPercent: PropTypes.number,
        // 当前直播间分成收益
        selfMediaProfit: PropTypes.number,
        // 是否已转载
        isRelay: PropTypes.string,
        // 转播按钮回调
        onReprint: PropTypes.func,
        discountStatus: PropTypes.string,
        startListening: PropTypes.func,
        pauseListening: PropTypes.func,
    }

    static contextTypes = {
        router: PropTypes.object,
    }

    constructor(props) {
        super(props)
        
        this.state = {
            isRelay: this.props.isRelay,
        }
    }
    


   onReprintBtnClick(channelInfo) {
        const { selfMediaPercent, userAdminLevel, router, liveId } = this.props;
        if ( userAdminLevel === 'none-agent') {
            this.props.showApplyAgent();
            return;
        }

        // console.log(this.props.hasEditPower)
        // if (!this.props.hasEditPower) {
        //     window.toast("没有权限");
        //     return;
        // }
        
        // 暂未设置分成比例或者分成比例设置为零
        // if (!selfMediaPercent || selfMediaPercent == 0) {
        //     this.context.router.push(`/wechat/page/live-studio/contact-info/${liveId}`);
        //     return;
        // }
        if (this.props.isRelay === 'Y') {
            return;
        }
        this.props.onReprint(channelInfo);
    }

    onTweetBtnClick(e) {
        // if (!this.props.hasEditPower) {
        //     window.toast("没有权限");
        //     return;
        // }

        if (!this.props.tweetUrl) {
            window.toast("该系列课暂无推文");
            return;
        }


        let newUrl = this.props.tweetUrl;

        if (/\?/.test(newUrl)) {
            newUrl = newUrl + `&v=${Date.now()}`;
        } else {
            newUrl = newUrl +`?v=${Date.now()}`;
        }

        window.location.href = newUrl;
        
        return false;
    }

    onHandleListen = () => {
        this.props.handleListen(this.props.index);
    }

    onPromotionBtnClick() {
        const shareUrl = `${window.location.origin}/live/channel/channelPage/${this.props.relayChannelId}.htm`;
        const percent = this.props.selfMediaPercent;
        const datas ={
            businessImage: this.props.reprintChannelImg,
            businessId: this.props.relayChannelId,
            businessName: this.props.reprintChannelName,
            amount: this.props.reprintChannelAmount,
        }
        this.props.showReprintPushBox({
            shareUrl,
            percent,
            datas,
        });
    }

    render() {
        // console.log(this.props)
        // reprintLiveId: PropTypes.string,
        // reprintLiveName: PropTypes.string,
        // reprintChannelId: PropTypes.string,
        // reprintChannelName: PropTypes.string,
        // reprintChannelImg: PropTypes.string,
        // reprintChannelAmount: PropTypes.string,
        // selfMediaPercent: PropTypes.string,
        // selfMediaProfit: PropTypes.string,
        const reprintChannelInfo = {
            index: this.props.index,
            tweetId: this.props.tweetId,
            reprintLiveId: this.props.reprintLiveId,
            reprintLiveName: this.props.reprintLiveName,
            reprintChannelId: this.props.reprintChannelId,
            reprintChannelName: this.props.reprintChannelName,
            reprintChannelImg: this.props.reprintChannelImg,
            reprintChannelAmount: this.props.reprintChannelAmount,
            selfMediaPercent: this.props.selfMediaPercent,
            selfMediaProfit: this.props.selfMediaProfit,
            chargeMonths: this.props.chargeMonths,
        }
        return (
            <div className="market-channel-item">
                <ChannelItemCard 
                    // 类型
                    itemType="market-item"
                    // 三方Id
                    tweetId={this.props.tweetId}
                    // 当前直播间 liveId
                    liveId={this.props.liveId}
                    // 被转播的课程直播间 liveId
                    reprintLiveId={this.props.reprintLiveId}
                    // 被转载的直播间名称
                    reprintLiveName={this.props.reprintLiveName}
                    // 被转播的系列课 id
                    reprintChannelId={this.props.reprintChannelId}
                    // 被转播的系列课名称
                    reprintChannelName={this.props.reprintChannelName}
                    // 被转播的系列课头图
                    reprintChannelImg={this.props.reprintChannelImg}
                    // 被转播的系列课原价
                    reprintChannelAmount={this.props.reprintChannelAmount}
                    // 被转播的系列课优惠价 无
                    reprintChannelDiscount={this.props.reprintChannelDiscount}
                    // 当前直播间分成比例
                    selfMediaPercent={this.props.selfMediaPercent}
                    // 当前直播间分成收益
                    selfMediaProfit={this.props.selfMediaProfit}
                    // 学习次数
                    learningNum={this.props.learningNum}
                    // 是否是高分成活动课程
                    isActivityCourse={this.props.isActivityCourse}
                    // 是否上架
                    chargeMonths={this.props.chargeMonths}
                    upOrDown={this.props.upOrDown}
                    discountStatus={this.props.discountStatus}
                    userAdminLevel={this.props.userAdminLevel}
                    onTweetBtnClick={this.onTweetBtnClick}
                />
                {
                    this.props.userAdminLevel !== 'super-agent' ?
                    <div className="operation-area">
                        <div className="listen-btn" onClick={this.onHandleListen}>
                            <span className={(this.props.audioStatus == 'playing') && (this.props.currentAudio == this.props.index) && (this.props.currentPlayTab == this.props.currentMarketTypeTab) ? 'pause-icon' : 'play-icon'}></span>
                            <span className="listen">{(this.props.audioStatus == 'playing') && (this.props.currentAudio == this.props.index) && (this.props.currentPlayTab == this.props.currentMarketTypeTab) ? '暂停试听' : '立即试听'}</span>
                            {
                                (this.props.currentAudio == this.props.index && (this.props.audioStatus == 'playing' || this.props.audioStatus == 'pause') && (this.props.currentPlayTab == this.props.currentMarketTypeTab)) ? 
                                <span className="percent">{this.props.percent + '%'}</span> : null
                            }
                        </div>
                        <div className="show-tweet icon search-icon" onClick={this.onTweetBtnClick}>查看推文</div>
                        {/* <div className="pre-income">预计收益：<span className="income-num">¥{this.props.selfMediaProfit || '--'}</span></div> */}
                        {
                            this.props.isRelay == 'Y' ?
                                <div className="operate-btn promote-btn" onClick={this.onPromotionBtnClick}>去推广</div>
                            :
                                <div className="operate-btn reprint-btn" onClick={() => this.onReprintBtnClick(reprintChannelInfo)}>{`赚￥${this.props.selfMediaProfit}`}</div>
                        }
                    </div> :
                    null
                }
            </div>
        )
    }
}
