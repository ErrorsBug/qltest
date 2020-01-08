import React, { Component } from 'react';
import {
    formatMoney,
    locationTo
} from 'components/util';
import moment from 'moment';

const now = moment()
const timeDiffStr = (time1, time2) => {
    let m1 = moment(time1)
    let m2 = time2 ? moment(time2) : now

    if (m2.valueOf() > m1.valueOf()) {
        return <span>进行中</span>
    } else {
        const diff = m1.diff(m2, 'minute')
        const d = Math.floor(diff / (24 * 60))
        const m = diff % 60
        const h = (diff - m) / 60 - d * 24
        return (
            <span>
            {
                d == 0 ? 
                    h == 0 ?
                    `即将开始`
                    :
                    `${h}小时后`
                : `${d}天后`
            }
            </span>
        )
    }
}

// =======================================================================================================
// 大图模块

const FunctionChannel = ({
    item = {},
    showLearningNumStatus, // 是否展示学习次数
    showCourseNumStatus, // 是否显示课程数量
    showPricesStatus, // 是否展示价格
    onJump = () => {}
}) => (
    <div className="function-module-course channel" onClick={onJump}>
        <div className="module-banner">
            <img src={`${item.headImage}?x-oss-process=image/resize,m_fill,limit_0,h_380,w_690`} alt="" />
            <div className="module-title"><p>{item.name}</p></div>
        </div>
        <div className="module-bottom-info">
            <div className="left">
                {
                    showCourseNumStatus == 'Y' ?
                    <span>共{item.topicCount}节课</span> : null  
                }    
                {
                    showLearningNumStatus == 'Y' ?
                    <span>{item.learningNum}人在学</span> : null  
                } 
            </div>
            {
                showPricesStatus == 'Y' ?
                    <div className="right">
                        {
                            ((item) => {
                                if (item.chargeType === 'flexible') {
                                    return <p className="price-box"><span className="months-sign">{item.chargeConfigs[0].chargeMonths}月/</span><span className="price">¥{item.chargeConfigs[0].amount}</span></p>
                                } else if (item.amount == 0) {
                                    return <span className='free'>免费</span>
                                } else if (item.discountStatus === 'UNLOCK') {
                                    return <p className="price-box"><s className="sign-text type-2">解锁</s><span className="price">¥{item.discount}</span></p>
                                } else if (item.discountStatus === "P" || item.discountStatus === 'GP') {
                                    return <p className="price-box"><s className="sign-text">拼</s><span className="price">¥{item.discount}</span></p>
                                } else if (item.discountStatus === 'Y') {
                                    return <p className="price-box"><s className="sign-text">促</s><span className="price">¥{item.discount}</span></p>
                                } else if (item.discountStatus === 'K') {
                                    return <p className="price-box"><s className="sign-text type-1">砍</s><span className="price">¥{item.discount}</span></p>
                                } else {
                                    return <span className='price'>¥{item.amount}</span>
                                }
                            })(item)
                        }
                    </div>
                :null  
            }    

        </div>
    </div>
)

const FunctionTopic = ({
    item = {},
    showLearningNumStatus, // 是否展示学习次数
    showPricesStatus, // 是否展示价格
    onJump = () => {}
}) => (
    <div className="function-module-course" onClick={onJump}>
        <div className="module-banner">
            <img src={`${item.backgroundUrl}?x-oss-process=image/resize,m_fill,limit_0,h_380,w_690`} alt="" />
            <div className="module-title"><p>{item.name}</p></div>
        </div>
        <div className="module-bottom-info">
            <div className="left">
                {
                    /ended/.test(item.status) ?
                    <span>回放中</span> : timeDiffStr(item.startTime)
                }
                {
                    showLearningNumStatus == 'Y' ?
                    <span>{item.browseNum || 0}人在学</span> : null  
                }
            </div>
            <div className="right">
                {
                    ((item) => {
                        if (showPricesStatus != 'Y') return null

                        if (item.type === 'encrypt') {
                            return <span className='price'>加密</span>
                        } else if (item.money == 0) {
                            return <span className='free'>免费</span>
                        } else {
                            return <span className="price">¥{formatMoney(item.money)}</span>
                        }
                    })(item)
                }
            </div>
        </div>
    </div>
)

const FunctionTraining = ({
    item = {},
    showCampPeriodNumStatus, // 是否显示训练营期数
    onJump = () => {}
}) => (
    <div className="function-module-course" onClick={onJump}>
        <div className="module-banner">
            <img src={`${item.headImage}?x-oss-process=image/resize,m_fill,limit_0,h_380,w_690`} alt="" />
            <div className="module-title"><p>{item.name}</p></div>
        </div>
        <div className="module-bottom-info">
            <div className="left">
                <span>训练营</span>
                { 
                    showCampPeriodNumStatus === 'Y' ?
                    <span>共{item.periodCount}期</span> : null
                } 
            </div>
            <div className="right">
                {
                    !item.campAuthNum || item.campAuthNum < 10 ? 
                    <span className="price">火热招生中</span> 
                    : 
                    <span>{item.campAuthNum}人购买</span>
                }
            </div>
        </div>
    </div>
)

const FunctionLiveCamp = ({
    item = {},
    showPricesStatus, // 是否展示价格
    showAffairDayStatus, // 是否展示打卡天数
    showAffairNumStatus, // 打卡次数
    onJump = () => {}
}) => (
    <div className="function-module-course live-camp" onClick={onJump}>
        <div className="module-banner">
            <img src={`${item.headImage}?x-oss-process=image/resize,m_fill,limit_0,h_380,w_690`} alt="" />
            <div className="module-title"><p>{item.name}</p></div>
        </div>
        <div className="module-bottom-info">
            <div className="left">
                { 
                    showAffairDayStatus === 'Y' ?
                    <span>打卡{item.dayNum || 0}天</span> : null
                }
                { 
                    showAffairNumStatus === 'Y' ?
                    <span>{item.authNum || 0}人参与</span> : null
                }
            </div>
            <div className="right">
                {
                    showPricesStatus === 'Y' ? 
                        item.price > 0 ?
                        <span className="price">¥{formatMoney(item.price)}</span> 
                        : 
                        <span className="free">免费</span>
                    : null
                }
            </div>
        </div>
    </div>
)

// =======================================================================================================
// 小图模块

const FunctionChannelSmall = ({
    item = {},
    showLearningNumStatus, // 是否展示学习次数
    showCourseNumStatus, // 是否显示课程数量
    showPricesStatus, // 是否展示价格
    onJump = () => {}
}) => (
    <div className="function-module-course channel" onClick={onJump}>
        <div className="module-banner">
            <img src={`${item.headImage}?x-oss-process=image/resize,m_fill,limit_0,h_150,w_240`} alt="" />
        </div>
        <div className="module-content-info">
            <div className="module-title"><p>{item.name}</p></div>
            <div className="module-bottom-info">
                <div className="left">  
                    {
                        showLearningNumStatus == 'Y' ?
                        <span>{item.learningNum}次学习</span> : null  
                    } 
                    {
                        showCourseNumStatus == 'Y' ?
                        <span>{item.topicCount}课</span> : null  
                    }  
                </div>
                {
                    showPricesStatus == 'Y' ?
                        <div className="right">
                            {
                                ((item) => {
                                    if (item.chargeType === 'flexible') {
                                        return <p className="price-box"><span className="months-sign">{item.chargeConfigs[0].chargeMonths}月/</span><span className="price">¥{item.chargeConfigs[0].amount}</span></p>
                                    } else if (item.amount == 0) {
                                        return <span className='free'>免费</span>
                                    } else if (item.discountStatus === 'UNLOCK') {
                                        return <p className="price-box"><s className="sign-text type-2">解锁</s><span className="price">¥{item.discount}</span></p>
                                    } else if (item.discountStatus === "P" || item.discountStatus === 'GP') {
                                        return <p className="price-box"><s className="sign-text">拼</s><span className="price">¥{item.discount}</span></p>
                                    } else if (item.discountStatus === 'Y') {
                                        return <p className="price-box"><s className="sign-text">促</s><span className="price">¥{item.discount}</span></p>
                                    } else if (item.discountStatus === 'K') {
                                        return <p className="price-box"><s className="sign-text type-1">砍</s><span className="price">¥{item.discount}</span></p>
                                    } else {
                                        return <span className='price'>¥{item.amount}</span>
                                    }
                                })(item)
                            }
                        </div>
                    :null  
                }    

            </div>
        </div>
    </div>
)

const FunctionTopicSmall = ({
    item = {},
    showLearningNumStatus, // 是否展示学习次数
    showPricesStatus, // 是否展示价格
    onJump = () => {}
}) => (
    <div className="function-module-course" onClick={onJump}>
        <div className="module-banner">
            <img src={`${item.backgroundUrl}?x-oss-process=image/resize,m_fill,limit_0,h_150,w_240`} alt=""/>
        </div>
        <div className="module-content-info">
            <div className="module-title"><p>{item.name}</p></div>
            <div className="module-bottom-info">
                <div className="left">
                    {
                        /ended/.test(item.status) ?
                        <span>回放中</span> : timeDiffStr(item.startTime)
                    }
                    {
                        showLearningNumStatus == 'Y' ?
                        <span>{item.browseNum || 0}次学习</span> : null  
                    }
                </div>
                <div className="right">
                    {
                        ((item) => {
                            if (showPricesStatus != 'Y') return null

                            if (item.type === 'encrypt') {
                                return <span className='price'>加密</span>
                            } else if (item.money == 0) {
                                return <span className='free'>免费</span>
                            } else {
                                return <span className="price">¥{formatMoney(item.money)}</span>
                            }
                        })(item)
                    }
                </div>
            </div>
        </div>
    </div>
)

const FunctionTrainingSmall = ({
    item = {},
    showCampPeriodNumStatus, // 是否显示训练营期数
    onJump = () => {}
}) => (
    <div className="function-module-course" onClick={onJump}>
        <div className="module-banner">
            <img src={`${item.headImage}?x-oss-process=image/resize,m_fill,limit_0,h_150,w_240`} alt="" />
        </div>
        <div className="module-content-info">
            <div className="module-title"><p>{item.name}</p></div>
            <div className="module-bottom-info">
                <div className="left">
                    { 
                        showCampPeriodNumStatus === 'Y' ?
                        <span>共{item.periodCount}期</span> : null
                    }
                    {
                        !item.campAuthNum || item.campAuthNum < 10 ? 
                        <span className="price">火热招生中</span> 
                        : 
                        <span>{item.campAuthNum}人购买</span>
                    }
                </div>
                <div className="right">
                </div>
            </div>
        </div>
    </div>
)

const FunctionLiveCampSmall = ({
    item = {},
    showPricesStatus, // 是否展示价格
    showAffairDayStatus, // 是否展示打卡天数
    showAffairNumStatus, // 打卡次数
    onJump = () => {}
}) => (
    <div className="function-module-course live-camp" onClick={onJump}>
        <div className="module-banner">
            <img src={`${item.headImage}?x-oss-process=image/resize,m_fill,limit_0,h_150,w_240`} alt="" />
        </div>
        <div className="module-content-info">
            <div className="module-title"><p>{item.name}</p></div>
            <div className="module-bottom-info">
                <div className="left">
                    { 
                        showAffairDayStatus === 'Y' ?
                        <span>打卡{item.dayNum || 0}天</span> : null
                    }
                    { 
                        showAffairNumStatus === 'Y' ?
                        <span>{item.authNum || 0}人参与</span> : null
                    }
                </div>
                <div className="right">
                    {
                        showPricesStatus === 'Y' ? 
                            item.price > 0 ?
                            <span className="price">¥{formatMoney(item.price)}</span> 
                            : 
                            <span className="free">免费</span>
                        : null
                    }
                </div>
            </div>
        </div>
    </div>
)

class FunctionCourseList extends Component {
    render() {
        const {
            moduleInfo: {
                name = '',
                businessList = [],

                ...otherProps
            },
            type = 'big'
        } = this.props

        if (type === 'small') {
            return (
                <div className='function-module-course-list small'>
                    {
                        businessList && businessList.length > 0 ?
                            businessList.map((item, index) =>{
                                switch (item.businessType) {
                                    case 'channel':
                                        return <FunctionChannelSmall key={'function-module-course' + index} item={item.businessObj} {...otherProps} onJump={() => locationTo(`/live/channel/channelPage/${item.businessId}.htm`)} />
                                    case 'topic':
                                        return <FunctionTopicSmall key={'function-module-course' + index} item={item.businessObj} {...otherProps} onJump={() => locationTo(`/wechat/page/topic-intro?topicId=${item.businessId}`)} />
                                    case 'training':
                                        return <FunctionTrainingSmall key={'function-module-course' + index} item={item.businessObj} {...otherProps} onJump={() => locationTo(`/wechat/page/training-intro?campId=${item.businessId}`)} />
                                    case 'liveCamp':
                                        return <FunctionLiveCampSmall key={'function-module-course' + index} item={item.businessObj} {...otherProps} onJump={() => locationTo(`/wechat/page/camp-detail?campId=${item.businessId}`)} />
                                }
                            })
                        :    
                        <div className='no-small'></div>
                    }
                </div>
            );
        } else if (type === 'big') {
            return (
                <div className='function-module-course-list big'>
                    {
                        businessList && businessList.length > 0 ?
                            businessList.map((item, index) =>{
                                switch (item.businessType) {
                                    case 'channel':
                                        return <FunctionChannel key={'function-module-course' + index} item={item.businessObj} {...otherProps} onJump={() => locationTo(`/live/channel/channelPage/${item.businessId}.htm`)} />
                                    case 'topic':
                                        return <FunctionTopic key={'function-module-course' + index} item={item.businessObj} {...otherProps} onJump={() => locationTo(`/wechat/page/topic-intro?topicId=${item.businessId}`)} />
                                    case 'training':
                                        return <FunctionTraining key={'function-module-course' + index} item={item.businessObj} {...otherProps} onJump={() => locationTo(`/wechat/page/training-intro?campId=${item.businessId}`)} />
                                    case 'liveCamp':
                                        return <FunctionLiveCamp key={'function-module-course' + index} item={item.businessObj} {...otherProps} onJump={() => locationTo(`/wechat/page/camp-detail?campId=${item.businessId}`)} />
                                }
                            })
                        :    
                        <div className='no-big'></div>
                    }
                </div>
            );
        }

        return null
    }
}

FunctionCourseList.propTypes = {

};

export default FunctionCourseList;