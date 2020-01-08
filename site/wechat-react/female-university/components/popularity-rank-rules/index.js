import React, { useState, useEffect } from 'react';
import PortalCom from '../portal-com';
import { getRankRule } from '../../actions/camp'
import { formatMoney, formatNumber } from 'components/util'

export default function PopularityRankRules({ goBack, ruleInfo = {} }) {
    const [rankRuleInfo, setRankRuleInfo] = useState({})
    const initData = async () => {
        const res = await getRankRule();
        setRankRuleInfo(res)
    }
    useEffect(() => {
        initData();
    }, [])
    return (
        <>
            <PortalCom className="un-popularity-rank-box">
                <div className="popularity-rank-rules-container">
                    <div className="page-desc" data-desc="榜单规则"></div>
                    <div className="detail">
                        <div className="part-rules">
                            <h3>高人气秘籍+惊喜菜单</h3>
                            <h4>人气值的计算：</h4>
                            <ul className="each-rules">
                                <li><div className="num">（1）</div> <div>每日完成朋友圈打卡，人气值+{ rankRuleInfo.checkIn }</div></li>
                                {/* <li><div className="num">（2）</div> <div>好友扫码海报查看你的学习报告，人气值+{ rankRuleInfo.watchAlbum }</div></li> */}
                                <li><div className="num">（2）</div><div>好友扫码海报查看你的学习报告并送花，人气值+{ rankRuleInfo.likeAlbum }（每一页都可送花）</div></li>
                                <li><div className="num">（3）</div> <div>好友扫码海报查看你的学习报告并报名《10天女性蜕变营》，人气值+{ rankRuleInfo.joinCamp }，<i className="high-light">并有彩蛋：{ formatMoney(rankRuleInfo.joinCampMoney | 0) }元奖金（奖金无上限叠加）</i></div></li>
                                <li><div className="num">（4）</div> <div>好友扫码海报查看你的学习报告并报名加入千聊女子大学，人气值+{ rankRuleInfo.joinUfw }，<i className="high-light">并有彩蛋：{ rankRuleInfo.joinUfwMoney || 0}元奖金（奖金无上限叠加）</i></div></li>
                            </ul>
                            <h4>结算节点：</h4>
                            <ul className="each-rules">
                                <li><div className="num">（1）</div> <div>本期学习营在开营当天开始计算</div></li>
                                <li><div className="num">（2）</div> <div>结营当天0点结束更新，结营典礼时发放奖励</div></li>
                            </ul>
                        </div>
                        { (!!ruleInfo?.addHours?.length || !!ruleInfo?.cash?.length) && (
                             <div className="part-present">
                                <h3>奖品介绍</h3>
                                <ul className="each-rules">
                                    { ruleInfo.addHours && ruleInfo.addHours.map((item, index) => (
                                        <li><div className="num">（{index + 1}）</div> <div>人气前{ item.topN }名，获得{ formatNumber(item.hours / 24) }天大学时长</div></li>
                                    )) }
                                    { ruleInfo.cash && ruleInfo.cash.map((item, index) => (
                                        <li><div className="num">（{ (index + ruleInfo.addHours.length + 1) }）</div> <div>人气第{ item.position }名，额外奖励{ formatMoney(item.cash) }元</div></li>
                                    )) }
                                </ul>
                            </div>
                        ) }
                    </div>
                </div>
            </PortalCom>
            <PortalCom className="go-back-btn" onClick={ goBack }>返回</PortalCom>
        </>
    )
}