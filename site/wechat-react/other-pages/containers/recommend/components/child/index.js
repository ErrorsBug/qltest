import React, { Component } from 'react';
import { digitFormat, locationTo } from 'components/util';
import NewCourseItem from 'components/common-course-item/new-course';
import Picture from 'ql-react-picture';
import FlagUI from 'components/flag-ui'
const Fragment = React.Fragment;
import { request, isAuthCourse, getFirstTopicInChannel, authFreeCourse } from 'common_actions/common';

class Child extends Component {

    constructor(props){
        super(props)
    }

    state = {
        courseListForPlayBtn: [],
    };

    async componentDidMount(){
        const courses = [...this.props.info.courses];
        if(courses.length > 3){
            courses.length = 3;
        }
        const tasks = [];
        courses.forEach(async c => {
            tasks.push(this.shouldDisplayPlayBtn(c));
        });
        const courseListForPlayBtn = await Promise.all(tasks);
        this.setState({
            courseListForPlayBtn
        });
    }

    async shouldDisplayPlayBtn(course){
        // 播放按钮展示逻辑
        let isShow = false;
        if(course.auditionTopicId || course.money <= 0){
            isShow = true;
        }else if(await isAuthCourse({
            businessId: course.businessId,
            businessType: course.businessType
        }) === 'Y'){
            isShow = true;
        }
        return {
            id: course.businessId,
            isShow
        };
    }

    async playBtnClickHandle(course){
        if(course.money <= 0){
            const res = await authFreeCourse({
                businessId: course.businessId,
                businessType: course.businessType
            });
            if(res === 'success'){
                if(course.businessType === 'topic'){
                    locationTo(`/wechat/page/topic-simple-video?topicId=${course.businessId}`)
                }else{
                    const topic = await getFirstTopicInChannel(course.businessId);
                    if(topic?.id){
                        locationTo(`/wechat/page/topic-simple-video?topicId=${topic.id}`);
                    }else{
                        window.loading(false);
                        window.toast('获取课程失败，请稍后重试')
                    }
                }
            }else{
                window.loading(false);
                window.toast('网络错误，请稍后再试');
            }
        }else if(course.businessType === 'topic'){
            locationTo(`/wechat/page/topic-simple-video?topicId=${course.businessId}`);
        }else if(course.auditionTopicId){
            locationTo(`/wechat/page/topic-simple-video?topicId=${course.auditionTopicId}`);
        }else if(course.businessType === 'channel'){
            window.loading(true);
            const topic = await getFirstTopicInChannel(course.businessId);
            if(topic?.id){
                locationTo(`/wechat/page/topic-simple-video?topicId=${topic.id}`);
            }else{
                window.loading(false);
                window.toast('获取课程失败，请稍后重试')
            }
        }
    }

    render() {
        const info = this.props.info;
        return (
            <div className="recommend-child on-visible"
                 data-log-region={info.code}
                 data-log-name={info.name}
            >
                <div className="block-header">
                    <span className="title">{info.name}</span> 
                </div>
                <div className="list-wrap">
                    {
	                    info.courses?.map((c, i) => (
                            <div className="list-item on-log"
                                 key={i}
                                 data-log-id={c.businessId}
                                 data-log-type={c.businessType}
                                 data-log-region={info.code}
                                 data-log-pos={i}
                                 onClick={e => this.props.courseItemTapHandle(c, {
                                     name: info.code,
                                     pos: 0
                                 })}
                            >
                                <div className="cover">
                                    <Picture
                                        src={c.indexLogo}
                                        placeholder={true}
                                        resize={{
                                            w: 204,
                                            h: 204,
                                        }}
                                    />
                                    {
                                        c.flag && <div className="flag">{c.flag}</div>
                                    }
                                    {
                                        this.state.courseListForPlayBtn[i]?.isShow &&
                                        <div className="play-btn onlog"
                                             data-log-id={c.businessId}
                                             data-log-type={c.businessType}
                                             data-log-region={`${info.code}-playBtn`}
                                             data-log-pos={i}
                                             onClick={e => {
                                                 e.stopPropagation();
                                                 this.playBtnClickHandle(c)
                                             }}
                                        ></div>
                                    }
                                </div>
                                <div className="name">{c.businessName}</div>
                                <div className="tip">{digitFormat(c.learningNum)}次学习</div>
                            </div>
                        ))
                    }
                </div>
                
                <div className="check-more-btn on-log"
                    data-log-name={info.name}
                    data-log-region="check-more-btn"
                    onClick={_=> this.props.getMoreBtnTapHandle(info)}>
                    <span>查看更多<i className="icon_enter"></i></span>
                </div>    
            </div>
        )
    }
}

export default Child;
