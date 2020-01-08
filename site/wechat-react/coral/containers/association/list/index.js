/**
 * Created by dylanssg on 2017/10/20.
 */
import React, {Component} from 'react';
import { connect } from 'react-redux';

import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import { formatDate } from 'components/util';
import Clipboard from 'clipboard';

import { getMyCommunityList } from '../../../actions/association';
import { isHideReferrer } from '../../../actions/account';

const LEVEL_MAP = {
	X: 'bachelor',
	B: 'doctor',
	J: 'professor'
};

class AssociationList extends Component {

	state = {
		noData: false,
		noMore: false,
		emptyPicIndex: 1,
		list: [],
		self: {},
		parent: {},
		copyName:'',
		showParent: false
	};

	data = {
		page: 1,
		pageSize: 20
	};

	componentDidMount(){
		this.getMyCommunityList(1);
		//复制定制
        var clipboard = new Clipboard(".fuzhi");
        clipboard.on('success', function(e) {
			let copyname = e.text;
			if(copyname.length > 14){
				copyname = copyname.substring(0,14) + "...";
			}
            window.toast('已复制微信号 ' + copyname);
        });
        clipboard.on('error', function(e) {
            window.toast('复制失败！请手动复制');
		});
		
	}


	async getMyCommunityList(page){
		const res = await this.props.getMyCommunityList({
			pageNum: page,
			pageSize: this.data.pageSize
		});
		if(res.state.code === 0){
			if(res.data.self.userId !== this.state.self.userId){
				this.setState({
					self: res.data.self
				});
			}

			if(res.data.parent && res.data.parent.userId !== this.state.parent.userId){
				this.setState({
					parent: res.data.parent
				});
				if(await this.isHideReferrer(this.state.parent.userId)){
					this.setState({
						showParent: true
					})
				}
			}else{
				this.setState({
					showParent: true
				})
			}

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
		await this.getMyCommunityList(++this.data.page);
		next && next();
	}

	async isHideReferrer(parentId){
		const res = await this.props.isHideReferrer(parentId);
		return res.state.code === 0 && res.data.isHide === 'N';
	}

	render(){
		return (
			<Page title="社群列表" className='page-association-list'>
				<ScrollToLoad
					loadNext={this.loadNext.bind(this)}
					noMore={this.state.noMore}
					toBottomHeight={50}
				>
					{
						this.state.showParent &&
						(
							this.state.parent.userId ?
								<div className="list-item referrer">
									<div className="avatar">
										<img src={this.state.parent.headImgUrl} alt=""/>
									</div>
									<div className="info">
										{
											this.state.parent.weixinNum?
												<div className="btn-copy fuzhi" data-clipboard-text={this.state.parent.weixinNum} >复制微信号</div>
												:
												<div className="none-copy">暂无微信号</div>
										}
										<div className="name">{this.state.parent.userName}&nbsp;<b className={`badge ${LEVEL_MAP[this.state.parent.identity]}`}></b></div>
										<div className="content">我的推荐人</div>
									</div>
								</div>
								:
								<div className="list-item referrer none">
									暂无推荐人
								</div>
						)
					}
					<div className="list-wrap">
						{
							this.state.self.userId &&
							<div className="list-item">
								<div className="avatar">
									<img src={this.state.self.headImgUrl} alt=""/>
								</div>
								<div className="info">
									<div className="name">{this.state.self.userName}&nbsp;
										{
											!!this.state.self.identity &&
											<b className={`badge ${LEVEL_MAP[this.state.self.identity]}`}></b>
										}
									</div>
									<div className="content">我</div>
								</div>
								{/*<div className="bound-num">绑定2人</div>*/}
							</div>
						}
						{
							this.state.list.map((item,i) => {
								return (
									<div className="list-item" key={i}>
										<div className="avatar">
											<img src={item.headImgUrl} alt=""/>
										</div>
										<div className="info">
											{
												item.weixinNum?
												<div className="btn-copy fuzhi" data-clipboard-text={item.weixinNum} >复制微信号</div>
												:
												<div className="none-copy" >暂无微信号</div>
											}
											<div className="name">{item.userName}&nbsp;
												{
													!!item.identity &&
													<b className={`badge ${LEVEL_MAP[item.identity]}`}></b>
												}
											</div>
											<div className="content">
												{
													item.status === 'N' ?
														'已冻结'
														:
														`绑定时间：${formatDate(item.createTime,'yyyy-MM-dd')}`
												}
											</div>
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
	getMyCommunityList,
	isHideReferrer
};

module.exports = connect(mapStateToProps, mapActionToProps)(AssociationList);
