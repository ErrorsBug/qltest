import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { autobind } from 'core-decorators';
import {createPortal} from 'react-dom'
import {Confirm} from 'components/dialog';
import { imgUrlFormat, locationTo, isNumberValid, validLegal } from 'components/util'
@autobind
class ChargeStandard extends Component {

    state = {
        show: false,
        // 收费配置
        chargeConfigs: [],
        // 当前要移除的项
        currentCloseIndex: ''
    }

    constructor(props) {
        super(props);
    }

    componentWillUpdate(nextProps,nextState) {
        if (!this.state.show && nextState.show && nextProps.chargeConfigs.length > 0) {
            this.setState({
                chargeConfigs: nextProps.chargeConfigs
            })
        }
    }
    

    show (){
        this.setState({
            show: true
        })
        setTimeout(_=>{
            this[`monthInput1`].focus()
        },300)
    }

    componentDidMount() {
    }

    // 点击完成按钮
    complete(){
        let isTrue = true
        this.state.chargeConfigs.map((item)=>{
            if(!isNumberValid(item.chargeMonths, 1, 36, "月份")){
                isTrue = false
                return false
            }
            if(!validLegal('money', '课程价格', item.amount.toString(), 50000, 1)){
                isTrue = false
                return false
            }
        })
        if(isTrue){
            this.props.saveChargeStandard(this.state.chargeConfigs)
            this.setState({show: false})
        }
    }

    // 输入月份
    monthInput(index, e){
        let chargeConfigs = this.state.chargeConfigs
        chargeConfigs = chargeConfigs.map((item, ind)=>{
            if(ind == index){
                return {
                    ...item,
                    chargeMonths: e.target.value
                }
            }else {
                return item
            }
        })
        this.setState({chargeConfigs})
    }

    // 输入金额
    amountInput(index, e){
        let chargeConfigs = this.state.chargeConfigs
        chargeConfigs = chargeConfigs.map((item, ind)=>{
            if(ind === index){
                return {
                    ...item,
                    amount: e.target.value
                }
            }else {
                return item
            }
        })
        this.setState({chargeConfigs})
    }

    // 创建新的收费类型
    creatChargeStandard(){
        let chargeConfigs = this.state.chargeConfigs
        if(chargeConfigs.length > 9) {
            window.toast('最多创建10种收费类型')
        }else {
            chargeConfigs.push({
                ...this.state.chargeConfigs[0],
                chargeMonths: '',
                amount: ''
            })
            this.setState({chargeConfigs},()=>{
                this[`chargeConfigs${this.state.chargeConfigs.length}`].scrollIntoView(false)
                // this[`monthInput${this.state.chargeConfigs.length}`].focus()
            })
        }
    }

    // 移除收费类型(唤起弹窗)
    removeChargeList(index){
        this.confirmEle.show()
        this.setState({
            currentCloseIndex: index
        })
    }

    // 移除
    confirmRemove(tag){
        this.confirmEle.hide()
        if(tag === 'confirm'){
            let chargeConfigs = this.state.chargeConfigs
            // 移除当前要删除的项
            chargeConfigs.splice(this.state.currentCloseIndex, 1)
            this.setState({chargeConfigs})
        }
    }

    render() {
        const {
            show,
            select,
            chargeConfigs
        } = this.state
        return (
            [
                <div className="charge-standard-container">
                    <ReactCSSTransitionGroup
                        transitionName="black"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={300}>
                    {
                        show && 
                        <div className="black" onClick={()=>{this.setState({show: false})}}></div>
                    }
                    </ReactCSSTransitionGroup>
                    <ReactCSSTransitionGroup
                        transitionName="charge-standard-tst"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={300}>
                    {
                        show && 
                        <div className="charge-standard">
                            <div className="header">设置按时收费
                                <div className="complete" onClick={this.complete}>确定</div>
                            </div>
                            <div className="create-charge-container">
                            {
                                chargeConfigs.map((item, index) => {
                                    if(index > 0){
                                        return (
                                            <div className="list" key={`list-${index}`} ref={el => this[`chargeConfigs${index + 1}`] = el}>
                                                <input placeholder="输入月数" value={item.chargeMonths || ''} ref={el => this[`monthInput${index + 1}`] = el} onChange={this.monthInput.bind(null, index)}/>
                                                <span>个月收取</span>
                                                <input placeholder="输入金额" value={item.amount || ''} onChange={this.amountInput.bind(null, index)}/>
                                                <span>元</span>
                                                <div className="close" onClick={this.removeChargeList.bind(this,index)}></div>
                                            </div>
                                        )
                                    }else{
                                        return (
                                            <div className="list" key={`list-${index}`}>
                                                <input placeholder="输入月数" value={item.chargeMonths || ''} onChange={this.monthInput.bind(null, index)} ref={el => this[`monthInput${index + 1}`] = el}/>
                                                <span>个月收取</span>
                                                <input placeholder="输入金额" value={item.amount || ''} onChange={this.amountInput.bind(null, index)}/>
                                                <span>元</span>
                                            </div> 
                                        )
                                    }
                                })
                            }
                            </div>
                            <div className="create-charge-tip">
                                <p>修改价格后，用户无需重新付费</p>
                                <p>最多创建10个收费方式</p>
                            </div>
                            <div className="add" onClick={this.creatChargeStandard}>添加一个收费类型</div>
                        </div>
                    }
                    </ReactCSSTransitionGroup>
                </div>,
                <Confirm 
                    ref = {el => this.confirmEle = el}
                    title = '确定删除该收费类型吗'
                    onBtnClick = {this.confirmRemove}
                    className = {`delete-channel-stardard`}
                />
            ]
        )
    }
}

ChargeStandard.propTypes = {

};

export default ChargeStandard;