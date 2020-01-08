import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';

import DistributionData from './components/distribution-data'
import TotalData from './components/total-data'
import InvitationData from './components/invitation-data'
import PushData from './components/push-data'
import StatisticsPop from './components/statistics-pop'
import OptimizeTipDialog from './components/optimize-dialog'
import QuestionDialog from './components/question-dialog';

import { getVal, locationTo } from 'components/util';

import {request,isFunctionWhite} from "common_actions/common";


import {changeSourceName, addSource, getAllInviteDate, getChannelOrTopicOptimize} from '../../actions/channel-statistics'

// 检查是否是数字
function checkoutIsNumber(num = 0) {
    var reg = /^[0-9]+.?[0-9]*$/
    if (!reg.test(num) || !num) {
        num = 0
    }
    return +num
}

class ChannelDataStatistics extends Component {
    state = {
        // 导航为右侧三个之一 total|distribution|invitation
        nav : "total",  
        
        // 帮助弹窗类型 none|baseApproach|popularizeApproach|changeApproachName|tooMoreChannel
        showHelpPop: "none",
        modifyName: "",

        totalData: {
            visitorData: {
                totalVisitor: 0,
                totalJoined: 0,
                totalPayed: 0,
                totalListen: 0,
            },
            ticked: {
                amount: 0,
                payNum: 0,
            },
            distribution: {
                shareRepresentNum: 0,
                shareProfit: 0
            },
            gift: {
                giftAmount: 0,
                giftPayCount: 0,
            },
            //课程数据
            // 赞赏
            appreciates: {
                rewardAmount: 0, // 赞赏总金额
                rewardCount: 0, // 赞赏笔数
                rewardLiveProfit: 0, // 直播间分成所得
                avgAppreciates: 0//平均赞赏金额
            },
            // 文件
            file: {
                fileAmount: 0, // 付费文件收入
                fileCount: 0, // 付费文件购买数
            },
            // 转播
            broadcast: {
                relayAmount: 0,	// 转播费收入
                relayLiveNum: 0, // 转播方直播间个数
                relayProfit: 0,	// 转播分成收入
                relayBuyerNum: 0 // 转播课购买人数
            },
            // 完播率
            endRate:0
        },

  
        baseChannelList: [],

        popularizeChannelList: [],

        pushTaskList: [],

        invitationList: [
            { headUrl: "",name: "pop", inviteNum: 23232, applyNum: 2222},
        ],
        invitationListPageNum: 1,
        invitationListNoMore: false,
        optimizeCount: 0,// 优化点数量
        showOptimizeDialog: false,
        optimizePoint: '',
        name: '',//课程标题
        isPushWhite:false,
    }

    data = {
        modifyKey: -1,
        page:1,
    }

   
    
    async componentDidMount() {
        // 获取课程优化点
        this.getChannelOrTopicOptimize()
        if(this.props.backEndData) {
            var totalDataView;
            if (this.props.backEndData && this.props.backEndData.totalDataView) {
                totalDataView = this.props.backEndData.totalDataView;
            } 

            var sourceList = []
            if (this.props.backEndData && this.props.backEndData.getSourceList && this.props.backEndData.getSourceList.list) {
                sourceList = this.props.backEndData.getSourceList.list;
            } 

            var popularizeChannelList = []
            var baseChannelList = []

            sourceList.map((item ,idx) => {
                if (item === null) {
                    return 
                }
                if(item.type == "custom") {
                    popularizeChannelList.push({
                        id: item.id,
                        name: item.sourceName,
                        visitorNum: item.viewTotal,
                        joinCourseNum: item.authTotal,
                        sourceNo: item.sourceNo,
                    })
                } else if (item.type == "system") {
                    baseChannelList.push({
                        viewTotal: checkoutIsNumber(item.viewTotal),
                        authTotal: checkoutIsNumber(item.authTotal),
                        sourceName: item.sourceName,
                        sourceNo: item.sourceName
                    })
                }
            })
           // popularizeChannelList.reverse();


            let invitationList = []

            if ( this.props.backEndData.getAllInviteDate && this.props.backEndData.getAllInviteDate.list) {
                this.props.backEndData.getAllInviteDate.list.map((item) => {
                    if (item !== null) {
                        invitationList.push({
                            headUrl: item.headUrl,
                            name: item.userName,
                            inviteNum: item.invitedCount,
                            applyNum: item.authTotal,
                        })
                    }
                })
            }
            this.setState({
                invitationList: invitationList,
                totalData: Object.assign({}, this.state.totalData, {
                        visitorData: {
                            totalVisitor: checkoutIsNumber(totalDataView.viewTotal),
                            totalJoined: checkoutIsNumber(totalDataView.authCount),
                            totalPayed: checkoutIsNumber(totalDataView.payNum),
                            totalListen: checkoutIsNumber(totalDataView.listenTotal), // 听课累计人次
                            authNum:  checkoutIsNumber(totalDataView.authNum)
                        },
                        ticked: {
                            amount: checkoutIsNumber((totalDataView.amount / 100).toFixed(2)),
                            payNum: checkoutIsNumber(totalDataView.payNum),
                        },
                        distribution: {
                            shareRepresentNum: checkoutIsNumber(totalDataView.shareRepresentNum),
                            shareProfit: checkoutIsNumber((totalDataView.shareProfit/ 100).toFixed(2)),
                        },
                        gift: {
                            giftAmount: checkoutIsNumber((totalDataView.giftAmount/ 100).toFixed(2)),
                            giftPayCount: checkoutIsNumber(totalDataView.giftPayCount),
                        },
                        appreciates: {
                            rewardAmount: checkoutIsNumber((totalDataView.rewardAmount/ 100).toFixed(2)), // 赞赏总金额
                            rewardCount: checkoutIsNumber(totalDataView.rewardCount), // 赞赏笔数
                            rewardLiveProfit: checkoutIsNumber((totalDataView.rewardLiveProfit/ 100).toFixed(2)), // 直播间分成所得
                            avgAppreciates: totalDataView.rewardCount == 0 ? 0 : (totalDataView.rewardAmount / totalDataView.rewardCount / 100).toFixed(2)//平均赞赏金额
                        },
                        // 文件
                        file: {
                            fileAmount: checkoutIsNumber((totalDataView.fileAmount/ 100).toFixed(2)), // 付费文件收入
                            fileCount: checkoutIsNumber(totalDataView.fileCount), // 付费文件购买数
                        },
                        // 转播
                        broadcast: {
                            relayAmount: checkoutIsNumber((totalDataView.relayAmount/ 100).toFixed(2)),	// 转播费收入
                            relayLiveNum: checkoutIsNumber(totalDataView.relayLiveNum), // 转播方直播间个数
                            relayProfit: checkoutIsNumber((totalDataView.relayProfit/ 100).toFixed(2)),	// 转播分成收入
                            relayBuyerNum: checkoutIsNumber(totalDataView.relayBuyerNum) // 转播课购买人数
                        },
                        endRate:totalDataView.endRate,
                        listenNum:totalDataView.listenNum,
                        shareRate:totalDataView.shareRate,
                        listenRate:totalDataView.listenRate,
                    }),
                baseChannelList: baseChannelList,
                
                popularizeChannelList,
            })

        }
        
        
        await this.getPushTaskRecord()
        
        this.autoTab()
    }
    
    // 获取优化点状态
    getChannelOrTopicOptimize = async() => {
        try{
            const result = await getChannelOrTopicOptimize({
                businessId: this.props.location.query.businessId,
                type: this.props.location.query.businessType
            })
            if(result.state.code === 0){
                let optimizePoint = ''
                if(result.data.headImageStatus == 'Y'){
                    optimizePoint = 'courseHeadImage'
                }else if(result.data.nameStatus == 'Y'){
                    optimizePoint = 'courseTitle'
                }else if(result.data.descStatus == 'Y'){
                    optimizePoint = 'courseSummary'
                }
                this.setState({
                    name: result.data.name,
                    optimizeCount: result.data.count,
                    optimizePoint
                })
            }
        }catch(err){
            console.error(err)
        }
    }


    switchNav = (nav) => {
        this.setState({
            nav: nav
        })
    }

    autoTab() {
        let type = this.props.location.query.tabType;
        if (type == 'push' && !this.state.isPushWhite) {
            false
        }
        if (type) {
            this.switchNav(type)
        }
    }

    showData = () => {
        let { businessType, businessId } = this.props.location.query
        switch(this.state.nav) {
            case "total" : 
                return <TotalData 
                            totalData={this.state.totalData} 
                            lastStatTime={this.props.backEndData.getSourceList.lastStatTime} 
                            popHandel={this.popHandel}
                            businessType={businessType}
                            businessId={businessId}
                            evaluteScore={this.props.evaluteScore}
                            authNum={ this.props.totalData.totalDataView ? this.props.totalData.totalDataView.authNum : 0 }
                            courseLevel = {this.props.backEndData.totalDataView && this.props.backEndData.totalDataView.courseLevel || ''}
                            optimizeCount = {this.state.optimizeCount}
                            openOptimizeDialog = {()=>{this.setState({showOptimizeDialog: true})}}
                            name = {this.state.name}
                            showCourseIndex = {!(this.props.backEndData.totalDataView.channelId && this.props.backEndData.totalDataView.isSingleBuy == 'N')}
                            isFree = {this.props.backEndData.totalDataView.isFree}
                            listenRate = {this.props.backEndData.totalDataView.listenRate}
                        > </TotalData>
            case "distribution" : 
                return <DistributionData 
                            distributionData={this.state.baseChannelList} 
                            lastStatTime={this.props.backEndData.getSourceList.lastStatTime} 
                            channelId={this.props.location.query.channelId}
                            popHandel={this.popHandel}
                            choseModifyKey={this.choseModifyKey}
                            popularizeChannelList={this.state.popularizeChannelList}
                            addPopularizeChannel={this.addPopularizeChannel}
                            businessType={businessType}
                            businessId={businessId}
                        > </DistributionData>
            case "invitation" : 
                return <InvitationData 
                            invitationList={this.state.invitationList} 
                            getMoreInviter={this.getMoreInviter}
                            noneOne={this.state.invitationListEmpty}
                            invitationListNoMore={this.state.invitationListNoMore}
                            invitationListPageNum={this.state.invitationListPageNum}
                            businessType={businessType}
                        > </InvitationData>
            case "push" : 
                return <PushData 
                            lastStatTime={this.props.backEndData.getSourceList.lastStatTime} 
                            pushTaskList={this.state.pushTaskList} 
                            methodDialogClick = {()=>{this.QuestionDialogEle.show()}}
                            pushNoMore={this.state.pushNoMore}
                            pushNoOne={this.state.pushNoOne}
                        > </PushData>
        }
    }

    popHandel = (type) => {
        this.setState({
            showHelpPop: type,
        })
    }

    modifyHandel = (content) => {
        this.setState({
            modifyName: content
        })
    }

    commitModify = async () => {

        let popularizeChannelList = [...this.state.popularizeChannelList]
        popularizeChannelList[this.data.modifyKey].name = this.state.modifyName;

        const result = await this.props.changeSourceName(
            this.state.popularizeChannelList[this.data.modifyKey].id, 
            this.props.liveId, 
            this.state.modifyName, 
            this.props.location.query.businessType)
        if (result.state.code === 0) {
            this.setState({
                popularizeChannelList: popularizeChannelList,
            })
        } else {
            window.toast("修改失败")
        }
        this.popHandel("none")
    }

    choseModifyKey = (key) => {
        this.data.modifyKey = key;
        this.setState({
            modifyName: this.state.popularizeChannelList[key].name
        })
    }

    addPopularizeChannel = async () => {
        if(this.state.popularizeChannelList.length <= 50) {
            let popularizeChannelList = [...this.state.popularizeChannelList]
            let { businessId, businessType } = this.props.location.query
            const result = await this.props.addSource(businessId, businessType, this.props.liveId)
            if(result && result.data) {
                popularizeChannelList.push({
                    name: result.data.sourceName,
                    id: result.data.id,
                    visitorNum: result.data.viewTotal,
                    joinCourseNum: result.data.authTotal,
                    sourceNo: result.data.sourceNo,
                })
                this.setState({
                    popularizeChannelList: popularizeChannelList
                })
            } else {
                window.toast("添加失败")
            }

        } else {
            window.toast("最多添加50个渠道")
        }
    }

    getMoreInviter = async () => {
        if(this.state.invitationListNoMore || this.state.invitationList.length == 0) {
            return
        }

        if (this.state.invitationList.length < this.state.invitationListPageNum * 30) {
            this.setState({
                invitationListNoMore: true
            })
        } else {
            const result = await this.props.getAllInviteDate(this.props.location.query.channelId, this.state.invitationListPageNum + 1, 30)
            
            if (result && result.list) {
                let invitationList = [...this.state.invitationList]
                result.list.map((item) => {
                    if (item !== null) {
                        invitationList.push({
                            headUrl: item.headUrl,
                            name: item.userName,
                            inviteNum: item.invitedCount,
                            applyNum: item.authTotal,
                        })
                    }
                })
                this.setState({
                    invitationListPageNum: this.state.invitationListPageNum + 1,
                    invitationList: invitationList,
                })
            } else {
                window.toast("没有更多了")
                this.setState({
                    invitationListNoMore: true
                })
            }



        }
    }
    
    scrollHandle = (e) => {
        // if(this.state.nav != "invitation" || this.state.invitationListNoMore || this.state.invitationList.length == 0) {
        //     return
        // }


        const event = e || window.event;
        const el = event.target;


        if ((el.scrollHeight - el.scrollTop - el.clientHeight) <= 1) {
            switch (this.state.nav) {
                case "invitation": this.getMoreInviter();
                    break;
                case "push": this.getPushTaskList();
                    break;
            }
        }
    }

    gotoOptimize = () => {
        let { businessType, businessId } = this.props.location.query
        if(businessType == 'channel') {
            locationTo(`/wechat/page/channel-create?channelId=${businessId}`)
        }else if(businessType == 'topic'){
            locationTo(`/wechat/page/topic-intro-edit?topicId=${businessId}`)
        }
    }


    async getPushTaskList() {
        if (this.state.pushNoMore||this.data.isLoading) {
            return;
        }
        this.data.isLoading = true;
        let { businessType, businessId } = this.props.location.query
        let pList = this.state.pushTaskList || [];
        const { data: { pushTaskList } } = await request({
            method:'POST',
			url: '/api/wechat/transfer/h5/live/pushTaskList',
            body: {
                liveId:this.props.liveId,
                businessType,
                businessId,
                page:{
                    page: this.data.page,
                    size:20
                }
			}
        });
        if (pushTaskList.length) {
            this.data.page++;
            this.setState({
                pushTaskList:[...pList,...pushTaskList],

            })
        } else {
            this.setState({
                pushNoMore: true,
                pushNoOne:this.data.page==1

            }) 
        }
        this.data.isLoading = false;
    }

    async getPushTaskRecord() {
        let data = await isFunctionWhite(this.props.liveId, 'pushTaskRecord');
        this.setState({ isPushWhite: data.isWhite === 'Y' });

        data.isWhite === 'Y' && this.getPushTaskList();
    }


    render() {
        let { isPushWhite } = this.state;
        return (
            <Page 
                title="数据统计" 
                className="channel-data-statistics"
                onScroll= {this.scrollHandle}
            >
                <StatisticsPop 
                    type={this.state.showHelpPop}
                    modifyName={this.state.modifyName} 
                    popHandel={this.popHandel}
                    modifyHandel={this.modifyHandel}
                    commitModify={this.commitModify}
                    changeSourceName={this.props.changeSourceName}
                >
                </StatisticsPop>
                <OptimizeTipDialog 
                    showOptimizeDialog = {this.state.showOptimizeDialog}
                    optimizePoint = {this.state.optimizePoint}
                    hide = {()=>{this.setState({showOptimizeDialog: false})}}
                    jump = {this.gotoOptimize}
                />
                <div className="container">
                    <div className="nav">
                        <span
                            className={`${this.state.nav == "total" ? "active" : ""} nav-item`}
                            onClick={() => {
                                this.switchNav("total")
                            }}
                        >
                            数据总览
                        </span>
                        <span
                            className={`${this.state.nav == "distribution" ? "active" : ""} nav-item`}
                            onClick={() => {
                                this.switchNav("distribution")
                            }}
                        >
                            渠道数据
                        </span>
                        <span
                            className={`${this.state.nav == "invitation" ? "active" : ""} nav-item`}
                            onClick={() => {
                                this.switchNav("invitation")
                            }}
                        >
                            邀请数据
                        </span>
                        {
                            isPushWhite && 
                            <span
                                className={`${this.state.nav == "push" ? "active" : ""} nav-item`}
                                onClick={() => {
                                    this.switchNav("push")
                                }}
                            >
                                推送数据
                            </span>
                        }
                    </div>
                    {this.showData()}

                </div>

                 <QuestionDialog ref={el => this.QuestionDialogEle = el}/>
            </Page>
        );
    }
}

function mapStateToProps(state){
    console.log(state.channelStatistics.totalData)
    return{
        liveId: state.channelStatistics.backEndData.liveId,
        totalData: state.channelStatistics.totalData,
        distributionData: state.channelStatistics.distributionData,
        popularizeChannelList: state.channelStatistics.popularizeChannelList,
        backEndData: state.channelStatistics.backEndData,
        evaluteScore:getVal(state, 'channelStatistics.backEndData.evaluation.score',0),
    }
}

const mapDispatchToProps ={
    changeSourceName,
    addSource,
    getAllInviteDate,
}
export default connect(mapStateToProps, mapDispatchToProps)(ChannelDataStatistics)
