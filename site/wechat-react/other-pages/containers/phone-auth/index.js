import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Page from 'components/page';
import { 
    InputPhone,
    InputVeriCode,
    InputPassword,
    GetVeriCode,
    checkPhone,
    checkVeriCode,
    checkPassword,
} from 'components/phone-auth';

import { request, getUserInfo } from 'common_actions/common';
import { getVal } from 'components/util';



class PhoneAuth extends React.Component {
    state = {
        phoneNum: '',
        veriCode: '',
        password: '',
        bindStatus: '',

        phoneNumPlaceholder: '',
    }

    async componentDidMount() {
        await this.props.getUserInfo();
        if (this.props.userInfo.mobile) {
            this.setState({
                phoneNumPlaceholder: this.props.userInfo.mobile,
            })
        }
    }

    render() {
        return <Page title="绑定手机号码" className='p-phone-auth'>
            <div className="desc"><span>根据国家法律法规要求,请先进行手机号验证</span></div>
            <div className="line-wrap">
                <InputPhone
                    onChange={this.onChangePhoneNum}
                    value={this.state.phoneNum}
                    placeholder={this.state.phoneNumPlaceholder || '请输入你的手机号码'}
                />
            </div>
            {
                !!this.state.phoneNumPlaceholder &&
                <div className="desc">您可以绑定已填写过的手机号,如更换,<span>请重新填写并绑定</span></div>
            }
            <div className="line-wrap c-flex">
                <InputVeriCode
                    onChange={this.onChangeVeriCode}
                    value={this.state.veriCode}
                />
                <GetVeriCode
                    phoneNum={this.state.phoneNum || this.state.phoneNumPlaceholder}
                />
            </div>
            <div className="line-wrap">
                <InputPassword
                    onChange={this.onChangePassword}
                    value={this.state.password}
                />
            </div>
            
            {
                this.state.bindStatus !== 'pending' && this.canBind
                    ?
                    <div
                        className="btn-bind on-log"
                        data-log-name="提交绑定手机号"
                        data-log-region="submit-user-info"
                        data-log-pos="phone-auth"
                        onClick={this.onClickBind}
                    >
                        确定
                    </div>
                    :
                    <div className="btn-bind disabled">确定</div>
            }

            <div className="tips">绑定后可在APP使用手机号+密码登录</div>
        </Page>
    }

    onClickBind = () => {
        if (/pending/.test(this.state.bindStatus)) return;

        if (!this.canBind) return;

        const params = {
            phoneNum: this.state.phoneNum || this.state.phoneNumPlaceholder,
            verifyCode: this.state.veriCode,
            password: this.state.password,
        }

        let toastMsg = '';
        if (toastMsg =
            checkPhone(params.phoneNum)
            || checkVeriCode(params.verifyCode)
            || checkPassword(params.password)
        ) return toast(toastMsg);

        this.setState({
            bindStatus: 'pending'
        })
        window.loading(true);
        
        request.post({
            url: '/api/wechat/transfer/h5/user/updatePhoneNum',
            body: params
        }).then(res => {
            window.toast('验证成功');
            this.setState({
                bindStatus: 'success',
            })
            
            if (this.props.location.query.redirect) return location.replace(decodeURIComponent(this.props.location.query.redirect));

            history.back();

        }).catch(err => {
            window.toast(err.message);
            this.setState({
                bindStatus: '',
            })
        }).then(() => {
            window.loading(false);
        })
    }

    get canBind() {
        return this.isPhoneNumValid && this.state.veriCode && this.isPasswordValid;
    }

    get isPhoneNumValid() {
        return this.state.phoneNum || this.state.phoneNumPlaceholder;
    }

    get isPasswordValid() {
        return this.state.password;
    }

    onChangePhoneNum = e => this.setState({phoneNum: e.target.value.trim()})

    onChangeVeriCode = e => this.setState({veriCode: e.target.value.trim()})

    onChangePassword = e => this.setState({password: e.target.value.trim()})
}




module.exports = connect(state => {
    return {
        userInfo: getVal(state, 'common.userInfo.user', {}),
    }
}, {
    getUserInfo,
})(PhoneAuth);

