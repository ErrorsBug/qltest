import React from 'react';
import { autobind } from 'core-decorators'

@autobind
class QuestionDialog extends React.Component {

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
            <div className="question-dialog">
                <div className="bg" onClick={this.hide}></div>
                <div className="question-container">
                <div className="top">为什么有些学员没有成功<br/>收到消息推送？</div>
                    <div className="main-content">
                        <div className="">
                            <b className="title">自己的服务号</b>
                            <p>1、学员没有关注您的公众号；</p>
                            <p>2、学员关注了公众号，但是未进行千聊身份绑定，请查看身份绑定教程；</p>
                            <p>3、你的公众号没有开通模版消息功能或把千聊添加的模版删除了，请查看模版消息教程；</p>
                            <p>4、你的学员没有与公众号产生交互，不能推送客服消息，请查看激活交互期教程；</p>
                            <p>5、学员已经报名课程，也无法收到推送</p>
                            <b className="title">千聊公众号矩阵</b>
                            <p>1、学员没有关注千聊公众号；</p>
                            <p>2、基础版直播间只能推送客服消息，不能推送模板消息，如果你的学员没有与公众号产生交互，即无法送达；</p>
                            <p>3、学员当天收到的客服消息已经超过了微信限制的数量，也会送达失败，这是不可抗因素。</p>
                            <p>4、学员已经报名课程，也无法收到推送</p>
                            <b className="title">我的订阅</b>
                            <p>如果用户已经报名你推送的课程，将无法收到推送。</p>
                            <b className="title">数据统计规则</b>
                            <p>-数据每天凌晨1:00～3:00更新；</p>
                            <p>-访问次数和访问人数只统计推送后3天內访问的用户，3天后再访问，不计入内。</p>
                        </div>

                    </div>
                    <div className="btn-group">
                        <div className="btn i-know" onClick={this.hide}>确认</div>
                    </div>
                </div>
            </div>
        );
    }
}


export default QuestionDialog;