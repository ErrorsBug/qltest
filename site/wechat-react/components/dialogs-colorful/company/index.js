import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators'
import { MiddleDialog } from 'components/dialog';
import {
    locationTo,
} from 'components/util';

/**
 * 实名认证弹框 
 * */ 
class CompanyDialog extends Component {
    render() {
        const { enterprisePo = {} } = this.props;
        return (
            <MiddleDialog
                show={this.props.show}
                theme='empty'
                close={true}
                titleTheme={'white'}
                className="real-name-dialog"
                onClose={this.props.onClose}
            >
                <div className="company-box">
                    <h3 className="real-head">已通过企业认证</h3>
                    <p>企业名称: { enterprisePo.enterpriseName }</p>
                    <p>企业注册号: { enterprisePo.creditCode }</p>
                </div>
            </MiddleDialog>
        );
    }
}

CompanyDialog.propTypes = {

};

export default CompanyDialog;