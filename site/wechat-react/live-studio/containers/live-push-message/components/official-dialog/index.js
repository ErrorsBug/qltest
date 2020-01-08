import React from 'react';
import { autobind } from 'core-decorators'

@autobind
class OfficailDialog extends React.Component {

    state = {
        show: false,
    }

    show(){
        this.setState({show: true})
    }

    hide(){
        this.setState({show: false})
    }

    render() {
        if(!this.state.show){
            return ''
        }
        return (
            <div className="official-push-dialog">
                <div className="bg" onClick={this.hide}></div>
                <div className="push-rule-container">
                    <div className="top">推送规则</div>
                    <div className="main-content">
                        <div className="">
                            <b className="title">千聊公众号矩阵</b>
                            <p>1、千聊公众号矩阵指：千聊，千聊课程，千聊公开课，已购课程。</p>
                            <p>2、学员关注了任意一个千聊公众号，即可接收到推送。</p>
                            <p>3、如果学员关注了多个公众号，只会通过其中一个推送，取关后，还能通过其他公众号下发。</p>
                            <p>4、学员必须订阅了你的直播间，才可以收到推送。</p>
                            <b className="title">推送频次</b>
                            <p>1、为了减少用户骚扰，晚上23点〜7早上点不能推送消息。</p>
                            <p>2、同一个课程，24小时内只能推送1次。</p>
                            <p>3、已经报名的用户，不会收到推送。</p>
                            <b className="title">如何让更多用户收到课程推送？</b>
                            <p>1、引导学员订阅你的直播间。</p>
                            <p>2、在社群或朋友圈，引导学员关注“千聊课程”公众号。</p>
                            <p>3、如果你对接了服务号，可以通过自己的服务号推送。</p>
                        </div>
                        <div className="focus-code-box">
                            <img src={"//open.weixin.qq.com/qr/code?username=gh_275392643e3b"} className="qrcode" alt="" />
                            <span className="tips-1">长按保存二维码，发送给学员</span>
                            <span className="tips-2">学员关注千聊课程公众号后，即可收到推送</span>
                        </div>

                    </div>
                    <div className="btn-group">
                        <div className="btn" onClick={this.hide}>确认</div>
                    </div>
                </div>
            </div>
        );
    }
}


export default OfficailDialog;