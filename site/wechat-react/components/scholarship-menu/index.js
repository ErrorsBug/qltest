import React from 'react';
import { share } from 'components/wx-utils';
import { request } from 'common_actions/common';
import { get } from 'lodash';
import { apiService } from "components/api-service";
import { scholarship } from 'components/constant/scholarship';

// 奖学金分享弹窗（用于详情页和极简模式页面）
export class ScholarshipDialog extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            show: false,
            packMaxMoney: 0
        }
    }

    show = async (packetId = '')=>{
        // await this.ajaxGetPackMaxMoney();
        // this.setState({show: true})
        // 手动触发打曝光日志
        // setTimeout(() => {
        //     typeof _qla != 'undefined' && _qla.collectVisible();
        // }, 0);
        // this.initShare(packetId);
    }

    // 初始化分享
    initShare = async(packetId) => {
        // 获取用户信息
        await request({
			url: '/api/wechat/transfer/h5/user/get',
			body: {}
		}).then(res => {
            if(res.state.code) throw Error(res.state.msg)
            let username = get(res, 'data.user.name', '')
            setTimeout(_=>{
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
            }, 2000)
		}).catch(err => {
			console.log(err);
		})
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

    hide = () => {
        this.setState({show: false})
        // 点击事件日志打印
        if (window._qla) {
            window._qla('click', {
                region: "luckyClose",
            });
        }
        this.props.initShare && this.props.initShare()
    }

    render(){
        // if(!this.state.show){
        //     return null
        // }
        // return(
        //     <div className="scholarship-dialog on-visible" data-log-region="luckyShareDialog">
        //         <div className="bg on-log" onClick={this.hide}></div>
        //         <div className="guide"></div>
        //         <div className="scholarship-content">
        //             <div className="content">
        //                 购课省<span>7-9折</span>
        //             </div>
        //         </div>
        //     </div>
        // )
        return null
    }
}

