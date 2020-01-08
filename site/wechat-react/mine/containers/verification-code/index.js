import React, { Component } from 'react'
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import { validLegal, locationTo } from 'components/util';
import { sendValidCode, checkoutCode, userInfo } from '../../actions/camp'

@autobind
class LogOutRule extends Component {
    state = {
        // 手机号码
        phoneNumber: '',
        // 是否获取验证码
        getCaptchaFlag: false,
        // 间隔秒数
        secondsCounter: 60,
        //秒数显示
        timer: false,
        // 验证码
        codeNum: {
            code1: '',
            code2: '',
            code3: '',
            code4: '',
            code5: '',
            code6: ''
        },
        messageId:''
    }
    data = {
        // 定时器ID
        intervalTimer: 0,
    }
    componentDidMount =  async () => {
        this.getPhone()
        this.inputRes1.focus()
    }
    //检查手机号码的合法性
    checkPhoneNumber = () => {
        if( this.state.phoneNumber != '' ){
            const phoneNumber = this.state.phoneNumber;
            return validLegal('phoneNum', '手机号码', phoneNumber);
        }else {
            return
        }  
    }

    //获取用户电话号码
    getPhone = async () => {
        let { user } = await userInfo()
        this.setState({
            phoneNumber: user.mobile || ''
        },() => {
            this.getCaptcha()
        })
    }
    //获取messageId
    getMassageId = (val) => {
        this.setState({
            messageId:val
        })
    }
    //获取短信验证码
    getCaptcha = async () => {
        if (!this.checkPhoneNumber()) {
            return false;
        }
        this.setState({
            getCaptchaFlag: true
        });
        let secondsCounter = this.state.secondsCounter;
        const intervalTimer = this.data.intervalTimer = setInterval(() => {
            if (secondsCounter > 1) {
                let timer = true
                this.setState({
                    secondsCounter: --secondsCounter,
                    timer
                });
            } else {
                let timer = false
                clearInterval(intervalTimer);
                this.setState({
                    getCaptchaFlag: false,
                    secondsCounter: 60,
                    timer
                })
            }
        }, 1000);
        const result = await sendValidCode({ phoneNum: this.state.phoneNumber });
        if (result?.state?.code === 0) {
            this.getMassageId(result.data.messageId)
            this.data.messageId = result.data.messageId;
        } else {
            // 发送短息验证码失败
            window.toast(result?.state?.msg || "发送短息验证码失败");
            this.setState({
                getCaptchaFlag: false,
                secondsCounter: 60
            })
        }
    }
    //跳转确认注销页面
    skipToEnterPage = () => {
        locationTo('/wechat/page/mine/enter-logout')
    }
    //限定只能输入一个数字 && 输入后下个输入框自动获取焦点
    examineInput = async (index, captchaRes, e) => {
        let codeNum = captchaRes
        if(e.target.value == '' && index > 1){
            this[`inputRes${index-1}`].focus()
        }
        if(!!codeNum[`code${index}`] && e.target.value == ''){
            codeNum[`code${index}`] = ''
            this.setState({
                codeNum
            })
        }
        //判断是否在0-9之间
        if(/^\+?(0|[1-9][0-9]*)$/.test(e.target.value) == false){
            codeNum[`code${index}`] = ''
            this.setState({
                codeNum
            })
            return false
        }
        if( index < 6 && codeNum[`code${index}`] == ""){
            this[`inputRes${index+1}`].focus()
        } else {
            this[`inputRes${index}`].focus()
        }
        codeNum[`code${index}`] = e.target.value
        this.setState({
            codeNum
        })
        if( codeNum.code1
            && codeNum.code2
            && codeNum.code3
            && codeNum.code4
            && codeNum.code5
            && codeNum.code6
            ) {
            let captcha = codeNum.code1 + codeNum.code2 + codeNum.code3 + codeNum.code4 + codeNum.code5 + codeNum.code6
            let { phoneNumber, messageId } = this.state
            window.loading(true);
            let result = await checkoutCode({phoneNum:phoneNumber,code:captcha,messageId})
            window.loading(false);
            if (result?.state?.code === 0) {
                //跳转到确认注销页面
                this.skipToEnterPage()
            } else {
                this.setState({
                    codeNum: {
                        code1: '',
                        code2: '',
                        code3: '',
                        code4: '',
                        code5: '',
                        code6: ''
                    },
                })
                this[`inputRes${1}`].focus()
                // 验证错误
                window.toast(result?.state?.msg || '验证错误');
            }
        }
    }
    // componentWillUnmount = () => {
    //     // 清除定时器
    //     clearInterval(this.data.intervalTimer);
    // }

    render() {
        const { secondsCounter, timer, codeNum, phoneNumber } = this.state
        
        return (
            <Page title="输入验证码" className="verification-code">
                <div className="verification-code-box">
                    <div className="title">
                        <p>请输入验证码</p>
                    </div>
                    <div className="phone-num">
                        <p>
                            已发送验证码至 
                            {phoneNumber && <span>{phoneNumber}</span>}
                        </p>
                        <p className={timer ? 'regain-color' : 'regain'} onClick={this.getCaptcha}>
                            重新获取 
                            <span style={timer ? { display: 'block' } : { display: 'none' }}>
                                ({secondsCounter}s)
                            </span>
                        </p>
                    </div>
                    <div className="verification-code-input">
                        <input 
                            ref={ele => this.inputRes1 = ele} 
                            onChange={this.examineInput.bind(this, 1, codeNum)} 
                            value={codeNum.code1}
                            maxLength='1'
                        />
                        <input 
                            ref={ele => this.inputRes2 = ele} 
                            onChange={this.examineInput.bind(this, 2, codeNum)} 
                            value={codeNum.code2}
                            maxLength='1'
                        />
                        <input 
                            ref={ele => this.inputRes3 = ele} 
                            onChange={this.examineInput.bind(this, 3, codeNum)} 
                            value={codeNum.code3}
                            maxLength='1'
                        />
                        <input 
                            ref={ele => this.inputRes4 = ele} 
                            onChange={this.examineInput.bind(this, 4, codeNum)} 
                            value={codeNum.code4}
                            maxLength='1'
                        />
                        <input 
                            ref={ele => this.inputRes5 = ele} 
                            onChange={this.examineInput.bind(this, 5, codeNum)} 
                            value={codeNum.code5}
                            maxLength='1'
                        />
                        <input 
                            ref={ele => this.inputRes6 = ele} 
                            onChange={this.examineInput.bind(this, 6, codeNum)} 
                            value={codeNum.code6}
                            maxLength='1'
                        />
                    </div>
                </div>
            </Page>
        );
    }
}

const mapStateToProps = function (state) {

};

const mapActionToProps = {
    sendValidCode
};

module.exports = connect(mapStateToProps, mapActionToProps)(LogOutRule);