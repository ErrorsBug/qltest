import React, { Component,Fragment } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { MiddleDialog } from 'components/dialog';
import { autobind } from 'core-decorators';
import { locationTo } from 'components/util';
import LiveStudioProtocol from 'components/protocol-live-studio-page'

@autobind
class AgreementDialog extends Component {


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
                    show={this.props.showAgreement}
                    buttons='none'
                    theme='empty'
                    bghide
                    titleTheme={'white'}
                    className="live-studio-protocol-dialog"
                    onClose={() => {}}
                    title=''>
                    <div className="agreement-container">
                        <dl className="agreement-content">
                            <LiveStudioProtocol />
                        </dl>
                        <div className="goback-button" role="button" onClick={this.props.hideAgreement}>我知道了</div>
                    </div>
                </MiddleDialog>
            , portalBody)
        );
    }
}

AgreementDialog.propTypes = {

};

export default AgreementDialog;