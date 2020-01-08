import React, { Component } from 'react';
import { connect } from 'react-redux'
import Page from 'components/page';
import { locationTo, imgUrlFormat,  digitFormat, formatDate, dangerHtml, getCookie} from 'components/util';

import {
    getLiveIntroPhoto
} from '../../../actions/live';

class liveInfo extends Component {
    componentDidMount() {
        this.props.getLiveIntroPhoto(this.props.liveId)
    }

    isVerificationLive = () => {
        let verification = false

        for (var index = 0; index < this.props.symbolList.length; index++) {
            if(this.props.symbolList[index].key === "livev") {
                verification = true
            }
        }

        return verification
    }
    verificationTime = () => {
        let verificationTime = 0

            for (var index = 0; index < this.props.symbolList.length; index++) {
                if(this.props.symbolList[index].key === "livev") {
                    verificationTime = this.props.symbolList[index].time
                }
            }

        return verificationTime
    }

    render() {
        return (
            <Page title={this.props.liveInfo && this.props.liveInfo.entity && this.props.liveInfo.entity.name ? (this.props.liveInfo.entity.name)  : "直播间简介" } className='live-info-page'>
                <div className="header-logo-con">
                    <img src={this.props.liveInfo.entity.logo} alt=""></img>
                    <div className="name">{this.props.liveInfo.entity.name}</div>
                </div>

                <div className="info-con">
                    <h1 className="title">简介</h1>
                    <div className="content intro" dangerouslySetInnerHTML={dangerHtml(this.props.liveInfo.entity.introduce && this.props.liveInfo.entity.introduce.replace(/\n/g, '<br/>'))}></div>
                    
                    <div className="intro-photo">
                        {this.props.liveIntroPhotoList.map((item) => {
                            return (
                                <div className="intro-photo" key={"intro-photo-" + item.sortNum}>
                                    <img src={item.url} alt="" />
                                    <div className="content">{item.msg}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {
                    this.isVerificationLive() &&
                    <div className="info-con">
                        <h1 className="title">认证信息</h1>
                        <div className="content auth">
                            <div className="v-time">认证日期：{formatDate(this.verificationTime(), 'yyyy年MM月dd日')}完成千聊直播间认证</div>
                            <div className="v-des">认证说明：千聊直播间认证是千聊官方对于直播间创建者身份和资质的真实性和合法性进行甄别和核实的过程。千聊是给创建者提供在线分享的工具和平台。</div>
                        </div>
                    </div>
                }

                {
                    this.props.liveInfo.entity.qrCode &&
                    <div className="info-con">
                        {/* <h1 className="title">公众号</h1> */}
                        <div className="qrcode-con">
                            <div className="con2">
                                <img src={this.props.liveInfo.entity.qrCode} alt="" />
                            </div>
                        </div>
                        <p className="tip">长按识别二维码</p>
                    </div>
                }

                
            </Page>
        );
    }
}

function mapStateToProps(state){
    return{
        liveId: state.live.liveInfo.entity.id,
        liveInfo: state.live.liveInfo,
        liveIntroPhotoList: state.live.liveIntroPhotoList,
        symbolList: state.live.liveSymbol,
    }
}

const mapDispatchToProps ={
    getLiveIntroPhoto
}
export default connect(mapStateToProps, mapDispatchToProps)(liveInfo)