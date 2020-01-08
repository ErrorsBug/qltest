import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { autobind } from 'core-decorators';

@autobind
class LuckyMoney extends Component {
    state = {
        moneys : [ 1, 5, 10, 20, 50, 100],
        rewardIntroduce : '爱赞赏的人，运气不会差',
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
            if( moneys.length > 6) moneys.pop();
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
        this.props.onRewardItemClick(Number(this.state.moneyInput));
    }

    hideOtherMoneyDialog(e) {
        console.log(e.target.className);
        if (e.target.className === "other-money-dialog" ||
            e.target.className === "icon_cancel") {
            this.setState({
                showOtherMoney: false,
            });
        }
    }

    showOtherMoneyDialog() {
        this.setState({
            showOtherMoney: true,
        });
    }

    render() {

        return (
            <div className="lucky-money-dialog">
                <div className="lucky-money-bg" onClick={()=>{this.props.onRewardClick()}}></div>
                <div className="lucky-money-main">
                    <span className="close-lucky-money icon_cross" onClick={() => {this.props.onRewardClick()}}></span>
                    <img src={this.props.payForHead} alt="" className="pay-for-head"/>
                    <span className="pay-for-name">{this.props.payForName}</span>
                    <span className="lucky-tips"><p>{this.state.rewardIntroduce}</p></span>
                    <ul className="price-list">
                        {
                            this.state.moneys.map((item) => <li key={`reward-item-${item}`} onClick={() => {this.props.onRewardItemClick(item)}}><p>{item}元</p></li>)
                        }
                    </ul>
                    <span className="other-money" onClick={this.showOtherMoneyDialog}>其他金额</span>
                    {
                        this.props.rewardPic ? <img src={this.props.rewardPic} alt="" className="reward-pic"/> : null
                    }
                        
                </div>

                <div className={this.state.showOtherMoney ? "other-money-dialog" : 'hide'} onClick={(e) => this.hideOtherMoneyDialog(e)}>
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
                </div>
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