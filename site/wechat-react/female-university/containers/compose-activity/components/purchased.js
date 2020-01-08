import React from 'react' 
import PortalCom from '../../../components/portal-com';
import { locationTo } from 'components/util';
import appSdk from 'components/app-sdk'

function Purchased({ className, isQlchat }) {
    return (
        <PortalCom className={ `cp-purchased-box ${className}` } onClick={() => { 
            if(isQlchat) {
                appSdk.linkTo('dl/live/mine/purchase-list')
            } else {
                locationTo('/wechat/page/mine/course?activeTag=purchased')
            }
         }}></PortalCom>
    )
}

export default Purchased