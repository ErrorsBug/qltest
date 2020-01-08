import React from 'react';
import PropTypes from 'prop-types';
import { formatDate, imgUrlFormat, formatMoney } from '../../../../../components/util'
import {
    TOPIC,
    CHANNEL,
    VIP,
    CAMP,
    defaultUserPortrait,
    CUSTOMVIP,
} from '../../methods'

const returnStatus = (item) => {
    switch(item.missionStatus) {
        case 'N': 
            return null;
        case 'Y':
            return <div className="pull-type">预返学费冻结中￥{formatMoney(item.returnMoney, 1)}</div>
        case 'SUCCESS':
            return <div className="pull-type">邀{item.inviteNum}人返学费￥{formatMoney(item.returnMoney, 1)}</div>
        default:
            return null
    }
}
const JoinList = props => {
    return (
        <ul className='co-join-list'>
            {
                props.list.map((item, index) => {
                    /* 用户头像不存在则使用默认头像 */
                    const headImgUrl = item.headImgUrl ? item.headImgUrl :
                          item.headImageUrl ? item.headImageUrl : defaultUserPortrait
                    return <li key={index}>
                        <img src={imgUrlFormat(headImgUrl, '@100w_100h_1e_1c_2o')} alt="" />
                        <div className="detail">
                            {
                                
                                /* 频道或话题类型显示管理按钮 */
                                (props.type === CHANNEL || props.type === TOPIC || props.type === VIP ||props.type === CAMP || props.type === CUSTOMVIP) &&
                                <button className='manage' onClick={() => { props.onListManageClick(item.id)}}>管理</button>
                            }
                            <h1>
                                <span className='user-name'>{item.userName + (item.status === 'D' && props.type !== VIP ? ' （已删除）' : '') + (item.status === 'N' ? ' （已过期）' : '')}</span>
                                <div className='badges'>
                                    {
                                        (
                                            /* 频道类型且非固定收费 */
                                            (props.type === CHANNEL && item.chargeMonths !== 0 && item.status === 'Y')
                                            ||
                                            /* 或VIP类型 */
                                            (props.type === VIP)
                                        )
                                        &&
                                        /* 显示会员时间 */
                                        <span>{item.chargeMonths}{item.type == 'tryout' ? '天' : '个月'}会员</span>
                                    }
                                    {
                                        /*
                                        *  频道类型且非固定收费
                                        *  或VIP类型
                                        *  显示支付记录状态
                                        *
                                        *  【支付状态】
                                        *  0 - 过期
                                        *  1 - 有效
                                        */
                                        (
                                            (props.type === CHANNEL && item.status === 'N') ||
                                            (props.type === VIP && item.status == '0')
                                        )
                                        &&
                                        item.chargeMonths !== 0 && 
                                        <span className="tag">
                                            过期
                                        </span>
                                    }
                                    {
                                        item.kickOutStatus === 'Y' && <span>(已踢出)</span>
                                    }
                                    {
                                        item.blackListStatus === 'Y' && <span>(已拉黑)</span>
                                    }
                                </div>
                                <div className="return-bage">
                                    {
                                        returnStatus(item)
                                    }
                                </div>
                            </h1>

                            <p>
                                {
                                    props.type === CAMP ?
                                    `支付${item.relateType == 'GIFT' ? 0 : item.payAmount}元` :
                                    `支付${item.relateType == 'GIFT' ? 0 : item.money}元`
                                }
                                {
                                    props.type === CAMP ? <span className="affair-days">已打卡{item.affairDays}天</span> :null
                                }
                                {
                                    /*
                                     * 渠道信息，状态比较多，暂时由后端拼接后以字符串形式返回
                                     * 之后如果需要控制可能改为前端判断状态显示
                                     *
                                     * 状态包括：
                                     * 1. 优惠码抵扣 [TOPIC, CHANNEL, VIP]
                                     * 2. 接受赠礼 [TOPIC, CHANNEL]
                                     * 3. 拼课免费 [CHANNEL]
                                     * 4. 任务邀请卡达标 [TOPIC]
                                     * 5. 直接购买 [TOPIC, CHANNEL, VIP]
                                     */
                                    // item.relateContent
                                    item.relateType == 'COUPON' ? `, 优惠码抵扣${item.relateContent}元` :
                                    item.relateType == 'GIFT' ? `, 来自${item.relateContent}的赠礼` :
                                    item.relateType == 'TASK_CRAD' ? `, 来自粉丝通`:
                                    item.relateType == 'PAY' ? '' : 
                                    props.type === CHANNEL ? 
                                        item.relateType == 'FREE' ? `, 拼课团长免费` : 
                                        item.relateType == 'GROUP' ? ', 参与拼课' :
                                        item.relateType == 'PERSON_OFFICIAL' ? '官方课代表礼包赠送' :
                                        item.payType == 'group_leader' ? ', 拼课付费团长' : '' : ''
                                }
                                {
                                    item.payType && item.payType.toLowerCase() === 'member_send_course' ?
                                        '，千聊会员赠课福利'
                                        :
	                                    item.payType && item.payType.toLowerCase().match('member') ?
                                            '，千聊会员八折福利'
                                            :
                                            null
                                }
                            
                            </p>

                            <time>{formatDate(item.createTime, 'yyyy-MM-dd hh:mm')}</time>
                            
                            {
                                /* 如果有推荐人信息则显示推荐人 */
                                Boolean(item.referrerName) &&
                                <p>推荐人: <b>{item.referrerName}</b></p>
                            }
                            {
                                /* 如果有推荐人信息则显示推荐人 */
                                Boolean(item.parentReferrerName) &&
                                <p calssName="secondary">上级推荐人: <b>{item.parentReferrerName}</b></p>
                            }

                        </div>
                    </li>
                })
            }
        </ul>
    );
};

JoinList.propTypes = {
    /* 列表类型 */
    type: PropTypes.string.isRequired,
    /* 列表数据 */
    list: PropTypes.array.isRequired,
    /* 点击管理按钮事件 */
    onListManageClick: PropTypes.func,
};

export default JoinList;