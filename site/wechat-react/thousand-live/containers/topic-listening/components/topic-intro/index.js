import React from 'react';
import PropTypes from 'prop-types';
import CollectVisible from 'components/collect-visible';

const TopicIntro = props => {
    return (
        <div className="listen-page-intro-container on-log"
            data-log-region="simplest-intro-btn"
            data-log-name="极简模式课程介绍点击"
            data-log-pos={ props.topicIntro.style }
        >

            {
                props.showBackTuition && 
                <CollectVisible>
                    <section className="topic-intro-row on-visible on-log" data-log-region="returnFee" onClick={ props.openBackTuitionDialog }>
                        <span className="row-label back-tuition">待返学费￥{props.returnMoney}</span>
                        <div className="icon_enter"></div>
                    </section>
                </CollectVisible>
            }

            <section className="topic-intro-row bottom-line" onClick={ props.linkToIntro }>
                <span className="row-label">{(props.isListenBook || props.isFreePublicCourse || props.isNewsTopic) ? '查看音频文稿' : '查看课程介绍'}</span>

                <div className="icon_enter"></div>
            </section>
        </div>
    );
};

TopicIntro.propTypes = {
    topicIntro: PropTypes.object,
    linkToIntro: PropTypes.func,
    channelName: PropTypes.string,
    openBackTuitionDialog: PropTypes.func,
    showBackTuition: PropTypes.bool,
    returnMoney: PropTypes.number
};

export default TopicIntro;