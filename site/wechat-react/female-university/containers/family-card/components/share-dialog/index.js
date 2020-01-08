import React from 'react'
import PortalCom from '../../../../components/portal-com';

const ShareDialog = ({ clickBtn }) => {
    return (
        <PortalCom className="uni-share-dialog" onClick={ clickBtn }>
            <div className="uni-share-img">
                <p>点击右上角，可发送</p>
                <p>大学体验卡给亲友哦！</p>
            </div>
        </PortalCom>
    )
}
export default ShareDialog