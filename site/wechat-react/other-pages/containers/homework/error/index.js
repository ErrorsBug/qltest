/**
 * Created by dylanssg on 2017/6/13.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Page from 'components/page';
import { connect } from 'react-redux';

class HomeworkError extends Component {

	state = {
		countDown: 3
	};

	componentDidMount() {
		setTimeout(() => {
			if(this.props.location.query.liveId){
				location.href = `/live/${this.props.location.query.liveId}.htm`
			}
		},3000);
	}
	

	render() {
		return (
			<Page title="课后作业" className="homework-error">
				<div className="error-img"></div>
				<div className="error-tip">当前作业不存在或已经被删除<br/>3秒钟后将返回直播间主页</div>
			</Page>
		)
	}
}

module.exports = connect((state) => {
	return {
	}
}, {

})(HomeworkError);