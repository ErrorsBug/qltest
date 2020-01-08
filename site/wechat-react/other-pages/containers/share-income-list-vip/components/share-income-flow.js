import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ShareIncomeVipList extends Component {


    render() {
        console.log(this.props.items);
        var flowListHtml= this.props.items.map((flowdd)=>{
            return (
                <dd>
                    <a href={`/wechat/page/share-income-detail-vip/${flowdd.liveId}`} >
                        <span className="content">{flowdd.liveName}</span>
                        <span className="span_1">分销总收益</span><span className="money">￥{flowdd.income}</span><br/>
                        <span className="span_1">分销笔数</span><span className="count">{flowdd.shareCount}笔</span>
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

ShareIncomeVipList.propTypes = {

};

export default ShareIncomeVipList;
