import React from 'react' 
import PortalCom from '../../../components/portal-com';
import PressHoc from 'components/press-hoc';
import { locationTo } from 'components/util';

function Ercode({ url, close, linkUrl }) {
    return (
        <PortalCom className={ `cp-ercode-box` } >
            <PressHoc className="un-ercode-bg" region="cp-ercode-code">
                <div className="close" onClick={ close }><i className="iconfont iconxiaoshanchu"></i></div>
                <img onClick={ () => locationTo(linkUrl) } src={ url } className="cl-class-code-img" />
            </PressHoc>
        </PortalCom>
    )
}

export default Ercode