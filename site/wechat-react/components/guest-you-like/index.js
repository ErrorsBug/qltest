import React from 'react';
import { request, getAdSpace } from '../../actions/common';
import { isFromLiveCenter, digitFormat } from 'components/util';
import CommonCourseItem from 'components/common-course-item';
import { query2string } from 'components/url-utils';
import YouLike from './you-like'
import { locationTo } from 'components/util';

export default class GuestYouLike extends React.Component {
    state = {
        isCend: isFromLiveCenter(),

        lshareKey: {},

		courseList: {
			status: '',
			data: [],
        },
        
        memberCount: 0,

        adObj: {}
    }

    async componentDidMount() {
        this.initNodeInfo();
        let liveId = this.props.liveId,
            isShare = false,
            res_courseList = {},
            res_lshareKey = {};

        this.setState({
            courseList: {
                ...this.state.courseList,
                status: 'pending',
            }
        })
        
        const purchaseList = [2000000177260061]
        const result = await request({
            url: '/api/wechat/mine/purchaseCourse',
            method: 'POST',
            body: {
                page: {
                    page : 1,
                    size : 20
                }
            },
        })
        
        if(result && result.data && result.data.list && result.data.list.length > 0) {
            result.data.list.map( item => {
                purchaseList.push(Number(item.bussinessId))
            })
        }

        await request({
            url: '/api/wechat/live/getGuestYouLike',
            method: 'POST',
            body: {
                businessType: this.props.businessType, 
                businessId: this.props.businessId,
                type: this.props.dimensionType, // 新增参数: 维度类型 buy(购买) browse(浏览)
                isCustomer: this.state.isCend ? 'Y' : 'N' // 新增参数：是否C端来源
            },
            sessionCache: true,
        }).then(res => {
            if (res.state.code) throw Error(res.state.msg);
            let data = res.data.dataList || [];

            if (!liveId && data[0]) {
                liveId = data[0].liveId;
            }

            if (data[0]) {
                isShare = data[0].isShare === 'Y';
            }

            const _data = data.filter( item => purchaseList.indexOf(Number(item.businessId)) < 0).slice(0, 3)

            // 产品说数量x3，为避免明显数字规律，结果加余数
            let memberCount = res.data.memberCount || 0;
            memberCount = memberCount * 3 + memberCount % 3;
            this.setState({
                memberCount,
            })

            res_courseList = {
                ...this.state.courseList,
                status: 'success',
                data: _data,
            }
        }).catch(err => {
            console.error(err);
            res_courseList = {
                ...this.state.courseList,
                status: 'error',
            }
        })

        this.setState({
		    courseList: res_courseList,
            lshareKey: res_lshareKey,
        }, () => {
            setTimeout(() => {
                typeof _qla === 'undefined' || _qla.collectVisible();
            }, 500)
        })
    }

    async initNodeInfo() {
        let type = ''
        const path = location.pathname;
        if(path.includes('/channel-intro')){ // 系列课详情
            if(Object.is(this.props.dimensionType, 'buy')){
                type = "channel"
            } else {
                type = "channel_unbuy"
            }
        } else if(path.includes('/topic-simple-video')){ // 视频极简
            type = "video"
        } else if(path.includes('/topic-intro')){ // 话题详情
            if(Object.is(this.props.dimensionType, 'buy')){
                type = "topic"
            } else {
                type = "topic_unbuy"
            }
        }
        if(path.includes('/topic/details-listening')){ // 音频极简
            type = "audio"
        }
        if(type) {
            const res = await getAdSpace({ type: type })
            this.setState({
                adObj: res || {}
            })
        }
    }

    // 修改wcl参数值
    paramsRewrite (isBigData) {
        const urlParams = { ...this.props.urlParams }
        if (isBigData === 'Y') { // 大数据打上标识
            urlParams.wcl = urlParams.wcl.replace(/promotion/, "promotionnNEW")
        } else if (!this.state.isCend) { // B端来源打上标识
            urlParams.wcl = urlParams.wcl.replace(/promotion/, "promotionB")
        }
        
        return urlParams
    }

    render() {
        if (!this.state.courseList.data.length && !this.props.isShowQlvipEntry) return false;
        const { adObj } = this.state;
        const dom = <div className="on-visible" data-log-region="guest-you-like-item">
            {/* {
                this.props.isShowQlvipEntry &&
                <CommonCourseItem
                    data={{
                        headImage: 'https://img.qlchat.com/qlLive/liveComment/6B9DUSW9-AK9Q-DYGZ-1548813450572-B5K3ZYEOCZA2.png',
                        businessName: '开通千聊会员，大师好课免费学，甄选课程随心听',
                        remark: '玩要尽兴，学要深度',
                        imgDesc: this.state.memberCount ? digitFormat(this.state.memberCount) + '人已加入' : '',
                        money: 9900,
                        discount: -1,
                    }}
                    href="/wechat/page/membership-center"
                    className="on-log on-visible"
                    data-log-region="guest-you-like-qlvip-entry"
                />
            } */}
            { this.props.isShowAd && Object.is(adObj.keyI, "Y") && (
                 <div className="university-like-ad" onClick={ () => locationTo(adObj.keyF) }>
                    <img src={ adObj.keyE } alt=""/>
                </div>
            ) } 

            {
                this.state.courseList.data.map((course, index) => {
                    let href = '/';
                    if (course.businessType === 'channel') {
                        href = `/wechat/page/channel-intro?channelId=${course.businessId}`;
                    } else {
                        href = `/wechat/page/topic-intro?topicId=${course.businessId}`;
                    }
                    href += '&' + query2string({
                        tracePage: 'liveCenter'
                    }, this.paramsRewrite(course.isBigData), course.isShare === 'Y' && course.lshareKey ? {
                        lshareKey: course.lshareKey
                    } : {});

                    if(Object.is(this.props.type, 'mini')){
                        return <YouLike 
                            key={index}
                            data={course}
                            href={href}
                            className="on-log like-mini-box on-visible"
                            pos={this.props.getDataLogPos ? this.props.getDataLogPos(index) : index} />
                    }

                    return <CommonCourseItem
                        key={index}
                        data={course}
                        href={href}
                        className="on-log on-visible"
                        data-log-region="guest-you-like-item"
                        data-log-pos={this.props.getDataLogPos ? this.props.getDataLogPos(index) : index}
                    />
                })
            }
        </div>

        if (this.props.render) {
            return this.props.render(dom);
        } else {
            return dom;
        }
    }
}