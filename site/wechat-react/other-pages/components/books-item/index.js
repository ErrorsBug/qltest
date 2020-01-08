import React, { useRef, forwardRef, useImperativeHandle, useEffect } from 'react'
import Picture from 'ql-react-picture'
import { digitFormat, locationTo, getAudioTimeShow } from 'components/util';
import {authFreeCourse } from "common_actions/common";

const playBtnClickHandle = async(isAuth, money, topicId) => {
    if(isAuth === 'Y'){
        locationTo(`/wechat/page/topic-simple-video?topicId=${topicId}`);
    }else if(money <= 0){
        const res = await authFreeCourse({
            businessId: topicId,
            businessType: 'topic'
        });
        if(res === 'success'){
            locationTo(`/wechat/page/topic-simple-video?topicId=${topicId}`)
        }else{
            window.loading(false);
            window.toast('网络错误，请稍后再试');
        }
    }
}

const toTopic = (topicId) => {
    typeof _qla != 'undefined' && _qla('click', {
        region: 'books-item',
    });
    locationTo(`/wechat/page/topic-intro?topicId=${ topicId }`)
}

function BooksItemRef ({ topicId, channelId, index, headImageUrl, backgroundUrl, isAuth, money, description, learningNum, resize, region, title, id, duration, isShowD}, ref) {
    const curNode = useRef(null)
    useImperativeHandle(ref, () => curNode.current)
    useEffect(() => {
    }, [curNode])
    const courseId = topicId || channelId
    return (
        <div className="ls-book-item on-log on-visible"
            data-log-region={ region || 'books-item' }
            data-log-pos={index}
            data-log-name={description || title}
            key={topicId}
            data-index={index}
            ref={ curNode }
            id={ id }
            onClick={()=>{toTopic(courseId)}}
        >
            <div className="cover">
                <Picture 
                    src={ headImageUrl || backgroundUrl } 
                    placeholder={true}
                    resize={resize || {w: 204,h: 260}}
                />
                {
                    (isAuth === 'Y' || money <= 0) &&
                    <div className="play-btn"
                        onClick={e => {
                            e.stopPropagation();
                            playBtnClickHandle(isAuth, money, courseId)
                        }}
                    ></div>
                }
            </div>
            <div className="book-des">
                <h4>{description || title}</h4>
                <div className="book-status">
                    <span>{digitFormat(learningNum|| 0)}次学习 { !isShowD && `| 时长${ getAudioTimeShow(duration) }` }</span>
                </div>
            </div>
        </div>
    )
}

export default forwardRef(BooksItemRef)