import React from "react";
import { connect } from 'react-redux';
import Page from 'components/page';
import { request } from 'common_actions/common';
import { share } from 'components/wx-utils';
import { locationTo } from "components/util";
import { get } from 'lodash';
import { apiService } from "components/api-service";
import { scholarship } from "components/constant/scholarship";

class SendPlatformCoupon extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            showSendDialog: false,
            canShare: false,
            show: false,
        }
    }

    componentDidMount(){
        this.getPacketId();
        // this.ajaxGetPackMaxMoney();
    }

    // 获取packetId(从运营分享的链接)
    getPacketId = async () => {
        let confId = this.props.location.query.confId
        if(!confId){
            this.setState({
                canShare: true,
                show: true
            })
            this.initShare()
            return
        }
        await request({
            url: '/api/wechat/transfer/couponApi/coupon/receivePacket',
			body: { confId }
		}).then(res => {
            if(res.state.code) throw Error(res.state.msg)
            let canShare = false
            let status = get(res, 'data.status')
            if(status && status !== 'none'){
                canShare = true
                this.initShare(res.data.packetId)
            }
            this.setState({canShare, show: true})
		}).catch(err => {
            this.setState({show: true})
            console.log(err);
        })
    }
    
    // 初始化分享
    initShare = async(packetId = '') => {
        // 获取用户信息
        await request({
			url: '/api/wechat/transfer/h5/user/get',
			body: {}
		}).then(res => {
            if(res.state.code) throw Error(res.state.msg)
            let username = get(res, 'data.user.name', '')
            if(!packetId){
                packetId = this.props.location.query.packetId || ''
            }
            share({
                title: scholarship.randomChoose(),
                desc: `${username}正在发千聊奖学金，快来抢~`,
                imgUrl: 'https://img.qlchat.com/qlLive/liveCommon/share-schloarship.png',
                shareUrl: `${window.location.protocol}//${window.location.host}/wechat/page/grab-platform-coupon?packetId=${packetId}`,
                successFn: () => {
                    window.toast("分享成功！");
                    if(window._qla){
                        _qla('event', {
                            category: 'luckyshare',
                            action: 'success',
                        });
                    }
                }
            });
		}).catch(err => {
			console.log(err);
		})
    }

    btnClick = ()=>{
        if(this.state.canShare){
            this.setState({showSendDialog: true})
            // 点击事件日志打印
            if (window._qla) {
                window._qla('click', {
                    region: "lucky",
                    pos: "share"
                });
            }
            return
        }
        locationTo('/wechat/page/recommend')
    }

    // ajaxGetPackMaxMoney = async () => {
    //     try {
    //         let result = await apiService.post({
    //             method: 'POST',
    //             url: '/h5/discountCoupon/getSavePacketMaxMoney',
    //             body: {}
    //         })
    //         if (result.state.code) {

    //         } else {
    //             this.setState({
    //                 packMaxMoney: Math.round(result.data.maxMoney)
    //             })
    //         }
    //     } catch (e) {
    //         console.error(e)
    //     }
    // }

    render(){
        let { canShare, show } = this.state
        if(!show){
            return ''
        }
        return (
            <Page title="20份奖学金，看谁的手气最佳~" className="platform-coupon-send-page">
                {
                    canShare ? <div className="img-wrap"><img src={require('./img/coupon.png')} alt="" className="coupon"/><div className="content">购课省<span>7-9折</span></div></div> :
                    <div className="img-wrap"><img src={require(canShare ? './img/coupon.png' : './img/empty-coupon.png')} alt="" className="coupon"/></div>
                }
                {/* <p className="tip">{canShare ? '快快发送给小伙伴，看看谁的手气最好!' : '很可惜，奖学金被抢完了~'}</p> */}
                <div className="send-friend">————  发送给好友  ————</div>
                {/* <div className="send on-log" onClick={this.btnClick}>{canShare ? '发给好友' : '回到首页'}</div> */}
                {canShare ? <p className="tip">你和朋友都能从发送的链接中领取~</p> : null}
                {
                    this.state.showSendDialog ? 
                    <div className="send-dialog">
                        <div className="bg" onClick={()=>{this.setState({showSendDialog: false})}}></div>
                        <div className="guide"></div>
                        <div className="send-dialog-content">
                            <img src={require('./img/send-dialog-content.png')} />
                            <div className="share-content">
                                点击右上角“…”，发送给朋友<br />即可领取~
                            </div>
                        </div>
                    </div> : null
                }
            </Page>
        )
    }
}

export default connect(()=>{},()=>{})(SendPlatformCoupon)