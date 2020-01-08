/**
 * Created by dylanssg on 2018/2/2.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
	locationTo,
} from 'components/util';

import { getPromoRank } from 'actions/distribution';

class PromoRank extends Component {
	state = {
		list: []
	};

	componentDidMount(){
		this.getRank();
	}

	async getRank(){
		const res = await this.props.getPromoRank({
			businessId: this.props.channelId,
			businessType: 'channel'
		});
		if(res.state.code === 0){
			const list = res.data.shareInfoList || [];
			if(list.length > 0){
				// 手动触发打曝光日志
				setTimeout(() => {
					typeof _qla != 'undefined' && _qla.collectVisible();
				}, 0);
			}
			if(list.length > 3){
				list.length = 3;
			}
			this.setState({
				list
			});
		}
	}

	render(){
		if(!this.state.list.length) return null;
		return (
			<div className="co-promo-rank icon_enter on-log on-visible"
			     onClick={_=> locationTo(`/wechat/page/distribution/promo-rank?businessId=${this.props.channelId}&businessType=channel`)}
			     data-log-name="分享达人榜"
			     data-log-region="promo-rank"
			>
				分享达人榜
				<div className="rank-list">
					{
						this.state.list.reverse().map((l, i) => (
							<div className="avatar" key={i}>
								<img src={l.userHeadUrl} alt=""/>
							</div>
						))
					}
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {

	}
}

const mapActionToProps = {
	getPromoRank
};

module.exports = connect(mapStateToProps, mapActionToProps)(PromoRank);