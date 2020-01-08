import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'

import Page from 'components/page'
import { QuestionList } from './components/question-list'
import ScrollToLoad from 'components/scrollToLoad'

import { fetchQuestionList} from 'studio_actions/my-question'

@autobind
class MyQuestion extends Component {

    state = {
        page: 1,
        size: 20,
        noMore:false,
        noneOne:false,
        questionList:[]
    }

    get liveId(){
        return this.props.params.liveId
    }

    componentDidMount() {
        this.loadQuestionList()    
    }

    async loadQuestionList(next) {
        const result = await this.props.fetchQuestionList({
            liveId: this.liveId,
            page: this.state.page,
            size:this.state.size,
        })

        if (result.state.code === 0) {
            let { questionList, page, size } = this.state
            page++
            questionList = questionList.concat(result.data.questions)

            this.setState({ questionList, page })
            if (questionList.length < size) {
                this.setState({
                    noMore: true,
                })
            }
            if(result.data.questions.length == 0 && this.state.questionList.length == 0){
                this.setState({
                    noneOne:true,
                    noMore:false,
                })
            }
        }

        next && next()
    }

    render() {
        return (
            <Page title='我的提问'>
            <div className='live-studio-my-question'>

                {/* <div className="count">已提问{this.props.count}个</div> */}
                <ScrollToLoad
                    toBottomHeight={600}
                    loadNext={this.loadQuestionList}
                    noMore={this.state.noMore}
                    noneOne={this.state.noneOne}
                    className={/* 'scroll-container' */''}
                >
                <QuestionList list={this.state.questionList}></QuestionList>
                </ScrollToLoad>
            </div>
            </Page>
        );
    }
}

function msp(state) {
    return {
    }
}

const map = {
    fetchQuestionList,
}

export default connect(msp, map)(MyQuestion);
