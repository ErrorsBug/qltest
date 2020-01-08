import React, { Component } from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { formatDate, digitFormat, formatMoney, timeAfter, isBeginning, locationTo, getVal } from 'components/util';
import ScoreStar, { CourseEvalText, subScoreType } from 'components/score-star';
import EvaluateItem from './components/evaluate-item';
import { collectVisible } from 'components/collect-visible';
import { LoadStatus } from 'components/scroll-view';
import EmptyPage from 'components/empty-page';


// 评价模块
class Evaluate extends Component {
    componentDidMount() {
        collectVisible();
    }

    onClickEvalNow = () => {
        locationTo(`/wechat/page/evaluation-create/${this.props.topicId}`)
    }

    ifCanEval() {
        if (!this.props.topicId || !this.props.isAuthTopic || this.props.power.allowMGLive || this.props.power.allowSpeak || !this.props.isOpen) return false;

        if (this.props.topicInfo.isAuditionOpen === 'Y') return false;

        if (/normal|ppt/.test(this.props.topicInfo.style)
            && this.props.topicInfo.status !== 'ended'
            && this.props.sysTime - this.props.topicInfo.startTime < 7200000
        ) {
            return false;
        }
        
        return true;
    }

    getEvaluationListObj = () => {
        return this.props.hasValidFilter ? this.props.evaluation.evaluationListValid : this.props.evaluation.evaluationList;
    }

    render() {
        const { evaluationData, isAuth, courseType, reply, removeReply } = this.props
        const evaluationListObj = this.getEvaluationListObj();

        // 分数规则
        let score = evaluationData.score
        // const baseScore = parseInt(score)
        // if (score !== baseScore && score !== baseScore + 0.5) {
        //     if (score > baseScore + 0.5) {
        //         score = baseScore + 1
        //     } else {
        //         score = baseScore + 0.5
        //     }
        // }

        const overallEvaluateList = evaluationData && evaluationData.overallEvaluateList || [];

        return (
            <div className="evaluate-module">
                {
                    evaluationData.evaluateNum > 0 &&
                    <div className="score-profile">
                        <div className="score-details">
                            <div className="total-score">
                                { 
                                    score >= 0 &&
                                    <div className="score">{score}分</div>
                                }
                                <ScoreStar score={score} />
                                <div className="desc"><CourseEvalText score={score} /></div>
                            </div>

                            <div className="sub-score-list">
                            {
                                overallEvaluateList.map((item, index) => {
                                    return <div className="sub-score" key={index}>
                                        <div className="title">{subScoreType[item.type]}</div>
                                        <LineScore score={item.countScore} />
                                    </div>
                                })
                            }
                            </div>
                        </div>

                        <div className="control-wrap">
                            <div className="valid-filter" onClick={this.props.onClickValidFilter}><i className={this.props.hasValidFilter ? 'active' : ''}></i>只看有效评价</div>
                            {
                                this.ifCanEval() &&
                                <span className="btn-eval-now on-log on-visible" 
                                    data-log-region="eval-now"
                                    onClick={this.onClickEvalNow}><i className="icon"></i>立即评价</span>
                            }
                        </div>
                    </div>
                }

                {
                    evaluationListObj.data && !evaluationListObj.data.length
                    ?
                    <div className="evaluate-empty">
                        <div>
                            <EmptyPage mini imgKey="noContent" emptyMessage={this.props.hasValidFilter && evaluationData.evaluateNum > 0 ? '暂无有效评价哦~' : '你的心得就是对我最大的支持~'} />
                            {
                                this.ifCanEval() && !(evaluationData.evaluateNum > 0) &&
                                <div className="btn-eval-now on-log on-visible" 
                                    data-log-region="eval-now"
                                    onClick={this.onClickEvalNow}>立即评价</div>
                            }
                        </div>
                    </div>
                    :
                    [
                        <div className="evaluate-list" key="evaluate-list">
                            {
                                evaluationListObj.data && evaluationListObj.data.map((item, index) => {
                                    return <EvaluateItem 
                                        key={`evaluate-item-${index}`}
                                        index={index}
                                        className="evaluate-item"
                                        item={item}
                                        reply={reply}
                                        removeReply={removeReply}
                                        isAuth={isAuth}
                                        courseType={courseType}
                                        />
                                })
                            }
                        </div>,
                        evaluationListObj.status === 'end' &&
                        <LoadStatus status={evaluationListObj.status}/>
                    ]
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
	return {
        sysTime: state.common.sysTime,
        evaluation: state.evaluation,
        evaluationData: state.evaluation.evaluationData || {},
        power: getVal(state, 'channelIntro.power.liveId') ? state.channelIntro.power : state.topicIntro.power,
        isOpen: state.evaluation.isOpen === 'Y',
        topicId: getVal(state, 'topicIntro.topicInfo.id'),
        topicInfo: getVal(state, 'topicIntro.topicInfo'),
        isAuthTopic: getVal(state, 'topicIntro.isAuthTopic', false),
        isAuthChannel: getVal(state, 'channelIntro.isAuthChannel') === 'Y',
	}
}

const mapActionToProps = {
};

export default connect(mapStateToProps, mapActionToProps)(Evaluate);



class LineScore extends React.PureComponent {
    render() {
        let score = Number(this.props.score) || 0;
        score = score / 5 * 100 + '%';
        return <div className="score"><div style={{width: score}}></div></div>
    }
}