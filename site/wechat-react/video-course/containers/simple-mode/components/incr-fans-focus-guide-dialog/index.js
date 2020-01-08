import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class IncrFansFocusGuideDialog extends Component {

    data = {
        
    }

    render() {
        if (typeof document == 'undefined') {
            return null;
        }

        if (!this.props.show) {
            return null;
        }

        const focusGuidConfigs = this.props.incrFansFocusGuideConfigs;

        return createPortal(
            <section className='incr-fans-focus-guide-dialog-container'>
                <aside className="bg" onClick={ this.props.onClose }></aside>
                <main className="dialog-content">
                    <span className='icon_cancel' onClick={ this.props.onClose }></span>
                    <img src={ focusGuidConfigs && focusGuidConfigs.qrCode } />
                </main>
            </section>,
            document.getElementById('app')
        );
    }
}

IncrFansFocusGuideDialog.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

const mapActionToProps = {

}

function mapStateToProps (state) {
    return {
        topicInfo: state.thousandLive.topicInfo
    }
}

export default connect(mapStateToProps, mapActionToProps)(IncrFansFocusGuideDialog);