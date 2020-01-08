import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import MiddleDialog from 'components/dialog/middle-dialog'

class FollowQlMidDialog extends Component {
    render() {
        if (typeof (document) == 'undefined') {
            return false;
        }
        
        return createPortal(
            <MiddleDialog
                className='follow-ql-middle-dialog'    
                title='关注千聊获取更多优质课程'
                show={ true }
                theme='empty'
                onClose={this.props.hide}
                close={ true }
            >
                <div className="main">
                    <img src={this.props.qrUrl} className={`on-visible`}
							data-log-name="三方分销话题顶部引导关注千聊"
							data-log-region="visible-three-topic-topguid"
							data-log-pos="111"/>
                    <span className="tips">长按识别二维码并关注</span>
                </div>    
            </MiddleDialog>,
            document.getElementById('app')
        );
    }
}

FollowQlMidDialog.propTypes = {

};

export default FollowQlMidDialog;