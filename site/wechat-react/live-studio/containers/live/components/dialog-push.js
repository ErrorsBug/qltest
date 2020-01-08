/**
 *
 *
 *
 *
 *
 * 已废弃，暂时保留不删
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Confirm } from 'components/dialog';
import { autobind } from 'core-decorators';
import { locationTo } from 'components/util';

@autobind
class DialogPush extends PureComponent {

    state = {
        selectStatus: false
    }

    onSelectPush() {
        this.setState({
            selectStatus: !this.state.selectStatus
        });
    }

    onBtnClick(key) {
        if (key === 'confirm') {
            locationTo(`/wechat/page/course/push/topic/${this.props.topicId}?sync=${this.state.selectStatus ? 'Y' : 'N'}&liveId=${this.props.liveId}`);
        }
    }

    show() {
        this.refs.dialog.show();
    }

    render () {
        return (
            <Confirm
                ref='dialog'
                title={`<span>还剩<span class="color-danger">${this.props.pushNum}次</span>推送机会</span>`}
                buttons={ 'cancel-confirm' }
                confirmText={ '去推送' }
                className='push-dialog'
                onBtnClick={ this.onBtnClick }
            >
                <div className='push-dialog-wrap'>
                    <p className='push-text'>给开启通知的粉丝推送新话题开播通知，该话题总共{this.props.maxPushNum}次推送机会，推送间隔需大于24小时，请谨慎使用！</p>

                    <div className={'push-to-timeline ' + (this.state.selectStatus ? 'active' : '')} onClick={ this.onSelectPush }>
                        同时发布到直播间动态
                        <span className="goto-tuto"></span>
                    </div>

                    <span className="push_span_1">
                        <span className="how-to-push"></span>
                        <a href="http://mp.weixin.qq.com/s/Q5eOCFHIrWusXPeOvk3V2w" className="">
                            点击查看如何用自己的服务号推送
                        </a>
                    </span>
                </div>

            </Confirm>
        );
    }
};

export default DialogPush;
