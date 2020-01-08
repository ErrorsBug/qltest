const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import Page from 'components/page';

import {Link} from 'react-router';
import { connect } from 'react-redux';
import ScrollToLoad from 'components/scrollToLoad';
import { share } from 'components/wx-utils';
import {MiddleDialog} from 'components/dialog';

//action
import {getChannelInfo} from '../../actions/channel';
import {getUserInfo} from '../../actions/common';
import {getChannelSharePercent,getChannelShareQualify} from '../../actions/channel-distribution';

class Represent extends Component {

    state = {
        qrBoxSow:false,
        styleId:1,
        shareKey:'',
        channelInfo:{
            id : "",
            liveName : "",
        },
        shareUrl:"",
    }

    async componentDidMount() {
        this.initDistribution();
    }

    async initDistribution(){
        if (this.props.channelDistributionInfo.shareKey) {
            var channelInfo = {};
            await this.setState({
                percent : this.props.channelDistributionInfo.shareEarningPercent,
                shareKey : this.props.channelDistributionInfo.shareKey,
            })
        }else{
            await this.props.getChannelInfo(this.props.params.channelId);
            await this.props.getUserInfo();
            var percent=await this.props.getChannelSharePercent(this.props.location.query.shareKey);
            await this.setState({
                percent : percent,
                shareKey : this.props.location.query.shareKey,
            })
        }

        this.initShare();
   
    }

    initShare () {
        let wxqltitle = this.props.channelInfo.name;
        let descript = this.props.channelInfo.description;
        let wxqlimgurl = this.props.channelInfo.headImage;
        let friendstr = wxqltitle;
        let shareUrl = window.location.origin + '/live/channel/channelPage/'+this.props.params.channelId +'.htm';
        wxqltitle = "我推荐-" + wxqltitle;
        friendstr = "我推荐-" + friendstr;
        shareUrl = `${shareUrl}?shareKey=${this.state.shareKey}&sourceNo=link`;
        this.setState({
            shareUrl:shareUrl
        })
        share({
            title: wxqltitle,
            timelineTitle: friendstr,
            desc: descript,
            timelineDesc: friendstr, // 分享到朋友圈单独定制
            imgUrl: wxqlimgurl,
            shareUrl: shareUrl
        });
    }

    render() {        
        return (
            <Page title='课代表专属页' className='represent-container'>
                <header className='header'>
                    <div className='portrait'><img src={`${this.props.userInfo.headImgUrl?this.props.userInfo.headImgUrl:'//img.qlchat.com/qlLive/liveCommon/normalLogo.png'}?x-oss-process=image/resize,w_64,h_64,m_fill,limit_0`} /></div>
                    <p className='welcome1'>hi~<span className='represent-kidname'>{this.props.userInfo.name}</span></p>
                    <p className='welcome2'>您已成为本系列课的课代表~</p>
                    <section className='topic-box'>
                        <a href={`/live/channel/channelPage/${this.props.params.channelId}.htm`}>
                        <span className='from'>来自系列课</span>
                        <span className='topic-title elli'>{this.props.channelInfo.name}</span>
                        <span className='icon_enter'></span>
                        </a>
                    </section>
                </header>
                <section className='represent-rights'>
                    <header className='title'>课代表权益</header>
                    <article className='content'>
                        <p className='rights-one'>1.分成比例{this.state.percent}%</p>
                        <p className='rights-three'>2.分成范围：本系列课付费或购买赠礼</p>
                    </article>
                </section>
                <section className='distribute-idea'>
                    <header className='title'>使用以下方式推广课程</header>
                    <section className='idea idea-one'>
                        <div className='orders'>
                            <div className='num'>1</div>
                            <p>方式</p>
                        </div>
                        <div className='idea-declare'>
                            <div className='declare1 declare-top'>常规转发</div>
                            <div className='declare2 declare-bottom'>此页面已经做特殊处理，请点击页面右上角<span className='icon_dots_horizontal'></span>直接转发给好友</div>
                        </div>
                    </section>
                    <section className='idea idea-two'>
                        <div className='orders'>
                            <div className='num'>2</div>
                            <p>方式</p>
                        </div>
                        <div className='idea-declare'>
                            <div className='declare2 declare-top'>长按复制下面链接，配置到公众号文章</div>
                            <div className='declare1 declare-bottom'>{this.state.shareUrl}</div>
                        </div>
                    </section>
                    <section className='idea idea-three'>
                        <div className='box'>
                            <div className='orders'>
                                <div className='num'>3</div>
                                <p>方式</p>
                            </div>
                            <div className='idea-declare'>
                                <div className='declare1'>使用邀请卡推广</div>
                            </div>
                        </div>
                        {/*<a className='btn-create-card' href={`/wechat/page/share-card-channel/${this.props.params.channelId}?shareKey=${this.state.shareKey}&type=channel`}>点击生成邀请卡</a>*/}
                        <a className='btn-create-card' href={`/wechat/page/sharecard?type=channel&channelId=${this.props.params.channelId}&liveId=${this.props.channelInfo.liveId}`}>点击生成邀请卡</a>
                        <p className='valid-tip'>
                            <span className='valid-text'>邀请卡<span className='valid-day'>30</span>天后过期</span>
                        </p>
                    </section>
                </section>
            </Page>
        );
    }
}

function mapStateToProps(state) {
    return {
        channelInfo:state.channel.channelInfo||[],
        userInfo:state.common.userInfo&&state.common.userInfo.user||[],
        channelDistributionInfo:state.channelDistribution.channelDistributionInfo||[],
    };
}

const mapActionToProps = {
    getChannelInfo,
    getUserInfo,
    getChannelSharePercent,
    getChannelShareQualify,
};

module.exports = connect(mapStateToProps, mapActionToProps)(Represent);