import React, { PureComponent, Fragment } from 'react'
import { MiddleDialog } from 'components/dialog';  
import { autobind } from 'core-decorators';
import { createPortal } from 'react-dom';
import MasterCourseDetails from './components/course-details';
import { api } from 'common_actions/common';
import { MediaPlayerCover } from 'components/media-player-cover';
import { getFinancialCamp,getCourseInfo,getCourseTopicList } from '../../actions/experience'
import { formatDate, locationTo, getVal, formatMoney, getCookie } from 'components/util';
 


@autobind
export default class extends PureComponent{
    state = { 
        courseDetails: {} ,
		courseDetailsId: '',
		courseDetailsType: 'channel',
		isTopicListMore: false,  
        playerTopicId: '',
        playStatus:'stop',
        isShowCourse: false, 
		topicListPage: 2,
		pageSize: 20,
    }
    
    data = { 
    }
    componentDidMount = () => {
    };  
    
	closeCourseDetatils () {
		this.auditionPause()
		this.setState({
			isShowCourse: false,
			playerTopicId: ''
		})
    }
     
 
    async showCourseDetatils ({businessId,desc='', businessType="channel"}) {
        !this.mediaPlayer&&this.initMediaPlayer()  
        const data = await getCourseInfo({
            businessId,
            businessType 
        })
        if (data) {
            if(desc){
                data.summary={content:desc} 
            }
            this.setState({
                courseDetails: data,
                courseDetailsId: businessId,
                courseDetailsType: businessType, 
                isShowCourse: true,
            })
        }
    } 
    
    // 初始化隐藏播放器（用于试听）
    initMediaPlayer() {
        let updateStatus = (status) => {
            if (this.state.playStatus === status) {
                return false;
            } 
            this.setState({
                playStatus: status
            })
        }
        this.mediaPlayer = new MediaPlayerCover({updateStatus});
    }
    //
    async auditionPlaying(type,id,idx){    
        if (this.data.id && this.data.id == id) {
            this.auditionPause()
        } else { 
            this.data.id = id;
            this.mediaPlayer.pause();
            try {
                const res = await this.getCourseAuditionList({
                    businessId: id,
                    businessType:'TOPIC'|| type.toUpperCase(),
                })
                let list = getVal(res, 'data.result.contentList', [])
                let msg = getVal(res, 'state.msg', '')
                if (list.length) {
                    let totalSeconds = getVal(res,'data.result.totalSeconds',0)
                    this.mediaPlayer.mediaPlayerUpdate(list, totalSeconds, type == 'topic', type == 'topic' ?  300 : null);
                    this.mediaPlayer.play(); 
                    this.setState({ 
                        playerTopicId : id
                    })
                    
                } else {
                    window.toast("暂未开课，先试听其他课吧~")
                    this.data.id = ''; 
                }
            } catch (error) {
                window.toast("网络请求超时~")
                this.data.id = ''; 
            }
        }
    }
    // 试听暂停
    auditionPause(){
        this.mediaPlayer.pause();
        this.data.id = ''; 
    }
    
    async getCourseAuditionList(params){
        const result = await api({
            showLoading: false,
            method: 'POST',
            url: '/api/wechat/getCourseAuditionList',
            body: params
        });
        return result;
    } 
    async fetchMediaUrl(topicId, sourceTopicId) {
        const params = {
            topicId
        }
        if (sourceTopicId && sourceTopicId !== topicId) {
            params.topicId = sourceTopicId
            params.relayTopicId = topicId
        }
        let result = await api({ 
            url: '/api/wechat/topic/media-url',
            method: 'GET',
            showLoading: false,
            body: params
        }) 
        return result;
    }; 
	 
 
    
	async fetchTopicList (page) {

		const {
			courseDetails,pageSize
		} = this.state

		let resultList = await getCourseTopicList({
			channelId: this.state.courseDetailsId,
			pageNum: page,
			pageSize 
		})

		const dataList = page !== 1 ? [...courseDetails.topicList, ...resultList] : [...resultList]
		this.setState({
			courseDetails: { ...courseDetails, topicList: dataList },
			topicListPage: page + 1,
			isTopicListMore: resultList.length < pageSize,
		})
	}
	loadMoreTopicList = async (next) => {

		const { topicListPage, isTopicListMore } = this.state
		
		if (!isTopicListMore) {
			await this.fetchTopicList(topicListPage)
		}

		next && next();
    }
    render() {
        const { 
            isShowCourse,
			courseDetails,
			courseDetailsId,
			courseDetailsType, 
			playerTopicId,
			playStatus,
            isTopicListMore,  } = this.state;
        const {children,  businessId,businessType,desc,...otherProps } = this.props; 
        return (
            <Fragment> 
                <div {...otherProps} onClick={()=>this.showCourseDetatils({businessId,businessType,desc})}> 
                    {children}
                </div>
                
                {
                    isShowCourse&&createPortal(
                        <MasterCourseDetails
                            {...otherProps}
							courseDetails={courseDetails}
							businessId={courseDetailsId}
							businessType={courseDetailsType}
							playerTopicId={playerTopicId}
							playerStatus={playStatus}
							audioPlay={this.auditionPlaying}
							loadMoreTopicList={this.loadMoreTopicList}
							noMore={isTopicListMore}
							close={this.closeCourseDetatils}
							/>
                        ,document.getElementById('app'))
                }  
            </Fragment>
        )
    }
}
