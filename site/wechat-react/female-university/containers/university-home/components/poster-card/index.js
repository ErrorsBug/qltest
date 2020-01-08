import React from 'react'
import PortalCom from '../../../../components/portal-com'

const PosterCard = ({ url, showHomeBtn, isTab  }) => {
    return (
        <PortalCom className={ `poster-card-box ${ isTab ? 'btm' : '' }` }>
            <div>
                <div className="poster-card-badge">
                    <img src={ require('../../img/bg01.png') } />
                </div>
                {/* <h3>
                    <img src={ require('../../img/icon-poster.png') }/>
                </h3> */}
                <div className="poster-card-img">
                    <img src={ url } />
                </div>
                <div className="poster-card-btn" onClick={ showHomeBtn }>进入大学报到</div>
            </div>
        </PortalCom>
    )
}
export default PosterCard;