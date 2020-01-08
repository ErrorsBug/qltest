import React, { Component, Fragment } from 'react';
import { formatDate, locationTo } from 'components/util';

class TotalData extends Component {

    getPercent(a,b) {
        let per = 0;
        if (a == 0 || b == 0) {
            return per;
        } else {
            let tempA = a > b ? b : a;
            per = ((tempA / b) * 100).toFixed(0); 
            return per;
        }
    }

    // 跳转到如何提升课程指数页面
    jumpToLivePromoteMethod = () => {
        if(this.props.isFree == 'Y') {
            return 
        }
        locationTo('/wechat/page/live-promote-method'+ window.location.search)
    }

    renderCourseIndex = () => {
        // 系列课下非单节购买的不显示
        if(!this.props.showCourseIndex){
            return null
        }
        let level = ''
        switch(this.props.courseLevel){
            case 'S': level = '超过95%的同行'; break;
            case 'A': level = '超过80%的同行'; break;
            case 'B': level = '超过60%的同行'; break;
            case 'C': level = '超过40%的同行'; break;
            case 'D': level = '超过30%的同行'; break;
            case '': level = '暂无课程指数'; break;
        }
        return (
            <div className="container">
                <div className="title">
                    <span className='icon-course-index'>课程指数</span>
                    <span className="help on-log" data-log-region="course_index_introduce" onClick={() => { this.props.popHandel("courseIndex") }}></span>
                </div>
                <div className="flex-wrap index-flex-wrap">
                    <div className="index-con on-log" data-log-region="course_index_improve" onClick={this.jumpToLivePromoteMethod}>
                        <div className={`label${this.props.courseLevel ? '' : ' none'}`}>{this.props.courseLevel || '无'}</div>
                        <div className="grade">
                            <div className="your-grade">{this.props.name}</div>
                            <div className="degree">{level}</div>
                        </div>
                        { this.props.isFree == 'Y' ? null : <div className="how-to-do">如何提升<i className="icon_enter"></i></div> }
                    </div>
                    {
                        this.props.optimizeCount ? 
                        <div className="index-con on-log" data-log-region="course_optimize" data-log-pos="button_click" onClick={this.props.openOptimizeDialog}>
                            <div className="optimize">
                                <div className="count">待优化<em>{this.props.optimizeCount}</em></div>
                                <div className="tip">优化后可提高购买转化率哦</div>
                            </div>
                            <div className="how-to-do">去优化<i className="icon_enter"></i></div>
                        </div> : null
                    }
                </div>
            </div>
        )
    }

    renderChannel = () => {
        let { visitorData, ticked, distribution, gift, endRate, shareRate=0 , listenRate=0, listenNum=0 } = this.props.totalData
        return (
            <div className="total-data">
                {this.renderCourseIndex()}
                <div className="container">
                    <div className="title">
                        <span className='icon-base'>基本数据</span>
                        <span className="help" onClick={() => { this.props.popHandel("topicBaseData") }}></span>
                    </div>
                    <div className="flex-wrap">
                        <div className="big-con">
                            <span className="sm-content money">{ticked.amount}</span>
                            <span className="vice-text">课程收入</span>
                        </div>    
                        <div className="sm-con">
                            <span className="sm-content">{visitorData.totalVisitor}</span>
                            <span className="vice-text">访问人数</span>
                        </div>
                        <div className="sm-con pointer" onClick={() => { locationTo(`/wechat/page/join-list/channel?id=${this.props.businessId}`) }}>
                            <span className="sm-content">{visitorData.authNum}<i className="icon_enter"></i></span>
                            <span className="vice-text" >报名人数</span>
                        </div>
                        <div className="sm-con">
                            <span className="sm-content">{visitorData.totalVisitor == 0 ? 0 :parseFloat((visitorData.totalJoined / visitorData.totalVisitor * 100).toFixed(2))}<i className='sy-one'>%</i></span>
                            <span className="vice-text">报名率</span>
                        </div>
                        <div className="sm-con">
                            <span className="sm-content">{listenNum > visitorData.totalJoined ? visitorData.totalJoined : listenNum}</span>
                            <span className="vice-text">听课人数</span>
                        </div>
                        <div className="sm-con">
                            <span className="sm-content">{this.getPercent(listenNum,visitorData.totalJoined)}<i className='sy-one'>%</i></span>
                            <span className="vice-text">听课率</span>
                        </div>
                        <div className="sm-con">
                            <span className="sm-content">{endRate? parseFloat((endRate* 100).toFixed(2)): 0 }<i className='sy-one'>%</i></span>
                            <span className="vice-text">完播率<span className="help" onClick={() => { this.props.popHandel("topicBaseData") }}></span></span>
                        </div>
                        <div className="sm-con">
                            <span className="sm-content">{(shareRate*100).toFixed(0)}<i className='sy-one'>%</i></span>
                            <span className="vice-text">分享率</span>
                        </div>

                        {
                            (this.props.evaluteScore && this.props.evaluteScore) > 0 ?
                            <div className="sm-con"  onClick={() => { locationTo(`/wechat/page/channel-evaluation-list/${this.props.businessId}`) }}>
                                <span className="sm-content icon-star">{this.props.evaluteScore}</span>
                                <span className="vice-text">总体评价</span>
                            </div>
                            :
                            <div className="sm-con">
                                <span className="sm-content no-comment">暂无评价</span>
                                <span className="vice-text">总体评价</span>
                            </div>
                        }    
                    </div>
                </div>
                <div className="container">
                    <div className="title">
                        <span className='icon-gift'>赠礼数据</span>
                            <span className="help" onClick={() => { this.props.popHandel("gift") }}></span>                          
                    </div>                         
                    <div className="flex-wrap">
                        <div className="sm-con">
                            <span className="sm-content money">{gift.giftAmount}</span>
                            <span className="vice-text">赠礼收入</span>
                        </div>
                        <div className="sm-con">
                            <span className="sm-content">{gift.giftPayCount}</span>
                            <span className="vice-text">购买人数</span>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="title">
                        <span className='icon-distribution'>分销数据</span>    
                        <span className="help" onClick={() => { this.props.popHandel("distribution") }}></span>  
                    </div>
                    <div className="flex-wrap">
                        <div className="sm-con">
                            <span className="sm-content">{distribution.shareRepresentNum}</span>
                            <span className="vice-text">有效分销用户数（人）</span>
                        </div>
                        <div className="sm-con">
                            <span className="sm-content money">{distribution.shareProfit}</span>
                            <span className="vice-text">用户分销分成</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    
    renderTopic = () => {
        let { visitorData, ticked, distribution, appreciates, file, broadcast, gift, endRate, listenNum=0, shareRate=0 , listenRate=0} = this.props.totalData
        return (
            <div className="total-data">
                {this.renderCourseIndex()}
                <div className="container">
                    <div className="title">
                        <span className='icon-base'>基本数据</span>
                        <span className="help" onClick={() => { this.props.popHandel("topicBaseData") }}></span>
                    </div>
                    <div className="flex-wrap">
                        <div className="big-con">
                            <span className="sm-content money">{ticked.amount}</span>
                            <span className="vice-text">课程收入</span>
                        </div>
                        <div className="sm-con">
                            <span className="sm-content">{visitorData.totalVisitor}</span>
                            <span className="vice-text">访问人数</span>
                        </div>
                        <div className="sm-con pointer" onClick={() => { locationTo(`/wechat/page/join-list/topic?id=${this.props.businessId}`) }}>
                            <span className="sm-content flex">{visitorData.authNum}<i className="icon_enter"></i></span>
                            <span className="vice-text"  >报名人数</span>
                        </div>
                        <div className="sm-con">
                            <span className="sm-content">{visitorData.totalVisitor == 0 ? 0 :parseFloat((visitorData.totalJoined / visitorData.totalVisitor * 100).toFixed(2))}<i className='sy-one'>%</i></span>
                            <span className="vice-text">报名率</span>
                        </div>
                        <div className="sm-con">
                            <span className="sm-content">{listenNum > visitorData.totalJoined ? visitorData.totalJoined : listenNum}</span>
                            <span className="vice-text">听课人数</span>
                        </div>
                        <div className="sm-con">
                            <span className="sm-content">{this.getPercent(listenNum,visitorData.totalJoined)}<i className='sy-one'>%</i></span>
                            <span className="vice-text">听课率</span>
                        </div>
                        <div className="sm-con">
                            <span className="sm-content">{endRate? parseFloat((endRate* 100).toFixed(2)): 0 }<i className='sy-one'>%</i></span>
                            <span className="vice-text">听课完播率<span className="help" onClick={() => { this.props.popHandel("topicBaseData") }}></span></span>
                        </div>
                        <div className="sm-con">
                            <span className="sm-content">{(shareRate*100).toFixed(0)}<i className='sy-one'>%</i></span>
                            <span className="vice-text">分享率</span>
                        </div>
                        {
                            (this.props.evaluteScore && this.props.evaluteScore) > 0 ?
                            <div className="sm-con"  onClick={() => { locationTo(`/wechat/page/topic-evaluation-list/${this.props.businessId}`) }}>
                                <span className="sm-content icon-star">{this.props.evaluteScore}</span>
                                <span className="vice-text">总体评价</span>
                            </div>
                            :
                            <div className="sm-con">
                                <span className="sm-content no-comment">暂无评价</span>
                                <span className="vice-text">总体评价</span>
                            </div>
                        }
                    </div>
                </div>
                <div className="container">
                    <div className="title">
                    <span className='icon-gift'>赠礼数据</span>
                        <span className="help" onClick={() => { this.props.popHandel("gift") }}></span>                          
                    </div>
                    <div className="flex-wrap">
                        <div className="sm-con">
                            <span className="sm-content money">{gift.giftAmount}</span>
                            <span className="vice-text">赠礼收入</span>
                        </div>
                        <div className="sm-con">
                            <span className="sm-content">{gift.giftPayCount}</span>
                            <span className="vice-text">购买人数</span>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="title">
                        <span className='icon-distribution'>分销数据</span>    
                        <span className="help" onClick={() => { this.props.popHandel("distribution") }}></span>  
                    </div>
                    <div className="flex-wrap">
                        <div className="sm-con">
                            <span className="sm-content">{distribution.shareRepresentNum}</span>
                            <span className="vice-text">有效分销用户数（人）</span>
                        </div>
                        <div className="sm-con">
                            <span className="sm-content money">{distribution.shareProfit}</span>
                            <span className="vice-text">用户分销分成</span>
                        </div>
                    </div>
                </div>
    
                <div className="container">
                    <div className="title">
                        <span className='icon-other'>其他</span>   
                        <span className="help" onClick={() => { this.props.popHandel("other") }}></span>  
                    </div>
                    <div className="flex-wrap">
                        <div className="sm-con">
                            <span className="sm-content money">{appreciates.rewardAmount}</span>
                            <span className="vice-text">赞赏收入</span>
                        </div>
                        <div className="sm-con">
                            <span className="sm-content money">{file.fileAmount}</span>
                            <span className="vice-text">文件收入</span>
                        </div>
                        <div className="sm-con">
                            <span className="sm-content money">{broadcast.relayAmount}</span>
                            <span className="vice-text">转播费收入</span>
                        </div>
                        <div className="sm-con">
                            <span className="sm-content money">{broadcast.relayProfit}</span>
                            <span className="vice-text">转播分成收入</span>
                        </div>
                        <div className="sm-con">
                            <span className="sm-content">{broadcast.relayLiveNum}</span>
                            <span className="vice-text">转播方数</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    render() {
        let businessType = this.props.businessType
        return (
            <Fragment>
                <div className="update-time">数据已更新至{formatDate(this.props.lastStatTime,'yyyy-MM-dd hh:mm:ss')}</div>

                {
                    businessType === "channel" ?
                    this.renderChannel()
                    : this.renderTopic()
                }
            </Fragment>    
        )
    }
}

export default TotalData;