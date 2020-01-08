import React, { Component } from "react";
import { connect } from "react-redux";
import Page from "components/page";
import { autobind } from "core-decorators";
import { locationTo, getCookie } from "components/util";
import { share } from 'components/wx-utils';
import { getUrlParams, fillParams } from 'components/url-utils'
import TabLift from './components/tab-left'
import CourseLists from './components/course-lists'
import { getMenuNode } from '../../actions/books'


@autobind
class BooksAll extends Component {
    state = {
        curId: this.tagId || ''
    }
    get tagId() {
        return getUrlParams('tagId', '')
    }
    componentWillMount() {
        this.initData();
    }
    async initData(){
        const { data } = await getMenuNode({ nodeCode: 'QL_LB_HOME' })
        const obj = data?.menuNode || {};
        this.initShare(obj)
    }
    initShare({ keyA, keyB, keyC, keyD }) {
        let title = keyA;
        let desc = keyB; 
        let shareUrl = keyD
        let imgUrl = keyC
        share({
            title: title,
            timelineTitle: title,
            desc: desc,
            timelineDesc: desc,
            imgUrl: imgUrl,
            shareUrl: shareUrl
        });
    }
    handleSelectCategory(value) {
        this.setState({
            curId: value
        })
    }
    render() {
        const { curId } = this.state;
        return (
            <Page title={'全部书籍'} className="ba-books-all">
                <TabLift handleSelectCategory={ this.handleSelectCategory } curId={ curId } /> 
                { curId && <CourseLists curId={ curId } /> }
            </Page>
        );
    }
}

function mapStateToProps(state) {
    return {
        
    };
}

const mapActionToProps = {
  
};

module.exports = connect(
)(BooksAll);
