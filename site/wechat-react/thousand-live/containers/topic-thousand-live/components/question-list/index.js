import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind, debounce, throttle } from 'core-decorators';
import ScrollToLoad from 'components/scrollToLoad';
import classNames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { fixScroll } from 'components/fix-scroll';

@autobind
class QuestionList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isNoMore: false, //是否还有更多
        }
    }

    componentDidMount() {
        fixScroll(".question-scroll-box");
    }

    dangerHtml(content){
        if (content) {
            content = content.replace(/\</g, (m) => "&lt;");
            content = content.replace(/\>/g, (m) => "&gt;");
            content = content.replace(/&lt;br\/&gt;/g, (m) => "<br/>");
        }

        return { __html: content }
    };

    async loadNextQuestions(next) {
        const lastIndex = this.props.questionList.length - 1;
        const timestamp = this.props.questionList[lastIndex].createTime;
        const result = await this.props.appendQuetionList(this.props.topicId, timestamp);
        if (result.length < 10) {
            this.setState({
                isNoMore: true,
            })
        }

        next&&next();
    }

    handleQuetionClick(question) {
        this.props.hideQuestionList();
        this.props.onFeedback({id:question.id,name:question.content,type:'replyQuestion'},true);
    }

    render() {
        let repliedQuestionList = [];
        let unrepliedQuestionList = [];
        this.props.questionList.forEach(function(question) {
            if ( question.isReply === 'Y') {
                repliedQuestionList.push(question);
            } else {
                unrepliedQuestionList.push(question);
            }
        }, this);
        const filteredQuestionList = [...repliedQuestionList, ...unrepliedQuestionList];
        const questions = filteredQuestionList.map((question, index) => {
            return (
                <li key={question.id} className="question-item" onClick={(e) => { e.preventDefault(); e.stopPropagation();  this.handleQuetionClick(question)} }>
                    <p>
                        { question.isReplay === 'Y' && <span className="replied">已回答</span> }
                        <span dangerouslySetInnerHTML={this.dangerHtml(question.content)}></span>
                    </p>
                </li>
            );
        });

        const questionListClass = classNames({
            'question-list': true,
        });

        return (
            <div className={ questionListClass }>
                <div className="blank-area" onClick={this.props.hideQuestionList}></div>
                <div className="header" onClick={this.props.hideQuestionList}>
                    <span className="icon_down"></span>
                    <p>问题区</p>
                    <p>点击问题快速回复</p>
                </div>
                <div className="list-box">
                    <ScrollToLoad
                        className={"question-scroll-box"}
                        toBottomHeight={300}
                        noneOne={this.props.questionList.length === 0}
                        notShowLoaded = {false}
                        loadNext={ this.loadNextQuestions }
                        noMore={ this.state.isNoMore } >
                        <ReactCSSTransitionGroup
                            transitionName="thousand-live-animation-listItem"
                            transitionEnterTimeout={500}
                            transitionLeaveTimeout={500}>
                            { questions }
                        </ReactCSSTransitionGroup>
                    </ScrollToLoad>
                </div>
            </div>
        );
    }
}

QuestionList.propTypes = {

};

export default QuestionList;
