import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { request } from 'common_actions/common';
import { render, modal } from 'components/indep-render';
import MiddleDialog from 'components/dialog/middle-dialog';
import { getLocalStorage, setLocalStorage } from '../util';



export default class WinPhoneAuth extends React.PureComponent {
    static defaultProps = {
        close: true,
    }

    state = {
        phoneNum: '',
        veriCode: '',
        password: '',
        bindStatus: '',
    }

    render() {
        return <MiddleDialog show close={this.props.close} bghide={this.props.close}
            onClose={this.onClose}
            className="co-phone-auth-modal"
        >
            <div className="co-phone-auth">
                <div className="title">验证手机</div>
                <div className="desc">根据国家法律法规要求,请先进行手机号验证</div>
                <div className="line-wrap">
                    <InputPhone
                        onChange={this.onChangePhoneNum}
                        value={this.state.phoneNum}
                    />
                </div>
                <div className="line-wrap c-flex">
                    <InputVeriCode
                        onChange={this.onChangeVeriCode}
                        value={this.state.veriCode}
                    />
                    <GetVeriCode
                        phoneNum={this.state.phoneNum}
                    />
                </div>
                {
                    this.props.needPassword &&
                    <div className="line-wrap">
                        <InputPassword
                            onChange={this.onChangePassword}
                            value={this.state.password}
                        />
                    </div>
                }
                
                <div className={classNames("btn-bind", {disabled: this.state.bindStatus === 'pending' || !this.canBind})}
                    onClick={this.onClickBind}
                >验证</div>
            </div>  
        </MiddleDialog>
    }

    onClickBind = () => {
        if (/pending/.test(this.state.bindStatus)) return;

        if (!this.canBind) return;

        const params = {
            phoneNum: this.state.phoneNum,
            verifyCode: this.state.veriCode,
        }

        let toastMsg = '';
        if (toastMsg = 
            checkPhone(params.phoneNum)
            || checkVeriCode(params.verifyCode)
        ) return toast(toastMsg);

        if (this.props.needPassword) {
            if (toastMsg = 
                checkPassword(this.state.password)
            ) return toast(toastMsg);
            params.password = this.state.password;
        }

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

            typeof this.props.onSuccess === 'function' && this.props.onSuccess({mobile: params.phoneNum});

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
        return this.isPhoneNumValid && this.state.veriCode && (!this.props.needPassword || this.state.password);
    }

    get isPhoneNumValid() {
        return this.state.phoneNum;
    }

    onClose = () => {
        typeof this.props.onClose === 'function' && this.props.onClose();
    }

    onChangePhoneNum = e => this.setState({phoneNum: e.target.value.trim()})

    onChangeVeriCode = e => this.setState({veriCode: e.target.value.trim()})
    
    onChangePassword = e => this.setState({password: e.target.value.trim()})
}




export class InputPhone extends React.PureComponent {
    render() {
        return <div className="co-phone-auth-input">
            <span className="icon-phone"></span>
            <input type="number"
                placeholder="请输入你的手机号码"
                onBlur = {()=>{document.body.scrollIntoView()}}
                {...this.props}
            />
        </div>
    }
}

export class InputVeriCode extends React.PureComponent {
    render() {
        return <div className="co-phone-auth-input">
            <span className="icon-message"></span>
            <input type="number"
                onBlur = {()=>{document.body.scrollIntoView()}}
                placeholder="请输入验证码"
                {...this.props}
            />
        </div>
    }
}

export class InputPassword extends React.PureComponent {
    render() {
        return <div className="co-phone-auth-input">
            <span className="icon-password"></span>
            <input type="password"
                placeholder="请输入密码，最少8位"
                {...this.props}
            />
        </div>
    }
}



export function checkPhone(num) {
    num = String(num);
    if (num.length !== 11) return '请输入11位手机号码';
    if (!/^1\d{10}/.test(num)) return '请输入有效手机号码';
}

export function checkVeriCode(code) {
    code = String(code);
    if (code.length !== 6) return '请输入有效验证码';
}

export function checkPassword(pw) {
    pw = String(pw);
    if (pw.length < 8) return '密码长度最少为8位';
    // if (!(/[0-9]/.test(pw) && /[a-zA-Z]/.test(pw))) return '密码最少包含数字和字母的组合';
}



export class GetVeriCode extends React.PureComponent {
    static propTypes = {
        phoneNum: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        onClick: PropTypes.func,
        onChange: PropTypes.func,
        retryTime: PropTypes.number,
    }

    static defaultProps = {
        retryTime: 60,
    }

    state = {
        status: '',
        restTime: 0,
    }

    render() {
        return this.state.restTime > 0
            ?
            <div className="co-get-veri-code disabled">
                {this.state.restTime}秒后重试
            </div>
            :
            <div className="co-get-veri-code" onClick={this.getVeriCode}>
                获取验证码
            </div>
    }

    emitChange(state) {
        state = {...state};
        this.setState(state, () => {
            typeof this.props.onChange === 'function' && this.props.onChange(state);
        })
    }

    getVeriCode = () => {
        if (/pending/.test(this.state.status)) return;

        let toastMsg = '';
        if (toastMsg =
            checkPhone(this.props.phoneNum)
        ) return toast(toastMsg);

        this.emitChange({
            status: 'pending',
        })
        
        request({
            url: '/api/wechat/transfer/h5/validCode/send',
            method: 'POST',
            throwWhenInvalid: true,
            body: {
                phoneNum: this.props.phoneNum,
            }
        }).then(res => {
            window.toast('验证码已发送');
            this.emitChange({
                status: 'success',
                messageId: res.data.messageId,
            })
            
            this.setRestTime(this.props.retryTime);
        }).catch(err => {
            window.toast(err.message);
            this.emitChange({
                status: '',
            })
        })
    }

    setRestTime(time) {
        clearTimeout(this.timer);
        if (!(time > 0)) time = 0;
        this.setState({
            restTime: time,
        })
        if (time > 0) {
            this.timer = setTimeout(() => {
                this.setRestTime(--time);
            }, 1000)
        }
    }
}



// 未绑定手机号，每五次提示一次
export function judgeShowPhoneAuthGuide(key = 'JUDGE_SHOW_PHONE_AUTH_GUIDE') {
    let times = Number(getLocalStorage(key)) || 0;
    times = times % 5;
    setLocalStorage(key, times + 1);
    if (times == 0) {
        return true;
    }
}



export function showWinPhoneAuth({
    onSuccess,
    ...props
} = {}) {
    return new Promise((resolve, reject) => {
        let destroy;
        const _onSucccess = function (res) {
            onSuccess && onSuccess(res);
            destroy && destroy();
            resolve(res);
        }
        const onClose = function () {
            destroy && destroy();
            resolve(false);
        }
        let ins = <WinPhoneAuth {...props} onSuccess={_onSucccess} onClose={onClose}/>;
        destroy = render(ins);
    })
}



export function showPhonAuthGuide() {
    return modal({
        close: true,
        className: 'dialog-modal phone-auth-guide',
        title: '绑定手机',
        children: <p style={{color: '#999', textAlign: 'left'}}>根据<span className="red">《中华人民共和国网络安全法》</span>要求，自2017年6月1日起使用信息发布、即时通讯等互联网服务<span className="red">需进行身份信息验证</span>。为保障您的使用体验，建议尽快完成<span className="red">手机号绑定验证</span>，感谢您的理解和支持。</p>,
        buttons: 'confirm',
        confirmText: '去绑定',
        onConfirm() {
            return true;
        },
        onCancel() {
            return false;
        }
    })
}