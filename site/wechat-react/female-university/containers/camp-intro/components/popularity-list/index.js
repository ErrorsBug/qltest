import React, { useState } from 'react'
import ClockRank from '../../../../components/clock-rank'
import PopularityRankRules from '../../../../components/popularity-rank-rules'

export default function PopularityList({ rankList, ruleInfo, userRank }) {
    const [isRule, setIsRule] = useState(false)
    return (
        <>
            <div className="pl-list-box">
                <div className="pl-list-head">
                    <h4>人气值实时榜单</h4>
                    <img onClick={() => setIsRule(true)} src={require('../../img/bg02.png')} alt="" />
                    <p>结营当天0点榜单结束更新，高人气学员可获奖</p>
                </div>
                <ClockRank list={rankList} userRank={ userRank } />
            </div>
            {isRule && <PopularityRankRules ruleInfo={ruleInfo} goBack={() => setIsRule(false)} />}
        </>
    )
}
