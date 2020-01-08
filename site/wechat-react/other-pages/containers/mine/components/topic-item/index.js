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
		evaluable: this.props.canStatus === 'Y'
	};

	evaluateHandle(e){
		e.stopPropagation();
		if(this.state.isEvaluated) location.href = `/wechat/page/topic-evaluation-list/${this.state.topicId}`;
		else location.href = `/wechat/page/evaluation-create/${this.state.topicId}`;
	}

	render(){
		return (
			<div className="topic-item-container" onClick={() => locationTo(`/topic/${this.state.topicId}.htm`)}>
				<div className="cover">
					<img src={`${this.state.cover}?x-oss-process=image/resize,m_fixed,h_120,w_146`}/>
					{this.state.showLiveStatus && <span className="tip">课程进行中</span>}
				</div>
				<div className="topic-info">
					<div className="title">
						{this.state.title.length > 22 ? this.state.title.substring(0, 22) + "..." : this.state.title}
					</div>
					<div className="detail">
						<div className="live-name">{this.props.liveName}</div>
						{
							this.props.browseNum?
							<div className="browse-num">{this.props.browseNum}次学习</div>
							:null
						}
						{
							(this.props.showEvaluate && this.props.isOpenEvaluate==="Y")?
							(this.props.pageType === 'unevaluated' ?
								<div className="evaluate-btn" onClick={(e) => {e.stopPropagation();location.href = `/wechat/page/evaluation-create/${this.state.topicId}`}}>
									评价
								</div>
								:
								(this.state.evaluable &&
									<div className={`evaluate-btn${this.state.isEvaluated ? ' ed' : ''}`} onClick={this.evaluateHandle.bind(this)}>
										{this.state.isEvaluated ? "已评价" : "评价"}
									</div>)
							):null
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