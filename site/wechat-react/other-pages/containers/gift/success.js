import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { request, subAterSign } from 'common_actions/common';

import Page from 'components/page';
import { 
    getGiftDetail,
    getGiftAcceptList,
    getMoreGift,
    getOneGift
} from '../../actions/gift';

import { 
    getAuth
} from '../../actions/topic';
import { getVal } from 'components/util';

import dayjs from 'dayjs';
import { getRealStatus } from '../../../live-studio/actions/live';

class Gift extends Component {

    static defaultProps = {
        
    }

    state = {
        giftDetail: {
            IsOverTime: 'Y', //是否已经过期
            topicId: '',    //话题id
            buynerId: '', //购买者id
            remaindNum: '', //剩余个数
            liveId: '', //直播间id
            price: 0
        },
        giftAcceptList: [], //赠礼领取详情 对象 { acceptTime, userName}
        topicInfo: {
            speaker: '',  //主讲人
            startTime: '', //课程开始时间
            topic: ''  //话题名称
        },
        giftSuccess: {
            
        }
    }

	async componentDidMount() {

        let { type } = this.props.params;
        let { giftId='', giftRecordId='', topicId, useByMe } = this.props.location.query;
        let { getGiftAcceptList, getGiftDetail, getAuth, getMoreGift, getOneGift } = this.props;
        
        let [topicAuth, giftDetailWrap] = await Promise.all([getAuth(topicId),getGiftDetail({giftId, giftRecordId, type})]);

        //判断是否有权限，有的话直接去话题详情页
        if (topicAuth.data.isAuth) {
            location.href = `/wechat/page/topic-intro?topicId=${topicId}`;
        }

        let giftDetail = giftDetailWrap.data;
        giftId = giftDetail.giftId;
        //如果是从分享的链接进来，就跳转到有我来使用的链接；
        if (giftDetail.buynerId == giftDetail.userId && !useByMe) {
            location.href = `/wechat/page/gift/topic/${giftId}`;
        }

        //点击我来使用和其他用户进来都可以领取
        let giftSuccess ;
        if (!giftRecordId) {
            giftSuccess = await getMoreGift(giftId, 'topic'); //群发
        }
        else {
            giftSuccess = await getOneGift(giftRecordId, 'topic') //单发
        }
        let { getResultCode } = giftSuccess.data;

        if (getResultCode === 'manager' || getResultCode === 'VipUser' || getResultCode === 'alreadyBuy') {
            location.href = `/wechat/page/topic-intro?topicId=${topicId}`
        }
        //如果领取成功则剩余份数减掉一；
        if (getResultCode === 'success') {
            giftDetail.remaindNum -= 1;
        }

        //获取领取列表
        let result = await getGiftAcceptList({giftId, giftRecordId, type})
    
        this.setState({
            giftAcceptList: result.data.acceptList,
            giftDetail: giftDetail,
            topicInfo: giftDetail.topicName,
            giftSuccess: giftSuccess.data
        })
    }

    goToTopic = async () => {
        try{
            let communityInfo = await this.gotoCommunity();
            let qrUrl = '';
            if (communityInfo.showStatus == 'Y') {
                let params = {
                    channelId: this.state.topicInfo.channelId || '',
                    topicId: this.state.topicInfo.topicId,
                    communityCode: communityInfo.communityCode,
                }
                qrUrl = await subAterSign('subAfterSignA', this.state.topicInfo.liveId, params)
                let communityCode = getVal(communityInfo, 'communityCode');
                location.href = `/wechat/page/new-finish-pay?liveId=${this.state.topicInfo.liveId}&payFree=N${qrUrl ? `&qrUrl=${encodeURIComponent(qrUrl.qrUrl)}&appIndex=${qrUrl.appId}` : ''}&title=${encodeURIComponent(this.state.topicInfo.topic)}${communityCode ? '&communityCode=' + communityCode + '&liveId=' + this.state.topicInfo.liveId: ''}`;
                return ;
            } else {
                location.href = `/wechat/page/topic-intro?topicId=${this.state.giftDetail.topicId}`;
            }
		}catch(err){
            console.error(err);
            location.href = `/wechat/page/topic-intro?topicId=${this.state.giftDetail.topicId}`;
		}
    }

    gotoCommunity = async () => {
		try {
			let result = await request({
                url: '/api/wechat/community/getByBusiness',
                method: 'POST',
				body: {
					liveId: this.state.giftDetail.liveId,
					type: this.props.params.type,
					businessId: this.state.giftDetail.topicId
				}
			})
			if (result.state.code == 0) {
				return {
					showStatus: result.data.showStatus,
					communityCode: result.data.communityCode
				}
			} else {
				console.log(result.state.msg);
			}
		} catch (error) {
			console.error(error)
		}
    }

    // 按钮面板的ui逻辑
    uiButtonPanel = (getSuccess, isSelf, IsOverTime, remaindNum, giftId, topicId, userId) => {
        if (getSuccess === 'giftEmpty') { //已成功领取赠礼
            return (
                <div className="gift-btn-box">
                    <a className="gift-button primary" href={`/wechat/page/topic-intro?topicId=${topicId}`}>
                        前往话题
                    </a>
                </div> 
            )
        }
        if (!isSelf) { //不是自己的情况下不能赠送，显示以下内容
            return (
                <div className="gift-btn-box">
                    <a className="gift-button primary" onClick={this.goToTopic} href="javascript:void(0)">
                        继续前往话题
                    </a>
                    <a className="gift-button default" href="/liveCenter/index.htm">
                        查看其他话题
                    </a>
                </div> 
            )
        }

        if (IsOverTime === 'Y') { //赠礼有过期时间，过期时间90天，过期显示灰色
            return (
                <div className="gift-btn-box">
                    <a className="gift-button grey" href="javascript:void(0)">
                        赠送给好友
                    </a>

                    <div className="gift-send-wrap">
                        <a href="javascript:" className="gift-send">
                            还剩{remaindNum}份赠礼未领取，点击群发
                        </a>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="gift-btn-box">
                    {
                        remaindNum >= 1 ? //赠礼还有剩余份数的显示逻辑
                        <a href={`/live/gift/send.htm?type=one&giftId=${giftId}`} className="gift-button primary">赠送给好友</a> : null
                    }
                    {
                        remaindNum >= 2 ? //赠礼多于n份代表可以群发，显示群发按钮
                        <a href={`/live/gift/send.htm?type=more&giftId=${giftId}`} className="gift-send">还剩{remaindNum}份赠礼未领取，点击群发</a> : null
                    }
                    {
                        remaindNum <= 0 ? //已经没有赠礼的时候按钮显示为灰色
                        <a href="javascript:void(0)" className="gift-button grey">赠送给好友</a> : null
                    }
                    {
                        remaindNum <= 0 ? 
                        <a href="javascript:void(0)" className="gift-send disable">还剩{remaindNum}份赠礼未领取，点击群发</a> : null
                    }
                </div>
            )
        }
    }

    uiAcceptList = (isSelf, giftList, me) => {
        if (!isSelf || !giftList) {
            return null
        }
        let gift_list = giftList.length > 0 ? giftList.map(({acceptTime, userName, userId}, idx) => {
            return (<div className="gift-got-info" key={idx}>
                <span>{userName} {userId === me ? '(我)' : ''}领取了我的赠礼</span> 
                <span>{acceptTime}</span>
            </div>)
        })
        :(
            <div className="gift-got-nobody">
                暂时没人领取过
            </div>
        )  
        return (
            <div className="gift-accept-list">
                <div className="gift-seperate">领取详情</div>
                {
                    gift_list
                }
            </div>
        )
    }

    uiHeader = (giftSuccess, remaindNum, overTime, IsOverTime) => {
        let {getResultCode} = giftSuccess;
        switch (getResultCode) {
            case 'selfDo':
                return (
                    <div className="gift-header">
                        <div className="gift-header-main">
                            {
                                remaindNum >= 0 ? `剩余${remaindNum}份` : '赠礼已被领取完毕'
                            }
                        </div>
                        <div className="gift-header-sub"> 
                            {
                                IsOverTime ? '赠礼已过期' : `赠礼将于${overTime}天后过期`
                            }
                        </div>
                    </div>
                );
            case 'overTime':
                return (
                    <div className="gift-header">
                        <div className="gift-header-main">
                            赠礼已过期
                        </div>
                        <div className="gift-header-sub"> 
                            下次记得早点来哦
                        </div>
                    </div>
                )
            case 'giftEmpty':
                return (
                    <div className="gift-header">
                        <div className="gift-header-main">
                            赠礼已被领取完毕
                        </div>
                        <div className="gift-header-sub">
                        { remaindNum >= 0 ? IsOverTime ? '赠礼已过期' : `赠礼将于${overTime}后过期` : '下次记得早点来哦'}
                        </div>
                    </div>
                )
            case 'alreadyGetGift':
                return (
                    <div className="gift-header">
                        <div className="gift-header-main">
                            已成功领取赠礼
                        </div>
                        <div className="gift-header-sub">
                            请在「 我的购买记录 」中查看
                        </div>
                    </div>
                )
            case 'getByOthers':
                return (
                    <div className="gift-header">
                        <div className="gift-header-main">
                            该礼品已被他人领取
                        </div>
                    </div>
                )
            case 'success':
                return (
                    <div className="gift-header">
                        <div className="gift-header-main">
                            已成功领取赠礼
                        </div>
                        <div className="gift-header-sub">
                            请在「 我的购买记录 」中查看
                        </div>
                    </div>
                )
            default: 
                return (
                    <div className="gift-header">
                        <div className="gift-header-main">
                            
                        </div>
                        <div className="gift-header-sub">
                            
                        </div>
                    </div>
                )
        }
    }

    //盖章的判断逻辑
    uiSeal = (code) => {
        if (code === 'selfDo' || code === 'alreadyGetGift' || code === 'success') {
            return  <div className="gift-card-get-success"></div>
        }
        if (code === 'getByOthers' || code === 'giftEmpty') {
            return  <div className="gift-card-get-empty"></div>
        }
        return null;
    }

    render() {
        let { type } = this.props.params;
        let { IsOverTime, remaindNum, overTime, price, buynerId, userId, topicId, giftId } = this.state.giftDetail;
        let { speaker, startTime, topic } = this.state.topicInfo;
        let {giftDetail, giftSuccess, topicInfo, giftAcceptList} = this.state;
        overTime = IsOverTime !== 'N' ? '' : overTime;
        let isSelf = buynerId === userId;
        return (
            <Page title="赠礼详情" className='gift-page'>
            
            {this.uiHeader(giftSuccess, remaindNum, overTime, IsOverTime)}
            <div className="gift-body">
                <div className="gift-card">
                    {this.uiSeal(giftSuccess.getResultCode)}
                    <div className="gift-card-header">
                        <div>赠礼</div>     
                        <div className="gift-card-header-content">¥ {Number(price / 100).toFixed(2)}</div>
                    </div>
                    <div className="gift-card-title">
                         { topic }
                    </div>
                    {speaker ? 
                    <div className="gift-card-item">
                        <div className="gift-card-item-up">
                            主讲人
                        </div>
                        <div className="gift-card-item-down">
                            {speaker}
                        </div>
                    </div> : null
                    }
                    <div className="gift-card-item">
                        <div className="gift-card-item-up">
                            开课时间
                        </div>
                        <div className="gift-card-item-down">
                            {startTime ? dayjs(startTime).format('YYYY/MM/DD hh:mm:ss') : ''}
                        </div>
                    </div>
                </div>
                {
                    this.uiButtonPanel(giftSuccess.getResultCode, isSelf, IsOverTime, remaindNum, giftId, topicId, userId)
                }
                {
                    this.uiAcceptList(isSelf, giftAcceptList, userId)
                }
            </div>
        </Page>
        )
    }
}

function mapStateToProps (state) {
    return {
	    
    }
}

const mapActionToProps = {
    getGiftDetail,
    getGiftAcceptList,
    getMoreGift,
    getOneGift,
    getAuth,
}

module.exports = connect(mapStateToProps, mapActionToProps)(Gift);
