import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { autobind } from 'core-decorators';

@autobind
class LuckyMoney extends Component {
    state = {
        moneys : [ 2, 5, 10, 20, 50],
        rewardIntroduce : '为老师打赏一杯咖啡吧',
        moneyInput: '',
        showOtherMoney: false,
    }

    componentDidMount(){
        this.initData();
    }
    
    initData(){

        if(this.props.rewardPrice){
            let moneys;
            moneys = this.props.rewardPrice.split(';');
            if( moneys.length > 5) {
                moneys = moneys.slice(0,5)
            }
            this.setState({
                moneys:[...moneys],
                rewardIntroduce:this.props.rewardIntroduce
            })
        }
    }

    isNumber(input) {
        if (input !== null && input !== "") return !isNaN(input);
        return false;
    }

    handleInputChange(e) {
        this.setState({
            moneyInput: e.target.value,
        });
    }

    sendOtherMoney() {
        if (this.state.moneyInput === '') {
            window.toast("金额不能为空");
            return;
        } 
        if (!this.isNumber(this.state.moneyInput)) {
            window.toast("请输入数字！");
            return;
        } 
        if ( Number(this.state.moneyInput) < 2 || Number(this.state.moneyInput) > 1000) {
            window.toast("请输入大于 2 小于 1000 的金额");
            return;
        }
        this.onRewardItemClick(Number(this.state.moneyInput));
    }

    hideOtherMoneyDialog(e) {
        this.setState({
            showOtherMoney: false,
        });
    }

    showOtherMoneyDialog() {
        this.setState({
            showOtherMoney: true,
        },()=>{
            this.inputEle.focus()
        });
    }

    showRewardCard(){
        this.props.showRewardCard('none')
        this.props.onHideRewardClick()
    }

    // 选择其他金额的时候点击弹窗四周不允许隐藏弹窗
    onHideRewardClick(){
        if(this.state.showOtherMoney){
            return 
        }else {
            window._qla && _qla('click', {region: 'turnoff-reward'});
            this.props.onHideRewardClick()
        }
    }

    onRewardItemClick(money) {
        // 永久防止敏感信息
        if (/^(89|8\.9|0\.89|64|6\.4|0\.64|89\.64|64\.89|1989\.64)$/.test(money)) {
            window.toast('金额错误，请输入其他金额')
            return false;
        }
        this.props.onRewardItemClick(money);

    }

    render() {

        return (
            <div className="lucky-money-dialog">
                <div className={`lucky-money-bg ${this.state.showOtherMoney ? '' : 'on-log'}`} onClick={this.onHideRewardClick}></div>
                <div className="lucky-money-main">
                    {/* <span className="close-lucky-money icon_cross" onClick={() => {this.props.onRewardClick()}}></span> */}
                    <img src={this.props.payForHead} alt="" className="pay-for-head"/>
                    <span className="pay-for-name">{this.props.payForName}</span>
                    <span className="lucky-tips"><p>{this.state.rewardIntroduce}</p></span>

                    {
                        this.state.showOtherMoney ?
                        <div className="input-money">
                            <div className="input-area">
                                <div className="icon">￥</div>
                                <div className="input-number">
                                    <input 
                                        type="number" 
                                        value={this.state.moneyInput} 
                                        onChange={(e) => this.handleInputChange(e)}
                                        ref={el => this.inputEle = el}
                                    />
                                </div>
                            </div>
                            <span className="confirm-btn" onClick={this.sendOtherMoney}>确定</span>
                            <span className="return" onClick={(e) => this.hideOtherMoneyDialog(e)}>返回</span>
                        </div>
                        :
                        <div className="select-money">
                            <ul className="price-list">
                                {
                                    this.state.moneys.map((item, index) => <li className="on-log" data-log-region="money-btn" data-log-pos={item} key={`reward-item-${item}`} onClick={() => {this.onRewardItemClick(item)}}>
                                        {
                                            index === 1 && <span>热门</span> 
                                        }
                                        {item}元
                                    </li>)
                                }
                                <li className="other on-log" data-log-region="money-btn" data-log-pos="other" onClick={this.showOtherMoneyDialog}>其他金额</li>
                                </ul>
                                {
                                    this.props.showRewardCard?    
                                        <span className="support on-log" onClick={this.showRewardCard} data-log-region="giveup-reward">暂时不打赏，用行动支持老师</span>
                                    :null        
                                }    
                            {
                                // this.props.rewardPic ? <img src={this.props.rewardPic} alt="" className="reward-pic"/> : null
                            }
                        </div>
                    }
                        
                </div>

                {/* <div className={this.state.showOtherMoney ? "other-money-dialog" : 'hide'} onClick={(e) => this.hideOtherMoneyDialog(e)}>
                    <div className="main">
                        <div className="header">
                            <span >其他金额</span>
                            <span className="icon_cancel" onClick={(e) => this.hideOtherMoneyDialog(e)}></span>
                        </div>
                        <div className="body">
                            <div className="input-area">
                                <input 
                                    type="number" 
                                    value={this.state.moneyInput} 
                                    placeholder="可填写2-1000"
                                    onChange={(e) => this.handleInputChange(e)}
                                />
                                <span>金额（元）:</span>
                            </div>
                            <span className="confirm-btn" onClick={this.sendOtherMoney}>确定</span>
                        </div>
                    </div>
                </div> */}
            </div>
        );
    }
}

LuckyMoney.propTypes = {
    // 赞赏的头像
    payForHead: PropTypes.string.isRequired,
    // 赞赏的名字
    payForName: PropTypes.string.isRequired,
    // 赞赏的背景点击，效果应该是隐藏赞赏框
    onRewardClick: PropTypes.func.isRequired,
    // 赞赏的金额item点击  (money:number)=>null
    onRewardItemClick: PropTypes.func.isRequired,
};

LuckyMoney.defaultProps = {
    payForHead: '',
    payForName: '',
    onRewardClick: () => {},
    onRewardItemClick: () => {},
}

export default LuckyMoney;