import React from 'react'
import PortalCom from '../../../../components/portal-com';

export default function Masking({ hideMask }) {
    return (
        <PortalCom className="eb-masking-box">
            <div>
                <h4>点击屏幕两边<br/>可进行翻页哦~</h4>
                <div className="eb-masking-btn" onClick={ hideMask }>我知道了</div>
            </div>
        </PortalCom>
    )
}