import React, { Component } from 'react';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { autobind } from 'core-decorators';

import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import stackBlurImage from 'components/blur-img';

import { imgUrlFormat, getCookie, locationTo } from 'components/util';

import { share } from 'components/wx-utils';

import { fetchCampDetail } from '../../actions/common';
import {
    fetchUserRanking,
    fetchCheckInRanking,
} from '../../actions/mine';
import { campDetail } from '../../routes/check-in-camp';

const RankingListItem = ({headImage, nickName, affairCount, affairRank, isVip}) => {
    return (
        <div className={classnames("ranking-list-item", {
            "first-ranking": affairRank == 1,
            "second-ranking": affairRank == 2,
            "third-ranking": affairRank == 3
        })}>
            <div className="left">
                <div className="ranking-number">{affairRank}</div>
                <img alt="用户头像" className="avatar small-avatar" src={imgUrlFormat(headImage, "@80h_80w_1e_1c_2o")} />
                <div className={classnames("name", "elli", {"vip-user": isVip == 'Y'})}>{nickName}</div>
            </div>
            <div className="right">
                <span className="checkin-count">{affairCount}</span>
            </div>
        </div>
    )
}

@autobind
class CheckInRanking extends Component {

    state = {
        // 列表数据是否经加载完毕
        noMore: false,
        // 列表数据是否为空
        noneOne: false,
        // 打卡排名列表
        rankingList: [],
        // 用户的打卡排名信息
        userRanking: {},
        // 训练营的详细信息
        campInfo: {},
        // 用户今日是否已经打卡
        checkinStatus: '',
    }

    data = {
        // 页码
        page: 1,
        // 每页加载的记录条数
        pageSize: 20,
    }

    // 获取训练营的campId
    get campId(){
        return this.props.params.campId;
    }

    // 获取分享人的userId
    get shareUserId(){
        return this.props.params.shareUser;
    }

    // 跳转至训练营详情页
    gotoCampDetail(){
        locationTo(`/wechat/page/camp-detail?campId=${this.state.campInfo.campId}`);
    }

    // 跳转至打卡页面
    gotoCheckin(){
        locationTo(`/wechat/page/camp-detail?campId=${this.state.campInfo.campId}#checkInPage=true`);
    }

    /**
     * 加载打卡的排行榜数据
     * @param {*function} next 
     */
    async loadMoreRankingData(next){
        const page = {
            page: this.data.page++,
            size: this.data.pageSize,
        }
        const campId = this.campId;
        const result = await this.props.fetchCheckInRanking({page, campId});
        if (result.state.code === 0) {
            const list = result.data.topNList || [];
            if (list.length == 0 && page.page == 1) {
                this.setState({
                    noneOne: true
                });
            } else if (list.length < this.data.pageSize) {
                this.setState({
                    noMore: true
                });
            }
            // 将新加载的训练营数据推入数组
            if (list.length) {
                this.setState((prevState) => {
                    return {
                        rankingList: [
                            ...prevState.rankingList,
                            ...list,
                        ]
                    }
                });
            }
        }
        next && next();
    }

    /**
     * 加载训练营的详细信息
     */
    async loadCampInfo(){
        const result = await fetchCampDetail(this.campId);
        if (result.state.code === 0) {
            this.setState({
                campInfo: {
                    ...result.data.liveCamp
                }
            });
        }
        return result;
    } 

    /**
     * 加载用户的打卡排名信息
     */
    async loadUserRanking(){
        let params = {
            campId: this.campId,
            shareUserId: this.shareUserId || getCookie('userId')
        };
        const result = await this.props.fetchUserRanking(params);
        if (result.state.code === 0) {
            this.setState({
                userRanking: {
                    ...result.data.userInfo
                },
                checkinStatus: result.data.affairStatus,
            });
        }
        return result;
    }

    /**
     * 生成训练营海报的模糊图
     */
    generateBlurImg(){
        stackBlurImage('blur-camp-poster-img', 'blur-camp-poster-canvas', 100, true);
    }

    componentDidMount(){
        // 先加载训练营信息和用户信息，然后再初始化分享信息
        Promise.all([this.loadCampInfo(), this.loadUserRanking()]).then(([campInfoResult, userRankingResult]) => {
            if (campInfoResult.state.code === 0 && userRankingResult.state.code === 0) {
                const campInfo = campInfoResult.data.liveCamp;
                const userRanking = userRankingResult.data.userInfo;
                share({
                    title: '一起围观打卡战绩',
                    timelineTitle: '一起围观打卡战绩',
                    desc: `让优秀成为一种习惯，一起加入《${campInfo.name}》吧！`,
                    timelineDesc: `让优秀成为一种习惯，一起加入《${campInfo.name}》吧！`,
                    imgUrl: campInfo.headImage,
                    shareUrl: `${location.href}/${userRanking.userId}`
                });
            }
        });
        // 加载第一页的打卡排行数据
        this.loadMoreRankingData();
    }

    render(){
        const {
            noMore,
            noneOne,
            rankingList,
            userRanking,
            campInfo,
            checkinStatus,
        } = this.state;
        const today = dayjs(this.props.sysTime);
        const isEnd = dayjs(campInfo.endTimeStamp).diff(today, 'day') < 0 ? true : false;
        return (
            <Page title="打卡排行榜" className="check-in-ranking-container">
                <section className="camp-info-wrapper">
                    <img 
                        alt="camp poster" 
                        className="blur-camp-poster-img blur" 
                        id="blur-camp-poster-img"
                        onLoad={this.generateBlurImg} 
                        src={`/api/wechat/image-proxy?url=${encodeURIComponent(imgUrlFormat(campInfo.headImage, "@270h_750w_1e_1c_2o"))}`}/>
                    <canvas id="blur-camp-poster-canvas" className="blur-camp-poster-canvas"></canvas>
                    <div className="camp-info">
                        <div className="pic">
                            <img alt="训练营海报" src={imgUrlFormat(campInfo.headImage, "@150h_240w_1e_1c_2o")} onClick={this.gotoCampDetail}/>
                        </div>
                        <div className="info">
                            <div className="name elli-text" onClick={this.gotoCampDetail}>{campInfo.name}</div>
                            <div className="stat">{campInfo.authNum}人参与&nbsp;&nbsp;{campInfo.allAffairNum}次打卡</div>
                        </div>
                    </div>
                </section>
                <section className="user-checkin-info-wrapper">
                    <div className="user-checkin-info">
                        <div className="user">
                            <img alt="用户头像" className="avatar big-avatar" src={imgUrlFormat(userRanking.headImage, "@100h_100w_1e_1c_2o")} />
                            <div className="info">
                                <div className={classnames("name", "elli", {"vip-user": userRanking.isVip == 'Y'})}>{userRanking.nickName}</div>
                                <div className="ranking">
                                {
                                    userRanking.affairCount > 0 ?
                                        `第${userRanking.affairRank}名 | 已打卡${userRanking.affairCount}次`
                                    :
                                        '暂未打卡'
                                }
                                </div>
                            </div>
                        </div>
                        {/* <div className="share-button" role="button">分享</div> */}
                    </div>
                </section>
                <section className="checkin-ranking-wrapper">
                    <ScrollToLoad
                        className='dd check-in-ranking-list'
                        toBottomHeight={500}
                        loadNext={this.loadMoreRankingData}
                        noneOne={noneOne}
                        noMore={noMore}>
                    {
                        rankingList.map((item, index) => 
                            <RankingListItem 
                                key={`ranking-item-${index}`}
                                headImage={item.headImage}
                                nickName={item.nickName}
                                affairCount={item.affairCount}
                                isVip={item.isVip}
                                affairRank={item.affairRank}/>)
                    }
                    </ScrollToLoad>
                </section>
                {
                    !isEnd && checkinStatus === 'N' && <div className="goto-checkin-button" role="button" onClick={this.gotoCheckin}>去打卡</div>
                }
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
    sysTime: state.common.sysTime,
});

const mapActionToProps = {
    fetchUserRanking,
    fetchCheckInRanking,
};

export default connect(mapStateToProps, mapActionToProps)(CheckInRanking);
