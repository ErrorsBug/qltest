import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';

import CheckinCampCard from './components/checkin-camp-card';
import CheckinCampBottomActionSheet from './components/checkin-camp-bottom-actionsheet';

import { fetchCheckinCampList } from '../../actions/live-studio';

@autobind
class CheckinCampList extends Component {
    state = {
        // 列表数据是否经加载完毕
        noMore: false,
        // 列表数据是否为空
        noneOne: false,
        // 训练营列表数据
        campList: [],
        // 是否显示页面底部的训练营操作弹框
        showBottomActionSheet: false,
    }

    data = {
        // 页码
        page: 1,
        // 每页加载的记录条数
        pageSize: 20,
        // 当前操作的打卡训练营
        activeCamp: null,
    }

    get liveId(){
        return this.props.params.liveId;
    }

    /**
     * 显示页面底部的训练营操作弹框
     * @param {*object} camp 
     */
    displayBottomActionSheet(camp){
        this.data.activeCamp = camp;
        this.setState({
            showBottomActionSheet: true
        });
    }

    /**
     * 隐藏页面底部的训练营操作弹框
     */
    hideBottomActionSheet(){
        this.setState({
            showBottomActionSheet: false
        });
    }

    /**
     * 显示或隐藏训练营的回调
     * @param {*string} status 'Y' or 'N' 
     */
    onCampDisplayChange(status){
        const activeCamp = this.data.activeCamp;
        this.setState({
            campList: this.state.campList.map((camp) => {
                if (camp.campId === activeCamp.campId) {
                    camp.displayStatus = status;
                }
                return camp;
            })
        });
    }

    /**
     * 删除训练营的回调
     */
    onCampDelete(){
        const activeCamp = this.data.activeCamp;
        this.setState({
            campList: this.state.campList.filter((camp) => {
                return camp.campId != activeCamp.campId;
            })
        });
    }

    /**
     * 加载打卡训练营数据
     * @param {*function} next 
     */
    async loadMoreCheckinCamp(next){
        const liveId = this.liveId;
        const page = {
            page: this.data.page++,
            size: this.data.pageSize,
        }
		const showDisplay = 'N'   // 是否显示要隐藏的单课
        const result = await this.props.fetchCheckinCampList({liveId, page, showDisplay});
        if (result.state.code === 0) {
            const list = result.data.liveCampList || [];
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
                        campList: [
                            ...prevState.campList,
                            ...list,
                        ]
                    }
                });
            }
        } else {
            window.toast(result.state.msg);
        }
        next && next();
    }

    componentDidMount(){
        // 加载第一页的打卡训练营数据
        this.loadMoreCheckinCamp();
    }

    render(){
        const {
            sysTime,
            clientRole,
        } = this.props;
        const {
            noneOne,
            noMore,
            campList,
            showBottomActionSheet,
        } = this.state;
        return (
            <Page title="打卡训练营列表" className="checkin-camp-list-container live-checkin-camp-page">
                <ScrollToLoad
                    className='dd checkin-camp-list'
                    toBottomHeight={500}
                    loadNext={this.loadMoreCheckinCamp}
                    noneOne={noneOne}
                    noMore={noMore}>
                {
                    campList.map((camp, index) => (
                        <CheckinCampCard
                            key={`camp-${index}`}
                            camp={camp}
                            sysTime={sysTime}
                            index={index}
                            isShowAuthNum='Y'
                            isShowAffairCount='Y'
                            clientRole={clientRole}
                            displayBottomActionSheet={this.displayBottomActionSheet} />
                    ))
                }
                </ScrollToLoad>
                {
                    showBottomActionSheet && <CheckinCampBottomActionSheet
                                                show={showBottomActionSheet}
                                                activeCamp={this.data.activeCamp}
                                                hideActionSheet={this.hideBottomActionSheet}
                                                onCampDelete={this.onCampDelete}
                                                onCampDisplayChange={this.onCampDisplayChange}
                                                notShowPoint={true}
                                                liveId={this.liveId} />
                }
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
    sysTime: state.common.sysTime,
    clientRole: state.live.power.allowMGLive ? 'B' : 'C',
});

const mapActionToProps = {
    fetchCheckinCampList,
};

export default connect(mapStateToProps, mapActionToProps)(CheckinCampList);