/**
 * Created by dylanssg on 2017/5/8.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Page from 'components/page';
import Stars from '../components/stars';
import ReactDOM from 'react-dom'
import ScoreStar, { CourseEvalText, subScoreType } from 'components/score-star';
import { collectVisible } from 'components/collect-visible';


import {
    create,
    getEvaluation
} from '../../../actions/evaluation';


/*
@props
type = "channel" || "topic"
title: String
*/

class EvaluationCreate extends Component {
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        const res = await this.props.getEvaluation(this.props.params.topicId) || {};
        if (res.evaluateStatus === 'DONE') {
            if (res.isOpenEvaluate === 'N') {
                window.toast('无评价权限');
            }
            this.setState({
                currentSelectedScore: res.evaluateScore,
                inputText: res.evaluateContent.replace(/\r|\n/, ' '),
                wordCount: res.evaluateContent && res.evaluateContent.length || 0,
                isOpenEvaluate: res.isOpenEvaluate !== 'N',
            })
        }
        this.setState({
            overallEvaluateList: res.overallEvaluateList || [],
        }, () => {
            collectVisible();
        })
    }

    state = {
        currentSelectedScore: 0,
	    mood: ['请给课程打分~', '不满意','一般','很不错啊','非常满意', '无可挑剔'],
	    maxTitleLength: 15,
        inputText: '',
        wordCount: 0,
        isOpenEvaluate: true,

        overallEvaluateList: [],
    };

    async commit(e) {
        if (!this.state.isOpenEvaluate) {
            window.toast('无评价权限');
            return false;
        }

        if(!this.state.currentSelectedScore) {
            window.toast('请给课程打分');
            return false;
        }else if(!this.state.inputText) {
            window.toast('请填写课程评价');
	        return false;
        }

        let result = await this.props.create({
            topicId: this.props.params.topicId,
	        score: this.state.currentSelectedScore,
	        content: this.state.inputText,
            labelKeyList: [],
            overallEvaluateList: this.state.overallEvaluateList,
        });

        if(result.state.code == 0){
            window.toast('发布成功', 3000);
            setTimeout(() => {
                // history.replaceState(null,null,`/wechat/page/topic-evaluation-list/${this.props.params.topicId}`);
                history.back()
            },3000);
        }


    }

    onGrade(score) {
	    this.setState({ 
            currentSelectedScore: score
        }, () => {
            collectVisible();
        })
    }

    reSize() {
        ReactDOM.findDOMNode(this).getBoundingClientRect()
    }

	inputHandle(e) {
        const state = {}
        let val = e.target.value.replace(/\r|\n/, ' ')
        if(val.length <= 200) {
            state.inputText = val
            state.wordCount = val.length
        } else {
            state.inputText = val.slice(0, 200)
            state.wordCount = 200
        }
        this.setState(state)
    }

    onEditSubScore = (type, score) => {
        const overallEvaluateList = this.state.overallEvaluateList.map(item => {
            if (item.type === type) {
                return {
                    ...item,
                    score,
                };
            }
            return item
        })
        this.setState({overallEvaluateList})
    }

    render() {
        const {currentSelectedScore, mood, inputText, wordCount} = this.state
        return (
            <Page title="课程评价" className='evalu-create' ref='page'>
                <header>
                    <ScoreStar 
                        score={currentSelectedScore}
                        isEditing={this.state.isOpenEvaluate}
                        onEdit={(score) => { this.onGrade(score)}}
                        />
                    
                    <span 
                        className={ `commit-btn on-log ${currentSelectedScore > 0 && inputText ? '' : 'disable'}` }
                        data-log-region="evaluate-release"
                        onClick={this.commit.bind(this)}>发布</span>
                </header>
                <div className={`mood${currentSelectedScore > 0 ? ' satisfy' : ''}`}>{currentSelectedScore > 0 ? `${currentSelectedScore}分 ` : ''}
                    {
                        currentSelectedScore == 0 ?
                        '给课程打个分吧~' :
                        <CourseEvalText score={currentSelectedScore} />
                    }
                </div>
                
                <div className="evalu-textarea-container">
                    <textarea className="evalu-textarea" value={inputText} placeholder='本节课的内容、讲师等方面给你留下了怎样的印象？是否值得推荐给朋友听？说说你的听课心得吧~' onChange={this.inputHandle.bind(this)} disabled={!this.state.isOpenEvaluate}/>
                    <p className="word-count">{wordCount < 200 ? wordCount + '/200字' : '最多200字哦亲'}</p>
                </div>

                {
                    currentSelectedScore > 0 &&
                    <div className="sub-score-list">
                    {
                        this.state.overallEvaluateList.map((item, index) => {
                            return <SubScore key={index}
                                name={subScoreType[item.type]}
                                type={item.type}
                                score={item.score}
                                onEdit={s => this.onEditSubScore(item.type, s)}
                            />
                        })
                    }
                    </div>
                }

                <div className="source on-log" data-log-region="evaluate-course-info" onClick={() => location.href = `/wechat/page/topic-intro?topicId=${this.props.params.topicId}`}>
                    <p className="title">课程：{this.props.evaluationData.topicName}</p>
                    <div className="redirect"></div>
                </div>
            </Page>
        );
    }
}



module.exports = connect((state) => {
	return {
		evaluationData: state.evaluation.evaluationData,
		userPower: state.evaluation.userPower,
		labelList: state.evaluation.labelList,
		isEvaluated: state.evaluation.isEvaluated
	}
}, {
    create,
    getEvaluation
})(EvaluationCreate);



class SubScore extends React.PureComponent {
    render() {
        return <div className="sub-score">
            <span className="name">{this.props.name}</span>
            <div className="score-pic">
                <ScoreStar score={this.props.score} isEditing={true} onEdit={this.props.onEdit}
                    rewriteStyle={true}
                    className="score-expr on-log on-visible"
                    attrs={{
                        'data-log-region': this.props.type,
                        'data-log-pos': 'score',
                    }}
                />
            </div>
            <span className="text">{this.getEvalText()}</span>
        </div>
    }

    getEvalText() {
		let score = Number(this.props.score) || 0;
		score > 5 && (score = 5);
		score < 0 && (score = 0);
		score = Math.round(score);
		return SubScore.evalTextMap[score];
	}

	static evalTextMap = ['', '不佳', '一般', '不错', '满意', '超棒']
}
