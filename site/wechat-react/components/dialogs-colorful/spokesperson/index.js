import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MiddleDialog } from 'components/dialog';

// 代言人
class Spokesperson extends Component {
    render() {
        return (
            <MiddleDialog
                show={this.props.show}
                theme='empty'
                bghide
                close={true}
                titleTheme={'white'}
                className="spokesperson-dialog"
                onClose={this.props.onClose}
            >
                <div className="content">
                    <b>千聊代言人</b>
                    <span>参与发文活动，并获得前十名</span>
                </div>
            </MiddleDialog>
        );
    }
}

Spokesperson.propTypes = {

};

export default Spokesperson;