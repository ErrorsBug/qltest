import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {formatDate,formatMoney } from 'components/util';

class ShareIncomeFlowList extends Component {
    render() {
        var flowListHtml= this.props.items.map((flowdd)=>{            
            return (
                <dd>
                    <span className="flow-content">{flowdd.type=="vip"?("直播间VIP（"+flowdd.tittle+"个月会员）"):flowdd.tittle}</span>
                    <span className="flow-money">+{formatMoney(flowdd.shareEarning)}</span>
                    {
                        (shareType => {
                            if(shareType === 'live'){
                                return  (<span className="span_1 flow-type">直播间推广</span>)
                            }else if(shareType === 'channel' || shareType === 'channel_second'){
	                            return  (<span className="span_1 flow-type">系列课推广</span>)
                            }else if(shareType === 'topic'){
	                            return  (<span className="span_1 flow-type">话题推广</span>)
                            }
                        })(flowdd.shareType)
                    }
                    <span className="span_1 flow-percent">(分成比例{flowdd.shareEarningPercent}%)</span><br/>
                    <span className="span_1 flow-live-name">{flowdd.liveName}</span><br/>
                    <span className="span_1 flow-time">{formatDate(flowdd.createTime,"yyyy-MM-dd hh:mm:ss")}</span>

                    <span className="span_1 flow-people">购买人:{flowdd.beInviterName}</span>
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

ShareIncomeFlowList.propTypes = {

};

export default ShareIncomeFlowList;
