const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Page from 'components/page';
// import TabBar from 'components/tabbar';
import { BottomDialog, Confirm } from 'components/dialog';
import { locationTo, dangerHtml, parseDangerHtml, imgUrlFormat, digitFormat } from 'components/util';
import { share } from 'components/wx-utils';
import ScrollToLoad from 'components/scrollToLoad';

import createImg from '../img/create-span.png'

// actions
import {
    loadTimeline,
    liveInfo,
    getPower,
    getNewLikeNum,
    timelineLike,
    liveDeleteTimeLine,
    initLiveShareQualify,
} from '../../../actions/live';

function mapStateToProps (state) {
    return {
        liveInfo: state.live.liveInfo,
        power: state.live.power,

        timeline: state.live.timeline,
        timelinePage: state.live.timelinePage,
        noMoreTimeline: state.live.noMoreTimeline,
        timeNow: state.common.sysTime,
        shareQualify: state.live.shareQualify,
    }
}

const mapActionToProps = {
    loadTimeline,
    getLiveInfo: liveInfo,
    getPower,
    getNewLikeNum,
    timelineLike,
    liveDeleteTimeLine,
    initLiveShareQualify,
}

class liveTimeline extends Component {

    constructor(props, context) {
        super(props, context);
        this.liveId = this.props.params.liveId
    }


    state = {
        listIndex: 0,
        dateIndex: 0,
        dateList: [],
        newLikeNum: 0,
        showAdmin: false,
    }

    data = {
        timelineIdForAdmin: 0,
        listIndexForAdmin: 0,
        dateIndexForAdmin: 0,
        dateListIndexForAdmin: 0,
    }

    async componentDidMount() {
        if(!this.props.liveInfo.entity.liveId) {
            this.props.getLiveInfo(this.liveId)
        }
        if(!this.props.power.liveId) {
            const power = await this.props.getPower(this.liveId)
            if(power && power.allowMGLive) {
                const newLikeNum = await this.props.getNewLikeNum(this.liveId)
                this.setState({
                    newLikeNum: newLikeNum
                })
            }
        } else {
            if(this.props.power.allowMGLive) {
                const newLikeNum = await this.props.getNewLikeNum(this.liveId)
                this.setState({
                    newLikeNum: newLikeNum
                })
            }
        }



        const timeline = await this.fetchTimelineList()
        if (timeline) {
            this.timelineListToDateGroup(timeline)
        } else {
            this.timelineListToDateGroup(this.props.timeline)
        }


        await this.props.initLiveShareQualify(this.liveId)
        
        if(this.props.shareQualify && this.props.shareQualify.id) {
            share({
                
                title: '我推荐-直播间"' + this.props.liveInfo.entity.name + '"的动态',
                desc: "这里有优质的直播间内容，快来查看吧",

                timelineTitle: '我推荐-直播间"' + this.props.liveInfo.entity.name + '"的动态',
                timelineDesc: "这里有优质的直播间内容，快来查看吧", // 分享到朋友圈单独定制

                imgUrl: this.props.liveInfo.entity.logo,
                shareUrl: location.origin + "/" + this.props.shareQualify.shareUrl,
            });
        } else {
            share({

                title: '直播间"' + this.props.liveInfo.entity.name + '"的动态',
                desc: "这里有优质的直播间内容，快来查看吧",

                timelineTitle: '直播间"' + this.props.liveInfo.entity.name + '"的动态',
                timelineDesc: "这里有优质的直播间内容，快来查看吧", // 分享到朋友圈单独定制

                imgUrl: this.props.liveInfo.entity.logo,
            });
        }

    }

    adminClickHandle = (key) => {
        switch(key) {
            case 'del': 
                this.closeAdminHandle()
                this.refs.delConfirm.show()
                break;
            default: 
                break;
        }
    }

    openAdminHandle = (idx, id, dateIdx, dateListIndex) => {
        this.data.timelineIdForAdmin = id
        this.data.listIndexForAdmin = idx
        this.data.dateIndexForAdmin = dateIdx
        this.data.dateListIndexForAdmin = dateListIndex

        this.setState({
            showAdmin: true,
        })
    }

    closeAdminHandle = () => {
        this.setState({
            showAdmin: false,
        })
    }

    closeDelConfirmHandle = () => {
        this.refs.delConfirm.hide()
    }
    delConfirmHandle = async (tag) => {
        if(tag == "confirm") {
            const result = await this.props.liveDeleteTimeLine(this.data.timelineIdForAdmin, this.data.dateListIndexForAdmin)
            if(result) {
                const dateList = this.state.dateList
                dateList[this.data.dateIndexForAdmin].list.splice(this.data.dateListIndexForAdmin, 1)
                this.setState({
                    dateList
                })
            }
        }
        this.refs.delConfirm.hide()
    }

    fetchTimelineList = () => {
        if (this.props.timeline.length < 1) {
            return this.props.loadTimeline(this.props.timelinePage, 0, this.liveId)
        }
    }

    likeHandle = async (index, feedId, state, dataIndex, itIndex) => {
        const result = await this.props.timelineLike(feedId, state, index)

        if (result) {
            let dateList = this.state.dateList;
            dateList[dataIndex].list[itIndex].likeNum = dateList[dataIndex].list[itIndex].likeNum + (state == "Y" ? 1 : -1)
            dateList[dataIndex].list[itIndex].liked = (state == "Y" ? 1 : 0)
            this.setState({dateList})
        }
    }

    timelineListToDateGroup = (timelineList) => {
        let dateIndex = this.state.dateIndex;

        let idxDay,idxMouth,idxYear;
        let dateList = []

        if (dateIndex == 0) {
            let idxDate = new Date(this.props.timeNow)
            idxDay = idxDate.getDate()
            idxMouth = idxDate.getMonth()
            idxYear = idxDate.getFullYear()
            dateList.push({
                year: idxYear,
                mouth: idxMouth,
                day: idxDay,
                list: [],
            })
        } else {
            dateList = this.state.dateList
            idxDay = dateList[dateIndex].day
            idxMouth = dateList[dateIndex].mouth
            idxYear = dateList[dateIndex].year
        }

        for (var index = 0; index < timelineList.length; index++) {
            const itemTime = timelineList[index].createTime
            const itemDate = new Date(itemTime)
            const itemDay = itemDate.getDate()
            const itemMouth = itemDate.getMonth()
            const itemYear = itemDate.getFullYear()
            if (
                itemDay == idxDay
                && itemMouth == idxMouth
                && itemYear == idxYear
            ) {
                if(dateList.length == 0) {
                    dateList.push({
                        year: idxYear,
                        mouth: idxMouth,
                        day: idxDay,
                        list: [],
                    })
                }
                dateList[dateIndex].list.push({...timelineList[index], listIndex: index + this.state.listIndex, shrink: true})
            } else {
                dateIndex++
                idxYear = itemYear
                idxMouth = itemMouth
                idxDay = itemDay
                dateList.push({
                    year: idxYear,
                    mouth: idxMouth,
                    day: idxDay,
                    list: [],
                })
                dateList[dateIndex].list.push({...timelineList[index], listIndex: index + this.state.listIndex, shrink: true})
            }
        }
        
        this.setState({
            dateIndex,
            dateList,
            listIndex: this.state.listIndex + timelineList.length
        })
    }

    isToday = (dateListItem) => {
        const dateNow = new Date(this.props.timeNow)
        const dayNow = dateNow.getDate()
        const mouthNow = dateNow.getMonth()
        const yearNow = dateNow.getFullYear()

        return (dateListItem.day == dayNow && dateListItem.mouth == mouthNow && dateListItem.year == yearNow) 
    }

    loadHandle = async (next) => {
        let time = 0
        if(this.props.timeline.length > 0) {
            time = this.props.timeline[this.props.timeline.length - 1].createTime
        }
        if (!this.props.noMoreTimeline) {
            const result = await this.props.loadTimeline(this.props.timelinePage, time, this.liveId)
            this.timelineListToDateGroup(result)
        }

        if(typeof next == "function") {
            next()
        }
    }
    
    unfoldHandle = (dateIdx, dateListIdx) => {
        const dateList = this.state.dateList
        dateList[dateIdx].list[dateListIdx].shrink = false
        this.setState({
            dateList
        })
    }

    foldHandle = (dateIdx, dateListIdx) => {
        const dateList = this.state.dateList
        dateList[dateIdx].list[dateListIdx].shrink = true
        this.setState({
            dateList
        })
    }
    render() {
        
        return (
            <Page title={"直播间动态"} className='live-timeline-page'>
                <ScrollToLoad
                    ref="scrollBox"
                    className="scroll-box"
                    toBottomHeight={500}
                    noMore={this.props.noMoreTimeline}
                    page={this.props.timelinePage}
                    loadNext={this.loadHandle}
                >
                    <div className="header">
                        <div className="left-con" onClick={locationTo.bind(this, "/wechat/page/live/" + this.liveId)}>
                            <div className="logo">
                                <img src={imgUrlFormat(this.props.liveInfo.entity.logo, "@100h_100w_1e_1c_2o")} alt=""/>
                            </div>
                            <div className="name">{this.props.liveInfo && this.props.liveInfo.entity && this.props.liveInfo.entity.name}</div>
                        </div>
                        <div className="right-con">
                        {
                            this.props.power.allowMGLive ?
                                <Link to={'/wechat/page/timeline/new-like?liveId=' + this.liveId}>
                                    <span className="msg"></span>
                                </Link>
                                : ""
                        }
                        </div>
                    </div>
                    <div className="timeline-con">
                        {
                            this.state.newLikeNum > 0 ?
                                <div className="new-like-con">
                                    <Link to={'/wechat/page/timeline/new-like?liveId=' + this.liveId}>
                                        <span className="new-like">
                                            <span className="new-like-text" >您获得了 <span className="num">{this.state.newLikeNum}</span> 个新点赞</span>
                                        </span>
                                    </Link>
                                </div> 
                            : ""
                        }

                        {
                            this.state.dateList.map((item, idx) => {
                                if (item.list.length > 0) {
                                    return (
                                        <div className="date-timeline-con" key={"date-timeline-con-" + idx}>
                                            <div className="date-con">
                                                {
                                                    this.isToday(item) ?
                                                        <div className="today">今天</div>
                                                        :
                                                        <div>
                                                            <div className="mouth">{item.mouth < 9 ? ("0" + (item.mouth + 1)) : (item.mouth + 1)}月</div>
                                                            <div className="date">{item.day < 10 ? ("0" + item.day) : item.day}</div>
                                                        </div>
                                                }
                                            </div>
                                            <div className="timeline-list">
                                                {
                                                    item.list.map((it, itIdx) => {
                                                        return (
                                                            <div className="timeline-item" key={"timeline-item-" + it.id}>
                                                                <div className="timeline-block">
                                                                    <div className="content">
                                                                        {
                                                                            (it.content.length > 80 && it.shrink) ? 
                                                                                <div className="content-text" dangerouslySetInnerHTML={parseDangerHtml((it.content.substr(0, 80)+ "..."))}>{}</div> 
                                                                                :
                                                                                <div className="content-text" dangerouslySetInnerHTML={parseDangerHtml(it.content)}></div> 
                                                                        }
                                                                        {
                                                                            (it.content.length > 80) ?
                                                                                (it.shrink)? 
                                                                                    <div className="unfold" onClick={this.unfoldHandle.bind(this, idx, itIdx)}>展开</div> 
                                                                                    : 
                                                                                    <div className="unfold" onClick={this.foldHandle.bind(this, idx, itIdx)}>收起</div>
                                                                                : ""
                                                                        }
                                                                    </div>
                                                                    <div className="relate-con" onClick={locationTo.bind(this, it.relateUrl)}>

                                                                        <div className="relate-logo">
                                                                            {
                                                                                it.relateType == "homework" ? 
                                                                                    <div className="homework"></div> 
                                                                                : ""
                                                                            }
                                                                            <img src={imgUrlFormat(it.relateLogo, "@100h_100w_1e_1c_2o")}  alt="" />
                                                                        </div>
                                                                        <div className="relate-text">{it.relateTitle}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="timeline-bottom">
                                                                    <div className="left">
                                                                        {
                                                                            this.props.power.allowMGLive ?
                                                                                <span className="admin" onClick={this.openAdminHandle.bind(this, it.listIndex, it.id, idx, itIdx)}></span> : ""
                                                                        }
                                                                    </div>
                                                                    <div className="right">
                                                                        {it.likeNum} 
                                                                        <span 
                                                                            onClick={this.likeHandle.bind(this, it.listIndex, it.id, it.liked == 1 ? "N" : "Y", idx, itIdx)} 
                                                                            className={"zan" + (it.liked == 1 ? " active" : "")}
                                                                        ></span></div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>

                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                </ScrollToLoad>

                {/* <div className="create-span" onClick={() => {locationTo("/wechat/page/timeline/choose-type?liveId=" + this.props.params.liveId)}}> </div> */}
                {
                    this.props.power.allowMGLive ? 
                        <div className="create-span" onClick={this.props.router.push.bind(this, '/wechat/page/timeline/choose-type?liveId=' + this.liveId)}> </div>
                    : ""
                }


                <Confirm
                    onClose={this.closeDelConfirmHandle}
                    onBtnClick={this.delConfirmHandle}
                    ref='delConfirm'
                    button="cancel-confirm"
                >
                    <div className="confirm-text">确定要删除该动态吗</div>
                </Confirm>

                <BottomDialog
                    className="admin-dialog"
                    show={this.state.showAdmin}
                    bghide={true}
                    theme='list'
                    title='动态管理'
                    items={
                         [
                            {
                                key: 'del',
                                icon: 'icon_trash',
                                show: true,
                                content: '删除'
                            }
                        ]
                    }
                    onItemClick={this.adminClickHandle}
                    close={true}
                    onClose={this.closeAdminHandle}
                />

            </Page>
        );
    }
}



module.exports = connect(mapStateToProps, mapActionToProps)(liveTimeline);
