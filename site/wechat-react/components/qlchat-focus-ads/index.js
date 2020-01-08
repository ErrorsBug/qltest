import React from 'react';
import { connect } from 'react-redux';
import { getVal } from '../util';
import dayjs from "dayjs";

// actions
import { getQlchatQrcode, getQlchatSubscribeStatus, isResetAppGuideRule } from '../../other-pages/actions/common';

class LiveFocusAds extends React.Component {

    // 线上首页直播间
    targetLiveId = '2000000645972374'
    // 测试环境直播间
    // targetLiveId = '2000000124600041'

    state = {
        showQlchatAds: false,
        showMiddleDialog: false,
        threeQrcode: '', // 三方二维码
		qlchatQrcode: '', // 官方二维码
    }

    componentDidMount() {
         // 手动触发打曝光日志
         setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0);

        this.initFocusAds();
    }

    async initFocusAds () {
        // 是否显示顶部广告
        let showQlchatAds = this.state.showQlchatAds;

		try {
            let lastCloseDate = Number(localStorage.getItem('__lastCloseAdDate'));
            let closeAdCount = Number(localStorage.getItem('__closeAdCount')) || 0;

            const timeStr = await this.getIsResetAppGuideRule();
            // const timeStr = '2018/04/11';
            const resetTimeStamp = new Date(timeStr).getTime();
            const nowTimeStamp = Date.now();
            // 关闭广告条的那天凌晨0点
            const endOfThatDayTimeStamp = new Date(dayjs(lastCloseDate).format('YYYY/MM/DD')).getTime();

            if (lastCloseDate && lastCloseDate < resetTimeStamp && nowTimeStamp > resetTimeStamp) {
                // 最后关闭广告条的时间如果在重置的时间之前，并且现在时间在重置时间之后，即已经开始本次重置，则显示广告条
                showQlchatAds = true;
                // 并且重置关闭次数
                localStorage.setItem('__closeAdCount', 0);
            } else if (closeAdCount == 0) {
                // 如果未关闭过广告条就显示广告条
                showQlchatAds = true;
            } else if (closeAdCount == 1) {
                // 如果关闭过广告条，判断现在已经过了关闭那天就显示广告条
                showQlchatAds = nowTimeStamp > endOfThatDayTimeStamp + 86400000;
            } else if (closeAdCount == 2) {
                // 如果关闭过广告条，判断现在已经过了关闭3天后，显示广告条
                showQlchatAds = nowTimeStamp > endOfThatDayTimeStamp + 86400000 * 3;
            } else if (closeAdCount == 3) {
                // 如果关闭过广告条，判断现在已经过了关闭3天后，显示广告条
                showQlchatAds = nowTimeStamp > endOfThatDayTimeStamp + 86400000 * 7;
            } else if (closeAdCount >= 4) {
                // 如果关闭过广告条，判断现在已经过了关闭4天后，不显示广告条
                showQlchatAds = false;
                return;
            }
		} catch (e) {
            console.error(e);
        }

        let subscribeStatus = await this.props.getQlchatSubscribeStatus(this.targetLiveId)

        let threeQrcode;
        let qlchatQrcode;

		if (subscribeStatus.isBindThird && !subscribeStatus.isFocusThree) {
            // 绑定三方并且没有关注三方就获取三方二维码
			threeQrcode = await this.props.getQlchatQrcode({ liveId: this.targetLiveId, showQl: 'N' });
		} if (!subscribeStatus.subscribe && subscribeStatus.isShowQl) {
            // 没有关注千聊并且isShowQl==true就获取千聊二维码
			qlchatQrcode = await this.props.getQlchatQrcode({ liveId: this.targetLiveId});
        }

		this.setState({
            showQlchatAds,
            threeQrcode,
            qlchatQrcode,
        })
    }
      

    /**
     * 获取是否重设显示app推广缓存规则
     * @returns {string} timeStr 时间字符串 eg: YY/MM/DD
     */
    async getIsResetAppGuideRule() {
        try {
            const result = await this.props.isResetAppGuideRule();            
            if (getVal(result, 'state.code') == 0) {
                return getVal(result, 'data.time');
            }

            return '';
        } catch (error) {
            console.error(error);
            return '';
        }
    }

    closeQlchatAds = () => {
        // session内不再显示
		try {
            let closeAdCount = localStorage.getItem('__closeAdCount') || 0;
            closeAdCount = Number(closeAdCount);

            closeAdCount++;

            localStorage.setItem('__lastCloseAdDate', Date.now());
            localStorage.setItem('__closeAdCount', closeAdCount);
        } catch (e) {}
        
        this.setState({
            showQlchatAds: false
        })
    }

    showMiddleDialog = () => {
        // 手动触发打曝光日志
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0);
        this.setState({
            showMiddleDialog: true
        })
    }

    closeMiddleDialog = () => {
        this.setState({
            showMiddleDialog: false,
        })
    }

    hideLiveFocusAds = (e) => {
        e.stopPropagation();
        this.closeQlchatAds();
    }

    handleClick = (e) => {
        e.stopPropagation();
    }

    /**
     * 是否显示顶部广告条
     */
    get showAdBar() {
        if (typeof window == 'undefined') {
            return false;
        }
        let isSubs = localStorage.getItem("isSubscribe") && Number(localStorage.getItem("isSubscribe")) >= 3 ? false : true;

        const constShowGoodieBag = (!!this.props.isRecommend)
            && isSubs 
            && this.props.isShowFlag 
            && this.props.isShowFlag.isHot == "Y" 
            && this.props.isShowFlag.isOrder != "Y";
        
        let show = this.state.showQlchatAds && !constShowGoodieBag && !this.props.appOpenId;

        if (this.props.onChangeVisiable) {
            this.props.onChangeVisiable(show);
        }

        return show;
    }

    renderDownloadApp() {
        return (
            <div className="live-focus-ads on-visible download-app" log-region="top-banner">
                <div 
                    className="live-focus-ads-header on-log" 
                    onClick={this.clickDownloadApp}

                    data-log-name="顶部横幅引导"
                    data-log-region="top-banner"
                >
                    <div className="content">
                        离线收听，听课学习更流畅
                    </div>
                    <div className="btn">
                        下载APP
                    </div>
                    <div className="btn-close" onClick={this.hideLiveFocusAds}>

                    </div>
                </div>
            </div>
        )
    }

    clickDownloadApp() {
        location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.thinkwu.live&ckey=CK1390836458352';
    }

    render () {
        if (!this.showAdBar) {
            return null;
        }

        let qrcode = this.state.threeQrcode || this.state.qlchatQrcode;

        if (!qrcode) {
            return this.renderDownloadApp()
        }

        return (
            <div className="live-focus-ads on-visible" log-region="top-banner">
                <div 
                    className="live-focus-ads-header on-log" 
                    onClick={this.showMiddleDialog}

                    data-log-name="顶部横幅引导"
                    data-log-region="top-banner"
                >
                    <div className="content">
                        限时领取超值福利，点击拆开
                    </div>
                    <div className="btn on-log" log-region="receive-welfare-banner-btn">
                        立即领取
                    </div>
                    <div className="btn-close on-log" onClick={this.hideLiveFocusAds} log-region="close-welfare-banner-btn"></div>
                </div>
                {
                    this.state.showMiddleDialog ? 
                    <div className="mask" onClick={this.closeMiddleDialog}> 
                        <div className="middle-dialog on-visible" onClick={this.handleClick} log-region="dialog-welfare">
                            <div className="dialog-close-btn on-log" onClick={this.closeMiddleDialog} log-region="close-welfare-dialog-btn">
                            
                            </div>
                            <img src={qrcode} alt="" className="official-accounts-qrcode"/>
                        </div>
                    </div> : null
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        isShowFlag: state.recommend.isShowFlag,
        // 有值就代表登陆过App
        appOpenId: state.common.appOpenId,
    }
}

const mapActionToProps = {
    getQlchatQrcode,
    getQlchatSubscribeStatus,
    isResetAppGuideRule,
}

export default connect(mapStateToProps, mapActionToProps)(LiveFocusAds);