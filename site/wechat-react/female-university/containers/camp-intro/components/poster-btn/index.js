import React, { useCallback } from 'react'
import PortalCom from '../../../../components/portal-com';
import PubSub from 'pubsub-js'
import './style.scss'

/**
 * 今日海报
 * @export
 * @returns
 */
export default function PosterBtn({ generatePoster }) {
    return (
        <PortalCom className="oc-poster-btn" onClick={ generatePoster }>
            <img src={ require('../../img/bg04.png') } />
        </PortalCom>
    )
}