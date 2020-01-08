import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MiddleDialog } from 'components/dialog';

// 热心拥趸
class HotHeart extends Component {
    render() {
        return (
            <MiddleDialog
                show={this.props.show}
                theme='empty'
                bghide
                close={true}
                titleTheme={'white'}
                className="hot-heart-dialog"
                onClose={this.props.onClose}
            >
                <div className="content">
                    <b>热心拥趸</b>
                    <span>积极参与千聊活动/产品/社群建设</span>
                </div>
            </MiddleDialog>
        );
    }
}

HotHeart.propTypes = {

};

export default HotHeart;