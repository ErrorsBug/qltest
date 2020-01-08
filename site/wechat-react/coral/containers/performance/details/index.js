/**
 * Created by dylanssg on 2017/10/20.
 */
import React, {Component} from 'react';
import { connect } from 'react-redux';
import ScrollToLoad from 'components/scrollToLoad';
import Page from 'components/page';
import {
	formatMoney
} from 'components/util';

import { performanceDetailsList, getMyPersonMonthAchievement } from '../../../actions/performance';

class PerformanceDetails extends Component {

	state = {
		year: this.props.location.query.date ? this.props.location.query.date.split('-')[0] : '',
		month: this.props.location.query.date ? this.props.location.query.date.split('-')[1] : '',
		money: this.props.location.query.money,
		noMore: false,
		emptyPicIndex: 2,
		list: [],
		self: {}
	};

	data = {
		page: 1,
		pageSize: 20
	};

	componentDidMount(){
		this.getMyPersonMonthAchievement();
		this.getPerformanceList(1);
	}

	async getMyPersonMonthAchievement(){
		const res = await this.props.getMyPersonMonthAchievement({
			year: this.state.year,
			month: this.state.month
		});
		if(res.state.code === 0){
			this.setState({
				self: res.data
			});
		}
	}

	async getPerformanceList(page){
		const res = await this.props.performanceDetailsList({
			year: this.state.year,
			month: this.state.month,
			pageNum: page,
			pageSize: this.data.pageSize
		});
		if(res.state.code === 0){
			if(page === 1 && (!res.data.list || !res.data.list.length)){
				this.setState({
					noData: true
				});
				return false;
			}else if(!res.data.list || res.data.list.length < this.data.pageSize ){
				this.setState({
					noMore: true
				});
			}

			this.setState({
				list: [...this.state.list, ...res.data.list]
			});
		}
	}

	async loadNext(next){
		await this.getPerformanceList(++this.data.page);
		next && next();
	}

	render(){
		return (
			<Page title="业绩明细" className='page-performance-details'>
				<ScrollToLoad
					loadNext={this.loadNext.bind(this)}
					noMore={this.state.noMore}
					noneOne={this.state.noData}
					toBottomHeight={50}
					emptyPicIndex={this.state.emptyPicIndex}
					emptyMessage="暂时没有业绩明细~"
					
				>
					<div className="title">
						<div className="date">{this.state.year}年{this.state.month}月业绩</div>
						<div className="num">{formatMoney((this.state.money<=0?0:this.state.money))}元</div>
					</div>
					<div className="details-list">
						{
							this.state.self.userName &&
							<div className="item" key="self">
								<div className="avatar">
									<img src={this.state.self.headImgUrl + '?x-oss-process=image/resize,m_fill,h_60,w_60'} alt=""/>
								</div>
								<div className="name">{this.state.self.userName}
									{
										this.state.self.userRole === 'X'&&<span className="badge bachelor"></span>
									}
									{
										this.state.self.userRole === 'B'&&<span className="badge doctor"></span>
									}
									{
										this.state.self.userRole === 'J'&&<span className="badge professor"></span>
									}
								</div>
								<div className="num">{formatMoney(this.state.self.money)}元</div>
							</div>
						}
						{
							this.state.list.map((item,i) => {
								return (
									<div className="item" key={i}>
										<div className="avatar">
											<img src={item.headImgUrl + '?x-oss-process=image/resize,m_fill,h_60,w_60'} alt=""/>
										</div>
										<div className="name">{item.userName}
										{
											item.userRole === 'X'&&<span className="badge bachelor"></span>
										}
										{
											item.userRole === 'B'&&<span className="badge doctor"></span>
										}
										{
											item.userRole === 'J'&&<span className="badge professor"></span>
										}
											
										</div>
										<div className="num">{formatMoney(item.money)}元</div>
									</div>
								)
							})
						}
					</div>
				</ScrollToLoad>
			</Page>
		)
	}
}

function mapStateToProps (state) {
	return {
	}
}

const mapActionToProps = {
	performanceDetailsList,
	getMyPersonMonthAchievement
};

module.exports = connect(mapStateToProps, mapActionToProps)(PerformanceDetails);
