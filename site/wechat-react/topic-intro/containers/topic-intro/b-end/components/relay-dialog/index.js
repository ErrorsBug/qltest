import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

// components
import { Confirm } from 'components/dialog';

@autobind
class RelayDialog extends Component {

    dialog = null;

    show() {
        this.dialog.show();
    }

    hide() {
        this.dialog.hide();
    }

    onBtnClick(type) {
        this.hide();
    }

    render() {
        return (
            <Confirm
                ref={ dom => this.dialog = dom }
                onBtnClick={ this.onBtnClick }
                buttons='confirm'
                confirmText='知道了'
            >
                <main className="relay-dialog-container">
                    <header>
                        转播成功！
                        <br/>
                        《{ this.props.topicName }》
                    </header>
                    

                    <dl>
                        <dt>内容同步</dt>
                        <dd>转播后，该话题将按开始时间显示在您的直播间主页，转播话题内容实时同步，您可以发言或撤回</dd>
                        {
                            this.props.topicType === 'charge' &&
                                [
                                    <dt key='relay-charge-label'>转播分成</dt>,
                                    <dd key='relay-charge-content'>通过您的直播间或链接成功购买，都将获得{ this.props.profitRatio }%的分成收益</dd>
                                ]
                        }
                        <dt>粉丝维护</dt>
                        <dd>推送转播话题来活跃自己的粉丝，扫描二维码引导关注也可为直播间增粉</dd>
                    </dl>
                </main>
            </Confirm>
        );
    }
}

RelayDialog.propTypes = {
    topicName: PropTypes.string,
    topicType: PropTypes.string,
    profitRatio: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};

export default RelayDialog;