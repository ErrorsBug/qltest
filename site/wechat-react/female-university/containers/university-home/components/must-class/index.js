import React, { PureComponent } from 'react'
import { autobind } from 'core-decorators'
import classnames from 'classnames'
import Picture from 'ql-react-picture'
import PublicTitleImprove from '../../../../components/public-title-improve'
import CourseStatusHoc from '../../../../components/course-status-hoc'
import {
    digitFormat,
    locationTo,
  } from 'components/util';

const ClassItem = ({ handleStudyPlan, isAnimite,topicId, channelId, curId, keyA, idx, keyC, keyD, joinArr,
        keyB, title, liveChannelPo, liveEntityPo, liveTopicPo, onAnimationEnd, isJoin }) => {
    const obj = liveChannelPo || liveEntityPo ||  liveTopicPo || {};
    const courId = topicId || channelId;
    const type = !!channelId ? 'channel' : 'topic';
    let url = '';
    if(!!topicId) {
        url = `/wechat/page/topic-intro?topicId=${ topicId }&isUnHome=Y`
    } else {
        url = `/wechat/page/channel-intro?channelId=${ channelId }&isUnHome=Y`
    }
    const cls = classnames("on-log", {
        'must-join': isJoin || courId === curId && isAnimite || joinArr.includes(courId),
        'must-animate': courId === curId && isAnimite,
        'once': courId === curId && isAnimite,
    })
    return (
        <div className="must-class-item on-log on-visible" 
            data-log-name={ title }
            data-log-region="un-must-item"
            data-log-pos={ courId }
            data-log-index={ idx }
            onClick={ () => locationTo(url) }>
            <div className="must-pic">
                <Picture src={ keyA || '' } resize={{w:172,h:196}}/>
            </div>
            <div className="must-text">
                <h4>{ title }</h4>
                <div className="must-decs">{ keyB } - { keyC }</div>
                <div className="must-bottom">
                    <div className="must-number">
                        <span className="icon-course">{ Object.is(type, 'channel') ? obj.topicCount : '单' }课</span>
                        <span className="icon-numb">{ digitFormat(obj.learningNum || 0) }</span>
                    </div>
                    <p 
                    className={ cls }
                    data-log-name={ title }
                    data-log-region="un-must-join"
                    data-log-pos={ idx }
                    onAnimationEnd={ onAnimationEnd } 
                    onClick={ (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleStudyPlan(courId, type, isJoin, true)
                    } }>{ (isJoin || (courId === curId && isAnimite) || joinArr.includes(courId)) ? '已加课表' : '加入课表' }</p>
                </div>
            </div>
        </div>
    )
}

@CourseStatusHoc({
    page: 1,
    size: 4,
    nodeCode:"QL_NZDX_SY_BX", // 必须课
})
@autobind
export default class extends PureComponent{
    handleMoreLink() {
        locationTo(`/wechat/page/university/compulsory-list`)
    }
    render() {
        const { handleStudyPlan, isAnimite, curId,  compulsoryObj, isTitle, btm, ...otherProps } = this.props; 
        return (
            <div className='must-class-box' style={{marginBottom: `${ Number(btm || 48) / 78 }rem`  }}>
                { isTitle && <PublicTitleImprove
                    className='un-must-title'
                    title={ compulsoryObj.title }
                    moreTxt="更多" 
                    region="un-must-more"
                    decs={ compulsoryObj.decs }
                    handleMoreLink={ this.handleMoreLink } /> }
                
                <div className='un-must-list'>
                    { !!compulsoryObj.lists && compulsoryObj.lists.map((item, index) => (
                        <ClassItem
                            { ...item }
                            key={ index } 
                            idx={ index }
                            isAnimite={ isAnimite }
                            curId={ curId }
                            { ...otherProps }
                            handleStudyPlan={ handleStudyPlan } />
                    )) }
                </div>
            </div>
        )
    }
}