/**
 * Created by dylanssg on 2017/9/13.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';

class PromotionTemp extends Component {
	constructor(props) {
		super(props)
	}

	componentDidMount(){

	}

	render() {
		return (
			<Page title="外部渠道分销模板" className="promotion-temp" >
				<div className="scroll-box"></div>
				<div className="bottom-panel">
					<div className="prices">
						<div className="origin">
							<del>￥299</del>
							<div className="discount-tag">特价优惠</div>
						</div>
						<div className="discount">￥99.9</div>
					</div>
					<div className="buy-btn">购买系列课</div>
				</div>
			</Page>
		)
	}

}

function mapStateToProps(state) {
	return {
	}
}

const mapActionToProps = {
};

module.exports = connect(mapStateToProps, mapActionToProps)(PromotionTemp);