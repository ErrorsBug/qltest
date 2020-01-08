import React from 'react';
import Picture from 'ql-react-picture';
import { locationTo, digitFormat, formatMoney, setLocalStorage, getLocalStorage } from 'components/util';
import { request } from 'common_actions/common';
import classNames from 'classnames';




export default class NewUserGift extends React.PureComponent {
    static neverShowKey = 'NEW_USER_GIFT_NEVER_SHOW';
    static neverRequestKey = 'NEW_USER_GIFT_NEVER_REQUEST';

    state = {
        activeIndex: undefined,
        isShowConfirm: false,
    }

    componentDidMount() {
        setTimeout(() => {
            if (typeof _qla != 'undefined') {
                _qla.collectVisible();
                _qla.bindVisibleScroll('new-user-gift-course-list');
            }
        }, 100);
    }

    render() {
        const btnReceiveCln = classNames('btn-receive on-visible', {
            disabled: this.state.activeIndex === undefined,
            'on-log': this.state.activeIndex !== undefined, 
        })
        return (
            <div className="co-new-user-gift" onClick={this.onClickClose}>
            { this.state.isShowConfirm
                ?
                <div className="win-confirm" onClick={e => e.stopPropagation()}>
                    <h1>真的不领取新人礼包吗？</h1>
                    <h2>仅一次机会，关闭后不可再免费领取</h2>
                    <div className="btns">
                        <div className="btn on-log"
                            data-log-region="new-user-gift-btn-giveup"
                            onClick={this.onClickGiveup}>放弃优惠</div>
                        <div className="btn red on-log"
                            data-log-region="new-user-gift-btn-rereceive"
                            onClick={this.onClickReReceive}>免费领取</div>
                    </div>
                </div>
                :
                <div className="entity-wrap">
                <div className="entity" onClick={e => e.stopPropagation()}>
                    <div className="course-list-wrap">
                    <div className="nug-course-list new-user-gift-course-list">
                        {
                            this.props.courseList && this.props.courseList.map((data, index) => {
                                return <div key={index}
                                    className={`nug-course-item on-log on-visible${this.state.activeIndex === index ? ' active' : ''}`}
                                    data-log-region="new-user-gift-course-item"
                                    data-log-pos={index}
                                    onClick={() => this.onClickCourseItem(index)}
                                >
                                    <div className="img-wrap">
                                    <Picture className="poster" src={data.headImage}/>
                                        <div className="learn-num">
                                            {digitFormat(data.learningNum || 0)}次学习
                                        </div>
                                    </div>
                                    <div className="info">
                                        <div className="name">{data.businessName}</div>
                                        <div className="other-info">
                                            <div>{data.businessType === 'channel' ? `共${data.topicCount}课` : ''}</div>
                                            {
                                                data.showPrice !== 'N' &&
                                                <div className="price">
                                                {
                                                    data.money > 0
                                                        ?
                                                        data.discount == -1 
                                                            ?
                                                            <span className="current">￥{formatMoney(data.money)}</span>
                                                            :
                                                            <span>
                                                                <span className="origin">¥{formatMoney(data.money)}</span>
                                                                <span className="current">¥{formatMoney(data.discount)}</span>
                                                            </span>
                                                        :
                                                        <div className="free">免费</div>
                                                }  
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                    </div>

                    <div className="bottom">
                        <div className={btnReceiveCln} data-log-region="new-user-gift-btn-receive" onClick={this.onClickReceive}>免费领取</div>
                        <div className="desc">{this.props.expiresDay}天免费畅听礼包课程</div>
                    </div>
                </div>
                </div>
            }
            </div>
        )
    }

    onClickCourseItem = index => {
        this.setState({
            activeIndex: index,
        })
    }

    onClickReceive = () => {
        if (this.state.activeIndex === undefined) return;

        const activeCourse = this.props.courseList[this.state.activeIndex];

        request({
            url: '/api/wechat/transfer/h5/live/center/get-gift2',
            method: 'POST',
            body: {
                businessType: activeCourse.businessType,
                businessId: activeCourse.businessId,
            }
        }).then(res => {
            if (res.state.code) throw Error(res.state.msg);
            window.toast('领取成功');
            locationTo('/wechat/page/mine/course?activeTag=purchased');
        }).catch(err => {
            console.log(err);
            window.toast(err.message);
        }).then(() => {
            this.close();
        })
    }

    onClickClose = () => {
        this.setState({isShowConfirm: true})
        typeof _qla !== 'undefined' && _qla('click', {
            region: "new-user-gift-close",
        });
        
    }

    onClickGiveup = () => {
        this.close();
        setLocalStorage(NewUserGift.neverShowKey, 1);
    }

    onClickReReceive = () => {
        this.setState({
            isShowConfirm: false
        });
    }

    close = () => {
        typeof this.props.onClose === 'function' && this.props.onClose();
    }
}




export async function getNewUserGiftData() {
    if (getLocalStorage(NewUserGift.neverShowKey) || getLocalStorage(NewUserGift.neverRequestKey)) return;

    const newUserGiftExpiresDay = await request({
        url: '/api/wechat/transfer/h5/live/center/gift-flag',
        method: 'POST',
    }).then(res => {
        if (res.state.code) throw Error(res.state.msg);

        // isShow是开关
        if (res.data.isShow === 'Y' && res.data.isUserNew === 'Y' && res.data.isGet === 'N') {
            return res.data.sendDay;
        } else {
            // 此组件请求量比较大，缓存请求结果1天
            setLocalStorage(NewUserGift.neverRequestKey, 1, 86400);
        }

    }).catch(err => {
        console.log(err);
    })

    if (!newUserGiftExpiresDay) return;

    const newUserGiftCourseList = await request({
        url: '/api/wechat/transfer/h5/live/center/all-gift2',
        method: 'POST',
    }).then(res => {
        if (res.state.code) throw Error(res.state.msg);
        return res.data.dataList || [];
    }).catch(err => {
        console.log(err);
    })

    if (!newUserGiftCourseList || !newUserGiftCourseList.length) return;

    return {
        isShowNewUserGift: true,
        newUserGiftExpiresDay,
        newUserGiftCourseList,
    }
}

