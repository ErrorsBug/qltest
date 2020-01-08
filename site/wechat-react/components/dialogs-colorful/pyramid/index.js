import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MiddleDialog } from 'components/dialog';

// 金字塔弹框
class PyramidDialog extends Component {
    render() {
        return (
            <MiddleDialog
                show={this.props.show}
                theme='empty'
                bghide
                close={true}
                titleTheme={'white'}
                className="pyramid-dialog"
                onClose={this.props.onClose}
            >
                <div className='pyramid-wrap'>
                    <img alt="" src="https://img.qlchat.com/qlLive/liveCommon/logo_pyramid_top_500.png" className="logo-pyramid" />
                    <div className="title">金字塔计划</div>
                    <div className="descript">千聊最具成长价值TOP500直播间</div>
                </div>
            </MiddleDialog>
        );
    }
}

PyramidDialog.propTypes = {

};

export default PyramidDialog;