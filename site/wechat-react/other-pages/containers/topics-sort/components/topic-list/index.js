import React, { Component } from "react";
import PropTypes from "prop-types";
// actions

class TopicList extends Component {
  async changeSort(e) {
    var id = e.currentTarget.dataset.id;
    var weight = e.currentTarget.value;

    this.props.changeTopicSort(id, weight);
  }
  render() {
    var itemLi = this.props.items.map((item, index) => {
      return (
        <li key={index}>
          <div className="topic-img">
            <img src={`${item.backgroundUrl}`} />
          </div>
          <div className="topic-title elli">{item.topic}</div>
          <div className="topic-Num">
            <input
              type="text"
              value={item.topicWeight}
              data-id={item.id}
              onChange={this.changeSort.bind(this)}
            />
          </div>
        </li>
      );
    });

    return <ul className="topic-list">{itemLi}</ul>;
  }
}

TopicList.propTypes = {};

export default TopicList;
