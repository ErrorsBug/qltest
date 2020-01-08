import React, { Component } from 'react';
import { connect } from 'react-redux'
import Page from 'components/page';
import { locationTo, updatePageData, imgUrlFormat, formatDate } from 'components/util'

class ExclusiveGiftPackage extends Component {

    state = {
    }

    constructor(props) {
        super(props)
    }

    componentDidMount() {

    }
    render() {
        let {courses,coupons} = this.props;
        return (
            <Page title={'新人专属礼包'} className='exclusive-gift-package'>
                <div className="top-bg"></div>
                <div className="gift-package-container">
                    <div className="course-container">
                        <div className="title-container">
                            <div className="title">精品课程</div>
                            <p className="tip">礼包课程可点击“已购”查看</p>
                        </div>
                        <div className="course">
                            {
                                courses && courses.length > 0 && courses.map((item, index) => {
                                    return (
                                        <div className="list" 
                                            key={`course-${index}`}
                                            onClick = {()=>{item.url && locationTo(item.url)}}
                                        >
                                            <img src={item.logo} alt=""/>
                                            <div className="course-title">{item.businessName}</div>
                                            <div className="desc">
                                                <span className="desc-live">{item.liveName}</span>
                                                <span className="learn-time">{item.authNum}次学习</span>
                                            </div>
                                            <span className="course-tag">新人专享</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="location" onClick={()=>{locationTo('/wechat/page/mine/course?activeTag=purchased')}}>前往已购查看</div>
                    </div>
                    <div className="coupon-container">
                        <div className="title-container">
                            <div className="title">购买优惠</div>
                            <p className="tip">礼包优惠券可点击“我的优惠券”查看</p>
                            <span className="s"></span>
                            <span className="m"></span>
                            <span className="l"></span>
                        </div>
                        {
                            coupons && coupons.length > 0 && coupons.map((item, index) => {
                                return (
                                    <div className="coupon-content" key={`coupon-${index}`} onClick={()=>{locationTo('/wechat/page/live/'+item.liveId)}}>
                                        <div className="price-container">
                                            <div className="m-c">
                                                <span className="icon">￥</span>
                                                <span className="money">{item.money/100}</span>
                                            </div>
                                            <span className="tip">新人专享</span>
                                        </div>
                                        <div className="desc-container">
                                            <p className="c-desc">官方直播间【{item.liveName}】</p>
                                            <p className="c-live">{item.minMoney ? '满' + item.minMoney/100 + '可用' : '直播间课程通用'}</p>
                                        </div>
                                        <div className="use-container">
                                            {
                                                item.overTime ? 
                                                <span>{formatDate(item.overTime)}<br/>{'前使用'}</span>
                                                :<span>永久有效</span>
                                            }
                                            <div className="use">去使用</div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        <div className="coupon-location" onClick={()=>{locationTo('/wechat/page/mine/coupon-list')}}>前往我的优惠券查看</div>
                    </div>
                </div>
            </Page>
        );
    }
}

function mapStateToProps(state) {
    return {
        courses: state.exclusiveGiftPackage.giftPackage.courses,
        coupons: state.exclusiveGiftPackage.giftPackage.coupons,
    }
}

const mapDispatchToProps = {

}
module.exports = connect(mapStateToProps, mapDispatchToProps)(ExclusiveGiftPackage)