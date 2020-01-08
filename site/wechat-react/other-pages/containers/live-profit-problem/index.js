import React, { Component } from "react";
import { connect } from "react-redux";
import Page from "components/page";
import { autobind } from 'core-decorators';
import ClipBoard from 'clipboard';

@autobind
class LiveProfitProblem extends Component {
  state = {};

  data = {};

	componentDidMount() {
		this.initClipBoard()
	}

	initClipBoard = () => {
		let clipboard = new ClipBoard('.clipboard-btn');
		clipboard.on('success', function(e) {
				window.toast('复制成功！');
		});  
		clipboard.on('error', function(e) { 
				window.toast('复制失败！请手动复制');
		});
}
  render() {
    return (
      <Page title="问题处理" className="profit-detail-problem-wrap">
        <div className="detail-problem-main">
          <div className="problem-header block-gap-mb30">老师您好，感谢您对千聊的支持！</div>
          <div className="problem-tip block-gap-mb30">
            请将您遇到的问题按照下方的提示进行填写并以邮件的形式发送至：千聊服务中心官方邮箱：
            <span className="tip-primary-color js_clipboard">qlservice@qlchat.com</span>
          </div>

					<div className="clipboard-box block-gap-mb30 js_clipboard">
						<ol>
							<li>直播间名称：</li>
							<li>直播间链接: </li>
							<li>问题描述： </li>
							<li>问题课程链接： </li>
							<li>问题截图： </li>
							<li>您的称呼： </li>
							<li>您的微信号： </li>
							<li>您的联系电话： </li>
							<li>您的千聊ID（个人中心，点击头像进入查询）：</li>
						</ol>
					</div>

					<div className="problem-tip block-gap-mb30">我们将会在三个工作日内对您进行回复，感谢您的配合！</div>
					{/* 这段样式不要改动 */}
					<div className="clipboard-btn" 
					data-clipboard-text={
`直播间名称：
直播间链接: 
问题描述：
问题课程链接：
问题截图：
您的称呼：
您的微信号：
您的联系电话： 
您的千聊ID（个人中心，点击头像进入查询）：
qlservice@qlchat.com`}>
						复制此模版及邮箱
					</div>
        </div>

				<div className="detail-problem-step">
					<div className="problem-step-header">
						操作步骤可参照下图（示例）：
					</div>

					<div className="problem-step-one">
						<div className="problem-tip block-gap-mb30">
							1、将信息粘贴至邮件正文，按照信息提示进行资料填写，如有截图请一并粘贴至邮件正文
						</div>
						<div className="problem-step-image">
							<img src={require('./img/step1.png')}></img>
						</div>
					</div>

					<div className="problem-step-two">
						<div className="problem-tip block-gap-mb30">
							2、正确填写收件人邮箱：
							<span className="tip-primary-color">
								qlservice@qlchat.com
							</span>
							邮件主题格式为：直播名称+问题概括
						</div>
						<div className="problem-step-image">
							<img src={require('./img/step2.png')}></img>
						</div>
					</div>


					<div className="problem-step-three">
						<div className="problem-tip block-gap-mb30">
							3、邮件信息确认无误之后，点击发送。我们将在3个工作日内回复进行处理
						</div>
						<div className="problem-step-image">
							<img src={require('./img/step3.png')}></img>
						</div>
					</div>

				</div>
      </Page>
    );
  }
}

const mapStateToProps = state => ({});

const mapActionToProps = {};

export default connect(
  mapStateToProps,
  mapActionToProps
)(LiveProfitProblem);
