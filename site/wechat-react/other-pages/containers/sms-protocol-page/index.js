import React, { Component } from 'react';
import Page from 'components/page';
import { connect } from 'react-redux';
import SmsProtocol from 'components/sms-protocol-page'


class SmsProtocolPage extends Component {

    
    render() {
        
        return (
            <Page title={"短信服务协议"} className="sms-protocol-page">
                <SmsProtocol />
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

module.exports = connect(mapStateToProps, mapActionToProps)(SmsProtocolPage);


