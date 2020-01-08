import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChannelItemCard from '../channel-item-card';
import { autobind } from 'core-decorators';
// import Confirm from 'components/dialog/confirm';

@autobind
export default class ManageChannelItem extends Component {
    static propTypes = {
        // prop: PropTypes
    }
    
    constructor(props) {
        super(props)
        
        this.state = {
            // 转播中 or 下架
            // upOrDown: this.props.upOrDown,
            // channelInfo : {
            //     index: this.props.index,
            //     channelId: this.props.reprintChannelId,
            // }
        }
    }

    componentDidMount = () => {
        // this.refs.confirmDelete.show();
    }
    
    
    onPromotionBtnClick() {
        const shareUrl = `${window.location.origin}/live/channel/channelPage/${this.props.reprintChannelId}.htm`;
        const percent = this.props.selfMediaPercent;
        const datas ={
            businessImage: this.props.reprintChannelImg,
            businessId: this.props.reprintChannelId,
            businessName: this.props.reprintChannelName,
            amount: this.props.reprintChannelAmount,
        }
        this.props.showReprintPushBox({
            shareUrl,
            percent,
            datas,
        })
    }

    onDeleteBtnClick(channelInfo) {
        this.props.showDeleteConfirm(channelInfo);
    }

    onDownBtnClick(channelInfo) {
        this.props.showDownConfirm(channelInfo);
    }

    onUpBtnClick(channelInfo) {
        this.props.showUpConfirm(channelInfo);
    }

    onEditBtnClick() {
        window.location.href = `/wechat/page/channel-create?channelId=${this.props.reprintChannelId}&v=${Date.now()}`
    }

    onTweetBtnClick() {
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
        // window.location.reload();
        return false;
    }

    render() {
        const channelInfo = {
            index: this.props.index,
            channelId: this.props.reprintChannelId,
        }

        return (
            <div className="manage-channel-item">
                <ChannelItemCard 
                    // 类型
                    itemType="manage-item"
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
                    // 是否上架
                    upOrDown={this.props.upOrDown}
                    // 订单数量
                    orderTotalNumber={this.props.orderTotalNumber}
                    // 订单金额
                    orderTotalMoney={this.props.orderTotalMoney}
                    chargeMonths={this.props.chargeMonths}
                    discountStatus={this.props.discountStatus}
                    onTweetBtnClick={this.onTweetBtnClick}
                />
                <div className="operation-area">
                    <div className="show-tweet icon search-icon" onClick={this.onTweetBtnClick}><span>推文</span></div>
                    {
                        this.props.upOrDown === 'up' 
                        ?
                        [
                            <div key="spread" className="spread icon promotion-icon" onClick={this.onPromotionBtnClick}><span>推广</span></div>,
                            <div key="close-course" className="close-course icon close-course-icon" onClick={() => this.onDownBtnClick(channelInfo)}><span>下架</span></div>,
                            <div key="edit" className="edit icon edit-icon" onClick={this.onEditBtnClick}><span>编辑</span></div>
                        ]
                        :
                        [
                            <div key="delete-course" className="delete-course icon delete-icon" onClick={() => this.onDeleteBtnClick(channelInfo)}><span>删除</span></div>,
                            <div key="open-course" className="open-course icon open-course-icon" onClick={() => this.onUpBtnClick(channelInfo)}><span>重新上架</span></div>
                        ]
                    }
                </div>
            </div>
        )
    }
}
