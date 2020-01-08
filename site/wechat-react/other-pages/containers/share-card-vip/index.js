const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { MiddleDialog } from 'components/dialog';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import { share } from 'components/wx-utils';
import { fillParams } from 'components/url-utils';

// actions
import { 
    getCardInfoVip,
    changeCardVip,
    getLiveInfo

 } from '../../actions/share-card';

class ShareCardVip extends Component {

    state = {
        qrBoxSow:false,
        styleId:1,
        shareKey:this.props.location.query.lshareKey,
    }
    async componentDidMount() {
        await this.props.getCardInfoVip(this.state.shareKey,this.props.params.liveId);
        await this.changeCard(true);
        this.getLiveInfo(this.props.params.liveId);
    }

    async getLiveInfo(liveId){
        var topicInfo=await this.props.getLiveInfo(liveId);
        share({
            title: '我推荐'+topicInfo.entity.name,
            desc: topicInfo.entity.introduce,
            timelineDesc: '我推荐'+topicInfo.entity.name, // 分享到朋友圈单独定制
            imgUrl: topicInfo.entity.logo,
            shareUrl:window.location.origin+'/wechat/page/live-vip-details?liveId='+liveId+'&lshareKey='+this.state.shareKey
        });
    }

    async changeCard(){
        var result=await this.props.changeCardVip(this.state.shareKey,this.props.params.liveId,this.state.styleId,1);//liveId,lshareKey,shareKey
        
        if(result.state.code==0){
            this.setState({
                shareUrl:result.data.shareUrl,
                cardUrl:result.data.cardUrl,
                styleId:result.data.styleId,
            })
            if(result.data.styleId>2||result.data.styleId<=0){
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


    render() {
        

        return (
            <Page title={`长按图片保存`} className='sharecard-vip-container'>
                <div>
                    <div className="share-card-img"><img src={this.state.cardUrl}/></div>
                    <div className="share-card-btnbox">
                        <span  className="change"><a href="javascript:;"  onClick={this.changeCard.bind(this)}><i className="change-i"></i>更换邀请卡主题</a></span>
                        {/*<span  className="qr"><a href="javascript:;" onClick={this.showQr.bind(this)}>获取二维码</a></span>*/}
                    </div>
                </div>
                
                {/*<dl className="tips-list">
                    <dt>如何玩转邀请卡</dt>
                    <dd>1.本次的分成比例为<span>{this.props.cardInfo.shareEarningPercent}%</span></dd>
                    <dd>2.点击[更换邀请卡主题]，选择好看的邀请卡</dd>
                    <dd>3.长按图片进行保存</dd>
                    <dd>4.邀请卡30天后将过期失效</dd>
                </dl>*/}

                <MiddleDialog 
                    show={ this.state.qrBoxSow }                                 // 是否显示弹框
                    theme='primary'                                // 主题
                    bghide={ true }                                // 是否点击背景关闭
                    close={ true }                                 
                    onClose={ this.onClose.bind(this) }  
                             //onBtnClick={ this.onBtnClick.bind(this) }
                    >
                    <div className="share-qr">
                        <img src={this.state.shareUrl} />
                    </div>
                </MiddleDialog>
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
        cardInfo:state.ShareCardVip.cardInfo
    }
}

const mapActionToProps = {
    getCardInfoVip,
    changeCardVip,
    getLiveInfo,
}

module.exports = connect(mapStateToProps, mapActionToProps)(ShareCardVip);
