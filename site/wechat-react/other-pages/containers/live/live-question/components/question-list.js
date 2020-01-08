import React from 'react';
import PropTypes from 'prop-types';
import { locationTo, imgUrlFormat } from 'components/util';

const QuestionItem = (props) => {
    return (
        <div className='question-item'>
            <div className='user-info-row'>
                <img src={ imgUrlFormat(props.headImgUrl, '@160w_160h_1e_1c_2o') }
                    onClick={ () => locationTo(`/live/whisper/ask.htm?u=${ props.userId }`) } />
                <div className='user-base-info-row'>
                    <span className='user-name elli-text'>{ props.name }</span>
                    <span className='auth-info'>{ props.introduce }</span>
                </div>
                {
                    props.isWhisperOpen == 'Y' ?
                            props.isMine ?
                                <div className='do-question' onClick={ () => locationTo(`/live/whisper/setPersonAuth.htm?userId=${ props.userId }`) }>
                                    <span>设置</span>
                                </div>
                                :
                                <div className='do-question' onClick={ () => locationTo(`/live/whisper/ask.htm?u=${ props.userId }&topicId=${ props.topicId || 0 }`) }>
                                    <span>向TA提问</span>
                                </div>
                        :
                            props.isMine ?
                                <div className='do-question' onClick={ () => locationTo(`/live/whisper/setPersonAuth.htm?userId=${ props.userId }`) }>
                                    <span>开启</span>
                                </div>
                                :
                                <div className='no-open-whisper'>
                                    <span>暂未开启私问</span>
                                </div>
                }
            </div>

            <div className='question-info'>
                <p className='question-stat'>
                    回答了{ props.answerNum }个问题，{ props.listenNum }人收听
                </p>

                {
                    props.topicId &&
                        <p className='neweast-course' onClick={ () => locationTo(`/topic/details?topicId=${props.topicId}`) }>
                            <span className='course-name-left'>最近课程：《</span>
                            <span className='course-name'>{ props.topic }</span>
                            <span className='course-name-right'>》</span>
                        </p>
                    //     :
                    // props.power.allowMGLive ?
                    //     <p className='neweast-course' onClick={ () => locationTo(`/wechat/page/topic-create?liveId=${props.liveId}`) }>暂无回答内容，前往创建话题</p>
                    //     :
                    //     <p className='neweast-course'>暂无回答内容</p>
                }
            </div>
        </div>
    )
}

const QuestionList = props => {
    return (
        <div className='question-list'>
            {
                props.list.map((item, index) => (
                    <QuestionItem 
                        key={ `question-item-${index}` }
                        isMine={ props.curUserId == item.userId }
                        power={ props.power }
                        liveId={ props.liveId }
                        {...item}
                    />
                ))
            }
        </div>
    );
};

export default QuestionList;
