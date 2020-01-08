// 注意  这个界面已废弃
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import { MiddleDialog } from 'components/dialog';
import { locationTo } from '../../../../components/util';

import { quickAudit, qlLiveShareQualify } from '../../../actions/distribution';
@autobind
class LiveDistribution extends Component{
    state = {
        //是否开启分销
        isOpen: JSON.stringify(this.props.shareQualify) !== '{}',
        showDialog: false,
        liveRatio: 0,
        qlRatio: 0,
        showTip: false,
    }

    componentDidMount(){
        this.init()
    }

    init(){
        let {shareQualify, adminFlag} = this.props
        let now = new Date().getTime()
        // 判断是否是未分销，未分销返回的是空对象
        if (JSON.stringify(this.props.shareQualify) === '{}') {
            // 未过期的专业版
            if (adminFlag.isLiveAdmin === 'Y' && adminFlag.liveAdminOverDue > now) {
                this.setState({
                    liveRatio: 50,
                    qlRatio: 50
                })
            // 过期专业版或者非专业版
            }else if((adminFlag.isLiveAdmin === 'Y' && adminFlag.liveAdminOverDue < now) || adminFlag.isLiveAdmin === 'N') {
                this.setState({
                    liveRatio: 40,
                    qlRatio: 60,
                })
            }
        }else {
            this.setState({
                qlRatio: shareQualify.shareEarningPercent,
                liveRatio: 100 - shareQualify.shareEarningPercent
            })
        }
    }

    showDialog() {
        this.setState({
            showDialog: true,
        })
    }

    hideDialog() {
        this.setState({
            showDialog: false,
        })
    }

    showTip(){
        this.setState({
            showTip: true,
        })
    }

    hideTip(){
        this.setState({
            showTip: false,
        })
    }

    async quickAudit(){
        const liveId = this.props.location.query.liveId
        const result = await this.props.quickAudit(liveId);
        if(result.state.code === 0){
            const shareQualify = await this.props.qlLiveShareQualify(liveId)
            if(shareQualify.state.code === 0){
                const qualify = shareQualify.data.qualify
                this.setState({
                    qlRatio: qualify.shareEarningPercent,
                    liveRatio: 100 - qualify.shareEarningPercent,
                    isOpen: true,
                    showDialog: false,
                })
                window.toast('开启成功')
            }
        }else {
            window.toast(result.state.msg);
        }
    }

    render(){
        let {liveRatio, qlRatio} = this.state
        return (
            <Page title={`直播间分销状态`} className="live-distribution-content">
                <div className="live-distribution">
                    <div className="state-content">
                        <div className="state-content-title">
                            <h3>直播间分销状态</h3>
                            <div className="btn-protocol-link">开启即代表阅读并同意 <span onClick={()=>{locationTo('/wechat/page/distribution/protocol?liveId=' + this.props.location.query.liveId)}}>《课程上架协议》</span></div>
                        </div>
                        {
                            this.state.isOpen ? 
                            <span className="have-opened">已开启</span>
                            :<span className="open" onClick={this.showDialog}>开启</span>
                        }
                    </div>
                    <div className="state-content">
                        <div className="proportion-content">
                            <h3>固定分成比例</h3>
                            <div className="proportion">直播间: <span>{liveRatio}%</span>  平台: <span>{qlRatio}%</span></div>
                        </div>
                    </div>
                    <div className="state-content advisory" onClick={this.showTip}>
                        <div className="advisory-content">
                            <h3>咨询</h3>
                            <div className="tip">取消授权或问题反馈请点击</div>
                        </div>
                        <img src={require('./img/right.png')} alt=""/>
                    </div>                    
                </div> 
                <MiddleDialog
                    show = {this.state.showDialog}
                    bghide = {true}
                    theme = "empty"
                    onClose = {this.hideDialog}
                    className = "live-distribution-dialog"
                    contentClassName = "content"
                >
                    <div className="text">您是否确认开启直播间分销？</div>
                    <div className="btn-group">
                        <span className="cancel" onClick={this.hideDialog}>取消</span>
                        <span className="confirm" onClick={this.quickAudit}>确定</span>
                    </div>
                </MiddleDialog>
                <MiddleDialog
                    show = {this.state.showTip}
                    bghide = {true}
                    theme = "empty"
                    onClose = {this.hideTip}
                    close={true}
                    className = "live-distribution-tip"
                    contentClassName = "content"
                >
                    <div className="title">遇到问题啦？</div>
                    <div className="tip-content">
                        <p>1.产品功能使用问题可直接点击此处查看超全的<a href="http://mp.weixin.qq.com/s/gC5ciBTT0vjeFjQXn4yO9Q" target="_blank">《产品使用教程》</a></p>
                        <p>2.在线咨询聊妹请扫描下方二维码，关注后直接在公众号里反馈问题即可，聊妹看到后会及时回复您的哦！</p>
                        <div className="qr-img">
                            <img src={require('./img/qrcode.jpg')} alt=""/>
                            <p>长按扫码关注反馈问题</p>
                        </div>
                    </div>
                </MiddleDialog>
            </Page>
        )
    }
}

function mapStateToProps(state){
    console.log(3333, state.distribution)
    return {
        shareQualify: state.distribution.qlLiveShareQualify,
        adminFlag: state.distribution.adminFlag,
    }
}

const mapActionToProps = {
    quickAudit,
    qlLiveShareQualify,
}

module.exports = connect(mapStateToProps, mapActionToProps)(LiveDistribution)