import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { imgUrlFormat, formatDate, locationTo, htmlTransferGlobal } from 'components/util';
import { findDOMNode } from 'react-dom';
import { autobind } from 'core-decorators';
import XiumiEditorH5 from "components/xiumi-editor-h5";

@autobind
class TopicIntro extends Component {
    state = {
        foldIntro: false,
        showFoldBtn:false,
    }
    componentDidMount() {
        this.initFoldBtn();
        setTimeout(() => {
            this.fixImgSize();
        }, 0);
    }
    
    foldIntro = async () => {
        await this.setState({
            foldIntro: !this.state.foldIntro,
        })

        if(this.state.foldIntro){
            let btnSwitch = findDOMNode(this.refs.btnSwitch);
            btnSwitch.scrollIntoView(true);
        }
    }

    initFoldBtn() {
        let introList = findDOMNode(this.refs.introList);
        if (introList.offsetHeight > 200) {
            this.setState({
                showFoldBtn : true

            })
        }
    }

    fixImgSize() {
        let imgs = document.querySelectorAll('.intro-image');

        Array.prototype.map.call(imgs, (item) => {
            if (item.complete) {
                item.style.width = item.width >= 800 ? '100%' : (item.width*window.dpr + 'px');
            }
        });

    }

    jump() {
        locationTo(
            `/live/channel/channelPage/${this.props.topicInfo.channelId}.htm`,
            `/pages/channel-index/channel-index?channelId=${this.props.topicInfo.channelId}`
        )
    }

    render() {
        let profileList = this.props.profileList.length ? this.props.profileList.filter((item) => {
            return item.type == "image";
        }) : [];
        return (
            <div className='topic-intro-container'>
                {
                    this.props.channelInfo?

                    <div className="channel-info-container">
                        <img 
                            className='logo-channel' 
                            src={`${imgUrlFormat(this.props.channelInfo.channel.headImage,'?x-oss-process=image/resize,m_fill,limit_0,h_100,w_100')}`} 
                            onClick={ this.jump }
                            alt="" 
                        />
                        <span className='channel-info'>
                            <h2 onClick={ this.jump } >{this.props.channelInfo.channel.name}</h2>
                            <h3>已更新{this.props.channelInfo.channel.topicCount}期</h3>
                        </span>
                        {
                            this.props.power.allowMGLive ?
                            <a href={`/wechat/page/join-list/topic?id=${this.props.topicInfo.id}`} className="btn on-log" data-log-region="goto-topic-graphic-join-list">报名管理</a>
                            :
                            (this.props.vipInfo && this.props.vipInfo.isVip === 'Y' || this.props.chargeStatus)?
                            <span className="btn disable" >已订阅</span>
                            :
                            <span className="btn" onClick={ this.jump } >订阅系列课</span>
                        }
                    </div>
                    :null
                }
                <div className="topic-remark">
                    <div className="title">{htmlTransferGlobal(this.props.topicInfo.topic) || ''}</div>
                    <span className="view">{this.props.topicInfo.browseNum||0}人次播放</span>
                    <span className="time">{formatDate(this.props.topicInfo.startTime,'yyyy-MM-dd hh:mm')}</span>
                </div>
                {
                    this.props.topicDesc ? 
                    <div className={`intro-list ${this.state.foldIntro ? 'fold' : ''}`}>
                        <XiumiEditorH5 content={this.props.topicDesc} />
                    </div> :
                    <div
                        className={`intro-list ${this.state.foldIntro ? 'fold' : ''}`}
                        ref = 'introList'
                    >   
                        {
                            profileList.map((item, index) => {
                                return <div key={`profileList-item-${item.id}`}>
                                    {
                                        item.url?
                                            <img
                                                className='intro-image'
                                                src={`${imgUrlFormat(item.url, '?x-oss-process=image/resize,w_800,limit_1')}`}
                                            />
                                        :null
                                    }
                                    {
                                        item.msg
                                            ? <pre><code>{htmlTransferGlobal(item.msg)}</code></pre>
                                            : null
                                    }
                                </div>
                                
                            })
                        }
                        

                    </div>
                }
                
                {
                    this.state.showFoldBtn?
                    <div className="btn-switch" ref='btnSwitch' onClick={this.foldIntro}>{this.state.foldIntro?'展开':'收起'}<span className={this.state.foldIntro?'icon_down':'icon_up'}></span></div>
                    :null
                }
            </div>
        );
    }
}

TopicIntro.propTypes = {

};

export default TopicIntro;