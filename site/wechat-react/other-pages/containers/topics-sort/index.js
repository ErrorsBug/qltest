const isNode = typeof window == "undefined";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router";
import ScrollToLoad from "components/scrollToLoad";
import Page from "components/page";
import TopicList from "./components/topic-list";
import { locationTo, updatePageData, isNumberValid } from "components/util";
// import { share } from 'components/wx-utils';

// actions
import {
  getTopicSort,
  saveTopicSort,
  changeTopicSort
} from "../../actions/topics-sort";

class TopicSort extends Component {
  state = {
    isNoMoreTopicData: false
  };

  componentDidMount() {
    this.getTopicList();
  }

  async changeTopicSort(id, weight) {
    await this.props.changeTopicSort(id, weight);
  }

  async saveTopicSort() {
    let allPass = true;
    allPass = !this.props.topicList.some(item => {
      return item.topicWeight == 0
        ? false
        : !isNumberValid(item.topicWeight, 1, 9999, "课程排序");
    });
    if (this.props.topicList.length === 0) {
      window.toast("暂无课程可排序");
      return;
    }
    if (allPass) {
      const result = await this.props.saveTopicSort(
        this.props.params.liveId,
        this.props.topicList,
        true
      );
      window.toast(result.state.msg);
      if (result.state.code === 0) {
        updatePageData();
        window.history.go(-1);
      }
    }
  }

  async getTopicList(next) {
    // 初始化系列课列表
    // if (this.props.topicList.length < 1) {
    const result = await this.props.getTopicSort(
      this.props.params.liveId,
      this.props.topicPageNum,
      this.props.topicPageSize,
      true
    );
    // }

    next && next();

    // 初始数据不够分页，则结束分页加载更多
    if (
      result &&
      result.data &&
      result.data.topicList.length < this.props.topicPageSize
    ) {
      this.setState({
        isNoMoreTopicData: true
      });
    }
  }

  render() {
    let { topicList } = this.props;
    return (
      <Page title={`课程排序`} className="topic-sort">
        <ScrollToLoad
          className="sort-box"
          toBottomHeight={100}
          loadNext={this.getTopicList.bind(this)}
          noMore={this.state.isNoMoreTopicData}
        >
          <span className="top-tips">
            1在框内输入数字排序，数字越大越靠前，数字为0时则按默认排序（最早排前）
          </span>
          <TopicList
            items={topicList}
            changeTopicSort={this.changeTopicSort.bind(this)}
          />
        </ScrollToLoad>
        <div className="btn-box">
          <a
            className="btn-save"
            href="javascript:;"
            onClick={this.saveTopicSort.bind(this)}
          >
            保存
          </a>
        </div>
      </Page>
    );
  }
}

TopicSort.propTypes = {};
// export default TopicSort;

function mapStateToProps(state) {
  return {
    topicList: state.topicListSort.topicList,
    topicPageSize: state.topicListSort.topicPageSize,
    topicPageNum: state.topicListSort.topicPageNum
  };
}

const mapActionToProps = {
  getTopicSort,
  saveTopicSort,
  changeTopicSort
};

module.exports = connect(
  mapStateToProps,
  mapActionToProps
)(TopicSort);
