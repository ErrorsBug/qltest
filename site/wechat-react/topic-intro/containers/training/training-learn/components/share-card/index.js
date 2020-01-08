import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import errorCatch from 'components/error-boundary/index';
import { autobind } from 'core-decorators';
import drawCard from './until';
import { apiService } from "components/api-service";
import { isFromLiveCenter, getCookie } from "components/util";

@errorCatch
@autobind
class ShareCard extends Component {

    state = { 
        shareCardUrl: '',
        qrCode: '',
    }

    componentWillReceiveProps (nextProps) {
        // 当展示时，且未生成过卡片 || 打卡次数刷新
        if (nextProps.show && !this.state.shareCardUrl) {
            this.initCardPoint()
        }
    }

    async initQrCode () {
        const {periodChannel} = this.props
        const res = await apiService.post({
            url: "/h5/camp/new/getQr",
            body: {
                    channel: 'campAffairShare',
                    pubBusinessId: get(periodChannel, 'periodPo.id'),
                    toUserId: getCookie('userId'),
                    showQl: 'N',
                    liveId: periodChannel.periodPo.liveId,
                    isCenter:isFromLiveCenter()?'Y':'N',
                }
        });

        const qrCode = get(res, 'data.qrUrl')
        this.setState({
            qrCode
        })
        return qrCode
    }

    async initCardPoint () {
        window.loading(true);
        const width = 630
        const height = 900

        const origin = width / 3 / 2 // 计算居中点

        const calculationTextAlign = (num) => {
            return (num + '').split('').length * 22 / 2 + 10
        }

        const {userAffairInfo} = this.props
        
        const singleContens = [
            {
                text: userAffairInfo.userName,
                style: {
                    top: 605,
                    left: 110,
                    font: 24,
                    color: "#333",
                }
            },
            {
                text: this.props.isQlLive === 'Y' ? '千聊训练营' : this.props.liveInfo && this.props.liveInfo.entity.name || '',
                style: {
                    top: 865,
                    left: 50,
                    font: 26,
                    color: "#666",
                }
            },
        ]

        const first = userAffairInfo.affairNum || 0  + ''
        const s1 = calculationTextAlign(first)
        singleContens.push(
            {
                text: first,
                style: {
                    top: 690,
                    left: origin - s1,
                    font: 40,
                    color: "#333",
                }
            },
            {
                text: '次',
                style: {
                    top: 690,
                    left: origin + s1 - 10,
                    font: 28,
                    color: "#333",
                }
            },
        )
        
        const two = userAffairInfo.courseNum || 0 + ''
        const s2 = calculationTextAlign(two)
        singleContens.push(
            {
                text: two,
                style: {
                    top: 690,
                    left: 3 * origin - s2,
                    font: 40,
                    color: "#333",
                }
            },
            {
                text: '课',
                style: {
                    top: 690,
                    left: 3 * origin + s2 - 10,
                    font: 28,
                    color: "#333",
                }
            },
        )
        
        const three = userAffairInfo.homeworkNum || 0 + ''
        const s3 = calculationTextAlign(three)
        singleContens.push(
            {
                text: three,
                style: {
                    top: 690,
                    left: 5 * origin - s3,
                    font: 40,
                    color: "#333",
                }
            },
            {
                text: '份',
                style: {
                    top: 690,
                    left: 5 * origin + s3 - 10,
                    font: 28,
                    color: "#333",
                }
            },
        )

        let qrCode = this.state.qrCode
        if (!qrCode) {
            qrCode = await this.initQrCode()
        }

        const imageContens = [
            {
                url: userAffairInfo.headImgUrl,
                style: {
                    left: 40,
                    top: 551,
                    width: 60,
                    height: 60,
                    isClip: true,
                    x: 40,
                    y: 551,
                    w: 60,
                    h: 60,
                    r: {
                        r_top_left: 30,
                        r_top_right: 30,
                        r_bottom_right: 30,
                        r_bottom_left: 30
                    },
                    bdWidth: 1,
                    bdColor: "#fff",
                    bgcolor: "rgba(255,255,255)",
                }
            },
            {
                url: qrCode,
                style: {
                    top: 765,
                    left: 470,
                    width: 110,
                    height: 110
                }
            }

        ]

        const multiContens = [
            {
                text: this.props.periodChannel.periodPo.campName,
                style: {
                    top: 795,
                    left: 50,
                    font: 30,
                    width: 370,
                    lineHeight: 35,
                    maxLine: 2,
                    color: "#333",
                }
            }
        ]
        drawCard({
            bgUrl: 'https://img.qlchat.com/qlLive/liveTraining/achievementCard2.png',
            cardWidth: width,
            cardHeight: height,
            singleContens,
            imageContens,
            multiContens,
            cb: (url) => {
                window.loading(false);
                this.setState({
                    shareCardUrl: url
                })
            }
        })
    }

    render () {
        return this.props.show ? (
            <div className="cash-back-card">
                <div className="bg" onClick={this.props.onClose}></div>

                {
                    this.state.shareCardUrl && (
                        <div className="content">
                            <img src={this.state.shareCardUrl} alt=""/>
                            {
                                this.props.isClock && (
                                    <div className="share-tips" onClick={this.props.onClose}>
                                        <p>恭喜您，打卡成功！</p>
                                        <p>长按保存和分享</p>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </div>
        ) : null
    }
}

const mapStateToProps = function (state) {

    return {
        periodChannel: get(state, 'training.periodChannel') || { periodPo: {} },
        userAffairInfo: get(state, 'training.userAffairInfo'),
    }
};

const mapActionToProps = {
};

module.exports = connect(mapStateToProps, mapActionToProps)(ShareCard);