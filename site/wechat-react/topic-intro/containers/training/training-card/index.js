import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from "components/page";
import { fetchAchievementCardInfo, getLiveInfo } from '../../../actions/training'
import { autobind } from "core-decorators";
import Picture from 'ql-react-picture';
import { apiService } from "components/api-service";
import { isFromLiveCenter, getCookie } from "components/util";

@autobind
class TrainingCard extends Component {
    state={
        campPo: {},
        userInfo: {},
        qrCode: ''
    };

    componentDidMount() {
        this.initData()
    }
    
    async initData() {
        const refId = this.props.location.query.ref
        const channelId = this.props.location.query.channelId
        const periodId = this.props.location.query.periodId

        let res1 = await this.props.fetchAchievementCardInfo({
            studentId: refId,
            channelId
        })
        if (res1.state.code == 0) {
            const liveId = res1.data.campPo.liveId
            
            const liveInfo = await getLiveInfo(liveId)

            const res2 = await apiService.post({
                url: "/h5/camp/new/getQr",
                body: {
                        channel: 'campAffairShare',
                        pubBusinessId: periodId,
                        toUserId: refId,
                        showQl: 'N',
                        liveId,
                        isCenter: isFromLiveCenter()?'Y':'N',
                    }
            });

            this.setState({
                campPo: res1.data.campPo,
                userInfo: res1.data.info,
                qrCode: res2.data.qrUrl || '',
                liveName: liveInfo && liveInfo.entity.name || ''
            })
        }
    }
    

    render() {
        const {campPo, userInfo} = this.state
        return (
            <Page title={campPo.name} className='training-card'>
                <div className="user-info">
                    <Picture className="user-img" src={userInfo.headImgUrl}></Picture>
                    <p>{userInfo.userName}</p>
                </div>
                
                {
                    campPo.name && (
                        <React.Fragment>
                            <div className="camp-info">
                                <p className="title">我在【{campPo.name}】</p>

                                <div className="task">
                                    <div className="item">
                                        <p><strong>{userInfo.affairNum || 0}</strong>次</p>
                                        <p>打卡</p>
                                    </div>
                                    <div className="item">
                                        <p><strong>{userInfo.courseNum || 0}</strong>课</p>
                                        <p>完成课程</p>
                                    </div>
                                    <div className="item">
                                        <p><strong>{userInfo.homeworkNum || 0}</strong>份</p>
                                        <p>完成作业</p>
                                    </div>
                                </div>
                            </div>

                            <div className="qr-code">
                                <p>长按识别二维码参加</p>
                                <p>关注{this.state.liveName}</p>
                                <div className="qr-img">
                                    <img src={this.state.qrCode} alt=""/>
                                </div>
                            </div>

                            <p className="saying">我仍然要徒步走遍世界，沙漠、森林和偏僻的角落<br />——顾城《生命狂想曲》</p>
                        </React.Fragment>
                    )
                }
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
    }
}

const mapActionToProps = {
    fetchAchievementCardInfo
};

module.exports = connect(mapStateToProps, mapActionToProps)(TrainingCard);