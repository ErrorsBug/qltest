/**
 * Created by dylanssg on 2017/10/20.
 */
import React, {Component} from 'react';
import { connect } from 'react-redux';

import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import { formatDate } from 'components/util';

import { getMyTemporaryRefList } from '../../../actions/association';

class Potential extends Component {

	state = {
		noData: false,
		noMore: false,
		emptyPicIndex: 1,
		list: [],
	};

	data = {
		page: 1,
		pageSize: 20
	};

	componentDidMount(){
		this.getMyTemporaryRefList(1);
	}

	async getMyTemporaryRefList(page){
		const res = await this.props.getMyTemporaryRefList({
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
		await this.getMyTemporaryRefList(++this.data.page);
		next && next();
	}

	render(){
		return (
			<Page title="社群管理" className='page-association-potential'>
				{
					<ScrollToLoad
						loadNext={this.loadNext.bind(this)}
						noMore={this.state.noMore}
						noneOne={this.state.noData}
						emptyPicIndex={this.state.emptyPicIndex}
						emptyMessage= '暂没有潜在用户~'
						toBottomHeight={50}
					>
						<div className="tips">请在规定时间内发展潜在用户支付购买礼包或课程则可以绑定成功。让用户点击你的推广链接即可获得待绑定关系。</div>
						<div className="user-list">
							{
								this.state.list.map((item,i) => {
									return (
										<div className="item" key={i}>
											<div className="avatar">
												<img src={item.headImgUrl} alt=""/>
											</div>
											<div className="info">
												<div className="name">{item.userName}</div>
												<div className="content">将于{formatDate(item.expiryTime, 'yyyy-MM-dd hh:mm')} 失去待绑定关系</div>
											</div>
										</div>
									)
								})
							}
						</div>
					</ScrollToLoad>
				}
			</Page>
		)
	}
}

function mapStateToProps (state) {
	return {

	}
}

const mapActionToProps = {
	getMyTemporaryRefList
};

module.exports = connect(mapStateToProps, mapActionToProps)(Potential);
