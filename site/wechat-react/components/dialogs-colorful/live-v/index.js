import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MiddleDialog } from 'components/dialog';

// 直播间加V
class LiveVDialog extends Component {
    render() {
        return (
            <MiddleDialog
                show={this.props.show}
                theme='empty'
                bghide
                close={true}
                titleTheme={'white'}
                className="live-v-dialog"
                onClose={this.props.onClose}
            >
                <div className="content">
                    <span>该直播间具备一定的知识分享资质</span>
                </div>
            </MiddleDialog>
        );
    }
}

LiveVDialog.propTypes = {

};

export default LiveVDialog;