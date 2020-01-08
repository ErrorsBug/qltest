import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import Header from './components/header'
import CardItem from './components/card-item'
import PortalCom from '../../components/portal-com';
import RuleDialog from './components/rule-dialog'
import InviterLists from '../../components/inviter-lists'
import ShareDialog from './components/share-dialog'
import { getByInfo, cardUserList } from '../../actions/family'
import ConfigMap from '../../hoc/config-map'
import { fillParams, getUrlParams } from 'components/url-utils';
import { share } from 'components/wx-utils';
import { getWxConfig } from '../../actions/common';
import appSdk from 'components/app-sdk';
import { isQlchat } from 'components/envi';

@ConfigMap
@autobind
class FamilyCard extends Component {
    state = { 
        isShow: false,
        cardInfo: {},
        isShare: false,
        userList: []
    }
    
    async componentDidMount() { 
        await this.initConfig();
        this.initData();
    }

    componentWillUpdate(nextProps, { cardInfo }) { // 组件更新前触发
        if(this.state.cardInfo.id != cardInfo.id) {
            this.initSahre(cardInfo.id)
        }
    }

    // 初始化数据
    async initData() {
        const { cardInfo } = await getByInfo()
        const { userRefList } = await cardUserList({ cardId: cardInfo.id});
        this.initSahre(cardInfo.id)
        this.setState({
            cardInfo: cardInfo || {},
            userList: userRefList || []
        })
    }
    async initConfig(){ 
        let config = await this.props.getWxConfig(); 
        var apiList = ['checkJsApi',  'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'translateVoice',
            'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'onVoicePlayEnd', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'openLocation',
            'getLocation', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard'
        ]
        wx.config({...config,jsApiList: apiList });
    }
  
    // 点击分享引导
    clickBtn() {
        if(isQlchat() && !this.state.isShare) {
            this.appShare();
        } else {
            this.setState({
                isShare: !this.state.isShare
            })
        }
    }

    // 规则显示隐藏
    handleDialog() {
        this.setState({
            isShow: !this.state.isShow
        })
    }
    initSahre(cardId) {
        let title = '送你一张女子大学亲友卡';
        let desc = '点击即可免费抢！新世界的大门正在为你打开，美好从此刻开始...'; 
        const url = `${location.origin}/wechat/page/university-family-other`
        let shareUrl = fillParams( {wcl:'university_family_card', cardId: cardId}, url) 
        let imgUrl = 'https://img.qlchat.com/qlLive/activity/image/N2ZIYF6T-T95H-3KS2-1570689922001-SI3LJEH1JSGL.png'
        // h5分享
        share({
            title: title,
            timelineTitle: title,
            desc: desc,
            timelineDesc: desc,
            imgUrl: imgUrl,
            shareUrl: shareUrl
        });
    }

    appShare() {
        const { cardInfo } = this.state;
        let title = '送你一张女子大学亲友卡';
        let desc = '点击即可免费抢！新世界的大门正在为你打开，美好从此刻开始...'; 
        const url = `${location.origin}/wechat/page/university-family-other`
        let shareUrl = fillParams( {wcl:'university_family_card', cardId: cardInfo.id}, url) 
        let imgUrl = 'https://img.qlchat.com/qlLive/activity/image/N2ZIYF6T-T95H-3KS2-1570689922001-SI3LJEH1JSGL.png'
        appSdk.shareConfig({
            content: shareUrl,
            title: title,
            desc: desc,
            thumbImage: imgUrl,
            success: (res) => {
                console.log('分享成功！res:', res);
            }
        });
        appSdk.shareAndCallback({
            content: shareUrl,
            title: title,
            desc: desc,
            thumbImage: imgUrl,
            success: (res) => {
                console.log('分享成功！res:', res);
            }
        });
    }
    render(){
        const { isShow, cardInfo, isShare, userList } = this.state;
        const { configInfo } = this.props
        return (
            <Page title="亲友卡" className="un-family-card">
                <div>
                    <Header url={ 'https://img.qlchat.com/qlLive/activity/image/95TDJ6NS-RSUK-2XCT-1570778388626-2OV9MLCPLVIT.png' } />
                    <div className="un-family-cont">
                        <CardItem 
                            className="card" 
                            title="亲友卡权益" 
                            isIcon 
                            handleDialog={ this.handleDialog }>
                            <div className="un-family-info">
                                <h4>—— 亲友权益 ——</h4>
                                <div>
                                    <p>免费参与大学任意一个体验营 (价值299元)</p>
                                    <p>{ configInfo.UFW_CARD_COUPON_AMOUNT || 0 }元入学基金<i>（优惠券不叠加）</i></p>
                                    <p>入学可额外获赠{ configInfo.UFW_CARD_INVITEE_ADD_MONTH || 0 }个月大学时长</p>
                                </div>
                            </div>
                            <div className="un-family-info">
                                <h4>—— 我的权益 ——</h4>
                                <div>
                                    <p>好友入学后，你也可获得<i className="red">{ configInfo.UFW_CARD_INVITER_ADD_MONTH || 0 }个月时长</i></p>
                                </div>
                            </div>
                        </CardItem>
                        <CardItem className="li" title="谁获得了">
                            { !!userList.length && (
                                <>  
                                    <div className="un-family-numb">共{ cardInfo.cardNum || 0 }张，{ 
                                        !!cardInfo.leftNum ? <>剩余<i>{ cardInfo.leftNum || 0 }</i>张</> : '已全部送出'
                                    }</div>
                                    <InviterLists lists={ userList } />
                                </>
                            ) }
                            { !userList.length && <>
                                <div className="un-family-no-more">暂无记录</div>
                                <div className="un-family-numb">您获得<span>{ cardInfo.leftNum || 0 }</span>张亲友卡, 快分享给好友吧</div>
                            </> }
                        </CardItem>
                    </div>
                </div>
                { isShow && <RuleDialog onClose={ this.handleDialog } cardNum={cardInfo.cardNum} { ...configInfo } /> }
                { isShare && <ShareDialog clickBtn={ this.clickBtn } /> }
                <PortalCom className="un-family-btn"  >
                    <div className="on-log on-visible" onClick={ this.clickBtn } 
                        data-log-name="免费送好友"
                        data-log-region="uni-family-share-btn"
                        data-log-pos="0">免费送好友</div>
                </PortalCom>
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {
    getWxConfig
};

module.exports = connect(mapStateToProps, mapActionToProps)(FamilyCard);