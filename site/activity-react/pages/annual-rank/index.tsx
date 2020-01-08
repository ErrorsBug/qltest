import * as React from 'react';
import { render } from 'react-dom';
import { autobind } from 'core-decorators';
import Page from '../../components/page';
import Dialog from './components/dialog/dialog';
import './style.scss';
import api from '../../utils/api';
import * as ui from '../../utils/ui'
import _ScrollToLoad from '../../components/scrollToLoad';
import { share } from '../../utils/wx-utils';
import * as envi from '../../utils/envi';

const ScrollToLoad = _ScrollToLoad as any
const activityCode = 'yearRank'

export type teacherItem = {
	id: string;
	businessId: string; //业务id
	likeNum: number; //投票数量
	content: string; //内容
	name: string; //名称
	headImg: string; //头像
	isLike: string; //是否投票过
	isFocus?: string; //是否关注过
	couponId?: string; //优惠券id
	url?: string;
}

type annualRankState = {
	teacherList: Array<teacherItem>;
	showMiddleDialog: boolean;
	showRankRule: boolean;
	pageSize: number;
	pageNum: number;
	isNoMore: boolean;
	dialogData: teacherItem;
}

interface SaveLikeParams {
	activitycode: string;
	businessId: string;
}

class AnnualRank extends React.Component<{}, annualRankState> {
	/** 页面初始化数据 */
	private initData = {actId: 'yearRank'}
	
	state = {
		showMiddleDialog: false,
		teacherList: new Array<teacherItem>(),
		showRankRule: false,
		pageSize: 10,
		pageNum: 0,
		isNoMore: false,
		dialogData: {
			id: '',
			businessId: '', //业务id
			likeNum: 0,//投票数量
			content: '', //内容
			name: '', //名称
			headImg: '', //头像
			isLike: '' //是否投票过
		}
	};

	componentDidMount () {
		this.getRankList();
	}

	async getRankList(){
		let result = await this.ajaxGetRankList();
		if (result) {
			this.setState({
				teacherList: result
			})
		}
		this.initShare();
		this.appShare();
	}

	initShare = () => {
        const actId = this.initData.actId;
        const shareUrl = window.location.protocol + "//" + window.location.host + `/wechat/page/activity/annualRank?actId=${actId}`
        share({
            title: '我正在参与千聊2017年度直播间评选',
            desc: '评选你最喜爱的年度直播间，送出海量优惠券，陪你过新年！',
            shareUrl,
            imgUrl: 'https://img.qlchat.com/qlLive/adminImg/1CNP8V5F-ET4H-VPOW-1514453115542-KM4UZQK32QMW.jpg'
        });
	}
	
	appShare = () => {
		let initData = this.initData;
		const actId = this.initData.actId;
		const shareUrl = window.location.protocol + "//" + window.location.host + `/wechat/page/activity/annualRank?actId=${actId}`
		var ver = envi.getQlchatVersion();
        var that = this;
        if (ver && ver >= 360) {
            (window as any).qlchat.ready(function () {
                (window as any).qlchat.onMenuShareWeChatTimeline({
                    type: "link", 
                    content: shareUrl, 
                    title: '我正在参与千聊2017年度直播间评选',
                    desc: '评选你最喜爱的年度直播间，送出海量优惠券，陪你过新年！',
                    thumbImage: 'https://img.qlchat.com/qlLive/adminImg/1CNP8V5F-ET4H-VPOW-1514453115542-KM4UZQK32QMW.jpg', 
                    // success: that.getShareCode.bind(that)
                });
                (window as any).qlchat.onMenuShareWeChatFriends({
                    type: "link", 
                    content: shareUrl, 
                    title: '我正在参与千聊2017年度直播间评选',
                    desc: '评选你最喜爱的年度直播间，送出海量优惠券，陪你过新年！',
                    thumbImage: 'https://img.qlchat.com/qlLive/adminImg/1CNP8V5F-ET4H-VPOW-1514453115542-KM4UZQK32QMW.jpg'
                });
            })
        }
	}

	onVote = async (id: string, couponId?: string) => {

		const result = await api('/api/wechat/activity/saveLike', {
			method: 'POST',
			body: {
				activityCode: activityCode,
				businessId: id,
				couponId
			}
		})

		// const result = {
		// 	state: {
		// 		code: 0,
		// 		msg: 'yes'
		// 	},
		// 	data: {
		// 		isHave: 'N',
		// 		isFocus: 'Y',
		// 		liveName: 'dsjfljsfkjsklfjksjfjdsfjsjfjafkdjklajsfk',
		// 		logo: 'jfjdsfj',
		// 		coupon: {
		// 			money: 15
		// 		}
		// 	}
		// }

		if (result.state && result.state.code === 0) {
			let data: any = {};
			//立即领券的情况
			if (couponId) {
				data = {
					...result.data.coupon, 
					isHave: result.data.isHave, 
					logo: result.data.logo,
					liveName: result.data.liveName,
					couponId: couponId
				}
			}
			else {
				data = this.state.teacherList.filter(item => {
					console.log(item)
					return item.businessId == id
				})[0]
				data.isFocus = result.data.isFocus;
			}
			
			//投票成功本地状态更新
			let teacher_list = this.state.teacherList.map(item => {
				if (item.businessId === id) {
					item.isLike = 'Y';
					item.likeNum += 1;
				}
				return item
			})
			this.setState({
				showMiddleDialog: true,
				dialogData: data,
				teacherList: teacher_list
			})
		}
		else {
			ui.toast(result.state.msg)
		}
	}
	//获取老师排行榜
	ajaxGetRankList = async () => {
		let {pageNum} = this.state;
		pageNum += 1;
		const result = await api('/api/wechat/activity/rankList', {
			method: 'POST',
			body: {
				activityCode: 'yearRank', 
				page: {
					page: pageNum,
					size: this.state.pageSize
				}
			}
		})
		if (result.state.code === 0) {
			let {teacherList} = this.state;
			this.setState({
				pageNum: pageNum,
				teacherList: teacherList.concat(result.data.dataList)
			})
			return result.data.dataList;
        } else {
			ui.toast(result.state.msg);
			return null
        }
	}

	onCloseDialog = () => {
		this.setState({
			showMiddleDialog: false
		})
	}
	//点击投票规则
	showRankRule = () => {
		this.setState({
			showRankRule: true
		})
	}
	//退出投票规则页面
	hideRankRule = () => {
		this.setState({
			showRankRule: false
		})
	}
	render(){
		return (
			<Page title='年度口碑榜' className='annual-rank-page'>
				{
					this.state.showRankRule ?       
					
					<div className="show-rank-rule">
						<div className="annual-rank-rule">
							<div className="header">
								年度口碑直播间评比规则
							</div>
							<div className="content">
							1、依据评比总榜投票数量，共评选10名年度最受欢迎直播间，颁发千聊官方年度直播间奖杯； <br />
							2、依据2017年度直播间收益+粉丝数量，共评选20名年度最具成就直播间，颁发千聊官方年度直播间奖杯； <br/>
							3、每位学员可投直播间一票，投票后有机会领取直播间券，投票截至时间2018年1月5日24：00；  <br />
							4、提名投票排行榜直播间筛选资格：内容优质，粉丝量1w以上，累计成交额10w以上             <br />       
							</div>
							<div className="prompt">
							最终获奖名单将在活动一周后公众号推文公布，工作人员将在活动结束后1个月内联系获奖老师。 <br />
							千聊保留本次活动最终解析权
							</div>
						</div>
						<div className="annual-rank-rule">
							<div className="header">
								千聊独家风云讲师奖评比规则
							</div>
							<div className="content">
							1、依据评比总得分=老师跨年演讲话题课的参与人数*50%+活动期间直接间收益*50%，评选前5名颁发千聊独家风云讲师奖杯； <br />
							2、活动时间：2017年12月29日——2018年1月5日
							</div>
							<div className="prompt">
							最终获奖名单将在公众号推文公布，工作人员将在活动结束后1个月内联系获奖老师； <br />
							千聊保留本次活动最终解析权。
							</div>
						</div>
						<div className="go-back" onClick={this.hideRankRule}>
							返回
						</div>
					</div>
					
					
					:
					<div className="annual-rank-page-scroll-wrap">
						<ScrollToLoad
							className="annual-rank-page-inner"
							toBottomHeight={0}
							notShowLoaded = {true}
							loadNext={this.loadNextTeacher}
							noMore={this.state.isNoMore}
						>
							<div className="header-wrap">
								<img className="header" src={require('./assets/title.png')} />
							</div>
							<div className="rank-rule-wrap">
								<div className="rank-rule" onClick={this.showRankRule}>
									投票规则
								</div>
							</div>
							<TeacherList data={this.state.teacherList} onVote={this.onVote}/>
						</ScrollToLoad>
						<Dialog 
							show={this.state.showMiddleDialog}
							onClose={this.onCloseDialog}
							data={this.state.dialogData}
						/>
					</div>
				}
			</Page>
		)
	}

	loadNextTeacher = async (next: Function) => {
        if (this.state.teacherList.length < 1) {
            next&&next();
            return false;
        }
    	const result = await this.ajaxGetRankList();
        if (result && result.length < 10) {
            this.setState({
                isNoMore: true,
            })
		}
		
        next&&next();
    }
}

interface TeacherListProps {
	data: teacherItem[];
	onVote: (id: string) => void;
}

class TeacherList extends React.Component<TeacherListProps, {}> {
	render() {
		return (
			this.props.data.length == 0 ? null :
			<div className="teacher-list">
				{
					this.props.data.map((item,idx) => {
						return <TeacherItem key={idx} {...item} onVote={this.props.onVote} counter={idx+1}/>
					})
				}
			</div>
		)
	}
}

interface teacherItemProps extends teacherItem {
	onVote: (id: string, couponId?: string) => void;
	counter: number;
}

class TeacherItem extends React.PureComponent<teacherItemProps, {}> {
	onVote = () => {
		this.props.onVote(this.props.businessId, this.props.couponId);
	}
	render() {
		return (
			<div className="teacher-item">
				<div className="avatar-wrap">
					<div className="avatar" style={{backgroundImage: `url(${this.props.headImg})`}}></div>
					<div className="counter">
						{this.props.counter > 3 ? this.props.counter : ''}
					</div>
				</div>
				<div className="content">
					<div className="nickname">{this.props.name}</div>
					<div className="vote-num">{this.props.likeNum}&nbsp;<span className="vote-unit">票</span></div>
					<a className="intro" href={this.props.url}>
						<div className="intro-inner">
							{this.props.content}
						</div>
					</a>
				</div>
				<div className="btn-panel">
					{ this.props.isLike === 'Y' ? 
						<div className="vote-btn has-vote-btn">已投票</div> :
						<div className="vote-btn" onClick={this.onVote}>投票</div>
					}
				</div>
			</div>
		)
	}
}

render(<AnnualRank />, document.getElementById('app'));