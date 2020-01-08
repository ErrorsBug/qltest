import React, {  } from 'react'
import Picture from 'ql-react-picture'
import { digitFormat, locationTo, getAudioTimeShow } from 'components/util';
import { authFreeCourse } from "common_actions/common";
import classnames from 'classnames'

const toTopic = (topicId) => {
    typeof _qla != 'undefined' && _qla('click', {
        region: 'books-item',
    });
    locationTo(`/wechat/page/topic-intro?topicId=${ topicId }`)
}

function BooksList ({ topicId, channelId, index, headImageUrl, money, name, learningNum, duration, isRanking, description, isShowD, isNumb }) {
    const cls = classnames({
        'one': index == 0,
        'two': index == 1, 
        'three': index == 2, 
    }) 
    const courseId = topicId || channelId;
    return (
        <div className="ba-book-list on-log on-visible"
            data-log-region="ba-book-list"
            data-log-pos={index}
            data-log-name={name}
            onClick={()=>{toTopic(courseId)}}
        >
            <div className="ba-book-img">
                <div className="ba-book-pic">
                    <Picture 
                        src={headImageUrl} 
                        placeholder={true}
                        resize={{w: 142,h: 184}} />
                </div>
                { isRanking && <span className={ cls }>NO.{ index+1 }</span> }
            </div>
            <div className="ba-book-1">
                <div>
                    <div className="ba-book-info">
                        <h4>{name}</h4>
                        <p>{ description }</p>
                    </div>
                    <div className="ba-book-play">
                        <p>{ !isNumb && `${ digitFormat(learningNum) }次学习 ` }{ `${ !isNumb ? '| ': '' }时长${ getAudioTimeShow(duration) }` }</p>
                        <div className="play">播放</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default BooksList