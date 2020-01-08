
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import Page from 'components/page';
import { request } from 'common_actions/common';
import { autobind } from 'core-decorators';
import { makeCertificateCard } from './components/make-certificate-card';
import { locationTo } from 'components/util';
import { getCertificateCardData } from "../../actions/channel-intro";
import {
    uploadImage,
} from '../../actions/common';

import { share } from 'components/wx-utils';


function mapStateToProps (state) {
	return {
		sysTime: get(state, 'common.sysTime'),
	}
}

const mapActionToProps = {
    getCertificateCardData,
    uploadImage,
};

@autobind
class Certificate extends Component {

	state = {
        cardUrl: get(this.props.location, 'query.cardUrl','')?decodeURIComponent(get(this.props.location, 'query.cardUrl','')):'',
        shareCardUrl: get(this.props.location, 'query.cardUrl','')?decodeURIComponent(get(this.props.location, 'query.cardUrl','')):'',
        periodInfo: {},
        cardData: {
            name:'摄影课证书',
            homeworkCount: 32,
            likedCount:22,
            userName: 'liuliuliu',
            nickName: 'hahahahaah',
            headImgUrl:'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png',
            type:'normal',
            desc:'简介',
        },
	}

	async componentDidMount () {
        
		const channelId = get(this.props.location, 'query.channelId')
		
		// 页面基础数据 位置不可变
		const userPeriod = await request({
			// url: '/api/wechat/channel/camp/getUserPeriod',
			url: '/api/wechat/channel/currentPeriod',
			method: 'POST',
			body: {
				channelId
			}
        })
        window.loading(true);
        const periodInfo = get(userPeriod, 'data.periodPo')
		const liveId = get(userPeriod, 'data.liveId')
		
		if (periodInfo && periodInfo.id) {

			this.setState({
				periodInfo,
				liveId
			})
		}
        
        if(get(this.props.location, 'query.cardUrl','') === ''){
           
            let result = await this.props.getCertificateCardData({
                channelId: channelId,
            });
            if(result.data && result.data.cardPo) {
                this.setState({
                    cardData: { qrCode: 'https://img.qlchat.com/qlLive/liveCampTrining/camp-qr.jpg', campId: periodInfo.campId, ...result.data.cardPo},
                }, ()=> {
                    this.makeCertificateCardFunc(this.state.cardData);
                })
            } else {
                // 回到系列课页面
                locationTo(`/wechat/page/channel-intro?channelId=${channelId}`)
                return
            }
            
        }else{
            window.loading(false);
        }
    }
    
    // oss上传
    initStsInfo() {
        const script = document.createElement('script');
        script.src = '//static.qianliaowang.com/frontend/rs/lib/aliyun-oss-sdk.min.js';
        document.body.appendChild(script);
    }

    async makeCertificateCardFunc (data) {
        // oss上传初始化
        await this.initStsInfo();
        makeCertificateCard(data,async (url)=>{
            this.setState({
                cardUrl: url,
            });
            window.loading(false);
            
            let resultFile = this.dataURLtoBlob(url);
            resultFile = new File([resultFile], 'temp.jpg', {
                type: 'image/jpeg',
            });
            let uploadUrl = await this.props.uploadImage(resultFile, 'certificate-card','',true,true);
            
            if (uploadUrl) {
                console.log(this.state.cardUrl);
                console.log(uploadUrl);
                this.setState({
                    shareCardUrl: encodeURIComponent(uploadUrl),
                },()=>{
                    console.log(this.state.shareCardUrl);
                    this.initShare();
                });
            };
        }, data.type);
    }

    dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    initShare(){
        //「姓名/昵称」完成xx份作业，获得「期数名称」「课程名称」颁发的证书
        let { periodInfo, cardData } = this.state;
        share({
            title: `「${cardData.userName||cardData.nickName}」完成${cardData.homeworkCount}份作业，获得「${periodInfo.name}」「${periodInfo.channelName || ''}」颁发的证书`,
            timelineTitle: `「${cardData.userName||cardData.nickName}」完成${cardData.homeworkCount}份作业，获得「${periodInfo.name}」「${periodInfo.channelName || ''}」颁发的证书`,
            desc: '',
            timelineDesc: '', // 分享到朋友圈单独定制
            imgUrl: 'https://img.qlchat.com/qlLive/camp/certificate-card-share.png',
            shareUrl: window.location.href + '&cardUrl=' + this.state.shareCardUrl,
        });
    }

	render () {
        const { periodInfo } = this.state;

		return  <Page title={periodInfo.channelName} className="certificate-card-page">
            {this.state.cardUrl&&<div className="card">
                <img src={this.state.cardUrl} />
                <div className="tips">长按保存图片证书</div>
            </div>}
        </Page>
	}
}

module.exports = connect(mapStateToProps, mapActionToProps)(Certificate);