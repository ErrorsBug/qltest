import React, { Component } from 'react';

import { connect } from 'react-redux';
import { share } from 'components/wx-utils';
import Page from 'components/page';
import {
    locationTo,
    digitFormat,
    imgUrlFormat,
} from 'components/util';

import paintCard from './utils/paintCard';

//actions
import {
	getQr,
	loading
} from '../../actions/common';
import {
    getPeriodShareCard,
} from '../../actions/recommend';

class SubscribeCard extends Component {
    state = {
        inviteKey:this.props.location.query.inviteKey||"",
	    card: ''
    };

    componentWillMount() {
        
    }
	async componentDidMount() {
        //微信分享定制
        share({
            title: '【千聊】专属定制听课大礼包',
            desc: "向你推荐2017最具价值的上课计划，一起组队听课吧",
            timelineDesc: '向你推荐2017最具价值的上课计划，一起组队听课吧', // 分享到朋友圈单独定制
            imgUrl: "https://img.qlchat.com/qlLive/liveCommon/period-share-logo.jpg",
            shareUrl:window.location.href,
        });

		this.props.loading(true);

        await this.getCard();
        await this.generateCard();

		this.props.loading(false);
        
    }
    async generateCard(){
        const qrCodeUrl = await this.getQrCode();

	    const card = await paintCard({
            bgImgUrl: 'https://img.qlchat.com/qlLive/liveCommon/custom-card-bg.png',
            name: this.props.periodCardInfo.name,
		    avatarImgUrl: imgUrlFormat(this.props.periodCardInfo.headImg,"@132w_132h_1e_1c_2o"),
            clockInNum: this.props.periodCardInfo.signIn || 120898,
		    qrCodeUrl
	    });
	    // console.log(card);
	    this.setState({
            card
        })
    }
    async getCard(){
        if(this.props.periodCardInfo && !this.props.periodCardInfo.imgUrl){
            await this.props.getPeriodShareCard(this.state.inviteKey);
        }
    }
    async getQrCode(){
        const res = await this.props.getQr({
	        channel: '119',
	        liveId: '100000081018489',
	        toUserId: this.state.inviteKey,
	        showQl: 'Y'
        });
        if(res.state.code === 0){
            return res.data.qrUrl;
        }else{
            return '';
        }
    }
    render() {
        var cardInfo=this.props.periodCardInfo;
         return (
            <Page title={`听课邀请卡`} className='subscribe-card-container'>
                <div className="share-card-wrap">
                    <div className="card-wrap">
                        <div className={`share-card-img${this.state.card ? ' show' : ''}`}>
                            <img src={this.state.card}/>
                        </div>
                    </div>
                    <section className="tips">长按发送给好友或保存图片</section>
                </div>
                <ul  className="invited-ul">
                    <li>
                        <div className="avatar"><img src={imgUrlFormat(cardInfo.headImg,"@132w_132h_1e_1c_2o")}/></div>
                        <div className="info">
                            <p className="user-name">{cardInfo.name}</p>
                            <p className="detail">已成功推荐 <span className="invited-num">{digitFormat(cardInfo.inviteNum,10000)}</span> 人组队来学习</p>
                        </div>
                    </li>
                    
                </ul>
            </Page>
        );
    }
    
}

function mapStateToProps (state) {
    return {
        periodCardInfo: state.periodCourse.periodCardInfo,
    };
}

const mapActionToProps = {
    getPeriodShareCard,
	getQr,
	loading
};

module.exports = connect(mapStateToProps, mapActionToProps)(SubscribeCard);