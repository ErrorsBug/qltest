import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { autobind, debounce, throttle } from 'core-decorators';
import Detect from 'components/detect';
import Switch from 'components/switch';
import { isNumberValid } from 'components/util';
import Picker from 'components/picker';
import Confirm from 'components/dialog/confirm';


@autobind
class GroupConfirmBox extends Component {
    data = {}
    state = {
        groupNum: '',
        discount: '',
        isOpenFree:false,
        joinTime: ['24'],
        joinTimeValue: '',
        joinTimeArr: [],
        simulationStatusActive: false
    }
    // componentDidMount() {
        // console.log("*************************");
        // this.setState({
        //     autoShare:this.props.curAutoShare==="Y"? true:false,
        //     autoPercent: this.props.curAutoPercent,
        // });
    // }
    componentWillMount() {
        let joinTimeArr = []
        for(let i = 0.5; i <= 48; i = i + 0.5) {
            joinTimeArr.push({
                value: `${i}`,
                label: `${i}小时`
            })
        }
        this.setState({
            joinTimeArr
        })
    }
    handleComfirmBtnTouch() {
        if (this.isNumber(this.state.groupNum) && this.isNumber(this.state.discount)) {
            if ( this.state.groupNum < 2 || this.state.groupNum > 50) {
                window.toast('人数范围 2~50 人');
                return;
            }
            if ( this.state.discount < 0.01 ) {
                window.toast('拼课优惠价格需大于0.01元')
                return;

            } 
            // discount + 0.005 是为了在用户输入超过超过两位小数的情况下，四舍五入后discount 仍小于系列课票价
            if (Number(this.state.discount) + 0.005 >= Number(this.props.curOriginPrice)) {
                window.toast(`拼课优惠价格需小于系列课票价`);
                return;
            }
            if(this.props.curAutoShare === 'Y' && !isNumberValid(this.props.curAutoPercent,1,80,'拼课佣金比例')){
                return;
            }

            
            const fixedDiscount = Number(this.state.discount).toFixed(2);
            const fixdGroupNum = Number(this.state.groupNum);
            const discountType = this.state.isOpenFree ? "P" : "GP";

            this.data = {
                fixedDiscount, 
                fixdGroupNum,
                discountType,
            }
            console.log(11111, this.state.simulationStatusActive, this.state.isOpenFree)
            // 如果有模拟拼课和团长免费  需要弹框
            if (this.state.simulationStatusActive && this.state.isOpenFree) {
                this.refs.freeConfirm.show()
                return
            }
            this.handleSaveChannelMarket()
        } else {
            if (this.state.groupNum === '') {
                window.toast('拼团人数只能为数字');
            } else if (this.state.discount === '') {
                window.toast('拼团价格只能为数字');
            } else {
                window.toast('输入不合法');
            }
        }
    }

    isNumber(input) {
        if (input !== null && input !== "") return !isNaN(input);
        return false;
    }

    handleGroupNumChange(e) {
        this.setState({
            groupNum: e.target.value,
        });
    }

    handleDiscoutChange(e) {
        this.setState({
            discount: e.target.value,
        });
    }

    hideConfirmBox() {
        this.setState({
            groupNum: '',
            discount: '',
        });
        this.box.style.top='';
        this.props.hideBox();
    }

    handleFocus(e) {
        if (Detect.os.phone && !Detect.os.iphone) {
            this.box.style.top='40px';
        }
    }


    OpenOrCloseAuto(){
        this.props.changeAutoShareStatus();
        setTimeout(() => {
            if(this.refs.autoPercentInput){
	            this.refs.autoPercentInput.scrollIntoView();
            }
        },500);
    }
    OpenOrCloseFree(){
        this.setState({
            isOpenFree:!this.state.isOpenFree
        });
    }

	autoPercentInputFocusHandle(e){
		const input = e.target;
		setTimeout(() => {
		   input.scrollIntoView(true);//自动滚动到视窗内
		},300)
    }
    /**
     * 选择拼团有效时间
     */
    selectJoinHandle (newValue) {
        let joinTimeValue = this.state.joinTimeArr.find(item => item.value == newValue[0]).label
        this.setState({
            joinTimeValue,
            joinTime: newValue
        })
    }
    handleQuestion() {
        this.refs.likeConfirm.show()
    }
    onLikeBtnClick() {
        this.refs.likeConfirm.hide()
    }
    simulationSwitchChangeHandle(){
		this.setState({
			simulationStatusActive: !this.state.simulationStatusActive
		})
    }
    onFreeBtnClick(type) {
        this.refs.freeConfirm.hide()
        if (type == 'confirm') {
            this.handleSaveChannelMarket()
        }
    }
    handleSaveChannelMarket() {
        let {fixedDiscount, fixdGroupNum, discountType} = this.data
        this.props.openGroup({
            channelId: this.props.curChannelId,
            discount: fixedDiscount, 
            groupNum: fixdGroupNum,
            discountType: discountType,
            simulationStatus: this.state.simulationStatusActive ? 'Y' : 'N',
            groupHour: this.state.joinTime[0]
        });
        this.props.hideBox();
        this.setState({
            groupNum: '',
            discount: '',
        });
    }
    render() {
        const containerClass = classNames({
            'group-confirm-box-container': true,
            'group-confirm-box-container-hide': !this.props.showComfirmBox,
        });
        return (
            <div className={containerClass}>
                <div className="box" ref={(ref) => this.box=ref}>
                    <div className="input-wrap">
                        <div className="input-scroll">
                        <section className="input">
                            <div className="tips-box">
                                <ul className="str3">
                                    <li>
                                        <span className="circle-num">1</span>
                                        开团或购买拼课
                                    </li>
                                    <li>
                                        <span className="circle-num">2</span>
                                        分享拼课给好友</li>
                                    <li>
                                        <span className="circle-num">3</span>
                                        进入听课
                                    </li>
                                </ul>
                            </div>
                            <div className="input-box">
                                <input 
                                    type="number" 
                                    value={this.state.groupNum}
                                    onChange={this.handleGroupNumChange} 
                                    placeholder="请输入拼课人数"
                                    onFocus={this.handleFocus}
                                />
                            </div>
                            
                            <div className="input-tips">团长包含在拼课人数内</div>
                            <span className="input-box">
                                <input 
                                    type="number" 
                                    value={this.state.discount} 
                                    onChange={this.handleDiscoutChange}
                                    placeholder="请输入拼团价格"
                                    onFocus={this.handleFocus}
                                />
                            </span>                            
                            <div className="input-tips">现原价: ¥{this.props.curOriginPrice} 注：拼课价位团长及拼课人需支付的价格</div>
                            <div className="switch-box">
                                <div className="switch-set">
                                    <span className="switch-word">团长免费</span>
                                    <Switch
                                        // Switch是开关状态
                                        active={this.state.isOpenFree}
                                        // switch的大小'lg', 'md', 'sm'

                                        // 改变状态时调用 
                                        onChange={this.OpenOrCloseFree.bind(this)}

                                        // 自定义样式
                                        className='btn-switch'
                                    />   
                                </div>
                                <div className="input-tips">开启后，团长即可免费开团，团长需邀请好友拼满团才可免费听课，有助于提高开团率及分享率</div>
            
                            </div>
                            <div className="data-wrap">
                                <div>
                                    <div className="switch-word">拼课团有效时长</div>
                                    <div className="switch-tips">在有效期内未成团则失败</div>
                                </div>
                                <Picker
                                    col={1}
                                    data={this.state.joinTimeArr}
                                    value={this.state.joinTime}
                                    title="请选择时间"
                                    onChange={this.selectJoinHandle}
                                >
                                    <div className='select-tag'>
                                    {this.state.joinTimeValue || 24 + '小时'}
                                        <i className='icon_enter'></i>
                                    </div>
                                </Picker>
                            </div>
                            <div className="switch-box">
                                <div className="switch-set">
                                    <span className="switch-word">
                                        模拟拼课
                                        <span className="icon-question" onClick={this.handleQuestion}>?</span>
                                    </span>
                                    
                                    <Switch
                                        // Switch是开关状态
                                        active={this.state.simulationStatusActive}
                                        // switch的大小'lg', 'md', 'sm'

                                        // 改变状态时调用 
                                        onChange={this.simulationSwitchChangeHandle.bind(this)}
                                    />   
                                </div>
                                <div className="input-tips">开启模拟拼课后，有效期内未达到拼课人数的拼课团，系统将投放”模拟用户“保证拼课成功。拼课成功后，直播间获得真实拼课的对应课程收入。</div>
            
                            </div>
                            <div className="switch-box">
                                <div className="switch-set">
                                    <span className="switch-word">邀请拼课拥金(自动分销)</span>
                                    <Switch
                                        // Switch是开关状态
                                        active={this.props.curAutoShare==="Y"}

                                        // 改变状态时调用 
                                        onChange={this.OpenOrCloseAuto.bind(this)}

                                        // 自定义样式
                                        className='btn-switch'
                                    />   
                                
                                </div>
                                <div className="input-tips">开启邀请拼课佣金后，当团长或团员邀请了成功付费的拼课成员后，则邀请者将会获得相应佣金，有助于提升拼课团分享率及成团率</div>
                            {
                                this.props.curAutoShare==="Y"&&
                                <div className="auto-percent">
                                    <span className="input-box">
                                        <input type="number"
                                            ref="autoPercentInput"
                                            placeholder="请输入邀请拼课佣金比例(1-80)%"
                                            value={this.props.curAutoPercent}
                                            onChange={this.props.changeAutoPercent}
                                            onFocus={this.autoPercentInputFocusHandle}
                                        />
                                    </span>
                                    <span className="percent-icon">%</span>
                                </div>
                            }
                            {
                                this.props.curDiscountStatus === 'Y' &&
                                <p className="discount">
                                    <img src={require('../../img/mark@2x.png')} alt=""/>
                                    <span>该课程已设置特价优惠，开启拼课后，会直接替换成拼课价</span>
                                </p>
                            }
                            </div>
                        </section>
                        </div>
                    </div>
                        
                    
                    <section className="btn-row" onClick={ this.handleComfirmBtnTouch }>
                        <span>确认</span>
                    </section>
                </div>
                <Confirm
                    ref='freeConfirm'
                    title='确定同时开启【团长免费】和【模拟拼课】吗'
                    content=''
                    buttons='cancel-confirm'
                    onBtnClick={ this.onFreeBtnClick }
                >
                    <div className="confirm-free-tip">同时开启两个开关，团长一定能免费听课哦。</div>
                </Confirm>
                <Confirm
                    ref='likeConfirm'
                    buttons='cancel'
                    onBtnClick={ this.onLikeBtnClick }
                    cancelText='关闭'
                >
                    <div className="confirm-like-wrap">
                        <div className="confirm-like-title">
                            模拟拼课介绍
                        </div>
                        <div className="confirm-like-step">
                            <div className="confirm-step-item">
                                <img src={require('../../img/pin.png')}/>
                                <div className="step-word">开启拼课</div>
                                <span className="red-line"></span>
                            </div>
                            <div className="confirm-step-item">
                                <img src={require('../../img/group.png')}/>
                                <div className="step-word">
                                    <div>学员参与</div>
                                    <div>等待成团</div>
                                </div>
                                <span className="red-line"></span>
                            </div>
                            <div className="confirm-step-item">
                                <img src={require('../../img/money.png')} />
                                <div className="step-word">
                                    <div>模拟拼课</div>
                                    <div>收益到账</div>
                                </div>
                            </div>
                        </div>
                        <div className="confirm-like-main">
                            <div className="confirm-like-tip">
                                模拟拼课是保障拼课成团率的一种手段。 开启模拟拼课后，拼课有效期内未达到拼课人数的团，系统将投放”模拟用户“保证拼课成功。
                            </div>
                            <img src={require('../../img/list.png')} className="confirm-like-img"/>
                            <div className="confirm-like-tip">
                                *拼课详情中的匿名用户即为系统投放的模拟用户
                            </div>
                        </div>
                    </div>
                </Confirm>
            </div>
        );
    }
}

GroupConfirmBox.propTypes = {

};

export default GroupConfirmBox;