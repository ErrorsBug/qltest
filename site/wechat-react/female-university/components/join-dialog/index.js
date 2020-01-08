import React, { PureComponent } from 'react'
import { MiddleDialog } from 'components/dialog';
import { limitScrollBoundary } from 'components/scroll-boundary-unlimit';

export default class extends PureComponent {
    componentDidMount(){
        document.querySelector('.study-card')&&limitScrollBoundary(document.querySelector('.study-card')) 
    }
    render() {
        const { isShowDialog, close, joinPlan } = this.props;
        return (
            <MiddleDialog
                show={isShowDialog}
                onClose={joinPlan}
                className="study-card">
                <div className="study-box">
                    <div className="study-info">
                        <h4>已加入我的课表</h4>
                        <p>可在大学首页右上角【我的课单】</p>
                        <p><span>设置学习提醒哦~</span></p>
                    </div>
                    <div className="footer-btn" onClick={ joinPlan }>
                        我知道了
                    </div>
                </div>
            </MiddleDialog>
        )
    }
}