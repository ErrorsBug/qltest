import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import { locationTo } from 'components/util';
import { setAlternativeChannel, setOperationType } from '../../../../../actions/live';

@autobind
class AlternativeChannelCard extends Component {

    get channelId(){
        return this.props.channel.channelId;
    }

    gotoChannelPage = () => {
        locationTo(`/live/channel/channelPage/${this.channelId}.htm`)
    }

    /**
     * 点击“查看推文”或“提供推文”
     */
    hookTweetClick = () => {
        // 存在推文，打开推文查看确认框，否则打开推文编辑确认框
        const {channel, setAlternativeChannel, setOperationType} = this.props;
        const {tweetUrl} = channel;
        setAlternativeChannel(channel);
        if (tweetUrl) {
            setOperationType('viewTweet');
        } else {
            setOperationType('editTweet');
        }
    }

    /**
     * 点击“关闭推广”或“申请推广”，展示操作确认框
     */
    hookPromoteClick = () => {
        const {channel, setAlternativeChannel, setOperationType} = this.props;
        setAlternativeChannel(channel);
        setOperationType('promote');
    }

    render(){
        const {
                channelHeadImg,
                channelName,
                authNum,
                learningNum,
                discountStatus,
                amount,
                discount,
                tweetTitle,
                tweetUrl,
                publishStatus,
                chargeMonths,
              } = this.props.channel;
        return (
            <div className="channel-card alternative-channel-card">
                <section className="channel-card-content">
                    <div className="channel-coverpic"><img src={`${channelHeadImg}@240w_150h_1e_1c_2o`} alt="系列课封面图" /></div>
                    <div className="channel-detail">
                        <h1 className="channel-title" onClick={this.gotoChannelPage}>{channelName}</h1>
                        <div>
                            <div className="channel-stat channel-detail-middle">
                                <span>学习: {learningNum}次</span>
                                <span>报名: {authNum}人</span>
                            </div>
                            <div className="channel-price channel-detail-footer">
                                {
                                    discountStatus === 'Y' && <div>优惠价：<em className="price-number"><i className="rmb-sign">￥</i>{discount}{chargeMonths > 0 && <i className="months-sign">/{chargeMonths}月</i>}</em></div>
                                }
                                {
                                    (discountStatus === 'N' || discountStatus === 'GP') && <div>原价：<em className="price-number"><i className="rmb-sign">￥</i>{amount}{chargeMonths > 0 && <i className="months-sign">/{chargeMonths}月</i>}</em></div>
                                }
                            </div>
                        </div>
                    </div>
                </section>
                <footer className="channel-card-footer">
                    <a href="javascript:void(0)" role="button" className="footer-button" onClick={this.hookTweetClick}>
                    {
                        tweetUrl ? 
                            <span><i className="icon-bg icon-enlarge"></i>查看推文</span>
                        :
                            <span><i className="icon-bg icon-tweet"></i>提供推文</span>
                    }
                    </a>
                    <a href="javascript:void(0)" role="button" className="footer-button" onClick={this.hookPromoteClick}>
                    {
                        publishStatus === 'Y' ? 
                            <span><i className="icon-bg icon-exchange-gray"></i>关闭推广</span>
                        :
                            <span><i className="icon-bg icon-exchange-green"></i>申请推广</span>
                    }
                    </a>
                </footer>
            </div>
        )
    }
}

AlternativeChannelCard.propTypes = {
    // 备选系列课对象
    channel: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => {
    return {}
}

const mapActionToProps = {
    setAlternativeChannel,
    setOperationType,
}

export default connect(mapStateToProps, mapActionToProps)(AlternativeChannelCard);