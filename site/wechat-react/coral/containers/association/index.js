/**
 * Created by dylanssg on 2017/10/20.
 */
import React, {Component} from 'react';
import { connect } from 'react-redux';
import { locationTo } from 'components/util';
import Page from 'components/page';

import { getMyTemporaryRefCount, getMyCommunityCount } from '../../actions/association';

class Association extends Component {

	state = {
		listCount: 0,
		potentialCount: 0,
		showListCountRedSpot: false,
		showPotentialCountRedSpot: false,
	};

	componentDidMount(){
		this.getData();
	}

	async getData(){
		const [listCountRes, potentialCountRes] = await Promise.all([this.props.getMyCommunityCount(), this.props.getMyTemporaryRefCount()]);
		if(listCountRes.state.code === 0){
			this.setState({
				listCount: listCountRes.data.count
			});
			if(listCountRes.data.count != (localStorage.getItem('lastListCount') || 0)){
				this.setState({
					showListCountRedSpot: true
				});
			}
		}
		if(potentialCountRes.state.code === 0){
			this.setState({
				potentialCount: potentialCountRes.data.count
			});
			if(potentialCountRes.data.count != (localStorage.getItem('lastPotentialCount') || 0)){
				this.setState({
					showPotentialCountRedSpot: true
				});
			}
		}
	}

	potentialPageJumpHandle = () => {
		if(this.state.potentialCount) localStorage.setItem('lastPotentialCount', this.state.potentialCount);
		locationTo("/wechat/page/coral/association/potential");
	};

	listPageJumpHandle = () => {
		if(this.state.listCount) localStorage.setItem('lastListCount', this.state.listCount);
		locationTo("/wechat/page/coral/association/list");
	};

	render(){
		return (
			<Page title="社群管理" className='page-association'>
				<div className="operation-list">
					<div className="item on-log" data-log-region="potential-user" onClick={this.potentialPageJumpHandle}>
						<div className={`name${this.state.showPotentialCountRedSpot ? ' red-spot' : ''}`}>潜在用户</div>
						<div className="num">{this.state.potentialCount}
							<b className="arrow icon_enter"></b>
						</div>
					</div>
					<div className="item on-log" data-log-region="group-list" onClick={this.listPageJumpHandle}>
						<div className={`name${this.state.showListCountRedSpot ? ' red-spot' : ''}`}>社群列表</div>
						<div className="num">{this.state.listCount}
							<b className="arrow icon_enter"></b>
						</div>
					</div>
				</div>
			</Page>
		)
	}
}

function mapStateToProps (state) {
	return {

	}
}

const mapActionToProps = {
	getMyTemporaryRefCount,
	getMyCommunityCount
};

module.exports = connect(mapStateToProps, mapActionToProps)(Association);
