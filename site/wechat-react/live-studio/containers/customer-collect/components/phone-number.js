import React from 'react';
import PropTypes from 'prop-types';
import CommonInput from 'components/common-input';
import {validLegal, getVal} from 'components/util'

class PhoneNumber extends React.PureComponent {

    state = {
        openBtn: false,
        showBtn: false, 
        openCodeInput: false,
        interval: 60,
    }
    
    changeData = (e) => {
        const val = e.target.value
        this.props.changeData && this.props.changeData(this.props.index, e.target.value);
        if (val && /^1\d{10}$/.test(val) && this.defaultPhoneNum !== val) {
            this.toggleCheckBtn(true)
        } else {
            this.toggleCheckBtn(false)
        }
        if(val && this.defaultPhoneNum !== val) {
            if(this.state.showBtn != true) {
                this.setState({
                    showBtn: true
                })
            }
        } else {
            if(this.state.showBtn != false) {
                this.setState({
                    showBtn: false
                })
            }
        }
    }

    // 切换按钮状态
    toggleCheckBtn = (openBtn) => {
        if (openBtn !== this.state.openBtn) {
            this.setState({
                openBtn
            })
            this.props.onChangeCheckBtn && this.props.onChangeCheckBtn(openBtn)
        }
    }

    lock = false
    timer = null
    getCode = async () => {
        
        if (this.lock) return
        this.lock = true

        const res = await this.props.sendValidCode({phoneNum: this.props.item.content})
        if (res && res.state) {
            if (res.state.code == 0) {
                let interval = this.state.interval
                this.setState({
                    openCodeInput: true,
                    interval: interval - 1
                })
                
                // 更新校验信息
                this.props.changeValidCode && this.props.changeValidCode({
                    ...this.props.validCode,

                    messageId: res.data.messageId
                })

                if (this.timer) clearInterval(this.timer)
                this.timer = setInterval(() => {
                    interval--
                    if (interval > 0) {
                        this.setState({
                            interval
                        })
                    } else {
                        clearInterval(this.timer)
                        this.setState({
                            interval: 60
                        })
                    }
                }, 1000);
            } else {
                window.toast(res.state.msg)
            }
        }
        this.lock = false
    }

    defaultPhoneNum = null
    componentDidMount () {
        if (this.props.item.content) {
            this.defaultPhoneNum = this.props.item.content
        }
    }

    changeValidCode = (e) => {
        if(/^\d{0,}$/.test(e.target.value)) {
            this.props.changeValidCode && this.props.changeValidCode({
                ...this.props.validCode,
    
                code: e.target.value
            })
        }
    }

    render () {
        const {
            item,
            validCode
        } = this.props
        const {
            openBtn = false,
            interval,
            openCodeInput
        } = this.state

        return (
            <li>
                <div className="main-flex">
                    <span className="title">
                        {item.isRequired == 'Y' && <i>*</i>}
                        {item.fieldValue}
                    </span>
                    <span className="value-box">
                        <CommonInput
                            className="text-input"
                            type="number"
                            noIntoView={true}
                            onFocus={this.props.onFocus}
                            onChange={this.changeData}
                            placeholder='请输入你的手机号'
                            value = {item.content || ''}
                        />
                        {
                            this.state.showBtn &&
                            <>
                            {
                                !openBtn || interval < 60 ? 
                                <span className="check-code-btn disable">{interval < 60 ? `已发送${interval}s` : '获取验证码'}</span>
                                :
                                <span className="check-code-btn" onClick={this.getCode}>获取验证码</span>
                            }
                            </>
                        }
                    </span>
                    {
                        openCodeInput ?
                        <span className="value-box">
                            <CommonInput
                                className="text-input"
                                type="number"
                                noIntoView={true}
                                onFocus={this.props.onFocus}
                                onChange={this.changeValidCode}
                                placeholder='请输入你的验证码'
                                value = {validCode && validCode.code || ''}
                            />
                        </span> : null
                    }
                </div>    
            </li>
        )
    }
}

PhoneNumber.propTypes = {
    
};

export default PhoneNumber;