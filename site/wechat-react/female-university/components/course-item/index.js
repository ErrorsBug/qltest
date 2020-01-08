import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import Picture from 'ql-react-picture';
import LearnInfo from '../learn-info';
import { locationTo } from 'components/util';
import RankStatus from '../rank-status'
import classnames from 'classnames' 
import CsItemCate from './cs-item-cate'

@autobind
export default class extends PureComponent {
    render() {
        const { className='', isShowCate,isShowItemCate, tagCName, title, headImgUrl, teacher, label, topicId, channelId, keyA, keyB, keyC,
            courseId, courseType, resize={ w: 172, h: 196}, id, idx, isShowRank, handleJump, ...otherProps } = this.props;
        let url = '';
        if(!!topicId || Object.is(courseType, 'topic')) {
            url = `/wechat/page/topic-intro?topicId=${ topicId || courseId }&isUnHome=Y`
        } else {
            url = `/wechat/page/channel-intro?channelId=${ channelId || courseId }&isUnHome=Y`
        }
        const rankCls = classnames({
            'one': idx === 0,
            'two': idx === 1,
            'three': idx === 2,
        }) 
        return (
            <div className={ `cs-item-box on-log on-visible ${ className }` } 
                data-log-name={ title }
                data-log-region="un-course-item"
                data-log-pos={ topicId||channelId||courseId }
                data-log-index={ idx }
                onClick={ () => {
                    handleJump && handleJump();
                    locationTo(url)
                } }>
                <div className="cs-item-pic">
                    <div className="cs-item-img"><Picture src={ headImgUrl || keyA || '' } resize={resize} placeholder={ false }  /></div>
                    { isShowCate && <p>{ tagCName }</p> }
                    { isShowRank && <RankStatus rankNum={ `NO.${ idx + 1 }` } className={ rankCls } /> }
                </div>
                <div className="cs-item-g">
                    <div className="cs-item-info">
                        <h3 dangerouslySetInnerHTML={{__html:title }}></h3>
                        <p dangerouslySetInnerHTML={{__html:`${ teacher || keyB }-${ label || keyC }` }}></p>
                    </div>
                    {
                        isShowItemCate && <CsItemCate {...otherProps} tagCName={tagCName}/>
                    }
                    
                    <LearnInfo 
                        isCourse 
                        channelId={ channelId } 
                        topicId={ topicId } 
                        courseType={ courseType }
                        courseId={ courseId }
                        id={ id } 
                        region="un-course-join" 
                        { ...otherProps } />
                </div>
            </div>
        )
    }
}