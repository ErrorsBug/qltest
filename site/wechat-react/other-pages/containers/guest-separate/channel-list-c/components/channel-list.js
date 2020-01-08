import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatDate,locationTo ,imgUrlFormat,formatMoney } from 'components/util';

class ChannelList extends Component {
    render() {
        const listData= this.props.item.map((val,index)=>{
            return <div className="item"  key={`channel-cli-${index}`}>
                    <div className="info-wrap" onClick={()=>{val.type==="channel"?locationTo("/live/channel/channelPage/"+val.businessId+".htm"):(val.type==="camp"?locationTo("/wechat/page/camp-detail?campId="+val.businessId):locationTo("/topic/details?topicId="+val.businessId))}}>
                        <div className="avatar">
                            <img src={imgUrlFormat((val.type === "channel"?val.channelHeadImg:(val.type === "camp"?val.campHeadImg:val.topicHeadImg)),'?x-oss-process=image/resize,h_100,w_100,m_fill')}/>
                        </div>
                        <div className="details">
                            <div className="title">{val.type === "channel"?val.channelName:(val.type === "camp"?val.campName:val.topicName)}</div>
                            <div className="proportion">分成比例：{val.sharePercent}%&emsp;
                            {
                                val.expiryTime&&val.expiryTime < new Date().getTime()?
                                "分成已结束"
                                :
                                "分成中"
                            }
                            </div>
                            <div className="deadline">截止时间：{val.expiryTime?formatDate(val.expiryTime,"yyyy-MM-dd hh:mm"):"无"}</div>
                            <div className="settlement">已 发 放：<span className="price">¥{formatMoney(val.totalIncome)}</span></div>
                            <div className="type">{val.type==="channel"?"系列课":(val.type === "camp"?'训练营':'课程')}</div> 
                        </div>
                        
                    </div>
                    {
                        val.type === "channel"?
                        <div className="operation">
                            <div className="btn" onClick={()=>{locationTo("/wechat/page/guest-separate/income-detail/mine?channelId="+val.businessId+"&type=detail&guestId="+val.id)}}>查看收益明细</div>
                            <span className="sepo"></span>
                            <div className="btn" onClick={()=>{locationTo("/wechat/page/guest-separate/income-detail/mine?channelId="+val.businessId+"&type=clearing&guestId="+val.id)}}>查看结算记录</div>
                        </div>
                        :
                        (
                            val.type === "camp"?
                            <div className="operation">
                                <div className="btn" onClick={()=>{locationTo("/wechat/page/guest-separate/income-detail/mine?campId="+val.businessId+"&type=detail&guestId="+val.id)}}>查看收益明细</div>
                                <span className="sepo"></span>
                                <div className="btn" onClick={()=>{locationTo("/wechat/page/guest-separate/income-detail/mine?campId="+val.businessId+"&type=clearing&guestId="+val.id)}}>查看结算记录</div>
                            </div>
                            :
                            <div className="operation">
                                <div className="btn" onClick={()=>{locationTo("/wechat/page/guest-separate/income-detail/mine?topicId="+val.businessId+"&type=detail&guestId="+val.id)}}>查看收益明细</div>
                                <span className="sepo"></span>
                                <div className="btn" onClick={()=>{locationTo("/wechat/page/guest-separate/income-detail/mine?topicId="+val.businessId+"&type=clearing&guestId="+val.id)}}>查看结算记录</div>
                            </div>
                        )
                        
                    }
                        
                </div>;  
        });
        return (
            <div className="list-wrap" >
                {listData}
            </div>
        );
    }
}

ChannelList.propTypes = {

};

export default ChannelList;