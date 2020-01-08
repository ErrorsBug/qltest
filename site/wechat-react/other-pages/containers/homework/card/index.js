/**
 * Created by dylanssg on 2017/6/19.
 */
import React, { Component } from 'react';
import Page from 'components/page';
import { connect } from 'react-redux';

class Card extends Component {
	render() {
		return (
			<Page title="作业卡" className="homework-card">
				<div className="container">
					<div className="tips">
						<span className="item">已生成作业卡已生成作业卡已生成作业卡已生成作业卡</span>
						<span className="item">长按保存图片，可在课程内发送</span>
						<span className="item">学员扫码后即可领取作业</span>
					</div>
					<div className="return-btn">返回作业管理</div>
				</div>
			</Page>
		)
	}
}

module.exports = connect((state) => {
	return {
	}
}, {

})(Card);