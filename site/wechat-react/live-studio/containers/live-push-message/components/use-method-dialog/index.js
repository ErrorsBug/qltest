import React from 'react';
import { autobind } from 'core-decorators'

@autobind
class UseMethodDialog extends React.Component {

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
            <div className="user-method-dialog">
                <div className="bg" onClick={this.hide}></div>
                <div className="user-method-container">
                    <div className="title">我的订阅</div>
                    <div className="method-container">
                        <p className="question">1.什么是“我的订阅”？</p>
                        <p className="answer">在这个页面，用户可以收到TA订阅的直播间推送的课程。<var>(原为“每天学”，现更名为“我的订阅”)</var></p>
                        <p className="question">2.“我的订阅”的曝光位</p>
                        <p className="answer">·千聊知识商城的主要模块【我的课程】和【动态】；<br />·每天通过千聊公众号推送；</p>
                        <div className="img-box">
                            <div className="img-1">
                                <img src="https://img.qlchat.com/qlLive/liveCommon/user-method-guide-1.png" alt=""/>
                            </div>
                            <div className="img-2">
                                <img src="https://img.qlchat.com/qlLive/liveCommon/user-method-guide-2.png" alt=""/>
                            </div>
                        </div>
                    </div>
                    <div className="footer"><div className="i-konw" onClick={this.hide}>我知道了</div></div>
                </div>
            </div>
        );
    }
}


export default UseMethodDialog;