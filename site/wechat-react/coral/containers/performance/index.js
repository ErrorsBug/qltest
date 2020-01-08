/**
 * Created by dylanssg on 2017/10/20.
 */
import React, {Component} from 'react';
import { connect } from 'react-redux';

import Page from 'components/page';
import {
    locationTo,
	formatMoney
} from 'components/util';

class Performance extends Component {
	render(){
		return (
			<Page title="业绩管理" className='page-performance'>
				<div className="banner">
					<div className="content">
						本月团队业绩(元)
						<div className="num">{formatMoney(this.props.thisMonthPerformance.money)}</div>
						<div className="check-btn on-log" data-log-region="check-month-details" onClick={() => locationTo(`/wechat/page/coral/performance/details?date=${this.props.thisMonthPerformance.year}-${this.props.thisMonthPerformance.month}&money=${this.props.thisMonthPerformance.money||0}`)}>查看本月明细</div>
					</div>
				</div>
				<div className="history-btn on-log" data-log-region="history-performance" onClick={()=>locationTo("/wechat/page/coral/performance/history")}>历史业绩<b className="arrow icon_enter"></b></div>
			</Page>
		)
	}
}

function mapStateToProps (state) {
	return {
		thisMonthPerformance: state.performance.thisMonth||{}
	}
}

const mapActionToProps = {
};

module.exports = connect(mapStateToProps, mapActionToProps)(Performance);
