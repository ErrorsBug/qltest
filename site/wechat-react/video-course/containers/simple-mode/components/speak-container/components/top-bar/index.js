import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind} from 'core-decorators';

import { getQlchatVersion } from 'components/envi';
import {
	imgUrlFormat,
	locationTo,
} from 'components/util';

@autobind
class TopBar extends Component {
    
    state = {
	    showTopicChannelChose: false,
    }



	dangerHtml(content){
		if (content) {
			content = content.replace(/\</g, "&lt;");
			content = content.replace(/\>/g, "&gt;");
			content = content.replace(/&lt;br\/&gt;/g, "<br/>");
		}

		return { __html: content }
	};

	get isWeapp() {
		return typeof window != 'undefined' && window.__wxjs_environment === 'miniprogram'
	}

	/**
	 * 回到直播间主页
	 *
	 * @param {any} e
	 * @memberof TopLiveBar
	 */
	handleLiveChoose(e) {
		if (this.isWeapp) {
			wx.miniProgram.redirectTo({ url: `/pages/live-index/live-index?liveId=${this.props.topicInfo.liveId}` });
		} else if (getQlchatVersion()) {
			locationTo(`qlchat://dl/live/homepage?liveId=${this.props.topicInfo.liveId}`);
		} else {
			locationTo(`/wechat/page/live/${this.props.topicInfo.liveId}`);
		}
	}

	/**
	 * 回到频道页
	 *
	 * @param {any} e
	 * @memberof TopLiveBar
	 */
	handleChannelChoose(e) {
		if (this.isWeapp) {
			wx.miniProgram.redirectTo({ url: `/pages/channel-index/channel-index?channelId=${this.props.topicInfo.channelId}` });
		} else {
			locationTo('/live/channel/channelPage/' + this.props.topicInfo.channelId + '.htm');
		}
	}

	/**
	 * 回到打卡训练营主页
	 */
	handleCampChoose() {
		locationTo(`/wechat/page/camp-detail?campId=${this.props.topicInfo.campId}`);
	}

	liveAvatarClickHandle(){
		this.setState({
			showTopicChannelChose: !this.state.showTopicChannelChose
		})
	}

    render() {
        return (
            <div className='top-container'>
                <div className="live-info">
                    <div className="avatar"
                         data-log-region="top-bar"
                         data-log-pos="avatar"
                         data-log-id={this.props.topicId}
                         onClick={this.liveAvatarClickHandle}
                    >
                        <img src={imgUrlFormat(this.props.topicInfo.liveLogo,'?x-oss-process=image/resize,h_60,w_60,m_fill')} alt=""/>
                    </div>
                    <div className="details">
                        <div className="name" dangerouslySetInnerHTML={this.dangerHtml(this.props.topicInfo.liveName)}></div>
                        <div className="content">
	                        {this.props.topicInfo.browseNum}人次 |&nbsp;
                            {
                                this.props.liveStatus === 'plan' && <div className="status">即将开始</div>
                            }
	                        {
		                        this.props.liveStatus !== 'plan' && this.props.liveStatus !== 'ended' && <div className="status ing">直播中</div>
	                        }
	                        {
		                        this.props.liveStatus === 'ended' && <div className="status ended">已结束</div>
	                        }
                        </div>
                    </div>

	                {
		                this.state.showTopicChannelChose ?
                            <div
                                className='channel-chose-menu'
                            >
                                <div
                                    className='content on-log'
                                    onClick = {this.handleLiveChoose}
                                    data-log-region="top-bar"
                                    data-log-pos="back-live-btn"
                                    data-log-business_id={this.props.topicInfo.id}
                                >
                                    <span className="icon-live-page"></span>
                                    <span>直播间主页</span>
                                </div>
				                {
					                this.props.topicInfo.channelId &&
                                    <div
                                        className='content on-log'
                                        onClick = {this.handleChannelChoose}
                                        data-log-region="top-bar"
                                        data-log-pos="back-channel-btn"
                                        data-log-business_id={this.props.topicInfo.id}
                                    >
                                        <span className="icon-channel-page"></span>
                                        <span>系列课主页</span>
                                    </div>
				                }
				                {
					                this.props.topicInfo.campId &&
                                    <div
                                        className='content on-log'
                                        onClick = {this.handleCampChoose}
                                        data-log-region="top-bar"
                                        data-log-pos="back-camp-btn"
                                        data-log-business_id={this.props.topicInfo.id}
                                    >
                                        <span className="icon-camp-page"></span>
                                        <span>打卡训练营主页</span>
                                    </div>
				                }
                            </div>
			                :
			                ""
	                }

                </div>
                {
                    this.props.renderProp()
                }
            </div>
        );
    }
}

TopBar.propTypes = {
    renderProp: PropTypes.func
};

export default TopBar;