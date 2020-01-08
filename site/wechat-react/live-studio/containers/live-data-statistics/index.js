import Page from 'components/page';
import { autobind, throttle } from 'core-decorators';
import { connect } from 'react-redux';
import ScrollToLoad from 'components/scrollToLoad';
import React, { Component } from 'react';
import {locationTo, imgUrlFormat} from 'components/util'
import {getLiveData,getAllStatTopicList, getAllStatChannelList, setOptimize} from '../../actions/data-statistics'

@autobind
class LiveDataStatistics extends Component {
    constructor(props){
        super(props)
        this.state = {
            fixedTabbar: false,
            showOptimizationDialog: false,
            liveId: this.props.location.query.liveId,
            totalMoney: 0,// 直播间收益
            viewNum: 0,// 访问人数
            orderNum: 0, // 下单人数
            type: 'topic',
            topicList: [],
            channelList: [],
            noMoreTopic: false,
            noMoreChannel: false,
            noneOneTopic: false,
            noneOneChannel: false,
            showTipDialog: false,
        }
    }

    data = {
        topicPage: 1,
        channelPage: 1,
        size: 10,
        currentSelectId: ''// 当前选择的id
    }

    componentDidMount(){
        this.getLiveData()
        this.getTopicList()
        setTimeout(()=>{
            this.getChannelList()
        },1000)
    }

    // timer = () => {
    //     return new Promise((resolve, reject)=>{
    //         setTimeout(_=>{
    //             resolve()
    //         },1000)
    //     })
    // }

    // 获取直播间数据
    getLiveData = async() => {
        try {
            const result = await getLiveData(this.state.liveId)
            if(result.state.code === 0){
                this.setState({
                    totalMoney: result.data.totalMoney,
                    viewNum: this.formatNum(result.data.viewNum, true),
                    orderNum: this.formatNum(result.data.orderNum, true)
                })
            }
        }catch(err){
            console.error(err)
        }
    }

    // 格式化数据
    formatNum = (num, million = false) => {
        num = Number(num)
        if(million && num < 1000000 || !million && num < 10000){
            // 小于100w或者小于1w直接显示
            return num
        } 
        return Math.floor(num / 1000)/10 + 'w+'
    }

    // 话题数据
    getTopicList = async () => {
        const result = await getAllStatTopicList({
            liveId: this.state.liveId,
            page: {
                page: this.data.topicPage,
                size: this.data.size
            }
        })
        if(result.state.code === 0){
            if(result.data && result.data.list && Array.isArray(result.data.list)){
                if(result.data.list.length < 1 && this.data.topicPage == 1){
                    this.setState({noneOneTopic: true})
                    return
                }
                if(result.data.list.length < 10){
                    this.setState({noMoreTopic: true})
                }
                if(this.data.topicPage == 1){
                    this.setState({topicList: result.data.list})
                }else {
                    return result.data.list
                }
            }else {
                if(this.data.topicPage == 1){
                    this.setState({noneOneTopic: true})
                }else {
                    return false
                }
            }
        }
    }

    // 系列课数据
    getChannelList = async () => {
        const result = await getAllStatChannelList({
            liveId: this.state.liveId,
            page: {
                page: this.data.channelPage,
                size: this.data.size
            }
        })
        if(result.state.code === 0){
            if(result.data && result.data.list && Array.isArray(result.data.list)){
                if(result.data.list.length < 1 && this.data.channelPage == 1){
                    this.setState({noneOneChannel: true})
                    return
                }
                if(result.data.list.length < 10){
                    this.setState({noMoreChannel: true})
                }
                if(this.data.channelPage == 1){
                    this.setState({channelList: result.data.list})
                }else {
                    return result.data.list
                }
            }else {
                if(this.data.channelPage == 1){
                    this.setState({noneOneChannel: true})
                }else {
                    return false
                }
            }
        }
    }

    // 滚动事件
    @throttle(100)
    scrollToDo(){
        if(!this.state.fixedTabbar && this.scrollBox.scrollTop >= this.scrollTabBar.offsetTop){
            this.setState({ fixedTabbar: true })
        }else if(this.state.fixedTabbar && this.scrollBox.scrollTop < this.scrollTabBar.offsetTop){
            this.setState({ fixedTabbar: false })
        }
    }

    // 隐藏优化提示弹窗
    hideOptimizationDialog = ()=>{
        this.setState({showOptimizationDialog: false})
    }

    // 切换tabbar
    switch = (type) => {
        if(this.state.type == type){
            return
        }
        this.setState({type})
    }

    // 滚动加载
    loadMoreCourse = async (next) => {
        let ifTopic = this.state.type == 'topic' ? true : false
        if(ifTopic){
            ++this.data.topicPage
        }else {
            ++this.data.channelPage
        }
        const list = (ifTopic ? await this.getTopicList() : await this.getChannelList()) || []
        if(ifTopic){
            this.setState({topicList: this.state.topicList.concat(list)})
        }else {
            this.setState({channelList: this.state.channelList.concat(list)})
        }
        next && next()
    }

    // 取消优化
    cancelOptimization = async () => {
        const result = await setOptimize({
            businessId: this.data.currentSelectId,
            type: this.state.type,
            status: 'Y'
        })
        if(result.state.code === 0){
            let list
            if(this.state.type == 'topic'){
                list = this.state.topicList
            }else {
                list = this.state.channelList
            }
            let newList = list.map(i => {
                if(i.id != this.data.currentSelectId){
                    return i
                }
                return {...i, optimize: {...i.optimize, count: 0, isOptimize: 'N'}}
            })
            if(this.state.type == 'topic'){
                this.setState({topicList: newList, showOptimizationDialog: false})
            }else {
                this.setState({channelList: newList, showOptimizationDialog: false})
            }
            window.toast('设置成功')
        }
    }

    // 跳转到编辑页面
    gotoOptimize = (id) => {
        if(this.state.type == 'channel') {
            locationTo(`/wechat/page/channel-create?channelId=${id}`)
        }else if(this.state.type == 'topic'){
            locationTo(`/wechat/page/topic-intro-edit?topicId=${id}`)
        }
    }

    // 跳转到数据统计页面
    jumpToDataStatistics = (id, type) => {
        locationTo(`/wechat/page/channel-topic-statistics?businessId=${id}&businessType=${type}`)
    }

    // 显示直播间数据说明提示弹窗
    showTipDialog = () => {
        this.setState({showTipDialog: true})
    }

    // 隐藏直播间数据说明提示弹窗
    hideTipDialog = () => {
        this.setState({showTipDialog: false})
    }

    render(){
        let {topicList, channelList} = this.state
        return (
            <Page title={'数据分析'} className='live-data-statistics-container'>
                {
                    this.state.fixedTabbar &&
                    <div className="tab-bar fixed">
                        <div className={`tab${this.state.type=='topic' ? ' active' : ''}`} onClick={()=>this.switch('topic')}>单课数据</div>
                        <div className={`tab${this.state.type=='channel' ? ' active' : ''}`} onClick={()=>this.switch('channel')}>系列课数据</div>
                    </div>
                }
                <ScrollToLoad
                    ref = {el => this.scrollBox = el}
                    className={`scroll-box`}
                    toBottomHeight={1000}
                    scrollToDo = {this.scrollToDo}
                    loadNext={this.loadMoreCourse}
                    noneOne={this.state.type == 'topic' ? this.state.noneOneTopic : this.state.noneOneChannel}
                    noMore={this.state.type == 'topic' ? this.state.noMoreTopic : this.state.noMoreChannel}
                >
                <div className="live-data">
                    <div className="live-data-title on-log" onClick={this.showTipDialog} data-log-region="data_introduce">直播间数据</div>
                    <div className="live-data-content">
                        <div className="income-fare"><em>￥</em>{this.state.totalMoney}</div>
                        <div className="income-part">
                            <div className="item">
                                <span className="label">访问人数</span>
                                <span className="count">{this.state.viewNum}</span>
                            </div>
                            <div className="item">
                                <span className="label">报名人数</span>
                                <span className="count">{this.state.orderNum}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tab-bar" ref={el => this.scrollTabBar = el }>
                    <div className={`tab${this.state.type=='topic' ? ' active' : ''}`} onClick={()=>this.switch('topic')}>单课数据</div>
                    <div className={`tab${this.state.type=='channel' ? ' active' : ''}`} onClick={()=>this.switch('channel')}>系列课数据</div>
                </div>
                <div className="course-container">
                    {
                        this.state.type == 'topic' ?
                        <div className="topic-container">
                            {
                                topicList.length > 0 && topicList.map((i, t) => (
                                    <div className="course-item" key={`i-${t}`}>
                                        <div className="course-info on-log" 
                                            onClick={this.jumpToDataStatistics.bind(this, i.id, 'topic')}
                                            data-log-region="course_list"
                                            data-log-pos="course_click"
                                            data-log-business_Id = {i.id}
                                            data-log-business_Type = "topic"
                                        >
                                            <div className="img-container">
                                                {
                                                    i.channelId && i.isSingleBuy == 'N' ? null : 
                                                    <div className={`course-level${i.courseLevel ? '' : ' none'}`}>{i.courseLevel || '无'}</div>
                                                }
                                                <img src={imgUrlFormat(i.headImage, '?x-oss-process=image/resize,m_fill,limit_0,h_153,w_245')} alt=""/>
                                            </div>
                                            <div className="info">
                                                <div className="title">{i.topicName}</div>
                                                { i.channelId && i.isSingleBuy == 'N' ? <div className="tip">系列课内非单卖课程，无统计</div> : null }
                                            </div>
                                        </div>
                                        {
                                            i.channelId && i.isSingleBuy == 'N' ? null :
                                            <div className="data-info" onClick={this.jumpToDataStatistics.bind(this, i.id, 'topic')}>
                                                <div className="item">
                                                    <span className="type">访客人数</span>
                                                    <span className="count">{this.formatNum(i.browsNum || 0)}</span>
                                                </div>
                                                <div className="item">
                                                    <span className="type">报名人数</span>
                                                    <span className="count">{this.formatNum(i.authNum || 0)}</span>
                                                </div>
                                                <div className="item">
                                                    {
                                                        !i.amount && !i.channelId ? 
                                                        '免费课程' : 
                                                        [
                                                            <span className="type">课程收入</span>,
                                                            <span className="count"><em>￥</em>{this.formatNum(i.income || 0)}</span>
                                                        ]
                                                    }
                                                </div>
                                            </div>
                                        }
                                        {
                                            i.optimize && i.optimize.count > 0 ?
                                            <div className="optimization">
                                                <div className="cancel on-log" 
                                                    onClick={()=>{this.setState({showOptimizationDialog: true});this.data.currentSelectId = i.id}}
                                                    data-log-region="course_list"
                                                    data-log-pos="ignore_click"
                                                    data-log-business_Id = {i.id}
                                                    data-log-business_Type = "topic"
                                                >
                                                    <span>忽略优化</span>
                                                </div>
                                                <div className="done on-log" 
                                                    onClick={this.gotoOptimize.bind(this, i.id)}
                                                    data-log-region="course_list"
                                                    data-log-pos="go_click"
                                                    data-log-business_Id = {i.id}
                                                    data-log-business_Type = "topic"
                                                >
                                                    <span>去优化<em>{i.optimize.count}</em></span>
                                                </div>
                                            </div> : null
                                        }
                                    </div>
                                ))
                            }
                        </div> : 
                        <div className="channel-container">
                            {
                                channelList.length > 0 && channelList.map((i,t) => (
                                    <div className="course-item" key={`i-${t}`}>
                                        <div className="course-info on-log" 
                                            onClick={this.jumpToDataStatistics.bind(this, i.id, 'channel')}
                                            data-log-region="course_list"
                                            data-log-pos="course_click"
                                            data-log-business_Id = {i.id}
                                            data-log-business_Type = "channel"
                                        >
                                            <div className="img-container">
                                                <div className={`course-level${i.courseLevel ? '' : ' none'}`}>{i.courseLevel || '无'}</div>
                                                <img src={imgUrlFormat(i.headImage, '?x-oss-process=image/resize,m_fill,limit_0,h_153,w_245')} alt=""/>
                                            </div>
                                            <div className="info">
                                                <div className="title">{i.channelName}</div>
                                            </div>
                                        </div>
                                        {
                                            i.channelId && i.isSingleBuy == 'N' ? null :
                                            <div className="data-info" onClick={this.jumpToDataStatistics.bind(this, i.id, 'channel')}>
                                                <div className="item">
                                                    <span className="type">访客人数</span>
                                                    <span className="count">{this.formatNum(i.learningNum || 0)}</span>
                                                </div>
                                                <div className="item">
                                                    <span className="type">报名人数</span>
                                                    <span className="count">{this.formatNum(i.authNum || 0)}</span>
                                                </div>
                                                <div className="item">
                                                {
                                                    i.chargeConfigs && i.chargeConfigs[0] && i.chargeConfigs[0].amount > 0? 
                                                    [
                                                        <span className="type">课程收入</span>,
                                                        <span className="count"><em>￥</em>{this.formatNum(i.income || 0)}</span>
                                                    ]: '免费课程'
                                                }
                                                </div>
                                            </div>
                                        }
                                        {
                                            i.optimize && i.optimize.count > 0 ?
                                            <div className="optimization">
                                                <div className="cancel on-log" 
                                                    onClick={()=>{this.setState({showOptimizationDialog: true});this.data.currentSelectId = i.id}}
                                                    data-log-region="course_list"
                                                    data-log-pos="ignore_click"
                                                    data-log-business_Id = {i.id}
                                                    data-log-business_Type = "channel"
                                                >
                                                    <span>忽略优化</span>
                                                </div>
                                                <div className="done on-log" 
                                                    onClick={this.gotoOptimize.bind(this, i.id)}
                                                    data-log-region="course_list"
                                                    data-log-pos="go_click"
                                                    data-log-business_Id = {i.id}
                                                    data-log-business_Type = "channel"
                                                >
                                                    <span>去优化<em>{i.optimize.count}</em></span>
                                                </div>
                                            </div> : null
                                        }
                                    </div>
                                ))
                            }
                        </div>
                    }
                </div>
                </ScrollToLoad>
                {
                    this.state.showOptimizationDialog ? 
                    <div className="optimization-dialog-container">
                        <div className="bg" onClick={this.hideOptimizationDialog}></div>
                        <div className="optimization-dialog">
                            <div className="content">
                                <div className="title">确定忽略该课程优化建议</div>
                                <div className="tip">忽略后该课程将不再出现优化提示</div>
                            </div>
                            <div className="btn">
                                <span 
                                    className="on-log" 
                                    onClick={this.cancelOptimization}
                                    data-log-region="course_list"
                                    data-log-pos="ignore_click_yes"
                                    data-log-business_Id = {this.data.currentSelectId}
                                    data-log-business_Type = {this.state.type}
                                >确认</span>
                                <span className="cancel" onClick={this.hideOptimizationDialog}>取消</span>
                            </div>
                        </div>
                    </div>
                    : null
                }
                {
                    this.state.showTipDialog ? 
                    <div className="tip-dialog-container">
                        <div className="bg" onClick={this.hideTipDialog}></div>
                        <div className="tip-dialog">
                            <div className="content">
                                <div className="title">数据说明</div>
                                <div className="tip">1、收入:直播间内所有项目的累计收入<em>(延迟1小时)</em></div>
                                <div className="tip">2、访问人数:包含所有来过直播间的用户<em>(截止至昨天)</em></div>
                                <div className="tip">3、下单人数:包含直播间内付费购买过任 何项目的用户<em>(截止至昨天)</em></div>
                            </div>
                            <div className="btn" onClick={this.hideTipDialog}>我知道了</div>
                        </div>
                    </div>
                    : null
                }
            </Page>
        )
    }
}

function mapStateToProps (state) {
    return {
        
    }
}

const mapActionToProps = {
    
}

export default connect(mapStateToProps, mapActionToProps)(LiveDataStatistics);