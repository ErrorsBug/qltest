/**
 * Created by dylanssg on 2017/10/20.
 */
import React, {Component} from 'react';
import { connect } from 'react-redux';
import ScrollToLoad from 'components/scrollToLoad';
import Page from 'components/page';
import { formatMoney, locationTo } from 'components/util';

import { performanceList } from '../../../actions/performance';

class PerformanceHistory extends Component {

	state = {
		noData: false,
		noMore: false,
		emptyPicIndex: 2,
		list: [],
	};

	data = {
		page: 1,
		pageSize: 20
	};

	componentDidMount(){
		this.getPerformanceList(1);
	}

	async getPerformanceList(page){
		const res = await this.props.performanceList({
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
			<Page title="历史业绩" className='page-performance-history'>
				<ScrollToLoad
					loadNext={this.loadNext.bind(this)}
					noMore={this.state.noMore}
					noneOne={this.state.noData}
					toBottomHeight={50}
					emptyPicIndex={this.state.emptyPicIndex}
					emptyMessage="暂时没有历史业绩~"
				>
					<div className="history-list">
						{
							this.state.list.map((item,i) => {
								return (
									<div className="item" key={i}  onClick={() => locationTo(`/wechat/page/coral/performance/details?date=${item.year}-${item.month}&money=${item.money||0}`)}>
										<div className="date">{item.year}年{item.month}月业绩</div>
										<div className="total-num">{formatMoney(item.money)}元
											<b className="arrow icon_enter"></b>
										</div>
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
	performanceList
};

module.exports = connect(mapStateToProps, mapActionToProps)(PerformanceHistory);
