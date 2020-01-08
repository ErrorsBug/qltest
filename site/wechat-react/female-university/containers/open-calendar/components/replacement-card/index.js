import React from 'react'
import PortalCom from '../../../../components/portal-com';
import './style.scss'

/**
 * 补卡弹窗
 * @export
 * @returns
 */
export default function ReplacementCard({ onClose, onRepCard }) {
    return (
        <PortalCom className="oc-rep-card">
            <div className="oc-rep-cont">
                <i className="iconfont iconxiaoshanchu" onClick={ onClose }></i>
                <p>这一天想必你很忙，忘记打卡了。 补卡成功将消费你1张补卡券</p>
                <div className="oc-rep-btn" onClick={ onRepCard }>确定补卡</div>
            </div>
        </PortalCom>
    )
}