import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators'
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';

import { digitFormat, formatMoney, locationTo,getVal } from 'components/util';
import { getUrlParams, fillParams } from 'components/url-utils';
import CourseItem from 'components/common-course-item';
import NewCourseItem from 'components/common-course-item/new-course';
import { MediaPlayerCover } from 'components/media-player-cover';


// actions
import {
    viewMore,
} from '../../../actions/recommend';
import {
    getCourseAuditionList
} from '../../../actions/common'
import { request } from 'common_actions/common';


function mapStateToProps(state) {
	return {

	}
}

const mapActionToProps = {
	viewMore
};

@autobind
class RecommendViewMore extends Component {

    constructor(props){
        super(props)
    }

    state = {
	    courseList: [],
        noMore: false,
        noData: false,
        
    };
    
    data = {
	    regionCode: this.props.location.query.regionCode,
        page: 1,
        size: 20
    };

    get getTab (){
        const regionCode = this.props.location.query.regionCode;
        return Object.is(regionCode, 'dijia')
    }

    componentWillMount() {
        this.urlParams = getUrlParams();
    }

    componentDidMount() {
        this.initMediaPlayer();
        if (this.urlParams.regionCode === 'guestYouLike') {
            this.getViewMore_guestYouLike();
        } else {
            this.getViewMore(this.data.page);
        }
        
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.bindVisibleScroll('co-scroll-to-load');
        }, 1000);
    }
    componentWillUnmount(){
        if(this.mediaPlayer){
            this.mediaPlayer.pause();
        }
    }

     // 初始化隐藏播放器（用于试听）
     initMediaPlayer() {
        let updateStatus = (status) => {
            if (this.playStatus === status) {
                return false;
            }
            this.setState({
                playStatus: status
            })
        }
        this.mediaPlayer = new MediaPlayerCover({updateStatus});
    }

    async getViewMore(page){
        const res = await this.props.viewMore({
	        page: {
	            page: page,
                size: this.data.size
            },
	        regionCode: this.data.regionCode,
	        twUserTag: this.props.location.query.twUserTag || '',
        });
        if(res.state.code === 0){
            if(res.data.dataList && res.data.dataList.length){
                this.setState({
                    courseList: [...this.state.courseList, ...res.data.dataList],
			        noMore: this.data.regionCode === 'rank'
                })
            }else if(page === 1){
                this.setState({
                    noData: true
                })
            }
	        if(res.data.dataList && res.data.dataList.length < this.data.size && page > 1){
		        this.setState({
			        noMore: true
		        })
	        }
        }
    }

    getViewMore_guestYouLike = async (page = this.data.page) => {
        const size = this.data.size;

        await request({
            url: '/api/wechat/transfer/h5/live/center/popularCourse',
            method: 'POST',
            body: {
                page: {
                    page,
                    size,
                }
            }
        }).then(res => {
            if (res.state.code) throw Error(res.state.msg);

            let list = res.data.courseList || [];
            const noMore =  list.length < size;
            
            // 过滤
            list = list.filter(item => item.displayStatus === 'Y');

            this.setState({
                courseList: page > 1 ? this.state.courseList.concat(list) : list,
                noMore,
                noData: page == 1 && !list.length ? true : false,
            })
        }).catch(err => {
            console.error(err);
            window.toast(err.message);
        })
    }

    async loadNext(next){
        this.data.page += 1;

        if (this.urlParams.regionCode === 'guestYouLike') {
            await this.getViewMore_guestYouLike(this.data.page);
        } else {
            await this.getViewMore(this.data.page);
        }
        
        next && next();
    }

	courseItemTapHandle(course){
        let url = course.url;
        // if(!!course.auditionTopicId && !this.getTab){
        //     locationTo(`/topic/details?topicId=${course.auditionTopicId}`);
        //     return false
        // } else
        {
            if (window.__wxjs_environment === 'miniprogram') {
                let url = (course.businessType === 'channel' 
                    ?
                    `/pages/channel-index/channel-index?channelId=${course.businessId}`
                    :
                    `/pages/intro-topic/intro-topic?topicId=${course.businessId}`);
                
                wx.miniProgram.navigateTo({ url });
            } else {
                if (!url) {
                    if(course.businessType === 'channel'){
                        url = `/wechat/page/channel-intro?channelId=${course.businessId}`;
                    }else if(course.style === 'normal' || course.style === 'ppt'){
                        url = `/topic/details?topicId=${course.businessId}`
                    }else{
                        url = `/topic/details-video?topicId=${course.businessId}`;
                    }
                }
                // 测你喜欢模块需要增加参数
                if (this.urlParams.regionCode === 'guestYouLike') {
                    url = fillParams({
                        wcl: 'promotion_recommend'
                    }, url)
                }
                locationTo(url);
            }
        }
    }
    //
    async auditionPlaying(type,id,idx){      
        if (this.data.id && this.data.id == id) {
            this.mediaPlayer.resume();
        } else {
            this.data.id = id;
            this.mediaPlayer.pause();
            this.setState({
                bsId: id,
                type: type,
                idx:idx,
                playStatus: 'loading'
            },)
            try {
                const res = await getCourseAuditionList({
                    businessId: id,
                    businessType: type.toUpperCase(),
                })
                let list = getVal(res, 'data.result.contentList', [])
                if (list.length) {
                    let totalSeconds = getVal(res,'data.result.totalSeconds',0)
                    this.mediaPlayer.mediaPlayerUpdate(list, totalSeconds, type == 'topic', type == 'topic' ?  300 : null);
                    this.mediaPlayer.play();
                } else {
                    window.toast("暂未开课，先试听其他课吧~")
                    this.data.id = '';
                    this.setState({
                        bsId: '',
                        type: '',
                        idx: -1,
                        playStatus: 'stop'
                    })
                }
            } catch (error) {
                window.toast("网络请求超时~")
                this.data.id = '';
                this.setState({
                    bsId: '',
                    type: '',
                    idx: -1,
                    playStatus: 'stop'
                })
            }
        }
    }
    // 试听暂停
    auditionPause(){
        this.mediaPlayer.pause();
    }

    render() {
        const title = this.urlParams.regionCode === 'guestYouLike' ? '猜你喜欢' : decodeURIComponent(this.props.location.query.name);
        return (
            <Page title={title} className='recommend-view-more-container'>
                <ScrollToLoad
                    loadNext={this.loadNext}
                    noMore={this.state.noMore}
                    noneOne={this.state.noData}
                >
                    <div className={`common-container${this.data.regionCode === 'rank' ? ' rank' : ''}`}>
                        { 
                            this.data.regionCode === 'rank' ? (
                                this.state.courseList.map((item, i) => (
                                    <div className="rank-item" key={i}>
                                        { i > 0 && i < 20 && <div className={`rank-pic-title _rank${i + 1}`}></div> }
                                        <NewCourseItem
                                            className="on-log on-visible"
                                            key={i}
                                            data={item}
                                            onClick={_=> this.courseItemTapHandle(item)}
                                            data-log-id={item.businessId}
                                            playing={ this.auditionPlaying }
                                            auditionPause={ this.auditionPause }
                                            playStatus={ this.state.playStatus }
                                            bsId={ this.state.bsId }
                                            type={ this.state.type }
                                            idx={ i }
                                            showHotComment={i < 3}
                                            selctId={ this.state.idx }
                                            data-log-type={item.businessType}
                                            data-log-region={this.data.regionCode}
                                            data-log-pos={i}
                                        />
                                    </div>
                                )))
                                :
                                !this.getTab && (
                                this.state.courseList.map((item, i) => (
                                    <NewCourseItem
                                        className="on-log on-visible"
                                        key={i}
                                        data={item}
                                        // isFlag={ true }
                                        onClick={_=> this.courseItemTapHandle(item)}
                                        data-log-id={item.businessId}
                                        playing={ this.auditionPlaying }
                                        auditionPause={ this.auditionPause }
                                        playStatus={ this.state.playStatus }
                                        bsId={ this.state.bsId }
                                        type={ this.state.type }
                                        idx={ i }
                                        selctId={ this.state.idx }
                                        data-log-type={item.businessType}
                                        data-log-region={this.data.regionCode}
                                        data-log-pos={i}
                                    />
                                ))) 
                        }
                        { this.getTab && this.data.regionCode !== 'rank' && (
                            this.state.courseList.map((item, i) => (
                                <CourseItem
                                    className="on-log on-visible"
                                    key={i}
                                    data={item}
                                    // isFlag={ true }
                                    onClick={_=> this.courseItemTapHandle(item)}
                                    data-log-id={item.businessId}
                                    data-log-type={item.businessType}
                                    data-log-region={this.data.regionCode}
                                    data-log-pos={i}
                                />
                            ))
                        ) }
                    </div>
                </ScrollToLoad>
            </Page>
            )
    }
}

module.exports = connect(mapStateToProps, mapActionToProps)(RecommendViewMore);
