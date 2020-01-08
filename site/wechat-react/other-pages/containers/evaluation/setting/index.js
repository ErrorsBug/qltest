import React, {Component} from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames';

import Page from 'components/page';

import {updateIsOpenEvaluate} from '../../../actions/evaluation';
import Confirm from 'components/dialog/confirm';

class EvaluationSetting extends Component {
    state = {
        cannotUpdate: false,
        // showConfirmDialog: false,
    }
    componentDidMount() {
        console.log(this.props.isOpen);
        if (!this.props.location.query.liveId) {
            this.setState({
                cannotUpdate: true
            });
        }
    }
    toggleEvaluation() {
        if (this.state.cannotUpdate) {
            window.toast('缺少参数');
            return;
        }
        // 要关闭评价
        if (this.props.isOpen == 'Y') {
            // this.setState({
            //     showConfirmDialog: true
            // });
            this.refs.ensureDialog.show();
        } else {
            this.props.updateIsOpenEvaluate(this.props.location.query.liveId, 'Y');
        }
        
    }
    ensureCloseEvaluate(type) {
        if (type == 'confirm') {
            this.props.updateIsOpenEvaluate(this.props.location.query.liveId, 'N');
        }
        // this.setState({
        //     showConfirmDialog: false
        // });
        this.refs.ensureDialog.hide();
    }
    setDialogChildren() {
        return (
            <div className="dialog-txt">关闭评论后，所有课程将不显示用户评价且不可被评价</div>
        )
    }
    render() {
        return (
            <Page title="评论设置" className="evaluation-set-ctn">
                <ul className="list-box">
                    <li className="list-item">
                        <div className="setting-name">开启课程评价</div>
                        <div
                            className={classnames("setting-op", {active: this.props.isOpen == 'Y'})}
                            onClick={this.toggleEvaluation.bind(this)}
                        >
                            <div className="inner-bar"></div>
                        </div>
                    </li>
                </ul>
                <Confirm
                    ref="ensureDialog"
                    buttons="confirm"
                    title="关闭评价"
                    children={this.setDialogChildren()}
                    confirmText="我知道了"
                    onBtnClick={this.ensureCloseEvaluate.bind(this)}
                />
            </Page>
        );
    }
}

const mapDispatchToProps = {
    updateIsOpenEvaluate,
};
function mapStateToProps({evaluation:{isOpen}}) {
    return {
        isOpen,
    };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(EvaluationSetting);