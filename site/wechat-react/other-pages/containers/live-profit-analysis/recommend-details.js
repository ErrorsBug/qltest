import React, { Component } from "react";
import { connect } from "react-redux";

import ScrollToLoad from "components/scrollToLoad";
import Page from "components/page";
import { formatDate } from "components/util";
import { autobind } from "core-decorators";
import { getProfitDetailList } from '../../actions/profit';

@autobind
class RecommendDetail extends Component {
	data = {
		size: 20,
		page: 1,
		source: {
			recommend: '千聊-推荐页',
			share: '千聊用户分享',
			tweet: '千聊公众号推文',
			menu: '千聊公众号菜单',
			guess: '千聊-猜你喜欢',
			discovery: '千聊-发现页',
			'mine-course': '千聊-我的课程',
			'mine-center': '千聊-个人中心',
			search: '千聊-搜索',
		}
	}
    state = {
        noneOne: false,
		noMore: false,
		resultList: [],
		type: this.props.location.query.type || 'topic'
    };

    componentDidMount() {
        this.fetchDetails();
    }

    async fetchDetails(page = 1) {
		let result = await this.props.getProfitDetailList({
			businessId: this.props.params.id,
			type:  this.state.type,
			page: {
				page,
				size: this.data.size
			}
		})
		if(result.state.code === 0) {
            let list = result.data.resultList
            if (page == 1 && (!list || !list.length)){
                this.setState({noneOne: true})
            }else if (!list.length || list.length < this.data.size) {
                this.setState({noMore: true})
            }
            this.setState({
                resultList: [...this.state.resultList, ...list]
            })
        }
	}

	async loadMoreRepresent(next) {
		let result =  await this.fetchDetails(++this.data.page);
		next && next();
	}

    render() {
        return (
            <Page title="推荐收益分析" className="recommend-detail-wrap">
				<ScrollToLoad
					className="dd"
					toBottomHeight={500}
					loadNext={this.loadMoreRepresent}
					noneOne={this.state.noneOne}
					noMore={this.state.noMore}
				>
					<div className="recommend-detail-list">
						{this.state.resultList.map((listItem, index) => (
							<div className="item" key={`normal-channel-${index}`}>
								<div className="pic">
									<img src={listItem.userIcon}/>
								</div>
								<div className="info">
									<div className="title">{listItem.userName}</div>
									<div className="date-title">{formatDate(listItem.createTime, 'yyyy年MM月dd日 hh:mm')} {this.data.source[listItem.psCh] || '千聊-推荐页'}</div>
									<div className="info-bar">
										<span className="title">成交金额: 
											<span className="content">￥{listItem.amount}</span>
										</span>
										&nbsp;&nbsp;
										<span className="title">直播间收益: 
											<span className="content">￥{listItem.liveProfit}</span>
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</ScrollToLoad>
            </Page>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

const mapActionToProps = {
	getProfitDetailList
};

module.exports = connect(
    mapStateToProps,
    mapActionToProps
)(RecommendDetail);
