/**
 * Created by dylanssg on 2017/5/16.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {formatDate, locationTo} from 'components/util';
import {connect} from 'react-redux';

class TopicItem extends Component {
	constructor(props) {
		super(props)
	}
	state = {
		topicId: this.props.topicId || this.props.id,
		title: this.props.topicName || this.props.topic,
		cover: this.props.imageUrl || this.props.backgroundUrl,
		isEvaluated: this.props.evaluateStatus === 'Y',
	};

	evaluateHandle(e){
		e.stopPropagation();
		if(this.state.isEvaluated) location.href = `/wechat/page/topic-evaluation-list/${this.state.topicId}`;
		else location.href = `/wechat/page/evaluation-create/${this.state.topicId}`;
	}

	progressList = (function () {
		try {
			let progress = localStorage.getItem('coursePercentageCompleteRecord')
        	return JSON.parse(progress) || {}
		} catch(e) {
			return {}
		}
	})()

	toEval (e, item) {
        e.stopPropagation();
        e.preventDefault();

        locationTo(`/wechat/page/evaluation-create/${item.id}`)
    }

	render(){
		const { index, timeSlot, item } = this.props;
		const progressList = this.progressList;

		return (
			<div className={`recent-item on-log on-visible ${timeSlot(item, index, true) ? 'no-border' : ''}`}
				onClick={() => locationTo(`/topic/details?topicId=${item.id}`)}
			>
				{
					timeSlot(item, index)
				}
				<img className="headImg" src={`${item.backgroundUrl}@296h_480w_1e_1c_2o`} alt=""/>
				<div className="info">
					<div className="title">{item.topic}</div>
					<div className="desc">
						<p>{progressList[item.id] ? (progressList[item.id] >= 1 ? '已学完' : `已学${ (progressList[item.id] * 100).toFixed(2)}%`) : `${item.browsNum >= 10000 ? (item.browsNum / 10000).toFixed(1) + "万" : item.browsNum}次学习`} | {item.timeDiff.str}</p>
						{
							item.canEval === 'Y' && (
								<span 
									className="to-eval on-log"
									data-log-region="recent-to-eval"
									data-log-pos={item.id}
									onClick={ (e) => { this.toEval(e, item) } }>去评价</span>
							)
						}
					</div>
				</div>
			</div>
		)
	}
}

TopicItem.propTypes = {
	showLiveStatus: PropTypes.bool,
	isEvaluated: PropTypes.bool
};

const mapDispatchToProps = {
	
};

export default connect(null, mapDispatchToProps)(TopicItem);