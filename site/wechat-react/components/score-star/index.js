import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';



/**
 * @param {number} score 分数
 * @param {boolean} isEditing 是否可编辑状态
 * @param {func} onEdit 点击分数回调 
 */
export default class ScoreStar extends React.PureComponent {
	static propTypes = {
		score: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		isEditing: PropTypes.bool,
		onEdit: PropTypes.func,
		rewriteStyle: PropTypes.bool,
	}

	render() {
		const cln = classNames({
			'co-score-star': !this.props.rewriteStyle,
			editing: this.props.isEditing,
		}, `s-${scoreRound(this.props.score)}`, this.props.className);

		return <span className={cln} {...this.props.attrs}>
			<div className="star-bg" onClick={this.onEdit}>
				<i s="1"></i>
				<i s="2"></i>
				<i s="3"></i>
				<i s="4"></i>
				<i s="5"></i>
			</div>
			<div className="star-real" onClick={this.onEdit}>
				{this.renderRealStar()}
			</div>
		</span>
	}

	renderRealStar() {
		let score = Number(this.props.score) || 0;
		score > 5 && (score = 5);
		score < 0 && (score = 0);

		const stars = [];
		let i = 1;
		for (; i < score; i++) {
			stars.push(
				<i key={i} s={i + ''}></i>
			)
		}

		if (score > i - 1) {
			stars.push(
				<i key={0} s={i + ''} style={{width: `${score + 1 - i}em`}}></i>
			)
		}

		return stars;
	}

	onEdit = e => {
		if (!this.props.isEditing) return;
		const score = Number(e.target.getAttribute('s')) || 0;
		typeof this.props.onEdit === 'function' && this.props.onEdit(score);
	}
}



/**
 * 课程评价文案：星星分数对应不同文案
 */
/**

总分
[1, 1.5) '大失所望'
[1.5, 2.5) '比较一般'
[2.5, 3.5) '还算不错'
[3.5, 4.5) '非常满意'
[4.5, 5] '物超所值'

 */
export class CourseEvalText extends React.PureComponent {
	render() {
		return <span className="course-eval-text">{this.getEvalText()}</span>
	}

	getEvalText() {
		return CourseEvalText.evalTextMap[scoreRound(this.props.score)];
	}

	static evalTextMap = ['暂无评分', '大失所望', '比较一般', '还算不错', '非常满意', '物超所值']
}



function scoreRound(score) {
	score = Number(score) || 0;
	score > 5 && (score = 5);
	score < 0 && (score = 0);
	score = Math.round(score);
	return score;
}



// 子维度类型对应文案
export const subScoreType = {
	content: '方法有效',
	knowledge: '逻辑清晰',
	result: '声音画质',
	teacher: '讲师专业',
	service: '课程服务',
}