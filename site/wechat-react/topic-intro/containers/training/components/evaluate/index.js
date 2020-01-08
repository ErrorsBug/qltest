import React, { Component } from 'react';
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
    

    render() {
        const { 
            evaluationData,
            evaluationListObj,
            isAuth, 
            courseType,
        } = this.props

        // 分数规则
        let score = evaluationData.score
        const baseScore = parseInt(score)
        if (score !== baseScore && score !== baseScore + 0.5) {
            if (score > baseScore + 0.5) {
                score = baseScore + 1
            } else {
                score = baseScore + 0.5
            }
        }
        const overallEvaluateList = evaluationData && evaluationData.overallEvaluateList || {};
    
        return (
            <div className="evaluate-module-v2">
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
                                Object.keys(overallEvaluateList).map((item, index) => {
                                    return <div className="sub-score" key={index}>
                                        <div className="title">{subScoreType[item]}</div>
                                        <LineScore score={overallEvaluateList[item]} />
                                    </div>
                                })
                            }
                            </div>
                        </div>

                        <div className="control-wrap">
                            <div className="valid-filter" onClick={this.props.onClickValidFilter}>
                            <i className={this.props.hasValidFilter == 'valid' ? 'active' : ''}></i>只看有效评价</div>
                        </div>
                    </div>
                }

                {
                    evaluationListObj && !evaluationListObj.length
                    ?
                    <div className="evaluate-empty">
                        <div>
                            <EmptyPage mini imgKey="noContent" emptyMessage={this.props.hasValidFilter == 'valid' && evaluationData.evaluateNum > 0 ? '暂无有效评价哦~' : '你的心得就是对我最大的支持~'} />
                        </div>
                    </div>
                    :
                    [
                        <div className="evaluate-list" key="evaluate-list">
                            {
                                evaluationListObj && evaluationListObj.map((item, index) => {
                                    return <EvaluateItem 
                                        key={`evaluate-item-${index}`}
                                        index={index}
                                        className="evaluate-item"
                                        item={item}
                                        reply={this.props.replyHandle}
                                        removeReply={this.props.removeReplyHandle}
                                        isAuth={isAuth}
                                        courseType={courseType}
                                        />
                                })
                            }
                        </div>,
                        // evaluationListObj.status === 'end' &&
                        // <LoadStatus status={evaluationListObj.status}/>
                    ]
                }
            </div>
        )
    }
}

export default Evaluate;



class LineScore extends React.PureComponent {
    render() {
        let score = Number(this.props.score) || 0;
        score = score / 5 * 100 + '%';
        return <div className="score"><div style={{width: score}}></div></div>
    }
}