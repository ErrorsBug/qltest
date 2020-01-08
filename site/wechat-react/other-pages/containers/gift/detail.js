import React, {Component} from 'react';
import { connect } from 'react-redux';
import { locationTo } from 'components/util';
import { request } from 'common_actions/common';

import Page from 'components/page';
import { 
    getGiftDetail,
    getGiftAcceptList,
    getGift
} from '../../actions/gift';
import { 
    getAuth
} from '../../actions/topic';

import dayjs from 'dayjs';

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
            speaker: '', //主讲人
            startTime: '', //开课时间
            topic: '' //课程名称
        },
    }

	async componentDidMount() {

        let { type, giftId } = this.props.params;
        let { getGiftAcceptList, getGiftDetail, getTopicInfo } = this.props;
        //获取赠礼详情

        let result = await Promise.all([getGiftDetail({giftId, type}), getGiftAcceptList({giftId, type})])
        let { topicId, userId } = result[0].data;
        let topicAuth = await getAuth(topicId)()

        this.setState({
            giftAcceptList: result[1].data.acceptList,
            giftDetail: result[0].data,
            topicInfo: result[0].data.topicName,
            topicAuth: topicAuth.data.isAuth
        })
    }

    // 按钮面板的ui逻辑
    uiButtonPanel = (isSelf, IsOverTime, remaindNum, giftId, topicId, topicAuth) => {
        if (!isSelf) { //不是自己的情况下不能赠送，显示以下内容
            return (
                <div className="gift-btn-box">
                    <a className="gift-button primary" href={`/wechat/page/topic-intro?topicId=${topicId}`}>
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
                        remaindNum >= 1 && !topicAuth ?
                            <a className="gift-send use-by-me" onClick={() => {
                                window.confirmDialog('确定要自己使用吗？', ()=> {
                                    window.location.href = `/wechat/page/gift-success/topic?topicId=${topicId}&giftId=${giftId}&useByMe=Y`;
                                }, ()=> {});
                        }} href='javascript:void(0);'>我来使用</a> : null
                    }
                    {
                        remaindNum <= 0 ? //已经没有赠礼的时候按钮显示为灰色
                        <a href="javascript:void(0);" className="gift-button grey">赠送给好友</a> : null
                    }
                    {
                        remaindNum <= 0 ? 
                        <a href="javascript:void(0);" className="gift-send disable">还剩{remaindNum}份赠礼未领取，点击群发</a> : null
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

    render() {
        let { type, giftId } = this.props.params;
        let { IsOverTime, remaindNum, overTime, price, buynerId, userId, topicId } = this.state.giftDetail;
        let {giftAcceptList} = this.state;
        let { speaker, startTime, topic } = this.state.topicInfo;
        let { topicAuth } = this.state;
        overTime = IsOverTime !== 'N' ? '' : overTime;
        let isSelf = buynerId === userId;
        return (
            <Page title="赠礼详情" className='gift-page'>
            
            <div className="gift-header">
                <div className="gift-header-main">
                    {   isSelf ? 
                        remaindNum > 0 ?
                        `剩余${remaindNum}份` :
                        '赠礼已被领取完毕' : ' '
                    }
                </div>
                <div className="gift-header-sub"> 
                    {
                        isSelf ? IsOverTime === 'Y' ? '赠礼已过期' :
                        remaindNum < 0 ? '赠礼全部送出' :
                        `赠礼将于${overTime}天后过期` :  ' '
                    }
                </div>
            </div> 
            <div className="gift-body">
                <div className="gift-card">
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
                    this.uiButtonPanel(isSelf, IsOverTime, remaindNum, giftId, topicId, topicAuth)
                }
                {
                    this.uiAcceptList(isSelf, giftAcceptList, userId)
                }
            </div>
        </Page>
        )
    }

    getGift = (giftId, userId, type="topic") => {
       
    }

}

function mapStateToProps (state) {
    return {
	    
    }
}

const mapActionToProps = {
    getGiftDetail,
    getGiftAcceptList,
    getGift,
    getAuth,
}

module.exports = connect(mapStateToProps, mapActionToProps)(Gift);
