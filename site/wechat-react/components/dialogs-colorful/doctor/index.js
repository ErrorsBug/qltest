import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MiddleDialog } from 'components/dialog';

// 金字塔弹框
class DoctorDialog extends Component {
    render() {
        return (
            <MiddleDialog
                show={this.props.show}
                theme='empty'
                bghide
                close={true}
                titleTheme={'white'}
                className="doctor-dialog"
                onClose={this.props.onClose}
            >
                <div className='doctor-wrap'>
                    <div className="logo-doctor"></div>
                    <div className="title">博士帽</div>
                    <div className="descript">教师节达标直播间</div>
                </div>
            </MiddleDialog>
        );
    }
}



export default DoctorDialog;