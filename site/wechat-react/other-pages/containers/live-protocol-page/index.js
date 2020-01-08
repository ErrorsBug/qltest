import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Page from 'components/page';
import { connect } from 'react-redux';
import ProtocolPage from 'components/protocol-page'


class LiveProtocolPage extends Component {

    
    render() {
        
        return (
            <Page title={"千聊平台讲师协议"} className="live-protocol-page">
                <ProtocolPage /> 
            </Page>
        );
    }
}
function mapStateToProps (state) {
    return {
    }
}

const mapActionToProps = {
}

module.exports = connect(mapStateToProps, mapActionToProps)(LiveProtocolPage);


