import React from 'react'
import PortalCom from '../../../../components/portal-com';

const EntryGroup = ({ groupHide, goGroupShow, className }) => {
    return ( 
        <PortalCom className={ `un-home-group on-log on-visible ${ className }` }
            data-log-name="加入班级"
            data-log-region="un-home-group"
            data-log-pos="0">
            <div>
                <span className="on-log on-visible" 
                    data-log-name="关闭"
                    data-log-region="un-hide-group"
                    data-log-pos="0"
                    onClick={ groupHide }></span>
                <div className="un-home-cont on-log on-visible" 
                    data-log-name="显示"
                    data-log-region="un-show-group"
                    data-log-pos="0" onClick={ goGroupShow }>
                    <img src={ require('../../img/collegehome_icon_banqun.png') } alt=""/>
                </div>
            </div>
        </PortalCom>
    )
}
export default EntryGroup;