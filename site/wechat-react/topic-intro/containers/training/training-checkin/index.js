import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from "components/page";
import { getVal, formatMoney }from 'components/util';
import { MiddleDialog } from 'components/dialog';
import { pushDistributionCardMaking } from "./components/achievement-card";
import { achievementCardInfo, listReward } from '../../../actions/training'
import { isBindLiveCoupon } from '../../../actions/coupon'
import { autobind } from "core-decorators";
@autobind
class FocusMiddle extends Component {
    state={
        qrurl:'',
        haibaopic:'',
        title: '',
        qrCode: 'https://img.qlchat.com/qlLive/liveCampTrining/camp-qr.jpg',
        courseData: {},
        rewordList: [],
        showDialog: false,
        hasReword: {},
    };

    get channelId() {
        return this.props.location.query.channelId || '';
    }
    get showReword() {
        return this.props.location.query.showReword || 'N';
    }

    componentDidMount() {
        this.initData();
    }
    
    async initData() {
        let rewordInfo = {}
        if (this.showReword == 'Y') {
            rewordInfo = await listReward({
                channelId: this.channelId
            })
        }

        let res = await achievementCardInfo({
            channelId: this.channelId
        })
        window.loading(true);
        if (res.state.code == 0) {
            this.setState({
                courseData: {
                    ...res.data.campPo,
                    ...getVal(res, 'data.info') || {}
               },
               rewordList: getVal(rewordInfo, 'data.dataList') || [],
               title: res.data.campPo.name
            }, () => {
                this.findReword()
                this.initDrawCard();
            })
        }
    }

    async findReword() {
        let { rewordList, courseData } = this.state
        if (this.showReword == 'Y' && rewordList.length > 0) {
            let hasReword = rewordList.find(item => item.affairNum == courseData.affairNum)
            if (hasReword) {
                let res = await this.props.isBindLiveCoupon({
                    couponId: hasReword.businessId
                })
                // 判断用户是否自动领过  isBinded = N 未领取不弹
                if (getVal(res, 'data.isBinded') == 'Y') {
                    this.setState({
                        hasReword
                    }, () => {
                        this.toggleMiddle()
                    })
                }
            }
        }
    }

    toggleMiddle() {
        this.setState({
            showDialog: !this.state.showDialog
        })
    }
    
    initDrawCard(){
        pushDistributionCardMaking("", this.state.courseData, (url) => {
			window.loading(false);
			this.setState({
				haibaopic: url,
            });
            // 曝光日志收集
            setTimeout(_=>{
                typeof _qla != 'undefined' && _qla.collectVisible();
            },0)
		}, true, "PersonCount", 610, 890, this.props.location.query.officialKey, this.state.qrCode);
    }

    renderTypeName(couponType) {
        let name = '优惠券'
        switch (couponType) {
          case 'live':
            name = '直播间通用券'
            break;
          case 'topic':
            name = '话题优惠券'
            break;
          case 'channel':
            name = '系列课优惠券'
            break;
          case 'global_vip':
            name = '通用vip券'
            break;
          case 'custom_vip':
            name = '定制vip券'
            break;
        }
        return name
      }
    render() {
        let { title, courseData, hasReword } = this.state
        return (
            <Page title={title} className='achievement-card-wrap'>
                <div className="achievement-wrap">
                    <div className="achievement-card">
                        <img src={this.state.haibaopic} className="haibao-bg" />
                        {
                            this.state.haibaopic && this.showReword == 'Y' &&
                            <img src={require('./img/dk.png')} className="dk-img"></img>
                        }
                    </div>
                    <div className="achievement-tip">
                        长按保存和分享
                    </div>

                </div>
                <MiddleDialog 
                    show={this.state.showDialog}
                    theme='empty'
                    bghide
                    titleTheme={'white'}
                    className="reword-dialog"
                    onClose={this.toggleMiddle}>
                    <div className="reword-title">
                        <img src={require('./img/btn.png')}></img>
                        太棒了
                    </div>
                    <main className="reword-content">
                        你已经坚持打卡了<span className="red">{courseData.affairNum}</span>次，
                        奖励：<span className="red">【{this.renderTypeName(hasReword.couponType)} ￥{formatMoney(hasReword.money, 1)}】</span> 已经发放到你的个人中心
                    </main>
                    <div className="btn bottom" onClick={this.toggleMiddle}>我知道了</div>
                </MiddleDialog>
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
    }
}

const mapActionToProps = {
    isBindLiveCoupon
};

module.exports = connect(mapStateToProps, mapActionToProps)(FocusMiddle);