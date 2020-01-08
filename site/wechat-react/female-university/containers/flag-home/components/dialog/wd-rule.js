import React, { PureComponent } from 'react'
import { MiddleDialog } from 'components/dialog';

 

export default class extends PureComponent{
    render() {
        const { isShow, close  } = this.props;
        return (
            <MiddleDialog
                show={isShow   }
                onClose={close}
                className="fhh-dialog">
                <div className="wd-dialog-cont">
                    <h4>提现说明</h4>
                    <p className="txt-center">坚持学习30天才可以提现哦，届时所有奖学金会自动打到你的微信钱包</p>
                </div>
                <div className="wd-dialog-btn" onClick={ close }>我知道了</div>
            </MiddleDialog>
        )
    }
}