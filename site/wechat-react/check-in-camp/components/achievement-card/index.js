import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import MiddleDialog from '../dialog/middle-dialog';
import drawAcheveMentCard from './gen-card-model/camp-achievement-card';

@autobind
export class AchievementCard extends Component {
    static propTypes = {
        // 画卡数据
        shareData: PropTypes.shape({
            userName: PropTypes.string.isRequired,
            campName: PropTypes.string.isRequired,
            daysNum: PropTypes.number.isRequired,
            headImgUrl: PropTypes.string.isRequired,
            shareUrl: PropTypes.string.isRequired,
            receiveDayNum: PropTypes.number.isRequired,
        }).isRequired,
        // 是否显示
        show: PropTypes.bool.isRequired,
        // 画卡完成后的回调
        onLoad: PropTypes.func,
    }

    state = {
        show: false,
        imgUrl: '',
        backgroundUrl: [
            'https://img.qlchat.com/qlLive/camp/achievement-card/bg1.png',
            'https://img.qlchat.com/qlLive/camp/achievement-card/bg2.png',
            'https://img.qlchat.com/qlLive/camp/achievement-card/bg3.png'
        ]
    }

    componentWillReceiveProps(nextPorps) {
        if (nextPorps.show) {
            this.genCard();
        } else {
            this.setState({ show: false });
        }
    }

    close() {
        this.setState({ show: false });
        this.props.onClose && this.props.onClose();
    }

    genCard() {
        const {shareData } = this.props
        const bgArray = this.state.backgroundUrl;
        const bgIndex = this.getRandomArbitrary(0, bgArray.length);
        // console.log(bgIndex)
        drawAcheveMentCard(bgArray[bgIndex], shareData, this.onPicOnLoad, false, "ACHIEVE_1");
    }

    getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    onPicOnLoad(imgUrl) {
        this.setState({ show: true, imgUrl});
        this.props.onLoad && this.props.onLoad(imgUrl);
    }

    render() {
        return (
            <MiddleDialog
                show={this.state.show}
                onClose={this.close}
                showCloseBtn={true}
                className="achevement-card"
            >
                <div className="achevement-card-container">
                    <img src={this.state.imgUrl}  
                        className="qr-code on-visible"
                        data-log-name="训练营成就卡"
                        data-log-region="visible-camp"
                        data-log-pos={this.props.qrcodeChannel} />
                    <div className="user-info">
                        <div className="head-img" style={{backgroundImage: `url(${this.props.liveHeadImage}?x-oss-process=image/resize,m_fill,limit_0,h_90,w_90)`}}></div>
                        <span className="text">长按保存图片，发送给好友</span>
                    </div>
                </div>
            </MiddleDialog> 
        )
    }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(AchievementCard)
