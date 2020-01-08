import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatMoney } from 'components/util';
import { autobind } from 'core-decorators';
import { locationTo, getVal } from 'components/util';

@autobind
class BtnShareCard extends Component {
    static contextTypes = {
        router: PropTypes.object
    }

    state = {
        url : ''
    }

    componentDidMount() {
        this.initShareUrl();
    }

    initShareUrl() {
        let lshareKey = getVal(this.context.router, 'location.query.lshareKey', '');
        let sourceNo = getVal(this.context.router, 'location.query.sourceNo', '');
        this.setState({
            url: `/wechat/page/sharecard?type=topic&topicId=${this.props.topicInfo.id}&liveId=${this.props.topicInfo.liveId}&lshareKey=${lshareKey}&sourceNo=${sourceNo}`
        })
    }

    render() {
        let { topicInfo, lShareKey, shareKey, coral, liveRole } = this.props;
        let hasLShareKey = lShareKey && lShareKey.shareEarningPercent && lShareKey.type == 'live';
        let hasTopicShareKey = shareKey && shareKey.shareEarningPercent && shareKey.type == 'topic';
        // 有 coral.lsharekey 表示该课程有加入珊瑚计划； 
        // 有 coral.percent 表示我是珊瑚计划课代表
        let isCoral = coral && coral.sharePercent && coral.isPersonCourse ==='Y';
        let isTabbarShow = this.props.isTabbarShow ? 'btn-lower-offset' : '';
        // 是否开启单节付费
        const isSingleBuy = topicInfo.isSingleBuy === 'Y';
        // 是否是系列课内话题
        const isInSeries = !!this.props.channelId;
        
	    if (topicInfo.isRelay == 'Y' || topicInfo.campId) {
		    // 如果是系列课内付费话题，没有开启单节支付 或者是 转播话题 或者是 打卡训练营内话题，则不显示按钮；
		    return null;

	    } else if ((isSingleBuy || !isInSeries) && topicInfo.type == 'charge') {

            if(liveRole != 'creater' && this.props.distributionShareEarningPercent && isCoral){
                // 如果是课代表并且有珊瑚计划身份
                return (
                    <div className={'btn-share-uncertain on-log ' + isTabbarShow} onClick={this.props.uncertainShareBtnClickHandle}
                         data-log-name="生成邀请卡"
                         data-log-region="btn-share-card"
                         data-log-pos="btn-share-uncertain"
                    >
                        {/* 分享赚 */}
                        生成邀请卡
                    </div>
                )
            }else if(hasTopicShareKey || hasLShareKey){
	            // 如果是课代表
	            return (
                    <div className={'btn-share-card on-log ' + isTabbarShow} onClick={()=>{locationTo(this.state.url)}}
                         data-log-name="生成邀请卡"
                         data-log-region="btn-share-card"
                         data-log-pos="btn-share-card"
                    >
                        <div className="main">
                            <i className="icon-share"></i>
                            <span className="content">
                                赚{formatMoney(topicInfo.money * this.props.distributionShareEarningPercent / 100)}元
                                {/* 生成邀请卡 */}
                            </span>
                        </div>
                    </div>
	            );
            }else if(liveRole != 'creater' && isCoral){
	            // 有珊瑚计划身份
	            return (

                    <div className={'btn-coral on-log ' + isTabbarShow} onClick={this.props.onCoralShare}
                         data-log-name="生成邀请卡"
                         data-log-region="btn-share-card"
                         data-log-pos="btn-coral"
                    >
                        <div className="main">
                            <i className="icon-coral"></i>
                            <span className="content">
                                分享 | 赚<var>{formatMoney(topicInfo.money * coral.sharePercent / 100)}</var>元
                                {/* 生成邀请卡 */}
                            </span>
                        </div>
                    </div>
	            );
            }else if(topicInfo.isAutoshareOpen === 'Y' && !hasLShareKey && !hasTopicShareKey){
                // 开启了自动分销 
                // 没有分销权限，因为有可能被冻结跳过上面进来了。
	            return (
                    <div className={'btn-share-card on-log ' + isTabbarShow} onClick={()=>{locationTo(this.state.url)}}
                         data-log-name="生成邀请卡"
                         data-log-region="btn-share-card"
                         data-log-pos="btn-share-card"
                    >
                        <div className="main">
                            <i className="icon-share"></i>
                            <span className="content">
                                赚{formatMoney(topicInfo.money * this.props.autoSharePercent / 100)}元
                                {/* 生成邀请卡 */}
                            </span>
                        </div>
                    </div>
	            )
            }else{
                return (
                    <div className={'btn-share-card on-log ' + isTabbarShow} onClick={()=>{locationTo(this.state.url)}}
                         data-log-name="生成邀请卡"
                         data-log-region="btn-share-card"
                         data-log-pos="btn-share-card"
                    >
                        <div className="main">
                            <i className="icon-share"></i>
                            <span className="content">我的邀请卡</span>
                        </div>
                    </div>
                )
            }

	    }else {
		    return (
                <div className={'btn-share-card on-log ' + isTabbarShow} onClick={()=>{locationTo(this.state.url)}}
                     data-log-name="生成邀请卡"
                     data-log-region="btn-share-card"
                     data-log-pos="btn-share-card"
                >
                    <div className="main">
                        <i className="icon-share"></i>
                        <span className="content">我的邀请卡</span>
                    </div>
                </div>
		    );
	    }

    }
}

BtnShareCard.propTypes = {

};

export default BtnShareCard;
