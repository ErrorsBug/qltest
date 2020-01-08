const isNode = typeof window === 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom';
import {connect} from 'react-redux';
import { message, LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn';
import style from './app.scss';
import LoginQr from '../components/login-qr';
import ModalLogin from '../components/modal-login';
import ModalLiveList from '../components/modal-live-list';
import ModalPromotion from '../components/modal-promotion';
import { autobind } from 'core-decorators';
import { getUserInfo, initState } from "../actions/common";
import { fetchChannelTypes } from "../actions/reprint";

const FastClick = !isNode && require('fastclick');

var _router;

@autobind
class App extends Component {

    static contextTypes = {
        // router: PropTypes.object,
    }

    state = {
        confirmContent: '',
        confirmTop: '',
        qrcodeUrl: '',
        showLogin: 'N',
    }

    componentWillMount() {
        _router = this.context.router;
    }
    


    setTitle(title) {
        if (title) {
            document.title = title;
        }
    }

    async componentDidMount() {
        FastClick && FastClick.attach(document.body);

        // 将message注入window对象
        window.message = message;
        // 将全局提示置于页面中间，优化体验
        message.config({
            top: 300
        });
        // 将loading注入window对象
        window.loading = this.props.loadingAction;

        window.confirmDialog = (msg, success, cancel, topmsg) => {
            this.refs.dialogConfirm.show();
            this.setState({
                confirmContent: msg,
                confirmTop: topmsg,
            });
            this.successDialog = success;
            this.cancelDialog = cancel;
        }

        window.showLogin = () => {
            this.setState({ showLogin: 'Y' })
        }

        const res = await this.props.getUserInfo();
        // console.log(res)

        const userId = res.state.code === 0 ?  res.data.user.userId : '';
        const liveId = this.props.location.query.selectedLiveId;
        const agentId = this.props.location.query.agentId;

        const initRes = await this.props.initState({userId, liveId, agentId})
        if (liveId) {
            this.props.fetchChannelTypes({liveId, type:'all'});
        }

        if(initRes && initRes.agentInfo.isExist === 'Y') {
            // console.log(1)
            this.setTitle(initRes.agentInfo.agentName);
        } else {
            // console.log(2)
            this.setTitle('知识通商城');
        }
        // console.log(initRes)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.payment&&nextProps.payment.qcodeUrl) {
            this.setState({
                qrcodeUrl: nextProps.payment.qcodeUrl,
            });
        }

        if (nextProps.agentInfo && nextProps.agentInfo.isExist === 'Y' ) {
            this.setTitle(this.props.agentInfo.agentName)
        }
    }


    onConfirmDialog(tag) {

        if (tag == 'confirm') {
            this.successDialog && this.successDialog();
            this.refs.dialogConfirm.hide();
        } else {
            this.cancelDialog && this.cancelDialog();
        }

        this.successDialog = null;
        this.cancelDialog = null;

    }

    onLoginModalClose() {
        this.setState({ showLogin: 'N'})
    }

    onClosePayment() {
        this.props.togglePayDialog(false);
    }

    render() {
        return (
            <LocaleProvider locale={zh_CN}>
                <div className={style.appContainer}>
                    <div className={style.mainContent} id="main-content">
                        {this.props.children}
                    </div>

                    <ModalLogin />
                    <ModalLiveList /> 
                    <ModalPromotion />
                </div>

            </LocaleProvider>    
        )
    }
}

function mapStateToProps(state) {
    return {
        agentInfo: state.common.agentInfo,
    }
}

const mapActionToProps = {
    getUserInfo,
    initState,
    fetchChannelTypes,
}

export default connect(mapStateToProps, mapActionToProps)(App);

export function getRouter() {
    return _router;
}
