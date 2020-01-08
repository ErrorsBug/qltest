import React, { PureComponent } from 'react'
import { MiddleDialog } from 'components/dialog';

 
const Rule = () => (
    <div className="fl-dialog-cont"> 
        <div className="fhd-tip">这一天，想必你太忙，忘记打卡了</div>
        <h4>没关系，立即补卡</h4>
        <h4>还有机会拿到全部奖学金！</h4>
    </div>
)

export default class extends PureComponent{
    render() {
        const { isShow, close,confirm } = this.props;
        return (
            <MiddleDialog 
                show={isShow  }
                onClose={close}  
                className="fh-dialog">
                <Rule />
                <div className="fhd-bottom">
                    <div className="fh-item fh-close-btn on-log on-visible" 
                        data-log-name='取消补卡'
                        data-log-region="un-flag-recard-cancel"
                        data-log-pos="0"
                        onClick={ close }>取消</div>
                    <div className="fh-item fh-confirm-btn on-log on-visible" 
                        data-log-name='确定补卡'
                        data-log-region="un-flag-recard-confirm"
                        data-log-pos="0"
                        onClick={ confirm }>确定</div>
                </div>
            </MiddleDialog>
        )
    }
}