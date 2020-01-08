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
		title: this.props.topicName,
		cover: this.props.headImageUrl,
		isEvaluated: this.props.evaluateStatus === 'Y',
		evaluable: this.props.canStatus === 'Y'
	};

	evaluateHandle(e){
		e.stopPropagation();
		if(this.state.isEvaluated) locationTo(`/wechat/page/topic-evaluation-list/${this.props.topicId}`);
		else locationTo(`/wechat/page/evaluation-create/${this.props.topicId}`);
	}

	onClickEvaluate = (e) => {
		e.stopPropagation();
		
		locationTo(`/wechat/page/evaluation-create/${this.props.topicId}`)
	}

	render(){
		const {
			topicId,
			headImageUrl,
			topicName,
		} = this.props;

		return (
			<div className="topic-item-container" onClick={() => locationTo(`/topic/${topicId}.htm`)}>
				<div className="cover">
					<img src={`${headImageUrl}?x-oss-process=image/resize,m_fixed,h_120,w_146`}/>
				</div>
				<div className="topic-info">
					<div className="title">
						{topicName.length > 22 ? topicName.substring(0, 22) + "..." : topicName}
					</div>
					<div className="detail">
						{
							this.props.isOpenEvaluate==="Y" &&
								<div className="evaluate-btn" onClick={ this.onClickEvaluate }>
									评价
								</div>
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