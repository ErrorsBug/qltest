import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MiddleDialog } from 'components/dialog';
import {
    locationTo,
} from 'components/util';

// 实名认证弹框
class CoralPushImgBox extends Component {
    componentDidMount() {
        typeof _qla === 'undefined' || _qla.collectVisible();
    }

    render() {
        return (
            <MiddleDialog
                show={this.props.show}
                theme='empty'
                close={true}
                closeStyle="btn-close-ui icon_cancel"
                className="coral-push-img-box"
                onClose={this.props.onClose}
                trackCloseBtnModel={{
                    name: '弹窗-会员',
                    region: "window",
                    pos: "close",
                }}
            >
                <img 
                    className="coral-push-pic on-log on-visible" 
                    data-log-name="弹窗-会员"
                    data-log-region="window"
                    data-log-pos="click"
                    src={this.props.pushData&&this.props.pushData.backgroundUrl||''} 
                    onClick={()=>locationTo(this.props.pushData&&this.props.pushData.url||'')} 
                />
            </MiddleDialog>
        );
    }
}

CoralPushImgBox.propTypes = {

};

export default CoralPushImgBox;