import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import CommonInput from "components/common-input";
import Picker from "components/picker";
import { locationTo, validLegal, formatDate } from "components/util";
import Page from 'components/page';
import Detect from '@ql-feat/detect';
import QRCode from 'qrcode.react';
import Clipboard from 'clipboard';

import { get } from 'lodash';

import {
    getIdentifyingCode,
    identityValidCode,
} from "../../../actions/live";

import {
	userBindKaiFang,
} from 'actions/recommend';

import { saveUserInfo,saveUserInfos, contract,contracts, newJoinPeriod } from '../../../actions/training'
import { getUrlParams, fillParams } from 'components/url-utils';
@autobind
class trainingStudentInfo extends Component {

	state = {
        title: '',
        step: 1,
        second: 0,
        selectedTag: ['0'],
        tagArr: [{
            label: '全日制学生',
            value: '全日制学生'
        }, {
            label: '生产人员',
            value: '生产人员'
        }, {
            label: '市场/公关人员',
            value: '市场/公关人员'
        }, {
            label: '客服人员',
            value: '客服人员'
        }, {
            label: '行政/后勤人员',
            value: '行政/后勤人员'
        }, {
            label: '人力资源',
            value: '人力资源'
        }, {
            label: '财务/审计人员',
            value: '财务/审计人员'
        }, {
            label: '文职/办事人员',
            value: '文职/办事人员'
        }, {
            label: '技术/研发人员',
            value: '技术/研发人员'
        }, {
            label: '管理人员',
            value: '管理人员'
        }, {
            label: '教师',
            value: '教师'
        }, {
            label: '顾问/咨询',
            value: '顾问/咨询'
        }, {
            label: '专业人士(如会计师、律师、建筑师、医护人员、记者等)',
            value: '专业人士(如会计师、律师、建筑师、医护人员、记者等)'
        }, {
            label: '其他',
            value: '其他'
        }],
        career: '请选择',
        showInput: false, 
        phoneNum: '', // 手机号
        weChatCount: '', // 微信号
        identifyingCode: '', // 验证码
        qrcodeUrl: '',
        isPic: false,// 是图片还是链接
        qrCodeBase64: '', 
        hasMobile: false, // 是否有手机号了
        studentNo:'',
    }
    data = {
        isGetCode: false
    }

	get channelId() {
		return this.props.location.query.channelId || '';
	}

    componentWillMount() {
        this.initUserInfo()
        let isJoinCamp = get(this.props.training.periodChannel, 'isJoinCamp')
        // 没报名的 让他报名先
        if (isJoinCamp != 'Y') {
            newJoinPeriod(this.channelId)
        }
        this.userBindKaiFang();
    }

    // 初始化绑定三方
	async userBindKaiFang() {
		const kfAppId = this.props.location.query.kfAppId;
		const kfOpenId = this.props.location.query.kfOpenId;
		if (kfAppId && kfOpenId) {
			// 绑定分销关系
			this.props.userBindKaiFang(kfAppId, kfOpenId);
		} 
	}

     // 检查数据。
     checkData() {
        if (!validLegal("text", "微信号", this.state.weChatCount)) {
            return false;
        }
        if (!validLegal("phoneNum", "手机号", this.state.phoneNum)) {
            return false;
        }
        if (!this.data.isGetCode) {
            window.toast("请先获取验证码", 1000);
            return false;
        }
        if (!/^\d{6}$/.test(this.state.identifyingCode)) {
            window.toast("验证码错误", 1000);
            return false;
        }
        
        if (this.state.career == "" || this.state.career == '请选择') {
            window.toast("请选择职业", 1000);
            return false;
        }
        return true;
    }

    /**
     * 根据用户信息判断需要在哪个级别展示
     */
    initUserInfo() {
        let campUsre = this.props.training.userInfo || {}
        let step = 1
        if (campUsre.contractTime) {
            step = 3
            this.initClipboard()
        } else if (campUsre.mobile && campUsre.wechat && campUsre.profession) {
            step = 2
        } else if (campUsre.mobile) {
            // 兼容表里面已经有用户手机号码了
            this.setState({
                hasMobile: true,
                identifyingCode: 111111,
                phoneNum: campUsre.mobile
            })
            this.data.isGetCode = true
        }
        this.setState({
            step,
            title: get(this.props.training.periodChannel, 'periodPo.campName') || '训练营信息填写'
        }, () => {
            // 第三步需要初始化二维码
            this.renderQrcodeUrl()
        })
    }

    /**
     * 初始化微信二维码
     */
    renderQrcodeUrl() {
        let referralLink = get(this.props.training.periodChannel, 'periodPo.referralLink')
        if (this.state.step == 3 && referralLink) {
            // 判断是链接  还是图片链接
            if (referralLink.match(/\.(jpeg|jpg|gif|png)$/)) {
                this.setState({
                    isPic: true,
                    qrCodeBase64: referralLink
                })
            } else {
                this.setState({
                    isPic: false,
                    qrcodeUrl: referralLink,
                }, () => {
                    const canvas = this.refs['qr-canvas'].getElementsByTagName('canvas')[0]
                    const qrCodeBase64 = canvas.toDataURL('image/png')
                    this.setState({
                        qrCodeBase64
                    })
                });
            }
        }
    }

    /**
     * 初始化复制面板
     */
    initClipboard() {
        var clipboard = new Clipboard(".copy-btn");
		clipboard.on('success', (e) => {
            window.toast('复制成功！');
            
		});
		clipboard.on('error', () => {
            window.toast('复制失败！请手动复制');
           
		});
    }
    
    /**
     *
     * 修改手机号
     * @param {any} e
     * @memberof LiveAuth
     */
    changePhone(e) {
        this.setState({
            phoneNum: e.target.value
        });
    }
    changeWechat(e) {
        this.setState({
            weChatCount: e.target.value
        });
    }
    changeCode(e) {
        this.setState({
            identifyingCode: e.target.value
        });
    }
    changeCareer(e) {
        this.setState({
            career: e.target.value
        });
    }
    selectTagHandle(data) {
        if (data[0] == '其他') {
            this.setState({
                showInput: true,
                career: ''
            },() => {
                setTimeout(() => {
                    document.getElementsByClassName('input-else')[0].focus()
                }, 50)
            })
        } else {
            this.setState({
                career: data[0]
            })
        }
    }
    async getCode() {
        if (validLegal("phoneNum", "手机号", this.state.phoneNum)) {
            if (this.data.isGeting) {
                return false;
            }
            this.data.isGeting = true;
            let result = await this.props.getIdentifyingCode({
                phoneNum: this.state.phoneNum
            });
            if (result.state && result.state.code == 0) {
                this.codeIntervel();
                this.data.isGeting = false;
                this.data.isGetCode = true;
                this.data.messageId = result.data.messageId;
            } else {
                window.toast(result.state.msg);
                this.data.isGeting = false;
            }
        }
    }

    codeIntervel() {
        if (!this.itvStart) {
            this.setState({
                second: 60
            },() => {
                    this.itvStart = setInterval(() => {
                        if (this.state.second == 0) {
                            clearInterval(this.itvStart);
                            this.itvStart = false
                        } else {
                            this.setState({
                                second: this.state.second - 1
                            });
                        }
                    }, 1000);
                }
            );
        }
    }

    async handleNextStep() {
        if (this.checkData()) {
            // 有手机号走这边
            if (this.state.hasMobile) {
                let { phoneNum, weChatCount, career } = this.state
                if (this.state.showInput) {
                    career = `其他_${career}`
                } 
                let result = await this.saveUserData();
                if (result && result.state && result.state.code === 0) {
                    this.changeStep()
                } else {
                    window.toast(result.state.msg);
                }
            } else {
                this.props
                .identityValidCode({
                    messageId: this.data.messageId,
                    code: this.state.identifyingCode,
                    phoneNum: this.state.phoneNum
                })
                .then(async result => {
                    if (result && result.state && result.state.code === 0) {
                        let { phoneNum, weChatCount, career } = this.state
                        if (this.state.showInput) {
                            career = `其他_${career}`
                        } 
                        return await this.saveUserData()
                    } else {
                        window.toast(result.state.msg);
                        return false;
                    }
                })
                .then(result => {
                    if (result && result.state && result.state.code === 0) {
                        this.changeStep()
                    } else {
                        window.toast(result.state.msg);
                    }
                });
            }
        }
    }
    async saveUserData(){
        let { phoneNum, weChatCount, career } = this.state
        let result=false
        if(getUrlParams('channelIds','')){
            let channelIds=getUrlParams('channelIds','').split(',')
            result = await saveUserInfos({
                channelIds,
                wechat: weChatCount,
                profession: career,
                mobile: phoneNum
            });
        }else{
            result = await saveUserInfo({
                channelId: this.channelId,
                wechat: weChatCount,
                profession: career,
                mobile: phoneNum
            });
        }
        return result  
    }
    async handleAnswer() {
        let result=false
        if(getUrlParams('channelIds','')){
            let channelIds=getUrlParams('channelIds','').split(',')
            result = await contracts(channelIds) 
            this.setState({
                studentNo: result?.data?.studentNo
            })
        }else{
            result = await contract(this.channelId)
        }
        if (result && result.state && result.state.code === 0) {
            this.changeStep()
        } else {
            window.toast(result.state.msg);
        }
    }

    changeStep() {
        this.setState({
            step: ++this.state.step
        }, () => {
            if(this.state.step == 3) {
                this.initClipboard()
                this.renderQrcodeUrl()
            }
        })
    }

    // 隐藏所有input的焦点 使移动端的键盘掉下去
    hideInputBlur() {
        let inputArr = document.getElementsByTagName('input')
        Array.from(inputArr).forEach(item => item.blur())
    }

    handleToTrainLearn() { 
        locationTo(fillParams(this.props.location.query||{},`/wechat/page/training-learn`) )
    }

    showImageView() {
        window.showImageViewer(this.state.qrCodeBase64, [this.state.qrCodeBase64]);
    }
	render(){
        let { title, step, second, career, qrcodeUrl, hasMobile, isPic,studentNo } = this.state
        let { userInfo } = this.props.training 
        let startTime = get(this.props.training.periodChannel, 'periodPo.startTime')
		return (
			<Page title={title} className='training-student-info-wrap'>
				<div className="step-bar">
                    <div className={`step-item ${step >= 1 ? 'active': ''}`}>1.完善信息</div>
                    <div className={`step-item ${step >= 2 ? 'active': ''}`}>2.学员公约</div>
                    <div className={`step-item ${step >= 3 ? 'active': ''}`}>3.开始学习</div>
                </div>

                {
                    step == 1 &&
                    <div className="student-step-wrap student-step-1">
                        <div className="info-group">
                            <div className="title">你的微信号</div>
                            <div className="input">
                                <CommonInput
                                    noscrollView={true}
                                    className="input-bar"
                                    placeholder="手机号/微信号（非昵称）"
                                    value={this.state.weChatCount}
                                    onChange={this.changeWechat}
                                />
                            </div>
                        </div>

                        <div className="info-group">
                            <div className="title">手机号</div>
                            <div className="input">
                            {
                                hasMobile ? 
                                <div className="input-bar input-disable">{this.state.phoneNum}</div>
                                :
                                <CommonInput
                                    noscrollView={true}
                                    className="input-bar"
                                    placeholder="请输入手机号码"
                                    value={this.state.phoneNum}
                                    onChange={this.changePhone}
                                />
                            }
                            </div>
                        </div>
                        {
                            !hasMobile && <div className="info-group">
                            <div className="title">验证码</div>
                                <div className="input">
                                    <CommonInput
                                        noscrollView={true}
                                        className="input-bar"
                                        placeholder="请输入验证码"
                                        value={this.state.identifyingCode}
                                        onChange={this.changeCode}
                                    />
                                    {second ? (
                                        <span className="btn-get-code">
                                            {second}S
                                        </span>
                                    ) : (
                                        <span
                                            className="btn-get-code"
                                            onClick={this.getCode}
                                        >
                                            获取验证码
                                        </span>
                                    )}
                                </div>
                            </div>
                        }
                        

                        <div className="info-group">
                            <div className="title">你的职业</div>
                            <div className="input">
                                {   this.state.showInput ?
                                    <CommonInput
                                        noscrollView={true}
                                        className="input-bar input-else"
                                        placeholder="请输入其他职业"
                                        value={this.state.career}
                                        onChange={this.changeCareer}
                                    />
                                    :
                                    <Picker
                                        className="picher-style"
                                        col={1}
                                        data={this.state.tagArr}
                                        value={this.state.selectedTag}
                                        title="请选择"
                                        onChange={this.selectTagHandle}
                                        onPickerChange={() => {this.hideInputBlur()}}
                                    >
                                        <div className="select-tag">
                                            <div className="select-placeholder">{career}</div>
                                            <i className="icon_enter" />
                                        </div>
                                    </Picker>
                                }

                            </div>
                        </div>

                        <div className="btn common-btn" onClick={this.handleNextStep}>下一步</div>
                    </div>
                }

                {
                    step == 2 && 
                    <div className="student-step-wrap student-step-2">
                        <div className="convention-header">
                            <div className="line"></div>
                            <div className="convention-title">
                                学员公约
                            </div>
                            <div className="line"></div>
                        </div>
                        <div className="convention-contnet">
                            <p className="convention-main"> 
                                为保证您的学习效果和其他学员的学习体验,开学 前需做以下承诺,
                            </p>
                            <ul className="convention-ul">
                                <li className="convention-li">
                                    1.认真完成学习任务，遵守课程规则
                                </li>
                                <li className="convention-li">
                                    2.配合班主任/助教工作，积极帮助其他学员完成训练
                                </li>
                                <li className="convention-li">
                                    3.完成自己定下的目标，按时按量，只为自己
                                </li>
                            </ul>
                        </div>

                        <div className="convention-tip">如对《学员公约》有异议，请到「千聊训练营」公众号提交疑问</div>

                        <div className="btn common-btn" onClick={this.handleAnswer}>同意</div>
                    </div>
                }
                {
                    step == 3 &&
                    <div className="student-step-wrap student-step-3">
                        <div className="start-header">
                            <div className="start-time">
                                开营时间：{formatDate(startTime, 'MM月dd日')}&nbsp;请添加班主任微信
                            </div>
							<div className="tips">(请务必加班主任为好友，否则影响上课)</div>
                        </div>

                        <div className="start-port start-port-one">
                            <div className="start-bage">01</div>
                            <div className="start-content mt10">
                                <div className="title">请务必复制学号，用于微信好友验证</div>
                                <div className="student-num">
                                    <span className="num-title">学号：</span>
                                    <div className="num">{studentNo||userInfo?.studentNoMerge||userInfo?.studentNo}</div>
                                    <div className="btn outlint-btn copy-btn on-log" data-log-region="information_copy" data-clipboard-text={studentNo||userInfo?.studentNoMerge||userInfo?.studentNo}>复制学号</div>
                                </div>
                            </div>
                        </div>

						<div className="start-port start-port-shili">
							<div className="start-title">示例</div>
							<div className="start-img">
								<img className="example-img" src={require('./img/example.png')} />
							</div>
						</div>

                        <div className="start-port start-port-two">
                            <div className="start-bage">02</div>
                            <div className="start-content">
                                <div className="title">长按识别二维码，添加班主任微信</div>
                                <div className="tip">注：因微信限制，班主任会在三天内通过验证，请耐心等候</div>
                            </div>
                        </div>
						<div className='qrcode-wrap' ref="qr-canvas">
							<img
								style={{pointerEvents: !Detect.os.phone && 'none'}}
								className='qrcode-image'
								src={this.state.qrCodeBase64}
								onClick={this.showImageView}/>
							{
								!isPic &&
								<QRCode
									style={{display: 'none'}}
									value={qrcodeUrl} />
							}
						</div>
                        <div className="btn common-btn" onClick={this.handleToTrainLearn}>返回训练营</div>

                    </div>
                }
			</Page>
		)
	}
}

const mapStateToProps = function(state) {
	return {
        training: get(state, 'training') || {},
    }
};

const mapActionToProps = {
    getIdentifyingCode,
    identityValidCode,
    userBindKaiFang
};

module.exports = connect(mapStateToProps, mapActionToProps)(trainingStudentInfo);