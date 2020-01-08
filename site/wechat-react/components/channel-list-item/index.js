/**
 * 系列课列表item，从直播间首页抽离组件
 * @date 20180403
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { locationTo, imgUrlFormat,  digitFormat, formatDate} from 'components/util';



export default class ChannelListItem extends Component {
    static propTypes = {
        channelId: PropTypes.any,
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
    }

    originPrice = () => {
        if (!this.props.chargeConfigs) {
            return false;
        }
        const chargeItem = this.props.chargeConfigs[0]
        if (chargeItem && chargeItem.discountStatus == "N") {
            return ""
        } else {
            return (<span className="abandon">￥{chargeItem ? chargeItem.amount : 0}</span>)
        }
    }
    chargeTag = () => {
        if (!this.props.chargeConfigs) {
            return false;
        }
        if(this.props.chargeConfigs[0] && this.props.chargeConfigs[0].discountStatus === "Y") {
            return (<span className="promotion"></span>)
        }
        if(this.props.chargeConfigs[0] && this.props.chargeConfigs[0].discountStatus === "P") {
            return (<span className="group"></span>)
        }
    }
    actualPrice = () => {
        if (!this.props.chargeConfigs) {
            return false;
        }
        const chargeItem = this.props.chargeConfigs[0]
        if (chargeItem && chargeItem.chargeMonths > 0) {
            return <span>￥{chargeItem.amount} / {chargeItem.chargeMonths > 1 ? chargeItem.chargeMonths : ""} 月</span>
        } else {
            if(!chargeItem) {
                return null
            }

            if (chargeItem.amount == 0) {
                return <span className="free">免费</span>
            } else {
                if (chargeItem.discountStatus == "N") {
                    return <span>￥{chargeItem.amount}</span>
                } else {
                    return <span>￥{chargeItem.discount}</span>
                }
            }
        }
    }   
    render() {
        return (
            <div className="__channel-list-item" onClick={() => {locationTo("/live/channel/channelPage/" + this.props.channelId + ".htm")}}>
                <div className="logo-con" >
                    <div className="logo" className={"logo"}> {this.props.hide ? <span className="show-hide-icon icon_hidden"></span>:""} <img  src={imgUrlFormat(this.props.logo, '@240w_148h_1e_1c_2o')} alt=""/>
                        {this.props.isRelay == 'Y' && this.props.power.allowMGLive ? <span className="is-relay">转载</span> : null}
                    </div>
                </div>
                <div className="main-con">
                    <div className="channel-name" >
                        <div className="left" >
                            <span className="title">{this.props.title}</span>
                        </div>
                        {
                            this.props.openBottomMenu ?
                            <div className="right" onClick={ this.props.openBottomMenu }>
                                {
                                    this.props.power.allowMGLive ?
                                        <span className="admin"></span> : ""
                                }
                            </div> : false
                        }
                    </div>
                    <div className="course-num">
                        {
                            (!this.props.isShowTopicNum || this.props.isShowTopicNum == 'Y') ?
                            `已开课${this.props.courseNum}节 | 预计更新${this.props.courseTotal}节课`
                            : null
                        }
                    </div>
                    <div className="last-con">
                        {
                            (!this.props.isShowStudyNum || this.props.isShowStudyNum == 'Y')?
                            <span className="learning-num">{digitFormat(this.props.learnNum)}次学习</span>
                            :null
                        }
                        <span className="charge">
                            {
                                this.originPrice()
                            }
                            {
                                this.chargeTag()
                            }
                            {
                                this.actualPrice()
                            }
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

