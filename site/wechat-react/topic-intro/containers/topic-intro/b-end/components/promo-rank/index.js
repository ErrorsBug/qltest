/**
 * Created by dylanssg on 2018/2/2.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
	locationTo,
} from 'components/util';

import { getPromoRank } from '../../../../../actions/topic-intro';

class PromoRank extends Component {
	state = {
		list: []
	};

	componentDidMount(){
		this.getRank();
	}

	async getRank(){
		const res = await this.props.getPromoRank({
			businessId: this.props.topicId,
			businessType: 'topic'
		});
		if(res.state.code === 0){
			const list = res.data.shareInfoList || [];
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
			<div className="co-promo-rank icon_enter" onClick={_=> locationTo(`/wechat/page/distribution/promo-rank?businessId=${this.props.topicId}&businessType=topic`)}>
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