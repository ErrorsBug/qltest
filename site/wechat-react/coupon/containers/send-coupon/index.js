import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';
import { autobind, debounce, throttle, deprecated } from 'core-decorators';
import { share } from 'components/wx-utils';
import { getVal } from 'components/util';

@autobind
class SendCoupon extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.initShare();
    }
    

    initShare() {
        let title = '';
        switch (this.props.sendCouponInfo.couponType) {
            case 'vip-batch': 
            case 'vip':
                title = this.props.sendCouponInfo.liveName;
                break;
            case 'topic-batch':
            case 'topic':
                title = this.props.sendCouponInfo.topicName;
                break;
            case 'channel-batch':
            case 'channel':
                title = this.props.sendCouponInfo.channelName;
                break;
            case 'camp-batch':
            case 'camp':
                title = this.props.sendCouponInfo.campName;
                break;
            default:
                title = this.props.sendCouponInfo.liveName;
                break;
        }

        let descript = '';
        let imgUrl = "https://img.qlchat.com/qlLive/liveCommon/couponsend_ico.png";
        //let shareUrl = window.location.origin + this.props.sendCouponInfo.redirectPath;

        // 分享链接需要push进一个主页的history, target指的就是分享出去要放问的链接，pre是返回回到的地址
		let target = this.props.sendCouponInfo.redirectPath;
		const pre = `/wechat/page/live/${this.props.location.query.liveId}?isBackFromShare=Y&wcl=middlepage`;

        let isNl = "\n";
        let money = getVal(this.props.sendCouponInfo, 'couponInfo.CouponInfoDto.money');
        
        if (/batch/.test(this.props.sendCouponInfo.couponType)) {
            descript = `点击领取! ${money}元优惠券限时抢，先到先得`;
        } else {
            descript = `点击领取！${money}元优惠券限时抢！`;
        }

         // 由于微信分享会自动decode一次，加上中间页go.html也要decode一次，所以要encode两次
        const shareUrl = `${window.location.origin}/api/gos?target=${encodeURIComponent(encodeURIComponent(target))}&pre=${encodeURIComponent(encodeURIComponent(pre))}`;

        title = `【领券便宜${money}元】${title}`;

        console.log({
            title: title,
            desc: descript,
            imgUrl: imgUrl,
            shareUrl: shareUrl,
        })
        share({
            title: title,
            desc: descript,
            imgUrl: imgUrl,
            shareUrl: shareUrl,
        });
    }

    getContent() {
        const type = this.props.sendCouponInfo.couponType;
        const tip1 = '点击右上角三个点“···”，选择“发送给朋友”，好友点击链接即可。'
        let tip2 = '';
        let tip3 = ''
        if (/batch/.test(type)) {
            tip2 = '一条链接可以被多个用户使用，点击即可领取。群发有被扩散的风险，请谨慎使用';
        } else {
            tip2 = '一条链接只能被一个用户使用，点击即可领取'; 
        }

        // switch(this.props.sendCouponInfo.overType) {
        //     case 'forever': tip3 = '该链接永久有效'; break;
        //     case 'halfAnHour': tip3 = '该链接30分钟内有效'; break;
        //     case 'oneDay': tip3 = '该链接24小时内有效'; break;
        // }

        return [tip1, tip2];
    }

    render() {
        return (
            <Page  title="发送优惠码"  className="send-coupon-container">
                <ul>
                    { 
                        this.getContent().map((data, idx) => {
                            return <li key={data} className="tips">{idx+1}.{data}</li>
                        }) 
                    }
                </ul>
                <div className="notice">有任何问题，请报告给【千聊公众号】</div>
            </Page>
        );
    }
}


function mapStateToProps (state) {
    return {
        sendCouponInfo: state.coupon.sendCouponInfo,
    }
}

const mapActionToProps = {

}

export default connect(mapStateToProps, mapActionToProps)(SendCoupon);