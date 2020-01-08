import React, { PureComponent } from 'react'
import { autobind } from 'core-decorators'
import ReactSwiper from 'react-id-swiper'
import Picture from 'ql-react-picture';
import PublicTitleImprove from '../../../../components/public-title-improve'
import {
    digitFormat,
    locationTo,
  } from 'components/util';
import StudyPlanBtn from '../../../../components/study-plan-btn' 
import CourseStatusHoc from '../../../../components/course-status-hoc'

const CourseItem = ({id, title, keyA, keyB, keyC, keyD, topicId, channelId, liveTopicPo, liveChannelPo, liveEntityPo, idx,courseId, ...otherProps }) => {
    const obj = liveTopicPo || liveChannelPo || liveEntityPo || {};
    let url = '';
    if(!!topicId) {
        url = `/wechat/page/topic-intro?topicId=${ topicId }&isUnHome=Y`
    } else {
        url = `/wechat/page/channel-intro?channelId=${ channelId }&isUnHome=Y`
    } 
    return (
        <div className="un-new-item on-log on-visible" 
            data-log-name={ title }
            data-log-region="un-new-item"
            data-log-pos={ topicId||channelId } 
            data-log-index={ idx }
            onClick={ () => locationTo(url) }
            >
            <div className="img"><Picture src={ keyB || 'https://img.qlchat.com/qlLive/business/H1D39EOM-X1J5-D55H-1560499366683-6HOJMIUXELV7.png' }/></div>
            <div className="un-new-info">
                <div className="un-new-item-top"> 
                    <p className="un-new-name">{ keyA }</p>
                </div>
                <h4>{ title }</h4>
                <div className="un-new-item-bottom"> 
                    <div className="un-new-numb">
                        <span>{ keyC }</span>
                    </div>
                    <StudyPlanBtn  
                        isHome
                        region="un-books-join" 
                        topicId={ topicId || courseId }  
                        channelId={channelId}
                        { ...otherProps } />
                </div>
            </div>
        </div>
    )
}


@CourseStatusHoc({
    page: 1,
    size: 5,
    nodeCode:"QL_NZDX_SY_HK", // 新课
    isNewBooks: true,
})
@autobind
export default class extends PureComponent{
    render() {
        const { title, decs, isTitle, newBooksObj, btm, ...otherProps } = this.props;
        const { lists = [] } = newBooksObj 
        return (
            <div className='un-new-box' style={{marginBottom: `${ Number(btm || 48) / 78 }rem`  }}>
                { isTitle && <PublicTitleImprove
                    className='un-new-title'
                    title={ title }
                    decs={ decs } /> }
                <div className='un-new-list'>
                    { lists.length>0 && (
                        <div className='un-new-list-container'> 
                            { lists.map((item, index) => (
                                <CourseItem idx={index} { ...item }  key={ index } { ...otherProps }/> 
                            )) }
                        </div>
                    ) }
                </div>
            </div>
        )
    }
}