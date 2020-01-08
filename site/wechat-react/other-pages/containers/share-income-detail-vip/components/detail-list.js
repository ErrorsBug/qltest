import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {formateToDay ,formatDate,formatMoney } from 'components/util';

class DetailVipList extends Component {
    render() {
        const flowList= this.props.topics;
        var flowListHtml= flowList.map((flowdd)=>{            
            return (
                <dd>
                    <div className="dd-left"><span>{formateToDay(flowdd.createTime)}</span><span>{formatDate(flowdd.createTime,"MM-dd")}</span></div>
                    <div className="dd-right">
                        <span className="whow">{flowdd.beInviterName}报名参加</span>
                        <span className="money">付费¥{formatMoney(flowdd.payAmount)}</span>
                        <span className="percent">分成比例{flowdd.shareEarningPercent}%（{flowdd.shareType=="live"?"直播间推广":null}）</span>
                    </div>
                </dd>
            );            
        });
        return (
            <dl className="detail-list">
                {flowListHtml}
            </dl>
        );
    }
}

DetailVipList.propTypes = {

};

export default DetailVipList;
