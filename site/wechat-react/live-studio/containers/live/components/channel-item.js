import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Picture from 'ql-react-picture';
import { locationTo, digitFormat, } from 'components/util';

class LiveChannelItem extends Component {

    originPrice = () => {
        const chargeItem = this.props.chargeConfigs[0]
        if (chargeItem && chargeItem.discountStatus == "N") {
            return ""
        } else {
            return (<span className="abandon">￥{chargeItem ? chargeItem.amount : 0}</span>)
        }
    }

    chargeTag = () => {
        if(this.props.chargeConfigs[0] && this.props.chargeConfigs[0].discountStatus === "Y") {
            return (<span className="price-tag promotion"></span>)
        }
        if(this.props.chargeConfigs[0] && this.props.chargeConfigs[0].discountStatus === "K") {
            return (<span className="price-tag cut"></span>)
        }
        if(this.props.chargeConfigs[0] && (this.props.chargeConfigs[0].discountStatus === "P"||this.props.chargeConfigs[0].discountStatus === "GP")) {//GP是团长付费拼团
            return (<span className="price-tag group"></span>)
		}
		if(this.props.chargeConfigs[0] && this.props.chargeConfigs[0].discountStatus === "UNLOCK") {
            return (<span className="price-tag unlock"></span>)
        }
    }
    
    actualPrice = () => {
        const chargeItem = this.props.chargeConfigs[0]
        if (chargeItem && chargeItem.chargeMonths > 0) {
            return <span className="actual-price">￥{chargeItem.amount} / {chargeItem.chargeMonths > 1 ? chargeItem.chargeMonths : ""} 月</span>
        } else {
            if(!chargeItem) {
                return null
            }

            if (chargeItem.amount == 0) {
                return <span className="free actual-price">免费</span>
            } else {
                if (chargeItem.discountStatus == "N") {
                    return <span className="actual-price">￥{chargeItem.amount}</span>
                } else {
                    return <span className="actual-price">￥{chargeItem.discount}</span>
                }
            }
        }
    }  
    
    
    isCamp(){
        const { isCamp,joinCamp,hasPeriod } = this.props;
        // 判断是否为训练营以及期数是否存在
        if(Object.is(isCamp,"Y") && Object.is(hasPeriod, "Y")){
            return true
        }
        // 已购买次训练营
        if(Object.is(joinCamp,"Y")){
            return true
        }
    }

    render() {
        return (
            <div 
                className="ls-live-channel-item on-log on-visible flex flex-row jc-between" 
                data-log-region="series-lessons-list"
                data-log-pos={this.props.index + 1}
                onClick={() => {locationTo(`/live/channel/channelPage/${this.props.channelId}.htm${this.props.auditStatus ? "?auditStatus=" + this.props.auditStatus : ""}`)}}
            >
                <div className="logo-con flex-no-shrink">
                    <div className="logo"> 
                        { this.props.hide && <span className="show-hide-icon icon_hidden"></span> }
                        <div className="c-abs-pic-wrap">
                            <Picture src={this.props.logo} placeholder={true} resize={{w:'220', h: "138"}} />
                        </div>
                        { this.props.isRelay == 'Y' && this.props.power.allowMGLive && <span className="is-relay">转载</span> }
                        { this.props.hasCommunity == 'Y' && <span className="community-sign">群</span> }
                    </div>
                </div>
                <div className="main-con flex-grow-1 flex flex-col jc-between">
                    <div className="channel-name flex-grow-1">
                        <div className="title elli-text">
                            { 
                                !this.props.power.allowMGLive && this.isCamp() &&
                                <i className="camp">训练营</i>
                            }
                            {this.props.title}
                        </div>
                    </div>

                    <div className="last-con flex flex-row flex-vcenter jc-between">
                        <span className="charge flex flex-row flex-vcenter">
                            {
                                this.chargeTag()
                            }
                            {
                                this.actualPrice()
                            }
                            {
                                this.originPrice()
                            }
                        </span>
                    {
                        this.props.power.allowMGLive &&
                        <span 
                            className="icon-menu on-log on-visible" 
                            data-log-region="series-lessons-list-option"
                            data-log-pos={this.props.index + 1}
                            onClick={this.props.openBottomMenu}
                        />
                    }
                    </div>
                    
                    <div className="course-num flex flex-row jc-between">
                    {
                        (!this.props.isShowTopicNum || this.props.isShowTopicNum == 'Y') && <span>已开课{this.props.courseNum}节 | 预计更新{this.props.courseTotal}节课</span>
                    }
                    {
                        (!this.props.isShowStudyNum || this.props.isShowStudyNum == 'Y') && <span className="learning-num">{digitFormat(this.props.learnNum)}次学习</span>
                    }
                    </div>
                </div>
            </div>
        );
    }
}


LiveChannelItem.propTypes = {
    power: PropTypes.object.isRequired,

    title: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,

    //courseNum已开课数
    courseNum: PropTypes.any.isRequired,
    //courseTotal预计更新课程数
    courseTotal: PropTypes.any.isRequired,

    learnNum: PropTypes.any.isRequired,

    chargeConfigs: PropTypes.any,

    openBottomMenu: PropTypes.func,

    hasCommunity: PropTypes.oneOf(['Y', 'N']),
};


export default LiveChannelItem