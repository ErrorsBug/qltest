import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators'
import Page from 'components/page';
import { Confirm} from 'components/dialog';
import ScrollToLoad from 'components/scrollToLoad';
import { locationTo, imgUrlFormat, formatDate, formatMoney } from 'components/util';

import {
    getVipReward,
    getVipIncomeRecord
} from 'actions/vip'

@autobind
class LiveVipIncome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 有id为定制vip，无id为通用vip
			liveId: props.location.query.liveId,
			vipType : 'general',
			amount : 0,
			buyCount: 0,
			
			dataList: [],
			gNoneOne:false,
			cNoneOne:false,
			gNoMore:false,
			cNoMore:false,
        }
    }

    data = {
		generalPage: 1,
		generalList:[],
        customizedPage: 1,
		customizedList: [],
		pageSize:20,
    }

    componentDidMount() {
		this.initIncome();
		this.getVipIncomeList('general');
		this.getVipIncomeList('customized');
    }
    

    // 初始化vip累计收益
    async initIncome() {
        let generalVipDetail = await this.props.getVipReward(this.state.liveId,'live');
        if (generalVipDetail.state && generalVipDetail.state.code == 0) {
            this.data.generalVipDetail = generalVipDetail.data
        }
        let customizedVipDetail = await this.props.getVipReward(this.state.liveId,'customVip');
        if (customizedVipDetail.state && customizedVipDetail.state.code == 0) {
            this.data.customizedVipDetail = customizedVipDetail.data
        }

        this.changeVipDetail(this.state.vipType);
    }

    // 切换显示vip累计收益
    changeVipDetail(type) {
        if (type == 'general') {
            this.setState({
                amount : this.data.generalVipDetail.amount,
                buyCount : this.data.generalVipDetail.buyCount,
            })
        } else {
            this.setState({
                amount : this.data.customizedVipDetail.amount,
                buyCount : this.data.customizedVipDetail.buyCount,
            })
            
        }
	}
	
	scrollLoadData(next) {
		this.getVipIncomeList();
		next && next();
	}


    async getVipIncomeList(type = this.state.vipType) {
		let dataList = await this.props.getVipIncomeRecord(
			this.state.liveId,
			type=='general'?'live':'customVip',
			{
				page: type == 'general' ? this.data.generalPage : this.data.customizedPage,
				size:this.data.pageSize,
			}
		);
        if (dataList.state && dataList.state.code == 0) {
			if (type == 'general') {
				
				if (dataList.data.vipChargeRecord.length<1 && this.data.generalPage < 2) {
					this.setState({
						gNoMore: false,
						gNoneOne:true,
					})
				} else if (dataList.data.vipChargeRecord.length<this.data.pageSize) {
					this.setState({
						gNoMore: true,
					})
				}
				this.data.generalPage = this.data.generalPage + 1;
				this.data.generalList = [...this.data.generalList, ...dataList.data.vipChargeRecord];


			} else {
				if (dataList.data.vipChargeRecord.length<1 && this.data.customizedPage < 2) {
					this.setState({
						cNoMore: false,
						cNoneOne:true,
					})
				} else if (dataList.data.vipChargeRecord.length<this.data.pageSize) {
					this.setState({
						cNoMore: true,
					})
				}
				this.data.customizedPage = this.data.customizedPage + 1;
				this.data.customizedList = [...this.data.customizedList, ...dataList.data.vipChargeRecord];
			}
		}
		
		this.changeVipList(this.state.vipType);
	}
	
	changeVipList(type) {
		if (type == 'general') {
            this.setState({
                dataList : this.data.generalList,
            })
        } else {
            this.setState({
                dataList : this.data.customizedList,
            })
            
        }
	}

	changeType(type) {
		this.setState({
			vipType:type,
		})
		this.changeVipList(type);
		this.changeVipDetail(type);
	}


    render() {
        return (
            <Page title="会员收益明细" className='live-vip-income flex-body'>
                <div className="tab-type flex-other">
					<span className={`item ${this.state.vipType == 'general' ? 'on' : ''}`} onClick={() => { this.changeType('general') }}>通用会员</span>
                    <span className={`item ${this.state.vipType == 'customized' ?'on':''}`} onClick={() => { this.changeType('customized')}}>定制会员</span>
                </div>

                <div className="vip-income-detail flex-other">
					<span className="item">
                        <b>￥{this.state.amount}</b><i>累计收益</i>
                    </span>
                    <span className="item">
                        <b>{this.state.buyCount}</b><i>支付笔数(笔)</i>
                    </span>
                </div>
                <div className="flex-main-h">
                    <ScrollToLoad
						loadNext={this.scrollLoadData}
                        noneOne={this.state.vipType == 'general'? this.state.gNoneOne:this.state.cNoneOne}
                        noMore={this.state.vipType == 'general'? this.state.gNoMore:this.state.cNoMore}
                        className='live-vip-income-list'
					>	
						{
							(this.state.dataList && this.state.dataList.length)?
							this.state.dataList.map(item => {
									return <div className="user-item" key={`data-item-${item.id}`}>
									<span className="head">
										<img src={imgUrlFormat(item.headImgUrl,'?x-oss-process=image/resize,m_fill,limit_0,h_100,w_100')}/>
									</span>
									<div className="main">
										<div className="name">{item.name}<i>({`${item.chargeMonths}${item.type == 'tryout' ? '天' : '个月'}会员`})</i></div>
										<span className="money">支付了<i>￥{formatMoney(item.amount)}</i></span>
										<span className="date"> {formatDate(item.createTime, 'yyyy年MM月dd日 hh:mm') }</span>
										{
											item.source == 'iap' ?
											<div className="ios-wrap">
												<div className="ios-plan">
													订单来自IOS APP
													<i className="ios-icon"></i>
												</div>
											</div>
											: null
										}
										{	
											item.customVipName ? 
												<div className="info"> {item.customVipName}</div>
											:null	
										}
									</div>
								</div>
							})
							:null
						}	
                        
                    </ScrollToLoad>
                
                </div>

            </Page>
        );
    }
}

function mapStateToProps(state) {
    return {
    }
}

const mapDispatchToProps = {
    getVipReward,
    getVipIncomeRecord

}

module.exports = connect(mapStateToProps, mapDispatchToProps)(LiveVipIncome)