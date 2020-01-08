/**
 * Created by dylanssg on 2017/5/27.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import shallowCompare from 'react-addons-shallow-compare';


class GoToReplyBtn extends Component {

	state = {
		isShow: false
	};

	data = {
	};

	shouldComponentUpdate(nextProps){

		return this.props.currentReplySpeak !== nextProps.currentReplySpeak;
	}

	componentDidMount(){
		if(this.props.currentReplySpeak){
			this.setState({
				isShow: true
			})
		}
	}

	componentDidUpdate(){

	}

	componentWillReceiveProps(props) {
		if(!this.state.isShow && props.currentReplySpeak){
			this.setState({
				isShow: true
			});
		}
	}


	btnHandle(){
		this.props.clearReplySpeak();
		this.setState({
			isShow: false
		});

		this.props.scrollToItem(this.props.currentReplySpeak.id);

		let replyItemsHasBeenRead = localStorage.getItem('replyItemsHasBeenRead-' + this.props.topicId);
		if(replyItemsHasBeenRead) replyItemsHasBeenRead = replyItemsHasBeenRead.split(',');
		else replyItemsHasBeenRead = [];
		this.props.totalSpeakList.forEach((speak) => {
			if(speak.isReplay === 'Y' && speak.commentCreateBy === this.props.userId){
				replyItemsHasBeenRead.push(speak.id);
			}
		});

		localStorage.setItem('replyItemsHasBeenRead-' + this.props.topicId, replyItemsHasBeenRead.join(','))
	}

	render() {

		return (
			<div className={`go-to-reply${this.state.isShow ? ' show' : ''}`} onClick={this.btnHandle.bind(this)}>老师回复了你</div>
		)
	}
}

GoToReplyBtn.defaultProps = {
};

function mapStateToProps (state) {
	return {
	}
}

const mapActionToProps = {

};


// export default connect(mapStateToProps, mapActionToProps)(GoToReplyBtn);
export default GoToReplyBtn
