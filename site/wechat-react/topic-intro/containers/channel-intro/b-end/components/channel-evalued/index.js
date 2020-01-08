import React, { Component } from 'react';
import { locationTo} from 'components/util';

class ChannelEvaluate extends Component {
    render() {
        return (
            <div className='channel-evaluate-bar icon_enter'
                onClick={()=>{locationTo(`/wechat/page/channel-evaluation-list/${this.props.channelId}`)}}
            >
                <span className="main">
                    <div className="star"><i style={{width:`${(this.props.evaluation.score *100/5).toFixed(0)}%`}}></i></div> {this.props.evaluation.score}
                </span>
                <span className="evaluate-num">{this.props.evaluation.evaluateNum}条评价</span>
            </div>
        );
    }
}


export default ChannelEvaluate;