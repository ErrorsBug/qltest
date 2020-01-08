/**
 * Created by qingxia on 20180417.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { getVal, formatDate , locationTo, imgUrlFormat, formatMoney } from 'components/util';
import ScrollToLoad from "components/scrollToLoad";
import { deleteLiveAuthShare, setLiveShareStatus } from '../../../../actions/distribute';

import './style.scss';

@autobind
class ManageDistributeBox extends Component {

    state = {
        activeTabIndex: 0,
        distributeList: [],
    }
    data = {
        isSetting: false,
    }
    componentDidMount(){
        this.setState({
            distributeList: this.props.distributeList,
        });
    }

    componentDidUpdate(preProps){
        console.log("haahahaha");
        if(preProps.distributeList != this.props.distributeList){
            this.setState({
                distributeList: this.props.distributeList,
            });
        }
        
    }

    onClickTab(index){
        console.log(index);
        this.setState({
            activeTabIndex: index,
        });
    }

    loadNext(next){
        this.props.getDistributeList(next);
    }

    async setStatus(e, shareId, index){
        e.stopPropagation();
        if(this.data.isSetting){ return false; }
        this.data.isSetting = true;
        let list = this.state.distributeList;
        let tips = (list[index].status ==='Y'? 
            "取消授权后，此课代表失去分销资格（不影响取消前所产生的收益）。确定取消吗？":
            "授权后，此课代表恢复分销资格（按新授权后产生的收益结算）。确定授权吗？");
        window.confirmDialog(tips , async () => {
            let result = await this.props.setLiveShareStatus({
                shareId, 
                type: 'live' 
            });
            if(result.state.code === 0){
                window.toast("设置成功");
                list[index].status = result.data.sharePo.status;
                this.setState({
                    distributeList: list,
                });
            }else{
                window.toast(result.state.msg);
            }
            this.data.isSetting = false;
        }, ()=> { this.data.isSetting = false; },'', 'confirm-cancel', {
            confirmText:'确定',
            cancelText:'取消',
            className:'delete-auth',
        });
    }

    deleteAuthDistribute(e,index){
        e.stopPropagation();
        
        window.confirmDialog('确定删除授权吗？', async () => {
            let result = await this.props.deleteLiveAuthShare({
                shareId:this.props.distributeList[index].shareId,
                type:'live',
            });
            if(result.state.code === 0){
                window.toast("删除成功");
                let list = this.props.distributeList;
                list.splice(index,1);
                console.log(list);
                this.setState({
                    distributeList: list,
                });
                // this.props.changeDistributeList(list);
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
        const { distributeList } = this.state;
        console.log(distributeList);
        return (
            <div className="manage-distribute-box">
            <ScrollToLoad 
                loadNext={this.loadNext}
                noMore={this.props.noMore}
                noneOne={this.props.noneOne}
                className="main-box" >
                {
                    distributeList && distributeList.map((item,index)=>{
                        return <div className="li" key={`distribute-${index}`} onClick={()=>locationTo(`/topic/share/liveshare.htm?userId=${item.userId}&liveId=${this.props.liveId}`)}>
                        <div className="top">
                            <div className="head">
                                <div className="pic"><img src={imgUrlFormat(item.userHeadImg || "https://img.qlchat.com/qlLive/liveCommon/normalLogo.png")} /></div>
                                <div className="info">
                                    <div className="auth-name elli">{item.userName}</div>
                                    <div className="auth-percent">分成比例：{item.shareEarningPercent||0}% </div>
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
                                <div className="control">
                                    {
                                       item.status ==='Y'?
                                       <div className="btn-device on-log"
                                       data-log-name="取消授权"
                                       data-log-region="course-distribute-control"
                                       data-log-pos="cancel_authorization" 
                                       onClick = {(e)=>this.setStatus(e, item.shareId, index)}>取消授权</div>
                                       : 
                                       <div className="btn-auth on-log"
                                       data-log-name="授权"
                                       data-log-region="course-distribute-control"
                                       data-log-pos="again_authorization"  
                                       onClick = {(e)=>this.setStatus(e, item.shareId, index)}>授权</div>
                                    }
                                    {
                                        item.status ==='N' && <div className="btn-delete on-log"
                                        data-log-name="删除"
                                        data-log-region="course-distribute-control"
                                        data-log-pos="delete_authorization"  
                                        onClick={(e)=>{this.deleteAuthDistribute(e, index)}}>删除</div>}
                                    
                                </div>
                            </div>
                            <div className="detail">
                                <span className="recommend-count">推荐人数：{item.recommendNum|| 0 }人</span>
                                <div>
                                    <span className="deal-count">成交笔数：{item.invitedCount || 0}笔</span>
                                    <span className="income">分销收入：{formatMoney(item.income)}</span>
                                </div>
                                
                            </div>
                        </div>
                        <div className="bottom">点击查看 {item.userName?item.userName:"千聊直通车"} 的推广用户 <i className="icon_enter"></i></div>
                    </div>
                    })
                }
                
                </ScrollToLoad>
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
    setLiveShareStatus,
};

module.exports = connect(mapStateToProps, mapActionToProps)(ManageDistributeBox);