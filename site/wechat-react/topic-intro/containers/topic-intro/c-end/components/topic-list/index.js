import React, { Component } from 'react';
import PropTypes from 'prop-types';
// utils
import { getVal, locationTo} from 'components/util';

import TopicItem from './topic-item';
class TopicList extends Component {
    render() {
        return (
            <div className='intro-page-topic-list-container'
                ref={this.props.topicListRef}
            >
                <div className="title-bar" onClick={()=>{locationTo(`/wechat/page/live/${this.props.liveId}${this.props.auditStatus ? '?auditStatus=' + this.props.auditStatus : ''}`)}}>更多课程</div>
                {
                    getVal(this.props, 'topicList', []).filter(item => item.id != this.props.topicId).map((item, index) => {
                        if ( index < 5) {
                            return (<TopicItem
                            key={ `topic-item-${index}` }
                            index={index}
                            chargeType={ item.type }
                            money={ item.money }
                            status={ item.status }
                            startTime={ item.startTime }
                            timeNow={ +new Date }
                            topicStyle={ item.style }
                            logo={ item.backgroundUrl }
                            browseNum={ item.browseNum }
                            title={ item.topic }
                            topicId={ item.id }
                            isRelay={ item.isRelay }
                            auditStatus={this.props.auditStatus}
                            />)
                        } else {
                            return null
                        }

                    })
                }
            </div>
        );
    }
}

TopicList.propTypes = {

};

export default TopicList;