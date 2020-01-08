import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import { Confirm } from 'components/dialog';
import { locationTo, formatDate } from 'components/util';
import { setOperationType, setPromotionalChannel} from '../../../../../actions/live';

@autobind
class PromotionalChannelCard extends Component {

    get channelId(){
        return this.props.channel.channelId;
    }

    /**
     * 跳转至媒体投放收益页面
     */
    gotoProfitPage = () => {
        locationTo(`/wechat/page/live/profit/detail/channel-knowledge/${this.channelId}`);
    }

    /**
     * 点击“下架”
     */
    hookOffshelfChange = () => {
        const {setOperationType, setPromotionalChannel, channel} = this.props;
        setPromotionalChannel(channel);
        if (channel.downCourseTime) {
            setOperationType('delay-offshelf');
        } else {
            setOperationType('offshelf');
        }
    }

    /**
     * 点击“修改比例”
     */
    // hookProportionChange = () => {
    //     const {setOperationType, setPromotionalChannel, channel} = this.props;
    //     setPromotionalChannel(channel);
    //     setOperationType('editProportion');
    // }

    render(){
        const {
            channelHeadImg, 
            channelName, 
            percent,
            profit,
            amount, 
            discount, 
            discountStatus,
            distributeNum,
            totalProfit,
            chargeMonths,
            downCourseTime,
        } = this.props.channel;
        return (
            <div className="channel-card promotional-channel-card">
                <section className="channel-card-content">
                    <div className="channel-coverpic"><img src={`${channelHeadImg}@240w_150h_1e_1c_2o`} alt="系列课封面图" /></div>
                    <div className="channel-detail">
                        <h1 className="channel-title" onClick={this.gotoProfitPage}>{channelName}</h1>
                        <div>
                            <div className="channel-discount channel-detail-middle">
                                {
                                    discountStatus === 'Y' ? `特惠:￥${discount}` : `原价:￥${amount}`
                                }{chargeMonths > 0 && `/${chargeMonths}月`}(分成比例{percent}%)
                            </div>
                            <div className="channel-profit channel-detail-footer">分成收益：<em className="price-number"><i className="rmb-sign">￥</i>{profit}</em></div>
                        </div>
                    </div>
                </section>
                <footer className="channel-card-footer">
                    <a href="javascript:void(0)" role="button" className="footer-button">
                        <em>{distributeNum}</em><span>渠道</span>
                        <span className="vertical-bar"></span>
                    </a>
                    <a href="javascript:void(0)" role="button" className="footer-button">
                        <em>￥{totalProfit}</em><span>收益</span>
                        <span className="vertical-bar"></span>
                    </a>
                    <a href="javascript:void(0)" role="button" className="footer-button" onClick={this.hookOffshelfChange}>
                        <i className="icon-bg icon-down"></i>
                        {
                            downCourseTime ?
                                <span className="to-be-offshelf">{formatDate(downCourseTime, 'M月d日h点')}下架</span>
                            :
                                <span>下架</span>
                        }
                        {/* <span className="vertical-bar"></span> */}
                    </a>
                    {/* <a href="javascript:void(0)" role="button" className="footer-button" onClick={this.hookProportionChange}>
                        <i className="icon-bg icon-edit"></i>
                        <span>修改比例</span>
                    </a> */}
                </footer>
            </div>
        )
    }
}

PromotionalChannelCard.propTypes = {
    // 已经投放的系列课对象
    channel: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => {
    return {}
}

const mapActionToProps = {
    setPromotionalChannel,
    setOperationType,
}

export default connect(mapStateToProps, mapActionToProps)(PromotionalChannelCard);