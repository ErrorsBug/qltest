import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ShareIncomeTopicList extends Component {
    render() {
        var flowListHtml= this.props.items.map((flowdd)=>{
            return (
                <dd>
                    <a href={`/wechat/page/share-income-detail-topic/${flowdd.businessId}`}>
                        <span className="content">{flowdd.topicName}</span>
                        {
                            (flowdd.topicStatus=="delete")?
                            <span className="topic-status-delete">已删除</span>
                            :
                            (flowdd.topicStatus=="ended")?
                            <span className="topic-status-over">已结束</span>
                            :null
                            
                        }
                        <span className="span_1">开播时间</span><span className="time">{flowdd.topicStartTime}</span><br/>
                        <span className="span_1">推广总收益</span><span className="money">￥{flowdd.income}</span><br/>
                        <span className="span_1">直播间</span><span className="live-name">{flowdd.liveName}</span>
                        <span className="check-detail">查看详情</span>
                   </a>
                </dd>
            );            
        });
        return (
            <dl className="flow-dl">
                {flowListHtml}
            </dl>
        );
    }

}

ShareIncomeTopicList.propTypes = {

};

export default ShareIncomeTopicList;
