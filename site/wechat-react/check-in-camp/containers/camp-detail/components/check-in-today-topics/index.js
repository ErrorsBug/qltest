import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getVal, locationTo } from 'components/util';
import { autobind } from 'core-decorators';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

@autobind
export class TodayTopics extends Component {
    static propTypes = {

    }

    constructor(props) {
        super(props)
        
        this.state = {
            currentActiveIndex: 0,
        }
    }
    
    componentDidMount() {
        this.initBannerTimer();
    }
    
    initBannerTimer() {
        this.timer = setInterval(()=>{
            let curIdx = this.state.currentActiveIndex;
            const nextIdx = curIdx >= this.props.todayTopicList.length - 1 ? 0 : curIdx + 1;
            this.setState({currentActiveIndex: nextIdx})
        },5000) 
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    handleClick(topicId) {
        locationTo(`/topic/details?topicId=${topicId}`)
    }


    getCurrentTopic () {
        const todayTopic = this.props.todayTopicList[this.state.currentActiveIndex] || {};
        const { backgroudUrl = '', topicName = '', topicId }  = todayTopic;
        return (
            <div className="banner-area" onClick={() =>this.handleClick(topicId)} key={this.state.currentActiveIndex}>
                <div className="head-img common-bg-img" style={{backgroundImage:`url(${backgroudUrl})`}}></div>
                <div className="topic-name common-multi-text">{topicName}</div>
            </div>
        )
    }

    render() {
        const { isEnd, isBegin } = this.props.dateInfo;
        if (isEnd === 'Y' || isBegin !== 'Y') {
            return null
        }

        if (this.props.todayTopicList.length === 0) {
            // return (
            //     <div className="today-topic-container-empty"></div>
            // )
            return null
        }

        const todayTopic = this.props.todayTopicList[this.state.currentActiveIndex] || {};
        const { backgroudUrl = '', topicName = '' }  = todayTopic;
        return (
            <div className="today-topic-container">
                <div className="title-area">
                    <span className="lines">//</span>
                    <span className="title">今日主题</span>
                    <span className="lines">//</span>
                </div>
                <div className="topic-content">
                <ReactCSSTransitionGroup
                    transitionName="today-topic"
                    transitionEnterTimeout={600}
                    transitionLeaveTimeout={600}
                >  
                    {   this.getCurrentTopic() }
                </ReactCSSTransitionGroup>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    todayTopicList: getVal(state, 'campTopics.todayTopicList'),
    dateInfo: getVal(state, 'campBasicInfo.dateInfo'),
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(TodayTopics)
