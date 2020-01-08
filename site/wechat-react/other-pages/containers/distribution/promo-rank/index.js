/**
 * Created by dylanssg on 2018/1/31.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import Page from 'components/page';
import { locationTo } from 'components/util';

// import { getPromoRank } from '../../../actions/distribution';
import { getNewPromoRank } from '../../../actions/distribution';

@autobind
class PromoRank extends Component {
	state = {
		myInfo: {},
		myRanking: '',
		list: [],
		// 当前用户邀请的人数
		userInviteCount: 0,
	};

	componentDidMount(){
		this.getRank();
	}

	async getRank(){
		const res = await this.props.getNewPromoRank({
			businessId: this.props.location.query.businessId,
			businessType: this.props.location.query.businessType,
			pageNum: 1,
			pageSize: 30,
		});
		if(res.state.code === 0){
			const userInviteCount = res.data.userInviteCount || 0;
			const list = res.data.list || [];
			list.forEach((item, i) => {
				if(item.userId === this.props.userId){
					this.setState({
						myRanking: i + 1
					})
				}
			});
			this.setState({
				userInviteCount,
				list
			});
		}
	}

	inviteBtnClickBtn(){
		const type = this.props.location.query.businessType;
		let url = `/wechat/page/sharecard?type=${type}&${type}Id=${this.props.location.query.businessId}&sourceNo=${this.props.location.query.sourceNo || 'link'}`;
		// 拉人返学费跳转到邀请卡页面的时候带参
		 if (this.props.location.query.missionId) {
            url += `&missionId=${this.props.location.query.missionId}`;
        }
		locationTo(url);
	}

	render(){
		return (
			<Page title="分享达人榜" className='promo-rank-page'>
				<div className="my-info">
					<div className="avatar">
						<img src={this.props.userInfo.headImgUrl} alt=""/>
					</div>
					<div className="details">
						<div className="name">
							<span>
								{this.props.userInfo.name}
							</span>
							{
								this.state.myRanking ?
									<div className={`ranking-badge no${this.state.myRanking}`}>
										{
											this.state.myRanking > 3 &&
												`第${this.state.myRanking}名`
										}
									</div>
									:
									<div className="ranking-badge">未获得排名</div>
							}
						</div>
						<div className="tip">推荐了<b>{this.state.userInviteCount || 0}</b>位朋友过来听课</div>
					</div>
					{
						this.props.userId &&
						<div className="invite-btn on-log on-visible" data-log-region="invite-btn" onClick={this.inviteBtnClickBtn}>
							去邀请
						</div>
					}
				</div>
				<div className="ranking-list">
					{
						this.state.list.map((l, i) => (
							<div className="item" key={i}>
								<div className="avatar">
									<img src={l.headImgUrl} alt=""/>
								</div>
								<div className="details">
									<div className="name">
										{l.userName}
										{
											i < 3 &&
											<div className={`ranking-badge no${i + 1}`}></div>
										}
									</div>
									<div className="tip">推荐了<b>{l.inviteCount}</b>位朋友过来听课</div>
								</div>
								<div className="order">{i + 1}</div>
							</div>
						))
					}
				</div>
			</Page>
		)
	}
}

const mapStateToProps = function(state) {
	return {
		userInfo: state.common.userInfo,
		userId: state.common.userInfo.userId
	}
};

const mapActionToProps = {
	// getPromoRank
	getNewPromoRank
};

module.exports = connect(mapStateToProps, mapActionToProps)(PromoRank);