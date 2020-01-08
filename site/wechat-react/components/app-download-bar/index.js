import React from 'react';
import openApp from 'components/open-app';


export default class AppDownloadBar extends React.Component {
    render() {
        return (
            <div className="co-app-download-bar">
                <div 
                    className="co-app-download-content on-log on-visible"
                    data-log-region="app-download-bar"
                    onClick={this.onClickDownload}
                    >
                    <div className="ql-logo"></div>
                    <div className="desc">
                        <div className="desc-content">
                            <p>APP收听更流畅，还能省流量哦</p>
                            <p>用千聊APP，随时随地获取知识</p>
                            <p>更多优质好内容尽在千聊APP</p>
                            <p>用千聊APP可后台播放音频哦</p>
                            <p>想边玩微信边听课？打开APP即可</p>
                            <p>打开千聊APP收藏、下载课程</p>
                            <p>用千聊APP，随时学习已购内容</p>
                            <p>打开千聊APP和知识做朋友</p>
                        </div>
                    </div>
                    {
                        this.props.style == 'button' ? 
                        <span className="open-btn">打开</span> :
                        <span className="icon-double-arrow"></span>
                    }
                    
                </div>
            </div>
        )
    }

    componentDidMount() {
    }

    onClickDownload = () => {
        const { topicId, channelId } = this.props
        let url = location.href
        if (!/\/topic-intro.*topicId=(\d*)|\/channel-intro.*channelId=(\d*)/.test(url)) {
            if (topicId) {
                url = location.origin + '/wechat/page/topic-intro?topicId=' + topicId
            } else if (channelId) {
                url = location.origin + '/wechat/page/channel-intro?channelId=' + channelId
            }
        }
        openApp({
            h5: url,
            ct: 'Guidedownload',
            ckey: 'CK1424279472359',
        });
    }
}
