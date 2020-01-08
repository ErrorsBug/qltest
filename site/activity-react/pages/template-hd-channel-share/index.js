import * as React from 'react';
import { render, findDOMNode } from 'react-dom';
import Page from '../../components/page';
import api from '../../utils/api';
import { formatMoney, locationTo } from '../../utils/util';
import * as urlUtils from '../../utils/url-utils'
import * as envi from '../../utils/envi';
import * as ui from '../../utils/ui';
import './style.scss';

import hdWxShare from '../../utils/hd-share'

import TuiwenImageItem from '../../components/tamplate-tuiwen-img'
import TuiwenVideoItem from '../../components/tamplate-tuiwen-video'
import TuiwenMask from '../../components/tamplate-tuiwen-mask'

class ChannelTuiwenHD extends React.Component { 
    constructor(props) {
        super(props);
        console.log(window.INIT_DATA);
        this.initData = window.INIT_DATA
    }

    state = {
        initData: {
            shareConfig: {},
            imgList: [],
        },
        couponMoney: 0,

        showBottom: false,
        bottomAnimation: {
            display: "none"
        }
    }

    componentDidMount() {
        this.initializeData()
        // this.initCouponData()
        this.initbottomAnimation()
        this.initBottomClicked()
        this.initShare()
    }

    initializeData = () => {
        this.setState({
            initData: this.initData
        })
    }

    srollLock = false
    initbottomAnimation = () => {
        const scrollBox = findDOMNode(this.refs.scrollBox)
        scrollBox.addEventListener('scroll', () => {
            if (!this.srollLock) {
                this.srollLock = true
                setTimeout(() => {
                    if(scrollBox.scrollTop > 400 && !this.state.showBottom) {
                        this.setState({bottomAnimation : {
                            transform: 'translate(0, 300px)'
                        },showBottom: true})
                        setTimeout(() => {
                            this.setState({bottomAnimation : {
                                transform: 'translate(0, 0)',
                                display: "flex"
                            }})
                        }, 100);
                    } else if(scrollBox.scrollTop < 400 && this.state.showBottom) {
                        this.setState({bottomAnimation : {
                            display: "none"
                        },
                        showBottom: false
                        })
                    }
                    this.srollLock = false
                }, 200);
            }
        })
    }

    // initCouponData = async () => {
    //     if(this.initData.couponIdList && this.initData.couponIdList.length) {
    //         const result = await api('/api/wechat/coupon/activityCouponObj', {
    //             method: 'POST',
    //             body: {
    //                 codeId: this.initData.couponIdList[0]
    //             }
    //         })

    //         let money = (result.data.promotionDto && result.data.promotionDto.money) || 0
    //         money = money % 100 == 0 ? (money / 100) : (money / 100).toFixed(2) 

    //         this.setState({
    //             couponMoney: money
    //         })

    //     } else {
    //         console.error("优惠券未配置")
    //     }

    // }

    initShare = () => {
        const shareData = this.initData.shareConfig

        hdWxShare({
            title: shareData.name,
            desc: shareData.content,
            imgUrl: shareData.icon,
        }, this.shareToChannel)
    }

    shareToChannel = () => {
        let linkUrl = this.initData.courseUrl || 'https://m.qlchat.com/live/channel/channelPage/' + this.initData.channelId + '.htm'
        linkUrl = urlUtils.fillParams({ activityCodeId: this.initData.couponIdList[0]} ,linkUrl)

        let ch = urlUtils.getUrlParams("ch")
        if(ch) {
            linkUrl = urlUtils.fillParams({ ch: ch } ,linkUrl)
        }

        if(envi.isQlchat()) {
            let couponUrl = ''
            if(/hd1.qianliao/.test(location.href)) {
                couponUrl = 'https://m.qlchat.com/wechat/page/activity/activity-coupon'
            } else {
                couponUrl = '/wechat/page/activity/activity-coupon'
            }

            let linkUrlEcode = encodeURIComponent(linkUrl)
            couponUrl = urlUtils.fillParams({ 
                channelId: this.initData.channelId ,
                activityCode: this.initData.couponIdList[0],
                courseUrl: linkUrlEcode
            } ,couponUrl)

            // 1000毫秒的延迟是为了兼容安卓APP都是直接回调的情况而做的兼容处理
            setTimeout(() => {
                location.href = couponUrl
            }, 1000);
        } else {
            locationTo(linkUrl)
        }
    }

    goToChannel = () => {
        let linkUrl = this.initData.courseUrl || 'https://m.qlchat.com/live/channel/channelPage/' + this.initData.channelId + '.htm'
        linkUrl = urlUtils.fillParams({ orderNow: 'Y' } ,linkUrl)

        let ch = urlUtils.getUrlParams("ch")
        if(ch) {
            linkUrl = urlUtils.fillParams({ ch: ch} ,linkUrl)
        }

        locationTo(linkUrl)
    }

    bottomClicked = false
    initBottomClicked = () => {
        if(window.localStorage.getItem("channelTuiwenHDBottom-" + urlUtils.getUrlParams("actid"))) {
            this.bottomClicked = true
        }
    }

    bottomClickHandle = () => {
        if(!this.bottomClicked) {
            this.setState({
                showMask: true
            })
            window.localStorage.setItem("channelTuiwenHDBottom-" + urlUtils.getUrlParams("actid"), "Y")
            this.bottomClicked = true
        } else {
            this.goToChannel()
        }
    }

    tuiwenListClickHandle = (mark, url) => {
        switch(mark) {
            case "link":
                locationTo(url);
                break;
            case 'share':
                this.setState({showMask: true});
                break;
            default:
                break;
        }
    }

    render(){
        const initData = this.state.initData
        return(
            <Page title={initData.title || window.INIT_DATA.title} className='channel-tuiwen-hd'> 
                <div className="main-con" ref="scrollBox">
                    <div className="head-img">
                        <img src={initData.headImg} alt="" />
                    </div>
                    {
                        initData.videoUrl && <TuiwenVideoItem
                            VideoSrc={initData.videoUrl}
                        />
                    }

                    {
                        initData.imgList && initData.imgList.length > 0 && initData.imgList.map((item, index) =>
                            <TuiwenImageItem
                                key={'tuiwen-img' + index}
                                imgSrc={item.icon}
                                mark={item.remark}
                                linkUrl={item.url}
                                clickHandle={this.tuiwenListClickHandle.bind(this, item.remark, item.url)}
                            />
                        )
                    }
                </div>

                <TuiwenMask
                    content={initData.maskFont}
                    show={this.state.showMask}
                    clickHandle={() => { this.setState({ showMask: false }) }}
                />

                <footer className="by-channel" style={this.state.bottomAnimation} onClick={this.bottomClickHandle}>
                    <div className="discount-price"> <var className="small">￥</var> {formatMoney(initData.discount)}</div>
                    <div className="origin-price-con">
                        <div className="origin-price">￥{formatMoney(initData.money)}</div>
                        <div className="tag">特价优惠</div>
                    </div>
                    <div className="buyCourse">
                        <div className="cor-des">{initData.bottomTitle || "购买系列课"}</div>
                        <div className="cor-ps">{initData.bottomSubTitle || ("分享后购买立减" + this.state.couponMoney + "元")}</div>
                    </div>
                </footer>

            </Page>
        )
    }
}


render(<ChannelTuiwenHD />, document.getElementById('container'))
