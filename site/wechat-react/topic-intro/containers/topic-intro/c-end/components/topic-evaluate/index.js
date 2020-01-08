import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { locationTo} from 'components/util';

class TopicEvaluate extends Component {
    render() {
        return (
            <div className='topic-evaluate-bar icon_enter'
                onClick={()=>{locationTo(`/wechat/page/topic-evaluation-list/${this.props.topicId}`)}}
            >
                <span className="main">
                    <div className="star"><i style={{width:`${(this.props.evaluation.score *100/5).toFixed(0)}%`}}></i></div> {this.props.evaluation.score > 0 ? this.props.evaluation.score :''}
                </span>
                {
                    this.props.evaluation.evaluateNum > 0 ?
                        <span className="evaluate-num">{this.props.evaluation.evaluateNum}条评价</span>
                        :    
                        <span className="evaluate-num">暂无评价</span>
                }
            </div>
        );
    }
}

TopicEvaluate.propTypes = {

};

export default TopicEvaluate;