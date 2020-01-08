const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { MiddleDialog } from 'components/dialog';
import Page from 'components/page';
import Detect from 'components/detect';
import ScrollToLoad from 'components/scrollToLoad';
import { share } from 'components/wx-utils';
import { onQrCodeTouch } from 'components/util';
import { fillParams } from 'components/url-utils';

// actions
import {
    shareCardChannel,

 } from '../../actions/share-card';
 import { getChannelInfo } from '../../actions/channel'
 import {getChannelSharePercent} from '../../actions/channel-distribution';

class ShareCardChannel extends Component {

    state = {
        qrBoxSow:false,
        styleId:1,
        shareKey:this.props.location.query.shareKey||'',
        lshareKey:this.props.location.query.lshareKey||'',
    }
    async componentDidMount() {
        var percent=await this.props.getChannelSharePercent(this.state.shareKey,this.state.lshareKey);
        this.setState({
            percent:percent
        });
        await this.changeCard(true);
        this.getChannelInfo(this.props.params.channelId);
    }

    async getChannelInfo(channelId){
        var shareParams='';
        await this.props.getChannelInfo(channelId);
        var channelInfo=this.props.channelInfo;
        
        if(this.state.shareKey!=""){
            shareParams='?shareKey='+this.state.shareKey;
        }else{
            shareParams='?lshareKey='+this.state.lshareKey;
        };

        share({
            title: '我推荐-'+channelInfo.name,
            desc: channelInfo.description||channelInfo.name,
            timelineDesc: '我推荐-'+channelInfo.name, // 分享到朋友圈单独定制
            imgUrl: channelInfo.headImage||"https://img.qlchat.com/qlLive/liveCommon/channelNormal.png",
            shareUrl:window.location.origin + '/live/channel/channelPage/'+channelId+'.htm'+shareParams
        });
    }

    async changeCard(){
        var result=await this.props.shareCardChannel(this.state.shareKey,this.state.lshareKey,this.props.params.channelId,this.state.styleId,1);//channelId,lshareKey,shareKey
        
        if(result.state.code==0){
            this.setState({
                shareUrl:result.data.shareUrl,
                cardUrl:result.data.cardUrl,
                styleId:result.data.styleId,
            })
            if(result.data.styleId>4||result.data.styleId<=0){
                this.setState({
                    styleId:1
                })
                
            }
            console.log(result.state.msg);

        };
    }
    async showQr(){
        this.setState({
            qrBoxSow:true
        })
    }

    async onClose(){
        this.setState({
            qrBoxSow:false
        })
    }

    /**
     * 二维码弹框点击判断
     * @param {Event} e
     */
    onQrCodeTouch(e) {
        const event = e.nativeEvent;
        const appDom = document.querySelector('#app');
        const qrConfirm = document.querySelector('.share-qr');

        const qrHeight = qrConfirm.clientHeight;
        const qrWidth = qrConfirm.clientWidth;
        const appHeight = appDom.clientHeight;
        const appWidth = appDom.clientWidth;
        const pointX = event.changedTouches[0].clientX;
        const pointY = event.changedTouches[0].clientY;

        const top = (appHeight - qrHeight) / 2;
        const bottom = (appHeight - qrHeight) / 2 + qrHeight;
        const left = (appWidth - qrWidth) / 2;
        const right = (appWidth - qrWidth) / 2 + qrWidth;

        if (pointX > right || pointX < left || pointY > bottom || pointY < top) {
            this.closeFollowQR();
        }
    }
    render() {
        

        return (
            <Page title={`长按图片保存`} className='sharecard-channel-container'>
                <div>
                    <div className="share-card-img"><img src={this.state.cardUrl}/></div>
                    <div className="share-card-btnbox">
                        <span  className="change"><a href="javascript:;"  onClick={this.changeCard.bind(this)}><i className="change-i"></i>更换邀请卡主题</a></span>
                        {/*<span  className="qr"><a href="javascript:;" onClick={this.showQr.bind(this)}>获取二维码</a></span>*/}
                    </div>
                </div>
                
                {/*<dl className="tips-list">
                    <dt>如何玩转邀请卡</dt>
                    <dd>1.本次课程的分成比例为<span>{this.state.percent}%</span></dd>
                    <dd>2.点击[更换邀请卡主题]，选择好看的邀请卡</dd>
                    <dd>3.长按图片进行保存</dd>
                    <dd>4.邀请卡30天后将过期失效</dd>
                </dl>*/}

                <MiddleDialog 
                    show={ this.state.qrBoxSow }                                 // 是否显示弹框
                    theme='primary'                                // 主题
                    bghide={ true }                                // 是否点击背景关闭
                    close={ true }  
                    className = "share-code"                               
                    onClose={ this.onClose.bind(this) }  
                             //onBtnClick={ this.onBtnClick.bind(this) }
                    >
                    <div className="share-qr">
                        <img 
                            style={{ pointerEvents: !Detect.os.phone && 'none' }}
                            src={this.state.shareUrl} 
                            onTouchStart={ (e)=>{onQrCodeTouch(e,".share-qr",this.onClose.bind(this))}}
                        />
                    </div>
                </MiddleDialog>
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
        channelInfo: state.channel.channelInfo,
    }
}

const mapActionToProps = {
    getChannelSharePercent,
    shareCardChannel,
    getChannelInfo,
}

module.exports = connect(mapStateToProps, mapActionToProps)(ShareCardChannel);
