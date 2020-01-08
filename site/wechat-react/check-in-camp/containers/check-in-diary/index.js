import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import Page from 'components/page';
import { getCookie, locationTo } from 'components/util';

import CampOverview from '../../components/camp-overview';
import MyCheckinCalendar from '../../components/my-checkin-calendar';
import MineCheckInItem from '../../components/check-in-item/my-check-in-item';
import ScrollToLoad from 'components/scrollToLoad';
import CheckInPage from '../../components/check-in-page';
import BackTo from '../../components/back-to';
import { fetchMyCheckInCalendar } from '../../actions/mine';
import dayjs from 'dayjs';

import {
    campBasicInfoModel,
    campUserInfoModel,
    campCheckInListModel,
} from '../../model';

const { fetchCampBasicInfo } = campBasicInfoModel;
const { requestCampUserInfo } = campUserInfoModel;
const { requestCheckInList } = campCheckInListModel;

@autobind
class CheckInDiary extends Component {

    get campId(){
        return this.props.params.campId;
    }

    state = {
        showCheckInPage: false,
        startTime: null,
        endTime: null,
        calendar: null,
    }

    loadNext(next) {
        const campId = this.campId
        requestCheckInList({campId, type: 'single', beforeOrAfter:'before', time:this.props.lastTimeStamp, pageSize:10, next,});
    }

    componentDidMount(){
        fetchCampBasicInfo({campId: this.campId});
        requestCampUserInfo({campId: this.campId, shareUserId: getCookie('userId')});
        requestCheckInList({campId: this.campId, type: 'single', beforeOrAfter:'before', time: Date.now(), pageSize:10});
        this.updateCalendar();
    }

    showCheckInPage() {
        this.setState({showCheckInPage: true})
    }

    hideCheckInPage() {
        this.setState({showCheckInPage: false})
    }


    async updateCalendar() {
        requestCampUserInfo({campId: this.campId, shareUserId: getCookie('userId')});
        const result = await this.props.fetchMyCheckInCalendar({campId: this.campId});
        if (result.state.code === 0) {
            const data = result.data.affairCalendar;
            // console.log(data)
            this.setState({
                startTime: data.startTime,
                endTime: data.endTime,
                calendar: data.affairDetail
            });
        }
    }

    render(){
        return (
            <Page title="我的打卡动态" className="check-in-diary-container">
                <ScrollToLoad 
                    className={`camp-list-container`}
                    loadNext={this.loadNext}
                    noMore={this.props.hasMoreData === 'N'}
                    scrollToDo={this.scrollToDo}
                    // disableScroll={true}
                >
                    <CampOverview className="camp-info" />
                    <MyCheckinCalendar 
                        className="checkin-calendar" 
                        campId={this.campId} 
                        startTime={this.state.startTime}
                        endTime={this.state.endTime}
                        calendar={this.state.calendar}
                    />
                    <div className="my-check-in-list">
                        <div className="line"></div>
                        <div className="my-check-info">
                            <div className="left-content">
                                <div className="box">
                                    <div className="clock-icon"></div>
                                </div>
                            </div>
                            <div className="right-content">
                                <div className="title">
                                   <span className="text">我的打卡动态</span>
                                </div>
                            </div>
                        </div>
                        {
                            this.props.affairStatus == 'N' ?
                            <div className="my-check-info">
                                <div className="left-content">
                                    <div className="box">
                                        <div className="red-dot"></div>
                                    </div>
                                </div>
                                <div className="right-content">
                                    <div className="title">
                                        <span className="text">{dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss")}</span>
                                    </div>
                                    <div className="check-in-bg">
                                    {
                                        this.props.isEnd === 'Y' ?
                                            <div>
                                                <span className="tip">打卡已经结束</span>
                                                <div className="check-btn" onClick={() => {locationTo(`/wechat/page/camp-detail?campId=${this.campId}`)}}>进入打卡详情</div>                                            
                                            </div>
                                        :
                                            this.props.client === 'C' && this.props.payStatus === 'N' ?
                                                <div>
                                                    <span className="tip">暂未参与打卡</span>
                                                    <div className="check-btn" onClick={() => {locationTo(`/wechat/page/camp-detail?campId=${this.campId}`)}}>参与打卡</div>                                            
                                                </div>
                                            :
                                                this.props.isBegin === 'Y' ? 
                                                    <div>
                                                        <span className="tip">您今日未打卡</span>
                                                        <div className="check-btn" onClick={this.showCheckInPage}>去打卡</div>
                                                    </div>
                                                :
                                                    <div>
                                                        <span className="tip">打卡未开始</span>
                                                        <div className="check-btn" onClick={() => {locationTo(`/wechat/page/camp-detail?campId=${this.campId}`)}}>进入打卡详情</div>
                                                    </div>
                                    }
                                    </div>
                                </div>
                            </div>: 
                            null
                        }
                        {
                            this.props.campCheckInList.map((item, index) => {
                                return <MineCheckInItem key={item.affairId} {...item} index={index}/>
                            })
                        }
                    </div>
                </ScrollToLoad>
                <CheckInPage 
                    isShow={this.state.showCheckInPage} 
                    close={this.hideCheckInPage}
                    onChecked={this.updateCalendar}
                />
                <BackTo eleClass="camp-list-container" liveId={this.props.liveId} />
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
    client: state.campAuthInfo.allowMGLive ? 'B' : 'C',
    isBegin: state.campBasicInfo.dateInfo.isBegin,
    isEnd: state.campBasicInfo.dateInfo.isEnd,
    payStatus: state.campUserInfo.payStatus,
    liveId: state.campBasicInfo.liveId,
    hasMoreData: state.campCheckInList.hasMoreData,
    lastTimeStamp: state.campCheckInList.lastTimeStamp,
    campCheckInList: state.campCheckInList.data,
    affairStatus: state.campUserInfo.affairStatus,
});

const mapActionToProps = {
    fetchMyCheckInCalendar,
}

export default connect(mapStateToProps, mapActionToProps)(CheckInDiary);