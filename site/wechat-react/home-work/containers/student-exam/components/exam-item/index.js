import React, { Component, PureComponent } from 'react';

import './style.scss'
import errorCatch from 'components/error-boundary/index';
import { autobind } from 'core-decorators';
import {
	dangerHtml
} from 'components/util';

export default class ExamItem extends PureComponent {

    check (idx) {
        this.props.onCheck && this.props.onCheck(idx)
    }

    judgeType () {
        const {
            usersAnswer,
            data
        } = this.props

        if (this.props.form === 'analysis') {
            return (
                <React.Fragment>
                    <div className={`item-content-option ${
                        data.rightAnswers === 'Y' ? 
                        usersAnswer === 'Y' ? 'check' : 'miss'
                        :
                        usersAnswer === 'Y' ? 'error' : ''
                    }`}>
                        <p><span>A、</span>正确</p>
                    </div>
                    <div className={`item-content-option ${
                        data.rightAnswers === 'N' ?
                        usersAnswer === 'N' ? 'check' : 'miss'
                        :
                        usersAnswer === 'N' ? 'error' : ''
                    }`}>
                        <p><span>B、</span>错误</p>
                    </div>
                </React.Fragment>
            )
        }

        return (
            <React.Fragment>
                <div onClick={() => this.check('Y')} className={`item-content-option ${usersAnswer === 'Y' ? 'check' : ''}`}>
                    <p><span>A、</span>正确</p>
                </div>
                <div onClick={() => this.check('N')} className={`item-content-option ${usersAnswer === 'N' ? 'check' : ''}`}>
                    <p><span>B、</span>错误</p>
                </div>
            </React.Fragment>
        )
    }

    otherType () {
        const {
            data,
            usersAnswer
        } = this.props

        if (this.props.form === 'analysis') {
            return data.answerList && data.answerList.length > 0 ? 
                    data.answerList.map((answer, index) => (
                        <div key={`answer-${index}`} className={`item-content-option ${
                            data.rightAnswers && data.rightAnswers.indexOf(answer.title) > - 1 ? 
                            usersAnswer && usersAnswer.indexOf(answer.title) > - 1 ? 'check' : 'miss'
                            :
                            usersAnswer && usersAnswer.indexOf(answer.title) > - 1 ? 'error' : ''
                        }`}>
                            <p><span>{answer.title}、</span>{answer.content}</p>
                        </div>
                    )) : null
        }

        return data.answerList && data.answerList.length > 0 ? 
                    data.answerList.map((answer, index) => (
                        <div key={`answer-${index}`} onClick={() => this.check(answer.title)} className={`item-content-option ${usersAnswer && usersAnswer.indexOf(answer.title) > - 1 ? 'check' : ''}`}>
                            <p><span>{answer.title}、</span>{answer.content}</p>
                        </div>
                    )) : null
    }

    render () {
        const {
            data,
            currIndex,
            maxLength
        } = this.props

        let typeStr = ''

        switch (data.type) {
            case 'multi':
                typeStr = '多选题'
                break
            case 'judge':
                typeStr = '判断题'
                break
            case 'single':
                typeStr = '单选题'
                break
        }

        return (
            <div className="exam-item">
                <div className="exam-item-header">
                    {
                        this.props.form === 'analysis' ? 
                        <p><span>第{currIndex+1}题</span>
                        {
                            data.type === 'multi' ?
                            typeStr && <span className="exam-item-type">（<s>{typeStr}</s>&nbsp;&nbsp;分值{data.score}分）</span>
                            :
                            `（${typeStr}，分值${data.score}分）`
                        }
                        </p>
                        :
                        <p><span>第{currIndex+1}题</span>
                        {
                            typeStr ?
                            <span className="exam-item-type">（<s>{typeStr}</s>）</span>
                            :
                            `（${typeStr}）`
                        }
                        </p>
                    }
                    <p><span>{currIndex+1}</span>/{maxLength}</p>
                </div>

                <div className="exam-item-content">
                    <p className="item-content-title">{data.title}</p>
                    
                    { data.type === 'judge' ? this.judgeType() : this.otherType() }

                    { this.props.form === 'analysis' && <AnalysisContent data={data} text={data.analysis} /> }
                </div>
            </div>
        )
    }
}

@errorCatch
@autobind
class AnalysisContent extends Component {
    state = {
        isHandle: false, // 是否处理过 锁机制
        isShrink: false, // 是否显示展开
        isOpen: false, // 是否展开
    }
    componentWillReceiveProps (nextProps) {
        if (this.props.text !== nextProps.text) {
            this.setState({
                isHandle: false,
                isShrink: false,
                isOpen: false,
            })
        }
    }

    ellipsis (dom, type) {
        if (type === 'content') {
            this.contentDom = dom
        }
        if (type === 'box') {
            this.boxDom = dom
        }

        if (this.boxDom && this.contentDom && !this.state.isHandle) {
            if (this.contentDom.offsetHeight > this.boxDom.offsetHeight) {
                this.setState({
                    isShrink: this.contentDom.offsetHeight > this.boxDom.offsetHeight,
                    isHandle: true
                })
            } else {
                this.setState({
                    isHandle: true
                })
            }
        }
    }

    toggleOpen () {
        const isOpen = !this.state.isOpen
        this.setState({
            isOpen
        })
    }

    render () {
        const {
            text
        } = this.props
        const {
            isHandle,
            isShrink,
            isOpen
        } = this.state
        return (
            <div className="analysis-content">
                <p className="answer">答案：{
                    this.props.data.type === 'judge' ? 
                    this.props.data.rightAnswers === 'Y' ? '正确' : '错误'
                    :
                    this.props.data.rightAnswers
                }</p>
                <div 
                    className={`speak-content ${isHandle ? (isShrink ? (isOpen ? '' : 'ellipsis') : '') : 'normal'}`} 
                    ref={ dom => this.ellipsis(dom, 'box') }>
                    <div ref={ dom => this.ellipsis(dom, 'content') } dangerouslySetInnerHTML={dangerHtml(text.replace(/\n/g,'<br/>'))}></div>
                </div>  
                {
                    isShrink && (
                        isOpen ? <span className="shrink" onClick={this.toggleOpen}>收起</span> : <span className="shrink" onClick={this.toggleOpen}>全部</span>
                    )
                }
            </div>
        )
    }
}