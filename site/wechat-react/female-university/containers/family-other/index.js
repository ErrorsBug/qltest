import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import ReceiveDialog from './components/receive-dialog';
import Header from './components/header';
import PortalCom from '../../components/portal-com';
import ConfigMap from '../../hoc/config-map'
import InvitationList from '../../hoc/invitation-list'
import { getUrlParams } from 'components/url-utils';
import { locationTo } from 'components/util';
import { getByCardId, getByInfo, postCard, userCardStatus, listCheckIn } from '../../actions/family'
import { getUserInfo } from '../../actions/common';


const cardList = [1, 3, 7]
const cardObj = {
    4: '系统异常，请稍后再试',
    5: '参数异常',
    6: '邀请卡信息不存在'
}

@ConfigMap
@InvitationList
@autobind
class FamilyOther extends Component {
    state = { 
        isShow: false,
        cardInfo: {},
        cardStatus: '',
        isReceive: false, // 是否显示领取列表
        // isShowBtn: false, // 是否显示领取按钮
    }

    get cardId(){
        return getUrlParams("cardId", "")
    }

    async componentDidMount() { 
        await this.cardStaus();
        this.initData();
    }

    // 初始化数据
    async initData() {
        this.props.getUserInfo();                // 获取
        const { cardInfo } = await getByCardId({ cardId: this.cardId })  // 获取亲友卡用户信息
        this.setState({
            cardInfo: cardInfo || {}
        })
    }

    // 获取亲友卡领取状态
    async cardStaus() {
        const { code } = await userCardStatus({ cardId: this.cardId });
        this.setState({
            cardStatus: code,
        })
    }

    // 点击领取亲友卡
    async onReceive() {
        const { cardStatus } = this.state;
        if(cardList.includes(cardStatus)) {
            this.setState({
                isShow: true
            })
            return false
        }
        if(cardStatus == 2) {
            locationTo('/wechat/page/family-camp-list')
            return false
        }
        try {
            const res = await postCard({ cardId: this.cardId });
            if(res){
                locationTo(`/wechat/page/university-experience-card?cardId=${this.cardId}`)
            }
        } catch (error) {
            window.toast("请求失败")
        }
    }

    // 确认按钮
    onBtn() {
        const { cardStatus } = this.state;
        if(cardStatus == 1) {
            locationTo('/wechat/page/family-camp-list')
        } else if(cardStatus == 3) {
            locationTo('/wechat/page/university/family-card')
        } else if(cardStatus == 7){
            this.onClose()
        }
    }

    // 显示领取列表
    showReceiveList() {
        this.setState({
            isReceive: true,
            isShow: true,
        })
    }

    // 关闭弹窗
    onClose() {
        this.setState({
            isReceive: false,
            isShow: false,
        })
    }
    render(){
        const { isShow, cardInfo, cardStatus, isReceive } = this.state;
        const { configInfo, userList, userInfo } = this.props;
        return (
            <Page title="亲友卡" className="un-family-other">
                <section className="scroll-content-container">
                    <Header 
                        userName={ userInfo.name || '' }
                        userPic={ userInfo.headImgUrl || '' }
                        shareName={ cardInfo.createByName || '' } 
                        shareDecs={ cardInfo.desc || '' }/>
                    <div className="un-family-explain">
                        <h4>
                            领取后你将获得：
                            <span onClick={ this.showReceiveList }>看谁抢到了<i className="iconfont iconxiaojiantou-copy"></i></span>
                        </h4>
                        <ul className="un-family-cont">
                            <li>免费参与大学任意一个体验营 (价值299元)</li>
                            <li>{ configInfo.UFW_CARD_COUPON_AMOUNT || 0 }元入学基金<span>（优惠券不叠加）</span></li>
                            <li>入学可额外获赠{ configInfo.UFW_CARD_INVITEE_ADD_MONTH || 0 }个月大学时长</li>
                        </ul>
                    </div>
                </section>
                { isShow && (
                    <ReceiveDialog 
                        onClose={ this.onClose }
                        lists={ userList }
                        isReceive={ isReceive }
                        cardStatus={ cardStatus }
                        onBtn={ this.onBtn } /> 
                )}
                <PortalCom 
                    className="un-other-btn on-log on-visible" 
                    data-log-name={ cardStatus === 2 ? '您已领取，去兑换体验营' : '立即免费领取' }
                    data-log-region={ cardStatus === 2 ? 'uni-go-exchange' : 'uni-receive-btn' }
                    data-log-pos="0"
                    onClick={ this.onReceive }>{ cardStatus === 2 ? '您已领取，去兑换体验营' : '立即免费领取' }
                </PortalCom>
            </Page>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.common.userInfo.user || {},
    }
}

const mapActionToProps = {
    getUserInfo
};

module.exports = connect(mapStateToProps, mapActionToProps)(FamilyOther);