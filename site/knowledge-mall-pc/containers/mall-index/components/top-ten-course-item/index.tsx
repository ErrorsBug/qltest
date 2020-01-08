import * as React from 'react';
import { ICourseItem } from '../../../../models/course.model'
import { imgUrlFormat, locationTo } from '../../../../components/util';
import {autobind} from 'core-decorators'

import { Card } from 'antd'
const { Meta } = Card

import styles from './style.scss'

export interface CourseItemProps {
    course: ICourseItem
    userIdentity: any
    isExist: any
    setPromotionInfo: any;
    setPromotionModalShow: any;
    [index: string]: any
}

const formatDigit = (num: number) => {
    num = Number(num);
    if (num > 10000) {
        let fNum = num/10000;
        if (Number.isInteger(fNum)) {
            return fNum.toFixed(0) + '万'
        } else {
            return (num / 10000).toFixed(2) + '万';
        }
    }
    return num;
}

const topColor = [
    '#ff3f3f',
    '#ff6f21',
    '#5193ff',
    '#7e7e7e',
]

@autobind
export default class CourseItem extends React.Component<CourseItemProps, any> {

    card = null;

    linkToArticle(e) {
        e.stopPropagation && e.stopPropagation()
        window.open(this.props.course.url,'_blank') 
    }

    linkToChannel(e) {
        // if(e.target !== this.card) return;
        window.open(`/live/channel/channelPage/${this.props.course.businessId}.htm`)
    }

    onClickPromote(e) {
        e.stopPropagation && e.stopPropagation();
        e.preventdefault && e.preventdefault();
        if(this.props.userIdentity === 'not-login') {
            this.props.setLoginModalShow('Y');
            return;
        }
        const {
            tweetId,
            liveName, 
            relayChannelId, 
            businessName, 
            selfMediaPercent,
            businessHeadImg, 
            selfMediaProfit,
            amount,
            liveId,
            discountStatus,
            chargeMonths,
            discount,
            title
        }  = this.props.course;

        const shareUrl = `${window.location.origin}/live/channel/channelPage/${relayChannelId}.htm`;
        const percent = this.props.selfMediaPercent;
        const data ={
            businessImage: businessHeadImg,
            businessId: relayChannelId,
            businessName,
            amount: discountStatus == 'Y' ? discount : amount,
        }
        this.props.setReprintInfo({
            tweetId,
            reprintLiveId: liveId,
            reprintLiveName: liveName,
            reprintChannelId: relayChannelId,
            reprintChannelName: businessName,
            reprintChannelImg: businessHeadImg,
            reprintChannelAmount:  amount,
            reprintChannelDiscount: discount,
            selfMediaPercent: selfMediaPercent,
            selfMediaProfit: selfMediaProfit,
            discountStatus,
            chargeMonths,
            title
        })

        this.props.setPromotionInfo({shareUrl, percent, data,});
        this.props.setPromotionModalShow('Y');
    }

    onClickTransport(e) {
        e.stopPropagation && e.stopPropagation();
        e.preventdefault && e.preventdefault();
        const { isExist, userIdentity } = this.props;
        // const userIdentity = this.props.userIdentity;
        if(userIdentity === 'not-login') {
            this.props.setLoginModalShow('Y');
            return;
        }

        const {
            tweetId,
            liveName, 
            businessId, 
            businessName, 
            selfMediaPercent,
            businessHeadImg, 
            selfMediaProfit,
            amount,
            liveId,
            discountStatus,
            discount,
            chargeMonths,
            title
        }  = this.props.course;
        const notAgentPower =  isExist && (userIdentity === 'knowledge' || userIdentity=== 'normal' || userIdentity==='not-login')
        if(isExist == 'Y') {
            if (userIdentity === 'knowledge'){
                window.message.error("您已是知识通用户，不能成为二级代理，将自动跳转至知识通商城");
                // 延迟3s跳转
                setTimeout(() => {
                    locationTo('/pc/knowledge-mall/index');
                }, 3000);
                return;
            }
            
            if (userIdentity === 'normal' || userIdentity === 'not-login' || userIdentity === 'none-live'){
                locationTo(`/wechat/page/live-studio/media-market?agentId=${this.props.agentId}`);
                return
            }

            if (userIdentity === 'super-agent'){
                window.message.info('一级代理无需转载');
                return;
            }
            this.props.setReprintInfo({
                tweetId,
                reprintLiveId: liveId,
                reprintLiveName: liveName,
                reprintChannelId: businessId,
                reprintChannelName: businessName,
                reprintChannelImg: businessHeadImg,
                reprintChannelAmount: amount,
                reprintChannelDiscount: discount,
                selfMediaPercent: selfMediaPercent,
                selfMediaProfit: selfMediaProfit,
                index: this.props.index,
                discountStatus,
                chargeMonths,
                title
            })
            this.props.setReprintModalShow('Y');
            
        } else {
            this.props.setReprintInfo({
                tweetId,
                reprintLiveId: liveId,
                reprintLiveName: liveName,
                reprintChannelId: businessId,
                reprintChannelName: businessName,
                reprintChannelImg: businessHeadImg,
                reprintChannelAmount: discountStatus === 'Y' ? discount : amount,
                reprintChannelDiscount: discount,
                selfMediaPercent: selfMediaPercent,
                selfMediaProfit: selfMediaProfit,
                index: this.props.index,
                discountStatus,
                chargeMonths,
                title
            })
            this.props.setReprintModalShow('Y');
        }
    }

    getConfirmText() {
        const { isExist, userIdentity } = this.props;
        const { selfMediaProfit } = this.props.course;

        if(isExist === 'Y') {
            if (userIdentity === 'knowledge' || userIdentity=== 'normal' || userIdentity==='not-login' || userIdentity ==='none-live') {
                return '申请代理'
            }
            return `推广赚 ¥${selfMediaProfit}`
        }

        return `推广赚 ¥${selfMediaProfit}`
        
    }

    render() {
        let {
            tweetId, title, url, status,
            liveName, businessId, businessName, chargeMonths,
            isRecommend, liveSharePercent, selfMediaPercent,
            businessHeadImg, selfMediaProfit, isRelay,
            price, amount, discount, discountStatus, learningNum, readProfit, tagName
        } = this.props.course

        const amountStr = chargeMonths !== 0 ? `${amount}/${chargeMonths}月` : amount
        const priceText = discountStatus === 'Y' ? `特惠: ` : `售价: ` 
        const sharePercent = `${selfMediaPercent}%分成`
        readProfit = readProfit || 0

        return (
            <div className={styles.item} onClick={this.linkToChannel} ref={el => this.card = el}>
                <div className={styles.topIcon}>
                    <svg>
                        <polygon style={{fill: `${topColor[this.props.index < 3 ? this.props.index : 3]}`, boxShadow: '0px 2px 4px 0px rgba(53, 53, 53, 0.26);' }} points="68,30 0,30 0,0 68,0 58,15 "/>
                        <text x="10" y="23" style={{fontSize: 14, fill: '#fff', }}>TOP </text>
                        <text x="38" y="23" style={{fontSize: 20, fill: '#fff', fontStyle: 'italic'}}>{Number(this.props.index) + 1}</text>
                    </svg>
                </div>
                <div className={styles.inner}>
                    <div className={styles.img} style={{ backgroundImage: `url(${imgUrlFormat(businessHeadImg, "?x-oss-process=image/resize,m_fill,limit_0,h_344,w_560")})`}} />    
                    {/* 文字内容区 */}
                    <section className={styles['content']}>
                        <div className={styles.contentInner}>
                            <div>
                                <h1 className={styles['title']}>{businessName}</h1>
                                <p className={styles['livename']}>{tagName}</p>
                            </div>
                            <div>
                                <p className={styles['price']}>{priceText} <span className={styles.priceInner}>{discountStatus == 'Y' ? `￥${discount}` : `￥${amountStr}` }</span> <span className={styles.priceInner}>{`(${sharePercent})`}</span></p>
                                <div className={styles['profit']}>
                                    {/* 预计收益: <strong>￥{selfMediaProfit}</strong> */}
                                    学习人次 { formatDigit(learningNum)}   { readProfit ? <React.Fragment><span className={styles.readProfit}>{`${readProfit}元`}</span>/阅读</React.Fragment> : null}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* 底部按钮区 */}
                <section className={styles['btns']}>
                    <div className={styles['view-btn']} onClick={this.linkToArticle}>查看推文</div>
                    {
                        isRelay === 'Y' ? 
                        <div className={styles['promote-btn']} onClick={this.onClickPromote}>推广课程</div> : 
                        <div className={styles['transport-btn']} onClick={this.onClickTransport}>
                            { 
                                this.getConfirmText()
                            }
                        </div>
                    }
                </section>
            </div>
        );
    }
}
