import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import { Confirm } from 'components/dialog';
import { locationTo, formatDate } from 'components/util';
import { offshelfChannel, savePercent } from '../../../../../actions/live-studio';
import { setPromotionalChannel, setOperationType } from '../../../../../actions/live';

@autobind
class PromotionalChannelConfirm extends Component {
    constructor(props){
        super(props);
        this.state = {
            // 分成比例
            // proportion: 0,
            // 系列课准确的下架时间
            offshelfTime: null,
            // 客服二维码图片URL
            customerServiceQr: null,
        };
        this.data = {
            // 0至100的整数校验正则
            // pattern: /^(([0-9])|([1-9][0-9])|(100))$/,
            // 假设的系列课价格
            // fakePrice: 100,
        }
    }

    get channelId(){
        return this.props.channel.channelId;
    }

    get liveId(){
        return this.props.liveId;
    }

    initStateAndData = (channel) => {
        this.setState({
            offshelfTime: channel.downCourseTime,
            customerServiceQr: channel.qrUrl,
        });
        // const {percent, profit, discountStatus, discount, amount} = channel;
        // this.setState({
        //     // 分成比例
        //     proportion: percent,
        // });
        // this.data = {
        //     ...this.data,
        //     // 真实的系列课售卖价格
        //     realPrice: discountStatus === 'Y' ? discount : amount,
        // }
    }

    // hookProportionInput = (e) => {
    //     this.setState({
    //         proportion: e.target.value.trim()
    //     });
    // }

    /**
     * 根据不同的操作类型显示不同的确认框
     */
    showConfirmDialog = (operation) => {
        switch (operation) {
            // 打开下架
            case 'offshelf':
                this.refs['offshelf-confirm-dialog'].show();
                break;
            // 延迟下架提示
            case 'delay-offshelf':
                this.refs['delay-tip-dialog'].show();
                break;
            // 打开编辑分成比例
            // case 'editProportion':
            //     this.refs['proportion-confirm-dialog'].show();
            //     break;
            default:
                break;
        }
    }


    /**
     * 点击“确定下架”
     */
    hookOffshelfClick = async (buttonTag) => {
        if (buttonTag === 'confirm') {
            // 立马关闭弹窗，防止用户暴力点击
            this.refs['offshelf-confirm-dialog'].hide();
            const {channel, setPromotionalChannel, setOperationType, offshelfChannel, removePromotional, updatePromotional} = this.props;
            const result = await offshelfChannel({liveId: this.liveId, channelId: this.channelId});
            if (result.state.code === 0) {
                if (result.data.haveRelay === 'Y') {
                    this.setState({
                        offshelfTime: result.data.downCourseTime,
                        customerServiceQr: result.data.qrUrl
                    }, () => {
                        this.refs['delay-tip-dialog'].show();
                    });
                    updatePromotional(channel, {downCourseTime: result.data.downCourseTime});
                } else {
                    // 将该课程移除列表
                    removePromotional(channel);
                }
            } else {
                window.toast(result.state.msg);
            }
        }
    }

    /**
     * 关闭滞后下架的提示弹窗
     */
    closeDelayTipDialog = () => {
        this.refs['delay-tip-dialog'].hide();
    }

    /**
     * 点击比例修改确认框的“保存”按钮
     */
    // hookProportionClick = async (buttonTag) => {
    //     if (buttonTag === 'confirm') {
    //         const {channel, setPromotionalChannel, setOperationType, savePercent} = this.props;
    //         // 比例数字校验
    //         const {pattern, realPrice} = this.data;
    //         const proportion = this.state.proportion;
    //         const proportionNum = +proportion;
    //         if (!proportion) {
    //             window.toast('分成比例不能为空');
    //             return false;
    //         } else if (!pattern.test(proportion)) {
    //             window.toast('请输入1~80的整数');
    //             return false;
    //         } else if (proportionNum < 1 || proportionNum > 80) {
    //             window.toast('请输入1~80的整数');
    //             return false;
    //         } else {
    //             const result = await savePercent({
    //                 liveId: this.liveId,
    //                 channelId: this.channelId,
    //                 percent: proportion
    //             });
    //             if (result.state.code === 0) {
    //                 setPromotionalChannel({
    //                     ...channel,
    //                     percent: proportion,
    //                     profit: realPrice * proportionNum / 100
    //                 })
    //                 this.refs['proportion-confirm-dialog'].hide();
    //             } else {
    //                 window.toast(result.state.msg);
    //             }
    //         }
    //     }
    // }

    componentWillReceiveProps = (nextProps) => {
        this.initStateAndData(nextProps.channel);
        this.showConfirmDialog(nextProps.operation);
    }

    render(){
        // const {fakePrice, realPrice, pattern} = this.data;
        // let {proportion} = this.state;
        // let fakeProfit = '--';
        // let currentProportion = '--';
        // if (pattern.test(proportion)) {
        //     currentProportion = proportion;
        //     fakeProfit = fakePrice * Number(proportion) / 100;
        // }
        // const {
        //     channelHeadImg, 
        //     channelName, 
        //     amount, 
        //     discount, 
        //     discountStatus,
        //     distributeNum,
        //     totalProfit,
        // } = this.props.channel;
        return (
            <div>
                {/* 下架 */}
                <Confirm 
                    className="confirm-dialog off-shelf-confirm"
                    title="您是否确定下架该课"
                    onBtnClick={this.hookOffshelfClick}
                    ref="offshelf-confirm-dialog"
                    confirmText="确定下架">
                    下架后，该系列课将停止推广，不再展示到各大分销商城
                </Confirm>
                {/* 下架滞后提示 */}
                <Confirm
                    className="confirm-dialog delay-offshelf-tip"
                    title="温馨提示"
                    onBtnClick={this.closeDelayTipDialog}
                    ref="delay-tip-dialog"
                    buttons="confirm"
                    confirmText="我知道了"
                >
                <p>该课已有渠道转载分发，为了流量主的工作排期，我们给予3天的缓冲期，该课将于<strong>{formatDate(this.state.offshelfTime, 'M月d日h点')}</strong>后自动下架，感恩您的谅解和配合。</p>
                <p>如有疑问，请扫码咨询工作人员:</p>
                <img alt="客服微信二维码" src={this.state.customerServiceQr} />
                </Confirm>
                {/* 编辑分成比例 */}
                {/* <Confirm
                    className="confirm-dialog proportion-edit-confirm"
                    title="修改比例"
                    confirmText="保存"
                    onBtnClick={this.hookProportionClick}
                    ref="proportion-confirm-dialog">
                    <div className="current-proportion">
                        <div className="label">当前分成比例</div>
                        <div className="profit-detail"><strong>{currentProportion}%（100元课程，您可获得{fakeProfit}元)</strong></div>
                    </div>
                    <div className="proportion-edit-wrapper">
                        <div className="label">设置新比例</div>
                        <div className="input-field-wrapper">
                            <input className="input-field" value={proportion} onChange={this.hookProportionInput}/></div>
                            <div className="proportion-tip">让利越多，越可促使优质大流量渠道主分发您的课程。建议您的销售分成10%~15%</div>
                    </div>
                </Confirm> */}
            </div>
        )
    }
}

PromotionalChannelConfirm.propTypes = {

}

const mapStateToProps = (state) => {
    const {operationType, promotionalChannel} = state.live;
    return {
        operation: operationType,
        channel: promotionalChannel
    }
}

const mapActionToProps = {
    offshelfChannel,
    savePercent,
    setPromotionalChannel,
    setOperationType,
}

export default connect(mapStateToProps, mapActionToProps)(PromotionalChannelConfirm);