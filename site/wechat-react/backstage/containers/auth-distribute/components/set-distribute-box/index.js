/**
 * Created by qingxia on 20180417.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';
import TabView from 'components/tab-view/v2';
import { autobind } from 'core-decorators';
import { getVal, formatDate , locationTo, imgUrlFormat } from 'components/util';
import ScrollToLoad from "components/scrollToLoad";
import { Confirm } from "components/dialog";

import { deleteLiveAuthShare } from '../../../../actions/distribute';

import { share, closeShare } from 'components/wx-utils';
import './style.scss';

@autobind
class SetDistributeBox extends Component {

    state = {
        typeTags: [
            {
                name: "直播间",
                type: "live",
            },
            {
                name: "系列课",
                type: "channel",
            },
            {
                name: "话题",
                type: "topic",
            },
        ],
        activeTypeIndex: 0,
        noMore: false,
        noOne: false,

        liveShareList:[],
        
        
    }
    data={
        isSetting: false,
    }

    componentDidMount(){
        this.setState({
            liveShareList: this.props.liveShareList,
        });
    }
    componentDidUpdate(preProps){
        if(preProps.liveShareList != this.props.liveShareList){
        console.log("preProps", preProps.liveShareList);
        this.setState({
                liveShareList: this.props.liveShareList,
            });
        }
    }


    selectType(index){
        this.setState({
            activeTypeIndex: index,
        });
    }
    loadNext(next){
        if(this.state.activeTypeIndex === 0){
            this.props.getLiveDistributeList(next);
        }else if(this.state.activeTypeIndex === 1){
            this.props.getChannelList(next);
        }else{
            this.props.getTopicList(next);
        }
       
    }

    addDistribute(){
        locationTo(`auth-distribution-add/${this.props.liveId}?type=live`);
    }

    initShareBatch (){
        this.showShareDialog();
        let shareTitle ="",
            description = "",
            shareUrl = window.location.origin + "/wechat/page/represent-auth?liveId="+ this.props.liveId;
		// if (type === 'topic') {
        //     shareTitle = "课代表邀请 - 来自话题『" + topicName + "』";
        //     description = "点击后成为该课程课代表，\n先到先得";
        // } else 
        if(this.state.activeTypeIndex === 0) {
            shareTitle = "课代表邀请 - 来自直播间『" + this.props.liveInfo.name + "』";
            description = "点击即可成为该直播间课代表，\n先到先得";
        };
        
        share({
            title: shareTitle,
            desc: description,
            shareUrl,
            imgUrl: 'https://img.qlchat.com/qlLive/liveCommon/normalShareLogo.png?v=1'
        });
    }

    initShareSingle(index){
        this.showShareDialog();
        let shareTitle ="",
        	description = "",
        	shareUrl = window.location.origin + "/wechat/page/represent-auth?liveId=" + this.props.liveId + '&shareId=' + this.props.liveShareList[index].shareId || '' + '&shareKey=' + this.props.liveShareList[index].shareKey;
            
        let percentVar = '分成比例' + (this.state.liveShareList[index].shareEarningPercent || 0) + '%';
        // if (shareTypeInvite === 'topic') {
       
        // shareTitle = "课代表邀请 - 来自话题『" + topicName + "』";
            // description = "点击后成为该课程课代表\n"+percentVar;
        // }else 
        
        if (this.state.activeTypeIndex === 0) {
            shareTitle = "课代表邀请 - 来自『" + this.props.liveInfo.name + "』";
            description = "点击即可成为该直播间课代表\n"+percentVar;
        };
        
        share({
            title: shareTitle,
            desc: description,
            shareUrl,
            imgUrl: 'https://img.qlchat.com/qlLive/liveCommon/normalShareLogo.png?v=1',
            successFn: ()=>{
                //分享成功
                
                let shareId = this.state.liveShareList[index].shareId,
                    shareStatus = 'S',
                    type = "live";
                this.props.updateShareStatus(shareId,shareStatus, type);
                let list = this.state.liveShareList;
                list[index].shareProcess = 'share';
                // this.props.changeShareList(list);
                this.setState({
                    liveShareList: list,
                });
                window.toast('分享成功');
                this.distributeShareDialog.hide();
                closeShare();
            }
        });
    }

    showShareDialog(){
        this.distributeShareDialog.show();
    }

    dialogsDistributeShareHandle(type){
        if(type ==='cancel'){
            closeShare();
        }
    }

    deleteAuthDistribute(e,index){
        e.stopPropagation();
        window.confirmDialog('确定删除授权吗？', async () => {
            let result = await this.props.deleteLiveAuthShare({
                shareId:this.state.liveShareList[index].shareId,
                type:'live',
            });
            
            if(result.state.code === 0){
                window.toast("删除成功");
                let list = this.state.liveShareList;
                list.splice(index,1);
                this.props.changeShareList(list);
                // this.setState({
                //     liveShareList: list,
                // });
            }else{
                window.toast(result.state.msg);
            }
            
        }, ()=> {},'', 'confirm-cancel', {
            confirmText:'删除',
            cancelText:'取消',
            className:'delete-auth',
        });
        
    }


    render() {
        const { typeTags, activeTypeIndex, liveShareList } = this.state;
        const {  distributeCount, channelList, topicList,
            liveListNoMore,
            liveListNoneOne,
            channelListNoMore,
            channelListNoneOne,
            topicListNoMore,
            topicListNoneOne,
        } = this.props;
        return (
            <div className="set-distribute-box">
                <div className="type-tag-bar">
                    { typeTags.map((item, index)=>{
                        return <div className={`tag ${index === activeTypeIndex?"active":"" }`} onClick={()=>this.selectType(index)}>{item.name}</div>
                    })}
                </div>
                <div className="distribute-list">
                    <ScrollToLoad 
                    loadNext={this.loadNext}
                    noMore={activeTypeIndex ===0 ? liveListNoMore: (activeTypeIndex ===1 ? channelListNoMore: topicListNoMore)}
                    noneOne={activeTypeIndex ===0 ? liveListNoneOne: (activeTypeIndex ===1 ? channelListNoneOne: topicListNoneOne)}
                    className="main-box" >
                        { activeTypeIndex ===0 && <div className="live-distribute">
                            <div className="manage-enter on-log"
                                data-log-name="成功邀请课代表详情"
                                data-log-region="course-distribute-control"
                                data-log-pos="add_representative"
                                onClick={()=>this.props.onClickTab()}>成功邀请 <span className="num">{distributeCount.getNum} </span>个直播间课代表 
                                <span className="icon_enter"></span>
                                <span className="check-detail">查看详情</span>
                            </div>
                            <div className="distribute-list-wrap">
                            {
                                liveShareList && liveShareList.map((item,index)=>{
                                    return <div className="distribute-li">
                                        <div className="pic"><img src={imgUrlFormat("https://img.qlchat.com/qlLive/liveCommon/normalLogo.png")} /></div>
                                        <div className="info">
                                            <div className="auth-name">{ 
                                                item.shareProcess ==='N' ? '未使用':
                                                (item.shareProcess ==='S' ?  '已分享': '已发送')
                                            } <span className="btn-delete c-ml-10" onClick={(e)=>{this.deleteAuthDistribute(e, index)}} >删除</span></div>
                                            <div className="auth-percent">分成比例：{item.shareEarningPercent}% </div>
                                            
                                            <div className="auth-over">推广关系：
                                                {item.beInviterDay == 99999999? '永久有效': null }
                                                {item.beInviterDay == 30? '1个月内有效': null }
                                                {item.beInviterDay == 90? '3个月内有效': null }
                                                {item.beInviterDay == 182? '6个月内有效': null }
                                                {item.beInviterDay == 272? '9个月内有效': null }
                                                {item.beInviterDay == 365? '一年有效': null }
                                                {item.beInviterDay == 545? '一年半有效': null }
                                                {item.beInviterDay == 730? '两年有效': null }
                                                {item.beInviterDay == 910? '两年半有效': null }
                                                {item.beInviterDay == 1095? '三年有效': null }
                                            
                                            </div>
                                        </div>
                                        <div className="btn-send  on-log"
                                            data-log-name="发送授权"
                                            data-log-region="course-distribute-control"
                                            data-log-pos="get_authorization"
                                            onClick= {()=>{this.initShareSingle(index)}}>
                                            发送授权
                                        </div>
                                    </div>;
                                })
                            }
                                
                            </div>
                            
                            
                        </div>
                        }
                        {activeTypeIndex === 1 &&
                        <div className="channel-distribute">
                        {
                            channelList && channelList.map((item,index)=>{
                                return <div className="distribute-li" key={`li-${index}`} onClick={()=>{locationTo(`/wechat/page/channel-distribution-list/${item.id}`)}}>
                                    <div className="channel-name elli">{ item.name }</div>
                                    <div className="channel-time">{formatDate(item.createTime,'yyyy-MM-dd')}</div>
                                    <i className="icon_enter"></i>
                                </div>
                            })
                        }
                            
                        </div>}
                        { activeTypeIndex ===2 &&
                        <div className="topic-distribute">
                        {
                            topicList && topicList.map((item,index)=>{
                                return <div className="distribute-li" key={`li-${index}`} onClick={()=>{locationTo(`/wechat/page/topic-distribution-list/${item.topicId}`)}}>
                                    <div className="channel-name elli">{ item.topicName }</div>
                                    <div className="channel-time">{formatDate(item.startTime,'yyyy-MM-dd')}</div>
                                    <i className="icon_enter"></i>
                                </div>
                            })
                        }
                            
                        </div>
                        }
                        
                        
                    </ScrollToLoad>
                </div>
                { 
                    activeTypeIndex ===0 && <div className="add-distribute-bottom">
                        <div className="btn-add-distribute on-log"
                            data-log-name="添加课代表"
                            data-log-region="course-distribute-control"
                            data-log-pos="detail"
                            onClick={this.addDistribute} >添加课代表</div>
                        {
                            distributeCount.unGetNum >=2 && <div className="btn-send-distribute on-log"
                            data-log-name="点击群发"
                            data-log-region="course-distribute-control"
                            data-log-pos="group_share"
                            onClick={()=>this.initShareBatch()}>{distributeCount.unGetNum} 个未领取，点击群发</div>}
                    </div>
                }

                <Confirm
                    className="distribute-share-dialog"
                    ref={(el)=>{this.distributeShareDialog = el}}
                    title={`发送授权`}
                    onBtnClick={this.dialogsDistributeShareHandle}
                    buttons='none'
                >
                    <span className="share-tips-1">不要关闭此弹窗</span><span>，点击页面右上角</span> <i className="dot"></i> <br /> <span>点击</span><i className="share-friend"></i> <span>发送给好友或</span><i className="share-friends"></i><span>朋友圈</span>
                </Confirm>
                
        </div>
        );
    }
}

function mapStateToProps (state) {
	return {
        
	}
}

const mapActionToProps = {
    deleteLiveAuthShare,
};

module.exports = connect(mapStateToProps, mapActionToProps)(SetDistributeBox);