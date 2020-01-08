import React, { Component,Fragment } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { MiddleDialog } from 'components/dialog';
import { autobind } from 'core-decorators';
import { locationTo } from 'components/util';
import ProtocolPage from 'components/protocol-page'

@autobind
class ProtocolDialog extends Component {


    render() {

        if (typeof document == 'undefined') {
            return null;
        }
        const portalBody = document.querySelector(".portal-low");

        if (!portalBody) {
            return null;
        }

        return (
            createPortal(
                <MiddleDialog
                    className='live-studio-protocol-dialog'    
                    show={ this.props.showProtocol }
                    theme='empty'
                    onClose={this.props.toggleProtocol}
                    onClose={() => {}}
                >   
                    <div className="agreement-container">
                        <div className="agreement-content">
                        <ProtocolPage /> 
                        </div>    
                        <div className="goback-button" role="button" onClick={this.props.toggleProtocol}>我知道了</div>
                    </div>    

                </MiddleDialog>
            , portalBody)
        );
    }
}

ProtocolDialog.propTypes = {

};

export default ProtocolDialog;