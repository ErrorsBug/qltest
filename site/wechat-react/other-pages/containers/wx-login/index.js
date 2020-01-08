import React,{Component} from 'react';
import {connect} from 'react-redux';

import Page from 'components/page';

class WXLogin extends Component {
    login() {
        window.location.href = '/wechat/page/mine';
    }

    render() {
        return (
            <Page title="登录" className="wx-login-ctn">
                <div className="op-box">
                    <div className="ql-title"><span className="ql-logo"></span></div>
                    <div className="description">再小的个体，也有自己的讲台</div>
                    <div className="btn-login" onClick={this.login.bind(this)}><span className="wx-logo"></span>微信登录</div>
                    <div className="login-tips">登录获取更多知识</div>
                </div>
            </Page>
        );
    }
}

const mapDispatchToProps = {};
const mapStateToProps = function(state) {
    return {};
};

module.exports = connect(mapStateToProps, mapDispatchToProps)(WXLogin);
