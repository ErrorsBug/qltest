import React from 'react'
import { locationTo } from 'components/util'
import { fillParams } from 'components/url-utils';
import PortalCom from '../../../../components/portal-com';

export default function AdCom({ title, keyA, shareUserId }) {
    return (
        <PortalCom className="eb-ad-com">
            <div onClick={ () => locationTo(`/wechat/page/university-experience-camp?campId=${ keyA }&shareKey=${ shareUserId }`) }>
                <p>{ title }</p>
                <i className="iconfont iconxiaojiantou-copy"></i>
            </div>
        </PortalCom>
    )
}