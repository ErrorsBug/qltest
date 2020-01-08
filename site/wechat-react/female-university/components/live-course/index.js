import React, { Fragment } from 'react';
import Picture from 'ql-react-picture';
import { locationTo } from 'components/util';
import PlayingAnimate from 'components/playing-animate'
import PublicTitleImprove from '../public-title-improve'

const handleTimeStatus = (start, end, sysTime) => {
    if(start > sysTime ){
        return 'start'
    }
    if(start <= sysTime){
        if(end && (sysTime >= end)){
            return 'end'
        }
        return 'processing'
    }
    return false
}

const LiveCourse = ({ className="", title, keyA, keyB, keyC, topicId, liveTopicPo, liveChannelPo, sysTime ,decs, isTitle, btm }) => {
    const obj = liveTopicPo || liveChannelPo || {}
    const status = handleTimeStatus(obj.startTime,obj.endTime, sysTime);
    return (
        <Fragment>
            { isTitle && <PublicTitleImprove
                    className='un-live-course-title'
                    decs={ decs }
                    title={ title } /> }
            <div className={ `un-live-box on-log on-visible ${className}`}
                style={{marginBottom: `${ Number(btm || 48) / 78 }rem`  }} 
                data-log-name={ title }
                data-log-region="un-live-item"
                data-log-pos="0"
                onClick={ () => locationTo(`/topic/details?topicId=${ topicId }&isUnHome=Y`) }>
                <div className="un-live-cont"> 
                    <div className="un-live-itme">
                        <div className="un-live-pic">
                            <Picture src={ keyB } />
                        </div>
                        <div className="un-live-info">
                            <div>
                                <div>
                                    <div className={ `un-live-status ${ status }` }>
                                        { Object.is(status, 'processing') && <PlayingAnimate className="un-live-play" /> }
                                        <span className="un-live-txt">{ 
                                            Object.is(status,'start') 
                                                ? '即将开播': 
                                                    Object.is(status,'processing') ? '直播中' : null }</span>
                                    </div>
                                    <h4>{ keyA }</h4>
                                    <p>{ keyC }</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default LiveCourse