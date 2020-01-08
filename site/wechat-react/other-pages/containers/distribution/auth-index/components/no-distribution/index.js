/**
 *
 * @author Dylan
 * @date 2018/3/30
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import { locationTo } from 'components/util';
import { MiddleDialog } from 'components/dialog';

const mapStateToProps = function(state) {
	return {
	}
};

const mapActionToProps = {
};

@autobind
class NoDistribution extends Component {
	state = {
        showTip: false,
	};

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
	
	render() {
		let {liveRatio, qlRatio, handleToggleDialog} = this.props
		return (
            <div className="no-distribution-wrap">
				<div className="distribution-options-header">
					<div className="distribution-options-header-title">
						<div className="title-name">
                            <img src={require('./img/icon-like.png')} alt=""/>
                            千聊推荐
                        </div>
                        <span className="open-btn" onClick={handleToggleDialog}>开启</span>
					</div>
					<div className="protocol">开启即代表阅读并同意 
						<span className="btn-protocol-link" onClick={()=>{locationTo('/wechat/page/distribution/protocol?liveId=' + this.props.liveId)}}>《课程上架协议》</span>
					</div>
					<div className="proportion">课程分成比例:  直播间<span className="proportion-bold">{liveRatio}%</span>， 平台<span className="proportion-bold">{qlRatio}%</span></div>
                    <div className="no-link"  onClick={this.showTip}>
                        <span>联系我们</span> 
                        <div className="enter-btn icon_enter"></div>
                    </div>
				</div>


				<div className="no-open-distribution">
                    <div className="no-open-header">
                        您能获取
                    </div>
                    <ul className="no-open-ul">
                        <li>1. 通过平台渠道流量帮助您进行课程分发，对于千聊推荐带来的订单，直播间获得当前课程订单40%的收益，千聊获得订单的60%；</li>

                        <li>2. 自2018年12月6日起，所有千聊推荐的H5订单分成只按照单次分成，平台不绑定用户（APP/小程序除外）。即平台为您的直播间带来新增粉丝，如果TA在您的直播间产生交易，平台不参与分成；当TA通过特定千聊官方渠道的产生交易，平台才参与分成。</li>

                        <li>3. 开启此授权，平台将按照该直播间有效完播率、订单转化率、报名人数等综合算法，对符合要求的课程进行推荐。若涉及引流等动作，会降低推荐权重。</li>

                        <li>4. 官方渠道包括但不限于：推荐、发现、猜你喜欢、搜索、个人中心、我的课程、公众号推文、公众号菜单</li>

                        <li>5. 千聊为您带来的分发收益，可以在“直播间收益”-“千聊推荐收益”查看。</li>
                    </ul>
                </div>
				 <MiddleDialog
                    show = {this.props.showDialog}
                    bghide = {true}
                    theme = "empty"
                    onClose = {handleToggleDialog}
                    className = "live-distribution-dialog"
                    contentClassName = "content"
                >
                    <div className="text">您是否确认开启千聊推荐？</div>
                    <div className="btn-group">
                        <span className="cancel" onClick={handleToggleDialog}>取消</span>
                        <span className="confirm" onClick={this.props.handleQuickAudit}>确定</span>
                    </div>
                </MiddleDialog>
                <MiddleDialog
                    show = {this.state.showTip}
                    bghide = {true}
                    theme = "empty"
                    onClose = {this.hideTip}
                    close={true}
                    className = "live-distribution-tip"
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
                            <img src={require('./img/qrcode.png')} alt=""/>
                            <p>长按扫码关注反馈问题</p>
                        </div>
                    </div>
                </MiddleDialog>
            </div>
        )
	}
}


module.exports = connect(mapStateToProps, mapActionToProps)(NoDistribution);