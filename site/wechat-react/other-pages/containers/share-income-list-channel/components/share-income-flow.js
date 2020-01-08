import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ShareIncomeChannelList extends Component {


    render() {
        console.log("there");
        var flowListHtml= this.props.items.map((flowdd,index)=>{
            console.log(index);
            return (
                <dd>
                    <a href={`/wechat/page/share-income-detail-channel/${flowdd.businessId}`}>
                        <span className="content">{flowdd.channelName}</span>
                        {
                            (flowdd.channelStatus=="D")?
                            <span className="channel-status-delete">已删除</span>
                            :null
                        }
                        <span className="span_1">收费类型</span><span className="time">
                        {
                            (flowdd.chargeType=="absolutely")?
                            `固定收费`
                            :
                            `按月收费`
                        }</span><br/>
                        <span className="span_1">推广总收益</span><span className="money">￥{flowdd.income}</span><br/>
                        <span className="span_1">直播间</span><span className="live-name">{flowdd.liveName}</span>
                        <span className="check-detail">查看详情</span>
                    </a>
                </dd>
            );            
        });
        console.log(this.props.items);
        return (
            <dl className="flow-dl">
                {flowListHtml}
            </dl>
        );
    }
}

ShareIncomeChannelList.propTypes = {

};

export default ShareIncomeChannelList;
