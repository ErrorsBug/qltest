import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { api } from '../../../../actions/common';
import { autobind } from 'core-decorators';
import { validLegal } from 'components/util';
import CommonInput from 'components/common-input';
@autobind
export class ApplyAgent extends Component {
    static propTypes = {
        // prop: PropTypes
        // 是否申请过
        isApply: PropTypes.string,
    }

    static defaultProps = {
        isApply: 'N'
    }

    constructor(props) {
        super(props)
        

        this.state = {
            isEdit: props.isApply === 'N',
            countDownNum: 0,
            isCountDowning: false,
            checkNum: '',
            messageId: '',
            selfMediaPrice: null,
        }
    }

    componentDidMount = () => {
        this.getSelfMediaPrice();
        // this.onInputFocus();
    }
    

    async sendCheckNum(phoneNum){
        if(this.state.isCountDowning) {
            return;
        }

        const isPass = validLegal("phoneNum", '手机号', phoneNum);
        if (!isPass) return;

        const result = await api({
            method: 'POST',
            showLoading: false,
            body: {phoneNum},
            url: '/api/wechat/sendValidCode',
        });

        if (result.state.code !== 0 ) {
            window.toast(result.state.msg);
            return ;
        }
        this.setState({
            countDownNum: 60,
            messageId: result.data.messageId,
        });
        this.startCountDown();
    }

    startCountDown() {
        this.setState({ isCountDowning: true });
        let timer = setInterval(()=>{
            if ( this.state.countDownNum === 0) {
                this.setState({ isCountDowning: false });
                clearInterval(timer);
                return
            }
            this.setState({ countDownNum: this.state.countDownNum - 1});
        },1000)
    }

    onCheckNumChange(e) {
        this.setState({ checkNum: String(e.target.value) });
    }

    async onApply(name, phoneNum) {
        const isPass = validLegal("phoneNum", '手机号', phoneNum) && validLegal("name", '姓名', name, 10);
        if (!isPass) return;
        if (this.state.checkNum === "") {
            window.toast("请输入验证码");
            return
        }
        if (this.state.checkNum.length !== 6) {
            window.toast("验证码输入有误");
            return
        }

        const result = await api({
            method: 'POST',
            showLoading: false,
            body: { 
                code: this.state.checkNum,
                messageId: this.state.messageId,
                phoneNum,
            },
            url: '/api/wechat/checkValidCode',
        });

        if (result.state.code !== 0 ) {
            // this.setState({ liveId: result.data.liveId });
            window.toast("验证码错误");
            return false;
        }
        const isSuccess = await this.props.submitApplyAgent();

        if(isSuccess) {
            this.setState({ isEdit: false});
        }
    }

    async getSelfMediaPrice() {
        const result = await api({
            method: 'POST',
            showLoading: false,
            url: '/api/wechat/live/mediaPrice',
        });

        if (result.state.code !== 0 ) {
            // this.setState({ liveId: result.data.liveId });
            window.toast(result.state.msg);
            return false;
        }
        this.setState({ selfMediaPrice: result.data.selfMediaBuy });
    }

    showEdit() {
        this.setState({ isEdit: true, checkNum: '' });
    }

    // async onInputFocus() {
    //     // setTimeout(e.target.scrollIntoView(), 200);
    //     // e.target.getBo
    //     await new Promise((resolve,reject) => setTimeout(resolve, 300))
    //     const element = document.querySelector(".edit-info");
    //     element.scrollIntoView(false);
    // }

    // scrollIntoView(element) {
    //     const windowHeight = document.body.clientHeight;
    //     const windowScrollHeight = document.body.scrollHeight;
    //     console.log(windowHeight, windowScrollHeight);
    //     const box = element.getBoundingClientRect();
    //     const eBottom = box.bottom;

    //     if (eBottom > windowHeight) return;


    //     console.log(eBottom)
    // }
    

    render() {
        const { isEdit, isCountDowning, countDownNum, checkNum, selfMediaPrice} = this.state;
        const { name, mobile, onApplyNameChange, onApplyMobileChange } = this.props; 
        return (
            <div className='apply-agent-container'>
                <div className="top-info">
                    <div className="top-title">招募代理</div>
                    <ul className="tip-list">
                        <li className="tip-name">
                            <span className="icon agent-icon"></span>代理福利
                        </li>
                        <li className="tip">
                            <span className="tip-num">1</span>
                            <span className="text">赠送价值<span className="high-light">{selfMediaPrice}元</span>的独立知识店铺，提供最强内容变现工具</span>
                        </li>
                        <li className="tip">
                            <span className="tip-num">2</span>
                            <span className="text">一键上架内容产品，坐享分成收益</span>
                        </li>
                        <li className="tip">
                            <span className="tip-num">3</span>
                            <span className="text">所有收益实时结算，提现实时到账</span>
                        </li>
                        <li className="tip">
                            <span className="tip-name">流程：</span>
                            <span className="text">申请 > 审核 > 分配比例 > 上架商品</span>
                        </li>
                    </ul>

                </div>
                <div className="bottom-info">
                    <div className="title">{ isEdit ? '请留下您的联系方式' : '您已提交申请，请核实信息'}</div>
                    {
                        isEdit 
                        ?
                        <div className="edit-info">
                            <div className="input-item">
                                <span className="label"> 姓{"   "}名：</span> 
                                <CommonInput className={`input ${name !== "" ? "input-content": ""}`} placeholder="请输入您的姓名" onChange={onApplyNameChange} value={name}/>
                            </div>
                            <div className="input-item">
                                <span className="label"> 手机号：</span> 
                                <CommonInput className={`input ${mobile !== "" ? "input-content": ""}`} placeholder="请输入您的手机号码" type="number" onChange={onApplyMobileChange} value={mobile}/> 
                                <span className={`get-check-num ${isCountDowning ? 'count' : ''}`} onClick={() => this.sendCheckNum(mobile)}>{isCountDowning ? countDownNum + 'S后重新获取':"获取验证码"}</span>
                            </div>
                            <div className="input-item">
                                <span className="label"> 验证码：</span> 
                                <CommonInput className={`input ${checkNum !== "" ? "input-content": ""}`} placeholder="请输入您的验证码" onChange={this.onCheckNumChange} value={checkNum}/>
                            </div>
                            <div className="apply-button-area">
                                <span className="apply-button" onClick={() => this.onApply(name, mobile)}>马上申请</span>
                            </div>
                        </div> 
                        :
                        <div className="show-info">
                            <div className="info-item">
                                <span className="label"> 姓{"   "}名：</span>
                                <span className="info">{name}</span>
                            </div>
                            <div className="info-item">
                                <span className="label"> 手机号：</span> 
                                <span className="info">{mobile}</span>
                                <span className="edit-btn" onClick={this.showEdit}>修改</span>
                            </div>
                        </div>
                    }
                </div>
                <div className="tail"></div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplyAgent)
