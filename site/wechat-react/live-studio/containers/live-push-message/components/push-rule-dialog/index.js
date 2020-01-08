import React from 'react';
import { autobind } from 'core-decorators'

@autobind
class PushRuleDialog extends React.Component {

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
            <div className="push-rule-dialog">
                <div className="bg" onClick={this.hide}></div>
                <div className="push-rule-container">
                    <div className="top">推送规则</div>
                    <div className="content">
                        <p>同一个课程24小时内不允许重复推送；</p>
                        <p>若A用户同时关注了您对接的服务号和千聊，只在对接服务号收到推送；</p>
                        <p>若A用户同时关注多个直播间接收的课程推送超过2条，会以合集的形式在当天21:00推送给用户，直播间评分越高排序越靠前；</p>
                        <p>直播间评分取决于：打开率、报名率、完播率、到课率及用户评分等；</p>
                        <p>为保证用户体验以下时间不允许推送：21:00-次日7:00；</p>
                    </div>
                    <div className="btn-group">
                        <div className="btn i-know" onClick={this.hide}>我知道了</div>
                    </div>
                </div>
            </div>
        );
    }
}


export default PushRuleDialog;