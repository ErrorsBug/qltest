import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

// components
import { MiddleDialog } from 'components/dialog';

// utils
import { getVal, locationTo, filterOrderChannel } from 'components/util';
import { getUrlParams } from 'components/url-utils';

// actions
import { doPay } from 'common_actions/common'
import { getGiftId } from '../../../../../actions/topic-intro'

const Row = props => {
    return <section className="gift-detail-row">
        <span className='row-label'>{ props.label }</span>
        <span className='row-content'>{ props.children }</span>
    </section>
}

@autobind
class GiftDialog extends Component {

    static contextTypes = {
        router: PropTypes.object
    }

    state = {
        showDialog: false,
        showSuccess: false,
        giftCount: 1,
        isGiftDisable: false,
        giftId:''
    }

    show() {
        this.setState({
            showDialog: true
        });
    }

    closeDialog(e) {
        this.setState({
            showDialog: false
        });

        // 点击事件才log
        e && window._qla && _qla('click', {name: '赠好友-关闭', region: "gift-close"});
    }
    closeSuccess() {
        this.setState({
            showSuccess: false
        });
    }

    /**
     * 加减赠礼数量
     *
     * @memberOf Channel
     */
    onChangeCount(type) {
        if (type === 'increase') {
            if (this.checkGiftValid(Number(this.state.giftCount) + 1)) {
                this.setState({
                    giftCount: Number(this.state.giftCount) + 1,
                    isGiftDisable: false,
                });
            }
        } else if (type === 'decrease' && this.state.giftCount > 1) {
            if (this.checkGiftValid(Number(this.state.giftCount) - 1)) {
                this.setState({
                    giftCount: Number(this.state.giftCount) - 1
                });
            }
        }
    }

    /**
     * 赠礼数量输入框内容改变
     *
     * @memberOf Channel
     */
    onInputCount(e) {
        const event = e || event;
        if (event.target.value == 0) {
            this.setState({
                giftCount: event.target.value,
                isGiftDisable: true
            });
            return;
        }

        if (/^[0-9]*$/.test(event.target.value)) {
            if (this.checkGiftValid(event.target.value)) {
                this.setState({
                    giftCount: event.target.value,
                    isGiftDisable: false,
                });
            }

        } else {
            window.toast('请输入正确的数字');
        }

    }

    /**
     * 测试赠礼数量和价格是否合理
     *
     * @memberOf Channel
     */
    checkGiftValid(count) {
        if (count * this.props.money > 50000) {
            window.toast('单次付费金额最大50000元');
            return false;
        } else if (count > 999) {
            window.toast('单次购买数量最多999个');
            return false;
        } else {
            return true;
        }
    }

    /**
     * 支付
     */
    async confirmGift() {
        if (this.state.isGiftDisable) {
            return;
        }

        this.closeDialog();

        const shareKey = getVal(this.context.router, 'location.query.shareKey', '');
        const officialKey = getVal(this.context.router, 'location.query.officialKey', '');
        const source = getVal(this.context.router, 'location.query.source', '');
        
        let payOptions = {
            liveId: this.props.liveId,
            topicId: this.props.topicId,
            total_fee: 0,
            type: 'GIFT',
            giftCount: this.state.giftCount,
            shareKey,
            officialKey: officialKey ? officialKey: (source=="coral"||this.props.tracePage=='coral'? this.props.userId:""),
            callback:this.payCallBack
        };

         // 平台分销且不属于珊瑚计划来源
         if (this.props.platformShareRate && getUrlParams('psKey') && getUrlParams('source') !== "coral" && !officialKey) {
            payOptions.psKey = getUrlParams('psKey');
        }
        if (this.props.platformShareRate && getUrlParams('source') !== "coral" && !officialKey ) {
            payOptions.psCh = filterOrderChannel();
            
        }
        await this.props.doPay(payOptions);
    }

    async payCallBack(id) {
        let result = await this.props.getGiftId(id);
        if (result.state && result.state.code == 0) {
            this.setState({
                showSuccess: true,
                giftId: result.data.orderGiftId,
            })
        }
    }

    render() {
        if (typeof (document) == 'undefined') {
            return false;
        }
        
        return createPortal(
            <main
                className='gift-dialog-container'
            >
                <MiddleDialog 
                    show={ this.state.showDialog }
                    close={ true }
                    bghide={ true }
                    onClose={ this.closeDialog }
                    contentClassName='gift-dialog'
                >
                    <header>
                        <p className="gift-dialog-title">{ this.props.topicName }</p>
                        <p className='gift-dialog-tip'>
                            赠礼将于90天后过期 
                            <br/>
                            过期未领取的课程将不退回
                        </p>
                    </header>

                    <main>
                        <Row label='赠送数量'>
                            <div className='counter'>
                                <i className='left on-log on-visible'
                                    data-log-name="赠好友-减1"
                                    data-log-region="gift-minus1"
                                    onClick={() => {this.onChangeCount('decrease')}}>-</i>
                                <span className='gift-count'>
                                    <input type="text" value={this.state.giftCount} onChange={this.onInputCount} />
                                </span>
                                <i className='right on-log on-visible'
                                    data-log-name="赠好友-加1"
                                    data-log-region="gift-add1"
                                    onClick={() => {this.onChangeCount('increase')}}>+</i>
                            </div>
                        </Row>
                        <Row label='合计'>
                            ￥{ (this.props.money * this.state.giftCount).toFixed(2) }
                        </Row>
                    </main>

                    <footer>
                        <span className={'btn-pack on-log on-visible' + (this.state.isGiftDisable ? 'disable' : '')} 
                            data-log-name="赠好友-打包"
                            data-log-region="gift-pack"
                            onClick={ this.confirmGift }>
                            {
                                this.state.isGiftDisable ?
                                    '请输入赠礼数量'
                                    :
                                    `打包${ this.state.giftCount }份赠礼`
                            }
                        </span>
                    </footer>
                </MiddleDialog>

                <MiddleDialog 
                    show={ this.state.showSuccess}
                    close={ true }
                    bghide={ true }
                    onClose={this.closeSuccess}
                    title='您的赠礼已经包装好~'
                    contentClassName='gift-dialog'
                >
                    <div className="gift-order-success">
                        <div className="content">了解赠礼的后续领取情况 </div>
                        <div className="content">请在 <b>「我的购买记录」</b> 中查看</div>
                    </div>

                    <footer>
                        <span className={'btn-pack'} onClick={()=>{locationTo(`/wechat/page/gift/topic/${this.state.giftId}`)}}>
                            查看赠礼
                        </span>
                    </footer>
                </MiddleDialog>
            </main>
            ,
            document.getElementById('app')
        );
    }
}


function mapStateToProps (state) {
    return {
        topicId: getVal(state, 'topicIntro.topicId', ''),
        liveId: getVal(state, 'topicIntro.liveId', ''),
        channelId: getVal(state, 'topicIntro.channelId', ''),
        topicName: getVal(state, 'topicIntro.topicInfo.topic'),
        money: getVal(state, 'topicIntro.topicInfo.money', 0) / 100,
        platformShareRate: getVal(state,'common.platformShareRate',false),
    }
}

const mapActionToProps = {
    doPay,
    getGiftId,
}

export default connect(mapStateToProps, mapActionToProps, null, {
    withRef: true
})(GiftDialog);
