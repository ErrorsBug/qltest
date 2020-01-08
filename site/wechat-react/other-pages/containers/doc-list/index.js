const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ScrollToLoad from 'components/scrollToLoad';
import Page from 'components/page';
import { locationTo ,updatePageData,isNumberValid} from 'components/util';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

// actions
import {getTopicSort,saveTopicSort,changeTopicSort} from '../../actions/topic-list-sort';

@graphql(gql`
    query {
        getList(page: 1, size: 10) {
            name,
            price
        }
    }
`)
class DocList extends Component {

    componentDidMount() {
    };

    render() {
        // const { getList } = this.props.data;
        // console.log(getList);
        console.log('call render!!!');
        return (

            <Page title={`共享文件`} className="doc-list-page">
                {
                    !this.props.data.loading && this.props.data.getList.map((item,id) => (
                        <div key={`hahahee--${id}`}>{item.name}</div>
                    ))
                }
                {/*
                <ScrollToLoad
                    className="sort-box"
                    toBottomHeight={100}
                    loadNext={ this.getTopicList.bind(this) }
                    noMore={ this.state.isNoMoreTopicData } >
                    <span  className="top-tips">在框内输入数字排序，数字越大越靠前，数字为0时则按默认排序（最早排前）</span>
                    <TopicList
                        items={ topicList }
                        changeTopicSort = {this.changeTopicSort.bind(this)}
                    />
                </ScrollToLoad>
                <div className="btn-box">
                    <a className="btn-save" href="javascript:;" onClick={this.saveTopicSort.bind(this)}>保存</a>
                </div>
                */}
            </Page>
        );
    }
}

DocList.propTypes = {

};

function mapStateToProps (state) {
    return {
    }
}

const mapActionToProps = {
}

module.exports = connect(mapStateToProps, mapActionToProps)(DocList);
