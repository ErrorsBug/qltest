import React, { PureComponent } from 'react'
import { MiddleDialog } from 'components/dialog'; 
import {  formatDate} from 'components/util';
import { getUrlParams } from 'components/url-utils';
 
const Rule = ({recardDate}) => (
    <div className="fl-dialog-cont"> 
        <h4> <span className="fh-title-icon"></span>补卡成功</h4>
        <div className="fhd-tip">恭喜你成功补卡{formatDate(getUrlParams('recard'),'yyyy年M月d日')}记录。继续加油，成功离你不远了〜</div>
    </div>
)

export default class extends PureComponent{
    render() {
        const { isShow, close,confirm,recardDate } = this.props;
        return (
            <MiddleDialog 
                show={isShow}
                onClose={close}  
                className="fh-dialog fh-dialog-recard">
                <Rule recardDate={recardDate}/>
                <div className="fhd-bottom">
                    <div className="fh-item fh-close-btn" onClick={ close }>我知道了</div>
                </div>
            </MiddleDialog>
        )
    }
}