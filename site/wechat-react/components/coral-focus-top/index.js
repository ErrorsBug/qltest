import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import classnames from 'classnames';

import Redpoint from '../redpoint';

import { locationTo } from '../util';
import { Confirm, MiddleDialog } from '../dialog'

import { getQr } from '../../coral/actions/common';



class CoralFocusTop extends Component {
    state = {
        showQlQRCodeDialog:false,
    }
    componentDidMount() {
        this.getQlQrCode();
    }

    async getQlQrCode(){
    	const res = await this.props.getQr({
		    channel: '120',
            showQl: 'Y',
            liveId: '0',
        });
        this.setState({
            qlQRCodeUrl: res.data.qrUrl
        })
    }

    showFocusQr(){
        this.setState({
            showQlQRCodeDialog:true,
        })
    }
    closeQlQRCodeDialog(){
        this.setState({
            showQlQRCodeDialog:false,
        })
    }
    
    render() {
        return (
            <div className="focus-bar-box">
                <span className="tips">关注千聊live及时接收收益通知</span>
                <div className="focus-control">
                    <span className="btn-focus" onClick={this.showFocusQr.bind(this)}>立即关注</span>
                    <span className="icon_cancel" onClick={this.props.closeFocusGuide.bind(this)}></span>
                </div>
                <MiddleDialog
                    show={this.state.showQlQRCodeDialog}
                    className="qlqrcode-dialog"
                    bghide={true}
                    onClose={this.closeQlQRCodeDialog.bind(this)}
                >
                    <div className="content">
                        <div className="tip">为了及时接收收益通知，请先关注千聊Live</div>
                        <div className="qrcode">
                            <img src={this.state.qlQRCodeUrl}  
                            className={`on-visible`}
							data-log-name="珊瑚计划增粉"
							data-log-region="visible-coral-addfans"
							data-log-pos="qrcode"  alt=""/>
                        </div>
                        <div className="tip2">长按扫描二维码并关注</div>
                    </div>
                </MiddleDialog>
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
    }
}
const mapActionToProps = {
	getQr,
}

module.exports = connect(mapStateToProps, mapActionToProps)(CoralFocusTop);
