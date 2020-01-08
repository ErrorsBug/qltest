import React from 'react';
import { isFromLiveCenter, formatMoney, locationTo } from 'components/util';
import { autobind } from 'core-decorators';
import { getRedEnvelopeQrCode, getDomainUrl } from '../../../../actions/thousand-live-normal'
import { getIsQlCourseUser } from '../../../../../actions/common'

@autobind
class RedpackDialog extends React.Component {

    // 是否正在进行touch事件
    isTouching = false

    state = {
        show: false,
        // 
        propsData: null,
        // 是否已开启
        open: false,
        // 红包状态
        status: '',
        // 红包没有二维码
        noQrCode: false,
        // 红包数据
        redpackData: null,
        // 红包金额
        money: 0,
        // 正在开启红包
        opening: false,
        // 是否显示二维码或者翻倍按钮(出现在领取红包24小时之后或者已经完成任务)
        showContent: true,
        // 二维码
        qrCode: '',
        // 红包id
        id: ''
    }

    /**
     * 显示红包弹窗
     * @param {*} props 父组件数据
     * @param {*} redpackData 红包数据
     * @memberof RedpackDialog
     */
    async show(props, redpackData = {}){
        console.log(props,redpackData)
        let money = 0, showContent = true
        // 如果已经有金额，就跳过开红包那一步
        if(redpackData && redpackData.money) {
            money = redpackData.money
            // 判断是否过期或者已经完成任务
            if(redpackData.step == 3 || new Date().getTime() > redpackData.expiryTime){
                showContent = false
            }
        }
        await this.setState({
            show: money ? false : true,
            propsData: props,
            redpackData,
            money,
            showContent,
            id: props.commentId || props.relateId // 音视频互动的红包id为relateId，其他为commentId
        })
        // 如果有金额，并且可以展示二维码或者翻倍按钮，直接请求二维码，不可展示的话就直接显示弹窗，不需请求二维码
        if(redpackData.money) {
            if(showContent){
                this.afterOpenRedpack()
            }else {
                await this.setState({
                    open: true,
                    show: true
                })
                this.props.unLockRequest() // 请求锁解除
            }
        }else {
            this.props.unLockRequest() // 请求锁解除
        }
    }

    // 开启红包
    async openRedpack(){
        // 开红包gif动画
        this.setState({
            opening: true,
        })
        let redpackObj = await this.props.openRedpack(this.state.id)
        if(redpackObj.acceptResult !== 'success'){
            if(redpackObj.acceptResult === 'already'){
                window.location.reload(true)
                return
            }
            if(redpackObj.acceptResult === 'fail'){
                window.toast('领取失败！')
                return
            }
            this.setState({
                status: redpackObj.acceptResult
            })
        }else {
            // 领取红包成功日志
            if (typeof _qla != 'undefined') {
                _qla('event', {
                    category: 'get-succeed',
                    action:'success',
                    trace_page: window.sessionStorage && window.sessionStorage.getItem('trace_page') || '',
                });
            }
            await this.setState({
                money: redpackObj.money,  
                redpackData: redpackObj
            })
             // 判断是否过期或者已经完成任务，这两种情况都不需要执行请求二维码的相关操作，因为不需要显示二维码
             if(redpackObj.step == 3 || new Date().getTime() > redpackObj.expiryTime){
                this.setState({
                    showContent: false,
                    open: true,
                    show: true,
                    opening: false,// 加载回来后不显示gif动画
                })
            }else {
                this.afterOpenRedpack()
            }
        }

    }

    async afterOpenRedpack(){

        // 获取红包二维码
        const qrcode = await getRedEnvelopeQrCode({
            redEnvelopeId: this.state.propsData.commentId,
            redEnvelopeMoney: this.state.money,
            liveId: this.props.topicInfo.liveId,
            topicId: this.props.topicInfo.id,
            channelId: this.props.topicInfo.channelId
        })
        
        // 获取是否千聊课程用户
        const existData = await getIsQlCourseUser({
            businessId: this.props.topicInfo.id || this.props.topicInfo.channelId,
            businessType: this.props.topicInfo.id ? 'TOPIC' : 'CHANNEL'
        })

        const {
            power,
            isLiveAdmin,
            isWhiteLive,
            isBindThird,
        } = this.props
        let isCoral = window.sessionStorage && window.sessionStorage.getItem('trace_page')==='coral';
        /**
         * 不展示二维码的四种条件
         * 1、用户关注过
         * 2、不是B端用户
         * 3、直播中心用户
         * 4、专业版或者白名单
         * 5、珊瑚来源
         */
        this.setState({qrCode: qrcode.qrUrl || '',appId: qrcode.appId})
        if(!qrcode || isCoral || power.allowSpeak || power.allowMGLive || (isFromLiveCenter() && existData.data && existData.data.status === 'Y') || isLiveAdmin === 'Y' && isBindThird || isWhiteLive === 'Y'){
            this.setState({
                noQrCode: true,
            })
        }
        await this.setState({
            open: true,
            show: true,
            opening: false,// 加载回来后不显示gif动画
        })
        // 曝光日志收集
        setTimeout(_=>{
            typeof _qla != 'undefined' && _qla.collectVisible();
        },0)
        this.props.unLockRequest() // 请求锁解除
    }

    // 跳转到红包翻倍活动页面
    async locationToActivity(){
        const result = await getDomainUrl({
            type:'redEnvelope',
        })
        if(result.state.code === 0){
            let channel = `${this.props.topicInfo.channelId?'&channelId='+this.props.topicInfo.channelId:''}`;
            let camp = `${this.props.topicInfo.campId ? '&campId=' + this.props.topicInfo.campId : ''}`;
            let url = `${result.data.domainUrl}activity/page/double-redpack?topicId=${this.props.topicInfo.id}${channel}${camp}&redEnvelopeId=${this.state.id}`;
            
            locationTo(url)
        }
    }

    // 隐藏红包弹窗并且重置页面状态（防止多个红包共用统一状态的情况）
    resetState(){
        this.setState({
            show: false,
            propsData: null,
            open: false,
            status: '',
            noQrCode: false,
            redpackData: null,
            money: 0,
            opening: false,
            showContent: true,
            qrCode: '',
            id: '',
        })
    }

    touchStartHandle(){
        this.isTouching = true
        this.touchTimer = setTimeout(() => {
            if(this.isTouching){
                if (typeof _qla != 'undefined') {
                    _qla('event', {
                        category: 'hb-newfocus',
                        action:'success',
                        trace_page: window.sessionStorage && window.sessionStorage.getItem('trace_page') || '',
                    });
                }
            }
        },700)
    }

    touchEndHandle(){
        if(this.isTouching){
			clearTimeout(this.touchTimer);
			this.isTouching= false;
		}
    }

    render() {
        const { qrCode, appId, showContent, opening, show, propsData, status, open, noQrCode, money } = this.state
        if(!show){
            return null
        }
        return (
            <div className="redpack-dialog-container">
                <div className="bg" onClick={this.resetState}></div>
                {
                    open ? 
                    <div className="open-redpack-dialog-content">
                        <div className="open-redpack-normal">
                            <img className="richer-img" src={propsData.speakCreateByHeadImgUrl || propsData.headImgUrl}/>
                            <div className="whose-redpack">{this.props.liveName}的红包</div>
                            <div className="money-container">{formatMoney(money)}<span>元</span></div>
                        </div>
                        {
                            showContent ? 
                            (
                                noQrCode ? 
                                <div className="double on-log on-visible" onClick={this.locationToActivity} data-log-region="hb-double" data-log-pos="double"></div>
                                :
                                <div className="redpack-qrcode-container">
                                    <div className="img-container">
                                        <img 
                                            src={qrCode} 
                                            className="qrcode on-visible" 
                                            data-log-region="visible-redEnvelope" 
                                            data-log-pos="redEnvelope"
                                            data-log-pos={appId}
                                            onTouchStart = {this.touchStartHandle} 
                                            onTouchEnd = {this.touchEndHandle}
                                        />
                                    </div>
                                    <div className="qrcode-tip">
                                        <p>长按识别二维码</p>
                                        <p className="red">关注直播间<br/>再领一个红包</p>
                                    </div>
                                </div>
                            ): null
                        }
                        <div className="open-redpack-tip">红包累计超过1元，将在24小时内<br/>自动转入您的微信钱包</div>
                    </div>:
                    <div className="redpack-dialog-content">
                        <div className="live-info">
                            <img className="richer-img" src={propsData.speakCreateByHeadImgUrl || propsData.headImgUrl}/>
                            <div className="live-name">{this.props.liveName}</div>
                        </div>
                        {
                            status ? 
                            [
                                status === 'empty' && <div className="redpack-status">手慢了，红包被领完了</div>,
                                status === 'expiry' && <div className="redpack-status">该红包已超过6天<br/>如已领取，可在“我的钱包”中查看</div>
                            ]:
                            [
                                <div className="tip">发了一个红包，金额随机</div>,
                                <div className="redpack-remark">{propsData.content}</div>,
                                (
                                    opening ? 
                                    <div className="opening"></div>:
                                    <div className="open" onClick={this.openRedpack}>開</div>
                                ),
                                <div className="tip-1">红包累计超过1元，将在24小时内<br/>自动转入您的微信钱包</div>
                            ]
                        }
                    </div>
                }
            </div>
        )
    }
}

export default RedpackDialog;
