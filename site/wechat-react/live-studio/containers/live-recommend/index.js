import Page from 'components/page';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import ScrollToLoad from 'components/scrollToLoad';
import {todayRecommend} from '../../actions/course-info';
import { locationTo } from 'components/util';

@autobind
class LiveRecommend extends Component {
    state = {
        month: '',
        day: '',
        isNoMore: false,
        noData: false,
        list: []
    }

    // 分页对象
    data = {
        pageNum: 1,
        pageSize: 30,
        date: ''
    }

    componentDidMount(){
        this.initDate()
        this.loadCourse()
    }

    // 课程加载
    async loadCourse(next = ()=>{}){
        const result = await todayRecommend({
            date: this.data.date,
            page: {
                page: this.data.pageNum,
                size: this.data.pageSize,
            }
        })
        if(result.state.code === 0){
            if(result.data && result.data.dataList && result.data.dataList.length > 0){
                let isNoMore = false
                if(result.data.dataList.length < this.data.pageSize){
                    isNoMore = true
                }else {
                    ++this.data.pageNum
                }
                this.setState({
                    isNoMore,
                    list: this.state.list.concat(this.updateLearnNum(result.data.dataList))
                })
            }else if(!result.data.dataList.length && this.data.pageNum == 1){
                this.setState({noData: true})
            }
        }
        next & next()
    }

    // 初始化页面日期
    initDate(){
        let month, day, date
        if(this.props.location.query.date){
            date = this.props.location.query.date
            month = Number(date.slice(4,6))
            day = Number(date.slice(6,8))
        }else {
            let today = new Date()
            let yearStr = today.getFullYear()
            let monthStr = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1
            let dayStr = today.getDate() < 10 ? '0' + today.getDate() : today.getDate()
            date = yearStr.toString() + monthStr.toString() + dayStr.toString()
            month = today.getMonth() + 1
            day = today.getDate()
        }
        this.data.date = date
        switch(month) {
            case 1: month = '一'; break;
            case 2: month = '二'; break;
            case 3: month = '三'; break;
            case 4: month = '四'; break;
            case 5: month = '五'; break;
            case 6: month = '六'; break;
            case 7: month = '七'; break;
            case 8: month = '八'; break;
            case 9: month = '九'; break;
            case 10: month = '十'; break;
            case 11: month = '十一'; break;
            case 12: month = '十二'; break;
        }
        this.setState({
            month: month + '月',
            day
        })
    }

    // 更新学习人数
    updateLearnNum(list = []){
        let newList = list.map((item)=>{
            if(item.learningNum < 300) {
                return {
                    ...item,
                    learningNum: '新课'
                }
            } else if(item.learningNum > 9999) {
                let num = (item.learningNum / 10000).toFixed(1)
                return {
                    ...item,
                    learningNum: (num.split('.')[1] === '0' ? num.split('.')[0] : num) + '万次学习'
                }
            } else {
                return {
                    ...item,
                    learningNum: item.learningNum + '次学习'
                }
            }
        })
        return newList
    }

    // 跳转到课程介绍页
    locationToIntro(type, id){
        let url = ''
        if(type === 'channel'){
            url = `/wechat/page/channel-intro?channelId=${id}`
        }else if(type === 'topic'){
            url = `/wechat/page/topic-intro?topicId=${id}`
        }
        locationTo(url)
    }

    render(){
        const { month, day, noData, isNoMore, list } = this.state
        return (
            <Page title={'今日推荐'} className='live-recommend-container'>
                <div className="top-label">
                    <div className="date-container">
                        <span className="month">{month}</span>
                        <span className="day">{day}</span>
                    </div>
                    <div className="desc-container">
                        <div className="title">你订阅的直播间更新课程了~</div>
                        <p className="tip">点击下方按钮“订阅管理”，屏蔽你不感兴趣的内容，你将不再收到对应推送~</p>
                    </div>
                </div>
                <div className="course-label">
                    <ScrollToLoad
                        className={"course-scroll-box"}
                        toBottomHeight={300}
                        noneOne={noData}
                        loadNext={ this.loadCourse }
                        noMore={isNoMore}
                    >
                        {
                            list.map((item, index) => (
                                <div className="list" key={`list-${index}`} onClick={this.locationToIntro.bind(this,item.businessType,item.businessId)}>
                                    <img src={item.imageUrl} className="img"/>
                                    <div className="course-desc">
                                        <div className="title">{item.title}</div>
                                        <div className="info">
                                            <span className="liveName">{item.liveName}</span>
                                            <span className="learnNum">{item.learningNum}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </ScrollToLoad>
                </div>
                <div className="bottom-label">
                    <div className="manage" onClick={()=>{locationTo(`/wechat/page/timeline/mine-focus`)}}>订阅管理</div>
                    <div className="more" onClick={()=>{locationTo(`/wechat/page/recommend`)}}>查看更多课程</div>
                </div>
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

export default connect(mapStateToProps, mapActionToProps)(LiveRecommend);