import React, {Component} from 'react';
import PropTypes from 'prop-types';

import MiddleDialog from 'components/dialog/middle-dialog';
import { autobind } from 'core-decorators';
import { createPortal } from 'react-dom';
import QRImg from 'components/qr-img';
import { formatDate,formatMoney, locationTo } from 'components/util'

/**
 * 关注弹框
 * 
 * 
 * 
 * 
 * 
 *              已迁移，留待观察后再删
 *              已迁移，留待观察后再删
 *              已迁移，留待观察后再删
 *              已迁移，留待观察后再删
 *              已迁移，留待观察后再删
 *              已迁移，留待观察后再删
 *              已迁移，留待观察后再删
 *              已迁移，留待观察后再删
 *              已迁移，留待观察后再删
 *              已迁移，留待观察后再删
 *              已迁移，留待观察后再删
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
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

    render () {
        
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
                bottomTip = '扫码关注公众号，及时提现收益'
                break
            case 'shareNoDistribution':
                title = '分享成功'
                tip = '关注直播间'
                bottomTip = '长按识别二维码'
                break
            case 'focusClick':
                title = '关注直播间'
                tip = '一个懂你的知识小管家'
                bottomTip = '长按识别二维码'
                break
            case 'focusliveConfirmClick':
                title = '关注直播间'
                tip = '一个懂你的知识小管家'
                break
        }

        return createPortal(
            <div className="share-dialog-container">
                <div className="bg" onClick={()=>{this.setState({show: false})}}></div>
                <div className={followDialogType === 'focusliveConfirmClick'?'focus-confirm-box':"share-dialog-content"}>
                    <div className="dd">
                        <div className="done"></div>
                        <div className="title">{title}</div>
                        <div className="distribution">
                            <p>{tip}</p>
                            {
                                followDialogType === 'shareDistribution' && <p className="share-money">你能获得分成<span>￥{formatMoney(shareMoney)}</span>元</p>
                            }
                            {
                                followDialogType === 'shareNoDistribution' && <p className="share-money">发现更多对你有用的知识</p>
                            }
                            {
                                followDialogType === 'focusClick' && <p className="share-money">第一时间为你推荐优质好课</p>
                            }
                            {
                                followDialogType === 'focusliveConfirmClick' && <p className="share-money">关注后会收到老师发送的上课模板消息通知</p>
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
                                    /> : <img className={`qr ${className}`} src={ qrUrl } alt="" { ...props } />
                                }
                            </div>
                            <div className="qrcode-tip">{bottomTip}</div>
                        </div>
                        
                    }
                    
                </div>
            </div>,
            document.getElementById('app')
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
