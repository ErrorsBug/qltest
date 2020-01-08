/**
 * Created by dylanssg on 2017/5/8.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import air from './img/air.png'

class Stars extends Component {
	constructor(props){
		super(props)
	}

	state = {
		score: this.props.score || 0
	};

	componentWillReceiveProps(props){
		if(this.props.score != props.score){
			this.setState({
				score: props.score
			});
		}
	}

	gradeHandle(e){
		if(this.props.type == 'display') return;
		let score = e.currentTarget.dataset.rate;
		this.setState({
			score: score
		});
		this.props.onGrade && this.props.onGrade(score);
	}

	calculateWidthByRate(rate){
		let score = this.state.score.toString(),
			int = score.split('.')[0],
			decimal = score.split('.')[1];

		return (int >= rate ? 100 : (decimal && Math.ceil(score) == rate ? parseInt(('0.' + decimal) * 100) : 0)) + '%';
	}

	render() {
		return (
			<div className={`evaluation-stars${this.props.starsCustomStyle && ' ' + this.props.starsCustomStyle}`}>
				<div ref={node => this.starsCongtainer = node} className={`stars-container${this.props.type !== 'display' ? ' spread-click-area' : ''}`}>
					<div className="star-item" data-rate="1" onClick={this.gradeHandle.bind(this)}>
						<div className="body" style={{width:this.calculateWidthByRate(1)}}></div>
						<img src={air} alt=""/>
					</div>
					<div className="star-item" data-rate="2" onClick={this.gradeHandle.bind(this)}>
						<div className="body" style={{width:this.calculateWidthByRate(2)}}></div>
						<img src={air} alt=""/>
					</div>
					<div className="star-item" data-rate="3" onClick={this.gradeHandle.bind(this)}>
						<div className="body" style={{width:this.calculateWidthByRate(3)}}></div>
						<img src={air} alt=""/>
					</div>
					<div className="star-item" data-rate="4" onClick={this.gradeHandle.bind(this)}>
						<div className="body" style={{width:this.calculateWidthByRate(4)}}></div>
						<img src={air} alt=""/>
					</div>
					<div className="star-item" data-rate="5" onClick={this.gradeHandle.bind(this)}>
						<div className="body" style={{width:this.calculateWidthByRate(5)}}></div>
						<img src={air} alt=""/>
					</div>
				</div>
				{ this.props.score > 0 && this.props.showScore &&  <div className="score">{this.state.score}</div>}
			</div>
		);
	}
}

Stars.propTypes = {
	showScore: PropTypes.bool,
	score: PropTypes.number,
	onGrade: PropTypes.func,
	starsCustionStyle: PropTypes.string
};

export default Stars;