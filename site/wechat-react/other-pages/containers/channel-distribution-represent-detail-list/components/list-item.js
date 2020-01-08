import React, {Component} from 'react';
import {connect} from 'react-redux';

import {formateToDay,formatDate,formatMoney  } from 'components/util';
//组件


class ListItem extends Component {

    render() {
        var invitedList = this.props.items.map((item,index)=>{
            return (
                <li className='c-distri-re-detail-item' key={`distri-re-${index}`}>
                 <div className='distri-time'>
                    <p>{formateToDay(item.createTime)}</p>
                    <p>{formatDate(item.createTime,"MM-dd")}</p>
                </div>
                {
                    this.props.type == 'return' ?
                    <div className='sign-up'>
                        <p className='user'>{item.beInviterName}报名参加</p>
                        <p className='money'>付费￥{formatMoney(item.payAmount)}</p>
                    </div>
                    : 
                    <div className='sign-up'>
                        <p className="earning">+{formatMoney(item.shareEarning)}</p>
                        {
                            item.type ==='channelGift'?
                            <p className='user'>{item.beInviterName}购买赠礼</p>
                            :
                            <p className='user'>{item.beInviterName}报名参加</p>
                        }
                        <p className='money'>付费￥{formatMoney(item.payAmount)}<var className="percent">（分成比例：{item.shareEarningPercent}%）</var></p>
                    </div>
                }
                   
                   
                </li>
            );
        });
        return (
            <ul>
                {invitedList}
            </ul>
        );
    }
}

function mapStateToProps(state) {
    return {};
}
const mapActionToProps = {};

export default connect(mapStateToProps, mapActionToProps)(ListItem);