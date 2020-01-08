import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './css-module.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { createPortal } from 'react-dom';
import DialogCourseIntro from '../dialog-channel-intro';
import { autobind, throttle } from 'core-decorators';
import Picture from 'ql-react-picture';
import { getTopicListByChannel, getUeditorSummary, getChannelProfile, removeCourseId } from "../../../../actions/home";
import { locationTo , formatCountdown } from 'components/util';
import { isQlchat } from 'components/envi'
import appSdk from 'components/app-sdk'


@withStyles(styles)
@autobind
class CourseList extends Component {

    state = {
        portalDom:null,
        courseList: [],
        topicListByChannel: [],
        currentTopicId: '',
        showChannelCourseDialog: false,   
        editorContent: '',   
        channelInfo: {},  
    }

    componentDidMount() {
        this.setState({
            portalDom:document.querySelector('.portal-middle')
        })
    }

    toggleQr() {
        this.setState({
            isShowQr:!this.state.isShowQr
        })
    }

    async onShowChannelCourseDialog(type,channelId,currentTopicId){
        if(type ==='channel'){
            let result = await getTopicListByChannel({
                channelId,
            });
            let editor = await getUeditorSummary({
                businessId: channelId,
                type: 'channel',
            });
            let channelProfile = await getChannelProfile(channelId);
            this.setState({
                editorContent: editor.content,
                topicListByChannel: result.dataList,
                currentTopicId,
                showChannelCourseDialog: true,
                channelDesc: channelProfile.descriptions,
            });
            this.props.changeDisAbleScroll && this.props.changeDisAbleScroll()

        }
        
    }
    onCloseChannelCourseDialog(){
        this.setState({
            showChannelCourseDialog: false,
        });
        this.props.changeDisAbleScroll && this.props.changeDisAbleScroll()

    }
    // 删除课程
    @throttle(300)
    removeCourse(id, type, index) {
        this.props.changeDisAbleScroll && this.props.changeDisAbleScroll()
        window.simpleDialog({
            title: null,
            msg: '确定移除该课程吗?',
            buttons: 'cancel-confirm',
            confirmText: '确认',
            cancelText: '取消',
            className: 'my-course-list-delete-dialog',
            onConfirm: async () => {
                try {
                    const { state } = await removeCourseId({
                        businessId: id,
                        businessType: type,
                    });
                    if(state && state.code == 0){
                        this.props.handleRemoveCourse(index);
                        window.toast("删除成功");
                    } else {
                        window.toast("删除失败");
                    }
                    this.props.changeDisAbleScroll && this.props.changeDisAbleScroll()
                } catch (error) {
                    
                }
            },
            onCancel: ()=>{
                this.props.changeDisAbleScroll && this.props.changeDisAbleScroll()
            },
        })
    }
    
    goFrontendPage(topicId, type) {
        let url = Object.is(type, 'book') ? `/topic/details-listening?topicId=${topicId}&isUnHome=Y`: `/topic/details?topicId=${topicId}&isUnHome=Y`
        if(isQlchat()) {
            appSdk.linkTo(`dl/live/topic?topicId=${ topicId }`)
        } else {
            locationTo(url)
        }
    }

    render() {
        if (!this.state.portalDom) {
            return null
        }
        return (
            <div className={`${styles['course-list-page-list']} `}>
                {
                    this.props.courseList.map((item, index) => {
                        return <div className={`${styles['course-item']} ${item.businessType ==='channel'?styles["channel"]:styles["book"]}`} key={`course-item-${index}`}>
                            <div className={`${styles['course-remove']}`} onClick={ () => this.removeCourse(item.businessId,item.businessType, index) }></div>
                            <div className={`${styles["course-info-box"]}`} onClick={()=>this.onShowChannelCourseDialog(item.businessType, item.businessId, item.currentId || item.firstCourseId)}>
                                <div className={`${styles['course-img']}`}>
                                    <Picture src={item.headImgUrl} resize={{ w: 130, h: 166 }} />
                                </div>
                                <div className={`${styles["flex-one"]}`}>
                                    <span className={`${styles["title"]} elli-text`}>{item.name}</span>
                                    <span className={`${styles["info"]}`}>
                                        <span className={`${styles["left"]}`}>
                                            {item.businessType ==='channel' ?  
                                                <var className={`${styles["couse-num"]}`}>{item.topicCount ||0}课</var>: 
                                                ( item.duration ? <var className={styles["couse-time-long"]}>{`${formatCountdown(Math.floor(item.duration),'mm:ss')}`}</var>:null)
                                            }
                                            {/* { 
                                                item.endRate >0?
                                                (
                                                    item.endRate<100 ? 
                                                    <var className={`${styles["ing"]}`}><EndRateRound rate={Number(item.endRate)} activeColor='#fff' bgColor='#BBBBBB' />已学{item.endRate}%</var>: 
                                                    <var className={`${styles["status"]} ${styles["complite"]}`}>已完成</var>
                                                )
                                                :
                                                <var className={`${styles["status"]} ${styles["no"]}`}>未开始</var>
                                            } */}
                                        </span>
                                        {item.businessType !=='channel' && <span className={`${styles["btn-play"]}`} onClick={ () => this.goFrontendPage(item.businessId, item.businessType) }>播放</span>}
                                    </span>
                                </div>
                            </div>
                            {
                                item.businessType ==='channel' && item.topicCount > 0 &&
                                <div className={`${styles["course-title-bar"]}`}  onClick={()=> this.goFrontendPage((item.currentId || item.firstCourseId))} >
                                    <span className={`${styles["title"]}`}>{item.currentCourseName?<b>在学:</b>:<b>开始：</b>} {item.currentCourseName || item.firstCourseName }</span>
                                    <span className={`${styles["btn-play"]}`}>播放</span>
                                </div>
                            }
                            
                        </div>
                        
                    })
                }

                {
                    createPortal(       
                        <DialogCourseIntro show ={this.state.showChannelCourseDialog} topicList={this.state.topicListByChannel} currentTopicId = {this.state.currentTopicId} close={this.onCloseChannelCourseDialog} editorContent={this.state.editorContent} channelProfile={this.state.channelDesc} />
                        ,this.state.portalDom
                    )
                }
                
            </div>
        );
    }
}

CourseList.propTypes = {

};

export default CourseList;