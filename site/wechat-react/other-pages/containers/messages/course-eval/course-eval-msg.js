import React from 'react';
import { withRouter } from 'react-router';
import classNames from 'classnames';
import { connect } from 'react-redux';

import ScoreStar, { CourseEvalText } from 'components/score-star';
import { locationTo, getVal } from 'components/util';
import { getUserInfo } from 'common_actions/common';
import { showPhonAuthGuide } from 'components/phone-auth';



@withRouter
class CourseEvalMsg extends React.Component {
	render() {
		const { data } = this.props;
		const isEvaluated = data.evaluateStatus === 'DONE';
		const cln = classNames('course-eval-msg', {
			evaluated: isEvaluated,
		}, this.props.className);

		return <div className={cln} {...this.props.attrs}>
			<div className="entity">
				{
					isEvaluated &&
					<div className="score-wrap">
						<CourseEvalText score={data.evaluateScore}/>
						<ScoreStar score={data.evaluateScore} />
					</div>
				}
				{
					!!this.props.isShowGuide && !isEvaluated &&
					<div className="guide">
						学完了就快来分享心得吧~
					</div>
				}
				{
					isEvaluated
					?
					<div className="main-content">{data.evaluateContent}</div>
					:
					<div className="main-content">
						<i className="icon icon-course"></i>{data.topicName}
					</div>
				}
				{
					isEvaluated &&
					<div className="sec-content">{data.topicName}</div>
				}
				{
					data.channelId &&
					<div className="channel-name">
						所属系列课：<span>{data.channelName}</span>
					</div>
				}
				{
					isEvaluated
					?
					<div className="btn-operate gray on-log"
						{...this.props.attrs}
						onClick={this.linkToEvalItem}
					><i className="icon icon-eye"></i>修改评价</div>
					:
					<div className="btn-operate on-log"
						{...this.props.attrs}
						onClick={this.linkToEvalItem}
					><i className="icon icon-edit"></i>立即评价</div>
				}
			</div>
		</div>
	}

	linkToEvalItem = async () => {
		if (!this.props.userInfo.userId) {
            await this.props.getUserInfo();
        }

		if (this.props.userInfo.isBind === 'N') {
			if (await showPhonAuthGuide()) {
				setTimeout(() => {
					locationTo(`/wechat/page/phone-auth?redirect=${encodeURIComponent(`/wechat/page/evaluation-create/${this.props.data.topicId}`)}`)
				}, 20)
            }
            return;
        }

		setTimeout(() => {
			locationTo(`/wechat/page/evaluation-create/${this.props.data.topicId}`)
		}, 20)
	}
}




export default connect(state => {
	return {
		userInfo: getVal(state, 'common.userInfo.user', {}),
	}
}, {
	getUserInfo,
})(CourseEvalMsg)