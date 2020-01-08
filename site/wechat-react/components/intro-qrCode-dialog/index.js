import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';

import MiddleDialog from 'components/dialog/middle-dialog';
import { autobind } from 'core-decorators';
import { createPortal } from 'react-dom';
import QRImg from 'components/qr-img';
import { formatDate,formatMoney, locationTo } from 'components/util'

/**
 * 关注弹框
 */
@autobind
class IntroQrCodeDialog extends Component {

    constructor (props) {
        super(props);

        this.state = {
            show: false,
        };
    }
    
    componentDidMount(){
    }

    show() {
        this.setState({
            show: true,
        });
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0)
    }

    hide() {
        this.setState({
            show: false,
        });
    }

    onClose(e) {
        this.props.onClose && this.props.onClose(e);
        this.hide();
    }

    focusLiveConfirm(e){
        this.props.focusLiveConfirm && this.props.focusLiveConfirm(true);
        this.hide();
    }


    /**
     * 关注直播间与分享成功 不共用样式
     */
    renderDialog() {
                
        if (typeof (document) == 'undefined') {
            return false;
        }

        const {
            shareMoney = '99.00',
            distribution,
            followDialogType,
            qrUrl,
            option, // 统计配置
            className,
            relationInfo, // 好友关系
            ...props
        } = this.props;

        const {
            show,
        } = this.state;

        if(!show){
            return null
        }

        let title,tip,bottomTip
        
        switch(followDialogType){
            case 'shareDistribution':
                title = '分享成功'
                tip = '若有好友购买课程'
                bottomTip = '长按关注公众号'
                break
            case 'shareNoDistribution':
                title = '分享成功'
                tip = '不只是这一门好课，'
                bottomTip = '长按关注直播间'
                break
            case 'focusClick':
                title = '关注直播间'
                tip = <p>新课上架，课程促销，优惠券派送，将第一时间通过<span>公众号</span>发送给你</p>
                break
            case 'focusliveConfirmClick':
                title = '关注直播间'
                tip = '一个懂你的知识小管家'
                bottomTip = '长按关注直播间'
                break
        }
        


        if(followDialogType === 'focusClick') {
            return (<div className="share-dialog-container focus-click-dialog">
            <div className="bg"></div>
                <div className={followDialogType === 'focusliveConfirmClick'?'focus-confirm-box':"share-dialog-content"}>
                    <i className="close-btn" onClick={this.onClose}>
                        <img src={require('./img/close.png')} alt=""/>
                    </i>
                    <div className="dd">
                        <div className="title">{title}</div>
                        <div className="distribution">
                            {tip}
                        </div>
                    </div>
                    {
                        followDialogType === 'focusliveConfirmClick'?
                            <div className="btn-box">
                                <div className="close on-log on-visible" 
                                    data-log-region="follow-area"
                                    data-log-pos="Unfollow"  onClick={this.onClose} >暂不</div>
                                <div className="confirm on-log on-visible" 
                                    data-log-region="follow-area"
                                    data-log-pos="Unfollow" onClick={this.focusLiveConfirm}>关注</div>
                            </div>
                        :
                        <Fragment>
                            <div className="qrcode-container">
                                <div className="img-container">
                                    <span className="top-left"></span>
                                    <span className="top-right"></span>
                                    <span className="bottom-left"></span>
                                    <span className="bottom-right"></span>
                                    {
                                        option && option.traceData ? 
                                        <QRImg
                                            src = { qrUrl }
                                            traceData = { option.traceData }
                                            channel = { option.channel }
                                            appId={ option.appId }
                                            className="qr"
                                            pos= { option.pos }
                                        /> : 
                                        <img style={{border: '1px solid #ddd'}} className={`qr ${className}`}src={ qrUrl } alt="" { ...props } />
                                    }
                                    <p className="how-to-focus">长按识别二维码</p>
                                </div>
                                
                            </div>
                            {
                                (followDialogType === 'shareNoDistribution' || followDialogType === 'shareDistribution' || followDialogType === 'focusClick') ?
                                (<div className="follow-bar">
                                    <span className="follow-bar-arrow-wrap left">
                                        <i className="follow-bar-arrow arrow-left"></i>
                                        <i className="follow-bar-arrow arrow-left"></i>
                                        <i className="follow-bar-arrow arrow-left"></i>
                                    </span>
                                    关注后，老师才能联系你
                                    <span className="follow-bar-arrow-wrap right">
                                        <i className="follow-bar-arrow arrow-right"></i>
                                        <i className="follow-bar-arrow arrow-right"></i>
                                        <i className="follow-bar-arrow arrow-right"></i>
                                    </span>
                                </div>) : null
                            }
                            {
                                (this.props.relationInfo && this.props.relationInfo.friendNum > 0) &&
                                <div className="focus-number">
                                    {relationInfo.friendName}等{relationInfo.friendNum}位朋友已关注   
                                </div>
                            }
                        </Fragment>
                    }
                </div>
            </div>);
        } else {
            return (
            <div className="share-dialog-container">
                <div className="bg"></div>
                <div className={followDialogType === 'focusliveConfirmClick'?'focus-confirm-box':"share-dialog-content"}>
                    <i className="close-btn" onClick={this.onClose}>
                        <img src={require('./img/close.png')} alt=""/>
                    </i>
                    <div className="dd">
                        <div className="title">{title}</div>
                        {
                            (followDialogType === 'shareNoDistribution' || followDialogType === 'shareDistribution' || followDialogType === 'focusClick') ?
                            (<div className="follow-bar">
                                <span className="follow-bar-arrow-wrap left">
                                    <i className="follow-bar-arrow arrow-left"></i>
                                    <i className="follow-bar-arrow arrow-left"></i>
                                    <i className="follow-bar-arrow arrow-left"></i>
                                </span>
                                扫码关注直播间
                                <span className="follow-bar-arrow-wrap right">
                                    <i className="follow-bar-arrow arrow-right"></i>
                                    <i className="follow-bar-arrow arrow-right"></i>
                                    <i className="follow-bar-arrow arrow-right"></i>
                                </span>
                            </div>) : null
                        }
                        <div className="distribution">
                            {
                                
                                followDialogType === 'shareDistribution' && <p className="share-money">{tip}，你能获得分成<span>￥{formatMoney(shareMoney)}</span>元，关注公众号，及时提现收益</p>
                            }
                            {
                                followDialogType === 'shareNoDistribution' && <p className="share-money">{tip}<br /> 关注直播间，更多优质课程等你来</p>
                            }
                            {
                                followDialogType === 'focusClick' && <p className="share-money">{tip}<br />第一时间为你推荐优质好课</p>
                            }
                            {
                                followDialogType === 'focusliveConfirmClick' && <p className="share-money">{tip}<br />关注后会收到老师发送的上课消息通知</p>
                            }
                        </div>
                    </div>
                    {
                        followDialogType === 'focusliveConfirmClick'?
                            <div className="btn-box">
                                <div className="close on-log on-visible" 
                                    data-log-region="follow-area"
                                    data-log-pos="Unfollow"  onClick={this.onClose} >暂不</div>
                                <div className="confirm on-log on-visible" 
                                    data-log-region="follow-area"
                                    data-log-pos="Unfollow" onClick={this.focusLiveConfirm}>关注</div>
                            </div>
                        :
                        <Fragment>
                            <div className="qrcode-container">
                                <div className="img-container">
                                    <span className="top-left"></span>
                                    <span className="top-right"></span>
                                    <span className="bottom-left"></span>
                                    <span className="bottom-right"></span>
                                    {
                                        option && option.traceData ? 
                                        <QRImg
                                            src = { qrUrl }
                                            traceData = { option.traceData }
                                            channel = { option.channel }
                                            appId={ option.appId }
                                            className="qr"
                                            pos= { option.pos }
                                        /> : 
                                        <img style={{border: '1px solid #ddd'}} className={`qr ${className}`}src={ qrUrl } alt="" { ...props } />
                                    }
                                </div>
                                <p className="how-to-focus">长按识别二维码</p>
                            </div>
                            {(this.props.relationInfo && this.props.relationInfo.friendNum > 0) &&
                            <div className="focus-number">
                                {relationInfo.friendName}等{relationInfo.friendNum}位朋友已关注   
                            </div>}

                        </Fragment>
                        
                    }
                </div>
            </div>);
        }
    }

    render () {
        return createPortal(
            this.renderDialog(),document.getElementById('app')
        );
    }
}

IntroQrCodeDialog.propTypes = {
    // 标题
    title: PropTypes.string,
    desc: PropTypes.string,
    onClose: PropTypes.func,
    // 自定义样式
    className: PropTypes.string,
    qrUrl: PropTypes.string,
    tips: PropTypes.string,
    option: PropTypes.object,
    focusLiveConfirm: PropTypes.func
};

export default IntroQrCodeDialog;
