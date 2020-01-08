import React from 'react'
import { locationTo } from 'components/util';

const Scholarship = () => (
    <div className="scholarship-box">
        <div className="on-log on-visible" 
            data-log-name="奖学金"
            data-log-region="un-scholarship-btn"
            data-log-pos="0"
            onClick={ () => locationTo(`/wechat/page/university/invitation-card`) }></div>
    </div>
)
export default Scholarship