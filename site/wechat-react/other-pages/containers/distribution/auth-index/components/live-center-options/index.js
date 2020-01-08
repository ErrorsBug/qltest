/**
 *
 * @author Dylan
 * @date 2018/3/30
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import Page from 'components/page';
import { locationTo } from 'components/util';
import { MiddleDialog } from 'components/dialog';
import NoDistribution from '../no-distribution';

// import { quickAudit, qlLiveShareQualify } from '../../../../../actions/distribution';
import { addQualify, qlPlatformShare, closeQlRecommend } from '../../../../../actions/distribution';
import { getLiveInfo } from '../../../../../actions/live';
import { getUserInfo } from '../../../../../actions/common';

const mapStateToProps = function(state) {
    return {
        shareQualify: state.distribution.qlLiveShareQualify,
        userInfo: state.common.userInfo && state.common.userInfo.user,
        liveInfo: state.live.liveInfo && state.live.liveInfo.entity
	}
};

const mapActionToProps = {
    addQualify,
    closeQlRecommend, 
    qlPlatformShare,
    getLiveInfo,
    getUserInfo
};

@autobind
class LiveCenterOptions extends Component {
	state = {
		//是否开启分销
        isOpen: this.props.shareQualify && (this.props.shareQualify.status === 'Y'), // null 和 status=N 是未开启的
        showDialog: false,
        showTip: false,
        liveRatio: 40,
        qlRatio: 60,
	};

	async componentDidMount() {
        this.init()
	}
	async init(){
        let { shareQualify } = this.props
        // 判断是否是未分销，未分销返回的是空对象
        if (shareQualify && shareQualify.status === 'Y') {
            this.setState({
                qlRatio: shareQualify.shareRate,
                liveRatio: 100 - shareQualify.shareRate
            })
        }
        await this.props.getUserInfo();
        await this.props.getLiveInfo(this.props.location.query.liveId);
    }

    showTip(){
        this.setState({
            showTip: true,
        })
    }

    hideTip(){
        this.setState({
            showTip: false,
        })
    }
	toggleDialog() {
        this.setState({
            showDialog: !this.state.showDialog,
        })
    }

    async quickAudit(){
        const liveId = this.props.location.query.liveId
        const result = await this.props.addQualify(liveId);
        if(result.state.code === 0){
            const shareQualify = await this.props.qlPlatformShare(liveId)
            if(shareQualify.state.code === 0){
                const qualify = shareQualify.data.platformShareQualifyPo
                this.setState({
                    qlRatio: qualify.shareRate || 60,
                    liveRatio: 100 - qualify.shareRate || 60,
                    isOpen: true,
                    showDialog: false,
                })
                window.toast('开启成功')
            }
        }else {
            window.toast(result.state.msg);
            this.setState({
                showDialog: false
            })
        }
	}
    
    // 确认关闭千聊推荐
    async confirmShutdown() {
        if(this.props.userInfo.userId === this.props.liveInfo.createBy) {
            const res = await this.closeQlRecommend();
            if(res.state.code === 0) {
                window.toast('已成功关闭千聊推荐');
                this.setState({
                    isOpen: false,
                    showTip: false  
                });
            } else {
                window.toast(res.state.msg);
            }
        } else {
            window.toast('只有直播间创建者有权限关闭');
        }
    }

    // 关闭千聊推荐
    async closeQlRecommend() {
        return (await this.props.closeQlRecommend(this.props.liveInfo.id));
    }
    
	render() {
		let {liveRatio, qlRatio, showDialog} = this.state
		return (
			<Page title="千聊推荐" className="distribution-auth-live-center-options">
				
				{
                    this.state.isOpen ? 
                    
					<div className="have-open-distribution">
                        <div className="distribution-options-header">
                            <div className="distribution-options-header-title">
                                <div className="title-name">
                                    <img src={require('./img/icon-like.png')} alt=""/>
                                    千聊推荐
                                </div>
                                <span className="hade-open-btn" onClick={this.showTip}>已开启</span>
                            </div>
                            <div className="protocol">开启即代表阅读并同意 
                                <span className="btn-protocol-link" onClick={()=>{locationTo('/wechat/page/distribution/protocol?liveId=' + this.props.location.query.liveId)}}>《课程上架协议》</span>
                            </div>
                            <div className="proportion">课程分成比例:  直播间<span className="proportion-bold"> {liveRatio}%</span>，平台<span className="proportion-bold"> {qlRatio}%</span></div>
                        </div>
                        
                        <div className="options-ul">
                            <div className="option-item" onClick={ _=> locationTo(`/wechat/page/live/profit/anslysis/recommend/${this.props.location.query.liveId}`)}>
                                <div className="advisory-content">
                                    <h3>
                                        <img className="advisory-img" src={require('./img/icon-platfm.png')} alt=""/>
                                        收益明细
                                    </h3>
                                    <div className="tip">查看千聊推荐带来的收益</div>
                                </div>
                                <div className="enter-btn icon_enter"></div>
                            </div>
                            
                            <div className="option-item" onClick={ _=> locationTo(`/wechat/page/excellent-course?liveId=${this.props.location.query.liveId}`)}>
                                <div className="advisory-content">
                                    <h3>
                                        <img className="advisory-img" src={require('./img/icon-book.png')} alt=""/>
                                        我的优质课
                                    </h3>
                                    <div className="tip">希望平台优先帮我推这些课</div>
                                </div>
                                <div className="enter-btn icon_enter"></div>
                            </div>

                            <div className="option-item" onClick={() => {this.setState({showQuestionQr: true})}}>
                                <div className="advisory-content">
                                    <h3>
                                        <img className="advisory-img" src={require('./img/icon-link.png')} alt=""/>
                                        联系我们
                                    </h3>
                                </div>
                                <div className="enter-btn icon_enter"></div>
                            </div>
                        </div>
                        
					</div>
					:
					<NoDistribution
                      liveRatio = {liveRatio}
                      qlRatio = {qlRatio}
                      showDialog = {showDialog}
                      handleQuickAudit = {this.quickAudit}
                      handleToggleDialog = {this.toggleDialog}
                      liveId = {this.props.location.query.liveId}
                    />
				}   
                <MiddleDialog
                    show = {this.state.showTip}
                    bghide = {true}
                    theme = "empty"
                    onClose = {this.hideTip}
                    close={false}
                    className = "live-distribution-tip"
                    contentClassName = "content"
                >
                    <div className="title">确定要关闭“千聊推荐”吗？</div>
                    <div className="desc">
                        <ul className="need-to-know-detail">
                            <li>
                                <span>1、</span>
                                <span>关闭后，您直播间内所有正在千聊平台推广的课程，会立即下架，失去平台流量扶持。</span>
                            </li>
                            <li>
                                <span>2、</span>
                                <span>为保证直播间的权益，只有<span className="highlight">直播间创建者</span>有权限关闭。</span>
                            </li>
                            <li>
                                <span>3、</span>
                                <span>如果您直播间为千聊合作方，须根据签署的合同或协议，取得双方同意之后再关闭，否则千聊可以根据合同寻求赔偿，如没有特别合作，请忽略本条。</span>
                            </li>
                        </ul>
                    </div>
                    <div className="confirm-btn-wrap">
                        <div className="confirm-btn confirm" onClick={this.confirmShutdown}>确定关闭</div>
                        <div className="confirm-btn" onClick={() => {this.setState({showTip: false})}}>再想想</div>
                        
                    </div>
                </MiddleDialog>
                <MiddleDialog
                    show = {this.state.showQuestionQr}
                    bghide = {true}
                    theme = "empty"
                    onClose = {() => {this.setState({showQuestionQr: false})}}
                    close={true}
                    className = "live-distribution-qr-code"
                    contentClassName = "content"
                >
                    <div className="title">遇到问题啦？</div>
                    <div className="tip-content">
                        <p>
							<strong>1.产品功能使用问题</strong>
							<div>直接点击查看 <a href="http://mp.weixin.qq.com/s/gC5ciBTT0vjeFjQXn4yO9Q" target="_blank">《产品使用教程》</a></div>
						</p>
                        <p>
							<strong>2.人工客服在线咨询</strong>
							<div>请扫描下方二维码关注公众号【千聊知识店铺】，直接在公众号发送您的疑问，聊妹看到后会及时回复您哦！</div>
						</p>
                        <div className="qr-img">
                            <img src={require('../no-distribution/img/qrcode.png')} alt=""/>
                            <p>长按扫码关注反馈问题</p>
                        </div>
                    </div>
                </MiddleDialog>        
			</Page>
		)
	}
}


module.exports = connect(mapStateToProps, mapActionToProps)(LiveCenterOptions);