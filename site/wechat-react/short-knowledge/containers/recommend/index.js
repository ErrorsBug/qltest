import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';

import TabView from 'components/tab-view/v2';
import CurrentCourse from './components/current-course/index';
import OtherPush from './components/other-push/index';



class PageContainer extends Component {
    state = {
        tabs: [
            {
                name: '课程',
                businessType: 'course',
            },
            {
                name: '其他',
                businessType: 'other',
            },
        ],
        activeTabIndex: 0,
        checkedIndex: undefined,

        courseCount: 0,
        courseListMap: {
        },
        selectType: this.props.location.query.selectType || '',
        selectId: this.props.location.query.selectId || ''
    }

    componentDidMount() {

        let index = 0;
        this.onClickTab(index);
    }

    render() {

        return (
            <Page title="设置推广内容" className="p-sk-recom">

                <TabView
                    config={this.state.tabs}
                    activeIndex={this.state.activeTabIndex}
                    onClickItem={this.onClickTab}
                />

                {
                    this.state.activeTabIndex === 0 &&
                    <CurrentCourse knowledgeId={this.props.location.query.knowledgeId} liveId = {this.props.location.query.liveId} selectId = {this.state.selectId} selectType = {this.state.selectType} />
                }
                {
                    this.state.activeTabIndex === 1 &&
                    <OtherPush knowledgeId={this.props.location.query.knowledgeId} liveId = {this.props.location.query.liveId} selectId = {this.state.selectId} selectType = {this.state.selectType} />
                }
            </Page>
        )
    }


    onClickTab = index => {
        this.setState({
            activeTabIndex: index
        })
    }

    
}



export default connect(state => {
    return state;
}, {
})(PageContainer)