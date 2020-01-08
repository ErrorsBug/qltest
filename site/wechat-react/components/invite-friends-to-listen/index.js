import React, {Component ,Fragment} from 'react';
import { autobind } from 'core-decorators';
import { createPortal } from 'react-dom';
import {getReceiveInfo, api, getMyQualify} from 'common_actions/common';
import { share } from 'components/wx-utils';

/**
 * 请好友免费听弹窗（C端介绍页，音频极简模式，详情页出现）
 */

@autobind
class InviteFriendsToListen extends Component {

    constructor (props) {
        super(props);

        this.state = {
            show: false,
            total: 0,
            remaining: 0,
            userList: [],
            userInfo: {},
            shareDate: null,
            missionDetail: null
        };
    }
    
    componentDidMount(){

    }

    /**
     * 重置分享(用于极简模式调用)
     * @param {*} topicObj 话题信息
     * @memberof InviteFriendsToListen
     */
    async resetShare(topicObj){
        let userInfo = await this.userInfo();
        let shareData={};
        let isCoral = false;
        if(this.props.source==='coral' || sessionStorage.getItem('trace_page') ==='coral'
            ||(this.props.coralInfo 
            && this.props.coralInfo.isPersonCourse === 'Y' 
            && this.props.coralInfo.sharePercent)
        ){
            isCoral = true;
        }else{
            shareData = await this.getShareKey(topicObj)
        }
        
        this.initShare(topicObj, userInfo, shareData,isCoral)
    }

    /**
     * 显示请好友免费听弹窗
     * @param {*} topicObj 话题信息
     * @param {*} missionDetail 拉人免学费数据
     * @memberof InviteFriendsToListen
     */
    async show(topicObj, missionDetail){
        let inviteFreeShareId = this.props.inviteFreeShareId
        if(!inviteFreeShareId){
            window.toast('未获取分享id！')
            return 
        }
        // 获取请好友听已领信息
        const result = await getReceiveInfo({inviteFreeShareId});
        if(result.state.code === 0){
            this.setState({
                show: true,
                missionDetail,
                ...result.data
            })
            let userInfo = await this.userInfo()
            let shareData={};
            let isCoral = false;
            if((this.props.source==='coral'|| sessionStorage.getItem('trace_page') ==='coral')
                && ( this.props.coralInfo 
                    && this.props.coralInfo.isPersonCourse === 'Y' 
                    && this.props.coralInfo.sharePercent
                )
            ){
                isCoral = true;
            }else{
                shareData = await this.getShareKey(topicObj)
            }
            this.initShare(topicObj, userInfo, shareData,isCoral);
        }
    }

    // 获取用户名
    async userInfo(){
        let userInfo = {};
        if(!this.initUserInfo){
            const userInfoResult  = await api({
                method: 'GET',
                showLoading: false,
                url: '/api/wechat/user/info',
            });
            if(userInfoResult.state.code === 0){
                this.initUserInfo = true
                userInfo = userInfoResult.data.user
                this.setState({userInfo})
            }
        }else {
            userInfo = this.state.userInfo
        }
        return userInfo
    }

    // 获取shareKey
    async getShareKey(topicObj){
        if(!this.initShareKey){
            const result = await getMyQualify(topicObj.channelId || this.props.channelId, 'channel')
            if(result.state.code === 0){
                this.initShareKey = true
                let key = result.data && result.data.shareQualifyInfo && result.data.shareQualifyInfo.shareKey || ''
                let type = result.data && result.data.shareQualifyInfo && result.data.shareQualifyInfo.type || ''
                let shareData = {key, type}
                this.setState({shareData: {key,type}})
                return shareData
            }
        }else {
            return this.state.shareData
        }
    }

    // 展示弹窗的时候重新初始化分享
    initShare(topicObj, userInfo, shareData, isCoral){
        let target = `/wechat/page/friend-invite?channelId=${topicObj.channelId}&inviteFreeShareId=` + this.props.inviteFreeShareId;
        if(isCoral){
            target += '&officialKey=' + userInfo.userId;
        }else{
            if(shareData){
                if(shareData.type === 'live'){
                    target += '&lshareKey=' + shareData.key
                }else if(shareData.type === 'channel'){
                    target += '&shareKey=' + shareData.key
                }
            }
        }
       

        if (this.props.userId && this.props.platformShareRate) {
			target += "&wcl=pshare&psKey=" + this.props.userId;
        }

        const shareUrl = `${window.location.origin}/api/gos?target=${encodeURIComponent(encodeURIComponent(target))}&pre=${encodeURIComponent(encodeURIComponent(`/wechat/page/recommend`))}`;
        
        share({
            title: `${userInfo.name}请你免费学，速度抢！只有10个名额~`,
            desc: `正在抢《${topicObj.topic}》`,
            imgUrl: topicObj.backgroundUrl || "",
            shareUrl,
	        successFn: () => {
                // window.toast("分享成功！");
                if(window._qla){
	                _qla('event', {
		                category: this.props.canListenByShare ? 'invitefree-friend-sharedeeply' : 'invitefree-friend-share',
		                action: 'success',
	                });
                }
            }
        });
    }

    hide() {
        this.setState({
            show: false,
        });
    }

    onClose(e) {
        this.props.onClose && this.props.onClose(e);
        this.hide();
    }

    render () {
        let {show, missionDetail} = this.state
        if(!show){
            return ''
        }
        return createPortal(
            <div className="invite-friends-to-listen-dialog-container">
                <div className="bg" onClick={this.onClose}></div>
                <div className="dialog-c">
                    <div className="notice-bar">
                        <div className="notice-bar-deco-wrap left">
                            <span className="notice-bar-deco"></span>
                            <span className="notice-bar-deco"></span>
                            <span className="notice-bar-deco"></span>
                        </div>
                        <p className="notice-text">
                            每赠送
                            <span>1</span>
                            位好友，你获得
                            <span>5</span>
                            学分
                        </p>
                        <div className="notice-bar-deco-wrap right">
                            <span className="notice-bar-deco"></span>
                            <span className="notice-bar-deco"></span>
                            <span className="notice-bar-deco"></span>
                        </div>
                    </div>
                    <div className="show">
                        {
                            missionDetail ? 
                            // 同时开启了请好友免费听和拉人返学费
                            <Fragment>
                                <p>{`请好友免费听，${missionDetail.inviteTotal || 0}人报名返学费￥${missionDetail.returnMoney || 0}`}</p>
                                <div className="step-group">
                                    <div className="step">
                                        <span className="num">1</span>
                                        <span className="label">发送给朋友</span>
                                    </div>
                                    <div className="step">
                                        <span className="num">2</span>
                                        <span className="label">好友免费听课</span>
                                    </div>
                                    <div className="step">
                                        <span className="num">3</span>
                                        <span className="label">{missionDetail.inviteTotal || 0}人报名立返</span>
                                    </div>
                                </div>
                            </Fragment>:
                            <Fragment>  
                                <div className="step-group">
                                    <div className="step">
                                        <span className="num">1</span>
                                        <span className="label">发送给朋友</span>
                                    </div>
                                    <div className="step">
                                        <span className="num">2</span>
                                        <span className="label">好友领取</span>
                                    </div>
                                    <div className="step">
                                        <span className="num">3</span>
                                        <span className="label">你得5学分</span>
                                    </div>
                                </div>
                            </Fragment>
                        }
                        <div className="invite-number">
                            <div className="invite-number-container">
                                <div className="tip">
                                    <p>共10个赠送名额，还可以发送给<em>{this.state.remaining}人</em></p>
                                </div>
                                <div className="img-group">
                                    {
                                        this.state.userList.length > 0 && this.state.userList.map((item,index)=>{
                                            if(index < 10){
                                                return (
                                                    <div className="img-container" key={`list-${index}`}>
                                                        <img src={item.headImg} alt=""/>
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <a className="my-point" href="/wechat/page/point/mine"><span>我的学分<img src={require('./img/icon_fx.png')}></img></span></a>
                    </div>
                </div>
            </div>,
            document.getElementById('app')
        );
    }
}

InviteFriendsToListen.propTypes = {

};

export default InviteFriendsToListen;
