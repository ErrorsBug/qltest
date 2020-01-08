import React, { PureComponent } from 'react'
import PortalCom from '../portal-com';

export default class extends PureComponent{
    render() {
        const { children, className, onClose, region } = this.props;
        return (
            <PortalCom className={ `uni-family-dialog ${ className }` }>
                <div className="uni-card-cont">
                    <div className="uni-card-close" onClick={ onClose }><i className="iconfont iconxiaoshanchu"></i></div>
                    <div className="uni-card-gra">
                        <div className="uni-card-content on-visible" 
                            data-log-name="弹窗"
                            data-log-region={ region }
                            data-log-pos="0">
                            { children }
                        </div>
                    </div>
                </div>

            </PortalCom>
        )
    }
}
