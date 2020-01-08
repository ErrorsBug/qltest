import React, { Component } from 'react';
import { connect } from 'react-redux'

import { collectVisible } from 'components/collect-visible';
import Page from 'components/page';
import ScrollToLoad from "components/scrollToLoad";
import { share } from "components/wx-utils";
import { locationTo, digitFormat, imgUrlFormat } from "components/util";
import fetch from 'isomorphic-fetch';
import Promise from "promise";
import { Confirm, BottomDialog } from "components/dialog";
import { fetchUserPower, userBindKaiFang } from "../../actions/common";
import { getLiveInfo, liveGetFollowNum } from "../../actions/connect-course";
import { getVideoList, deleteKnowledge, fetchFocusLive } from "../../actions/short-knowledge";
import { FunctionMenu, FunctionBtn } from './components/function-menu'
import RecommendDialog from './components/recommend-dialog';
import { apiService } from 'components/api-service/index';


class videoList extends Component {

    state = {
        dataList: [],
        showBottomDialog: false,
        noMore: false,
        noOne: false,
        liveId: this.props.location.query.liveId,
        entity:{},
        isFocus: false,
        client: 'C',
        loaded: false,
        editAuthStatus: true,
        editType: '',
        /* 功能菜单是否可见 */
        functionMenuVisible: false,
        openRecommend: true, //开启热门推荐
        showRecommend: false, //显示推荐弹框
    }
    data = {
        pageSize: 20,
        pageNum: 1,
        datamockList: [],
        
    }

    currentTop = 0;
    top_left = 0;
    top_right = 0;
    

    async componentDidMount(){
        this.getPowerInfo();
        
        this.initLiveData();
        this.userBindKaiFang();
        // this.getDomainUrl();
        
    }

    // 绑定三方
    userBindKaiFang = async()=>{
        let { kfAppId, kfOpenId } = this.props.location.query
        if (kfAppId && kfOpenId) {
			this.props.userBindKaiFang(kfAppId, kfOpenId);
		}
    }

    async initLiveData(){
        await this.props.getLiveInfo(this.state.liveId);
        let result = await this.props.liveGetFollowNum(this.state.liveId);
        console.log(result)
        this.setState({
            focusNum: result.follwerNum||0,
            entity: this.props.liveInfo.entity||{},
            isFocus: this.props.liveInfo.isFollow,
            openRecommend: this.props.liveInfo.entityExtend.knowledgeStatus != 'N' ? true : false
        },()=>{
            this.initShare();
            collectVisible();
        });
    };

    async initListStyle( next ){
        let result = await this.props.getVideoList(this.state.liveId,this.state.client,this.data.pageSize,this.data.pageNum);
        if(result.state.code === 0){
            const dataList = result.data.list || [];
            if(this.data.pageNum ===1 && dataList && dataList.length<=0){
                this.setState({
                    noOne: true,
                });
            }else if(this.data.pageNum >= 1 && dataList && dataList.length < this.data.pageSize){
                this.setState({
                    noMore: true,
                });
                
            }
            this.drawScrollList(dataList, next);
            this.data.pageNum++;
            
        }

    }

    drawScrollList(dataList,next,reload){
        this.wrap = document.getElementById('scroll-video-list');
        this.scroll = document.getElementsByClassName('main-box')[0];
        const thisdataList = [];
        const promiseList = [];

        this.infoBox = document.getElementsByClassName("opacity");
        let padding = this.scroll.clientWidth - this.wrap.clientWidth;

        dataList.forEach(element => {
            let coverImage = element.coverImage;
            if(!coverImage){
                return
            }
            const promiseFunc = new Promise((resolve, reject)=>{
                let imgInfo = null;
                if(/mp4/.test(coverImage)){  //如果是mp4取第一帧图片的话，直接onload获取宽高
                    this.img = new Image();
                    this.img.src = coverImage;
                    this.img.onload= ()=>{
                        imgInfo = {
                            ImageHeight: {value: this.img.height},
                            ImageWidth: {value: this.img.width},
                        }
                        
                        
                        resolve(imgInfo);
                    }
                    
                }else{//普通图片使用阿里云的方式获取宽高信息
                    imgInfo = fetch( coverImage.split('?')[0] +'?x-oss-process=image/info',{
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json;charset=UTF-8',
                            "Access-Control-Allow-Headers": "Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE"
                        },
                    }).then((res) => res.json()).catch((err)=>{
                        return {
                            ImageHeight: {value: 0},
                            ImageWidth: {value: 0},
                        }
                    })
                    resolve(imgInfo);
                }
            })
            promiseList.push(promiseFunc);
        });
        
        
        Promise.all(promiseList).then((result) => {
            result.map((imgInfo, index ) => {
                let imgPercent = 1.4;
                if(imgInfo.ImageHeight.value&&imgInfo.ImageWidth.value){
                    let height = Number(imgInfo.ImageHeight.value);
                    let width = Number(imgInfo.ImageWidth.value);
                    
                        if(width >= height){
                            imgPercent = (128/204).toFixed(2);
                            dataList[index].big ='W';
                        }else{
                            imgPercent = (300/204).toFixed(2);
                            dataList[index].big ='H';
                        }
                    
                }else{
                    imgPercent = 0.06;
                }
                
                
                dataList[index].width = (this.wrap.clientWidth - padding)/2;
                dataList[index].height = (dataList[index].width-padding) * imgPercent;
                dataList[index].left = (this.top_left <= this.top_right? padding/2 : (this.wrap.clientWidth/2));
                dataList[index].top = (this.top_left <= this.top_right? this.top_left : this.top_right);
                if(this.top_left <= this.top_right){
                    this.top_left = this.top_left + dataList[index].height + this.infoBox[0].clientHeight + 20;
                }else{
                    this.top_right = this.top_right + dataList[index].height + this.infoBox[0].clientHeight + 20;
                }
                thisdataList.push(dataList[index]);
            });
            this.setState({
                dataList: reload?  thisdataList : [ ...this.state.dataList, ...thisdataList ],
                loaded: true,
            },()=>{
                if(this.state.noMore){
                    this.noMore = document.getElementsByClassName('list-nomore')[0];
                    if (this.noMore) {
                        let nomoreTop = (this.top_left <= this.top_right)? this.top_right : this.top_left;
                        nomoreTop += this.infoBox[0].clientHeight/4;
                        this.noMore.style.top =`${nomoreTop}px`;
                        this.noMore.style.position=`absolute`;
                        this.noMore.width =`100%`;
                    }
                }
                next && next();
            });
                    
        }).catch((error) => {
        console.log(error)
        })
    }

    loadNext(next){
        this.initListStyle(()=>{
            // 手动触发打曝光日志
            setTimeout(() => {
                typeof _qla != 'undefined' && _qla.collectVisible();
            }, 0);
            next && next();
        });
        
        
    }

    calllog (category) {
        typeof _qla !== 'undefined' && _qla('event',{
            category: category,
            action: "success",
        })
    }

    showBottomDialog(index,id, editAuthStatus, editType){
        this.editIndex = index;
        this.knowledgeId = id;
        this.setState({
            showBottomDialog:true,
            editIndex: index,
            knowledgeId: id,
            editAuthStatus,
            editType
        });
        
    }

    hideBottomDialog(){
        this.setState({
            showBottomDialog:false,
        });
    }
    onItemClick(key){
        this.hideBottomDialog();
        if(key === 'edit'){
            this.clearStroge()
            locationTo(`/wechat/page/short-knowledge/publish?knowledgeId=${this.knowledgeId}&liveId=${this.state.liveId}`);
        }else if(key === 'delete'){
            this.deleteConfirmDialog.show();
        }else if(key === 'sort'){
            locationTo(`/wechat/page/short-knowledge/sort?liveId=${this.state.liveId}`);
        }
    }

    // 清除有声PPT页面和发布页面创建的session缓存
    clearStroge = () => {
        let strogeList = ['resourceList', 'totalSecond', 'audioList', 'initData', 'textContent']
        strogeList.forEach(i => {
            sessionStorage.removeItem(i)
        })
    }

    async deleteConfirmBtnClick(type){
        if(type ==='confirm'){
            const result = await this.props.deleteKnowledge({
                liveId: this.state.liveId,
                knowledgeId: this.knowledgeId,
            })
            if(result.state.code === 0){
                let dataList = this.state.dataList;
                let temArray=[];
                for(let i=0;i<dataList.length;i++){
                    if( i!= this.editIndex ){
                        temArray.push(dataList[i]);
                    }
                }
                this.currentTop = 0;
                this.top_left = 0;
                this.top_right = 0;
                this.drawScrollList(temArray,()=>{},true);
                this.setState({
                    dataList: temArray,
                });
                
                
                window.toast('删除成功');
            }
        }
        this.deleteConfirmDialog.hide();
    }

    async getPowerInfo(){
        await this.props.fetchUserPower({
            liveId: this.state.liveId,
        });
        this.setState({
            client: (this.props.power.allowMGLive ? 'B' : 'C'),
        },()=>{
            this.initListStyle();
        });
        
    };

    async onClickFocus(e){
        e.stopPropagation();
        e.preventDefault();
        if(this.focusEnable) return false;
        this.focusEnable = true;
        let result = await this.props.fetchFocusLive({
            liveId: this.state.liveId,
            status: (this.state.isFocus? 'N':'Y'),
        });
        if(result.state.code === 0 ){
            let entity = this.state.entity;
            this.setState({
                focusNum: this.state.isFocus? this.state.focusNum -1 : this.state.focusNum +1,
                isFocus: !this.state.isFocus,
                entity,
            },()=>{
                this.focusEnable = false;
                if(this.state.isFocus){
                    window.toast('关注成功');
                }else{
                    window.toast('取消关注成功');
                }
                
                this.calllog('shortlist-follow-live');
            });
        }
        
    }

    goToLive(){
        locationTo(`/wechat/page/live/${this.state.liveId}?wcl=ShortVideo`);
    }

    // getDomainUrl = async () => {
    //     try {
    //         let result = await getDomainUrl({
    //             type: 'main'
    //         });
    //         if (result.state.code == 0) {
    //             this.setState({
    //                 domainUrl : result.data.domainUrl,
    //             })
    //         } else {
    //             window.toast(result.state.msg);
    //         }
    //     } catch (error) {
    //         console.error(error)
    //     }
    // }

    initShare(){
        let entity = this.state.entity;
        this.shareOption = {
            title: `${this.state.entity.name}的小视频超有料，每天必刷！`,
            desc: '推荐给你',
            imgUrl: entity.logo||'',
            shareUrl: location.href,
            successFn: function() {
                toast('分享成功');
            }
        };
        share(this.shareOption);
    }

    noPassDialogShow(){
        this.noPassConfirmDialog.show();
    }
    closeNoPassDialog(){
        this.noPassConfirmDialog.hide();
    }

    onCourseClick(id, status, type, transcodStatus){
        
        if(transcodStatus ==='transcoding'){
            window.toast('该视频在合成中');
            return false;
        }
        if(status ==='noPass' && type ==='shortVideo'){
            this.setState({
                knowledgeId: id,
            },()=>{
                this.noPassDialogShow();
            });
            
        }else{
            locationTo(`/wechat/page/short-knowledge/video-show?knowledgeId=${id}&liveId=${this.state.liveId}`)
        }
    }

    

    showFunctionMenu(state) {
        this.setState({ functionMenuVisible: state })
    }

    changeRecommendStatus = async () => {

        typeof _qla != 'undefined' && _qla('event', {
            category: 'topRecommended',
            action: this.state.openRecommend ? 'close' : 'open'
        })
        this.setState({
            // openRecommend: !this.state.openRecommend,
            showRecommend: true
        })
    }

    render() {
        
        const { entity, isFocus, client, focusNum } = this.state;
        return (
            <Page title="短知识" className="short-video-list">
                
                
                <div className="header"  onClick={()=>{this.goToLive()}}>
                        <div className="pic on-log"
                            data-log-region="short-list"
                            data-log-pos="photo"
                            data-log-name="头像" >
                            <img src={imgUrlFormat(entity.logo||'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png')} />
                        </div>
                        <div className="name-wrap">
                            <div className="name">
                                {entity.name} <br/>
                                <span>{digitFormat(focusNum||0)}人关注</span>  
                            </div>
                            {
                                client != 'C' ?
                                <div className="recommend-wrap" onClick={(e) => {
                                    e.stopPropagation()
                                }}>
                                    <span className="recommend">热门推荐</span>
                                    <span className={"switch " + (this.state.openRecommend ? 'selected' : '')}
                                          onClick={this.changeRecommendStatus}>
                                    </span>
                                </div> : null
                            }
                        </div>
                        {
                            client ==='C' && <div className={`focus ${ !isFocus ? 'active' : ''} on-log on-visible`}
                            data-log-region="short-list"
                            data-log-pos={isFocus?"not-follow":"follow"}
                            data-log-name={isFocus?"取关":"关注"} onClick={this.onClickFocus.bind(this)}>{isFocus?'取消关注':'关注'}</div>
                        }
                    </div>
                
                <ScrollToLoad 
                    loadNext={this.loadNext.bind(this)}
                    noMore={this.state.loaded && this.state.noMore}
                    noneOne={this.state.loaded && this.state.noOne}
                    className="main-box" >
                    <div id="scroll-video-list" className="grid">
                        
                    {
                        this.state.dataList && this.state.dataList.map((item,index)=>{
                            return <div className="grid-item" style={{'left': item.left, 'top': item.top, 'width': item.width, 'height': item.height}} key={`video-${index}`}>
                                <div className="box" onClick={()=>this.onCourseClick(item.id, item.auditStatus, item.type, item.transcodStatus)}>
                                    <img className="video-head-pic" src={imgUrlFormat(item.coverImage,`?x-oss-process=image/resize,m_fill,limit_0,${item.big ==='H'?'h_300,w_204':(item.big ==='W'?'h_128,w_204':null)}`)} />
                                    <div className="info">
                                        <div className="intro elli-text">{item.name}</div>
                                        <div className="num">{digitFormat(item.playNum||0)}</div>
                                        { client ==='B' && item.auditStatus !== 'auditing' && item.transcodStatus !=='transcoding' && <div className="btn-control" onClick={(e)=>{ e.preventDefault();e.stopPropagation(); this.showBottomDialog(index,item.id, item.auditStatus, item.type)}}></div>}
                                        
                                    </div>
                                    {
                                        client ==='B' && item.transcodStatus ==='transcoding' && <div className="btn-status change">合成中</div>
                                    }
                                    {
                                        client ==='B' && item.auditStatus === 'noPass' && <div className="btn-status notpass">审核不通过</div>
                                    }
                                    {
                                        client ==='B' && item.transcodStatus ==='transcoded' && item.auditStatus === 'auditing' && <div className="btn-status auditing">审核中</div>
                                    }
                                    {
                                        client ==='B' && item.transcodStatus ==='transcoded' && item.status === 'draft' && <div className="btn-status draft">草稿</div>
                                    }
                                    
                                    
                                </div>
                            </div>
                        })
                    }
                    <div className="grid-item opacity" >
                            <div className="box">
                                <div className="info">
                                    <div className="intro elli-text">opacity text box</div>
                                    <div className="num">{0}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollToLoad>

                <Confirm
                    className="delete-confirm-dialog"
                    ref={ dom => this.deleteConfirmDialog = dom }
                    buttons='confirm-cancel'
                    confirmText='删除'
                    cancelText='取消'
                    onBtnClick={this.deleteConfirmBtnClick.bind(this) }
                >
                    <div className="content">视频删除后将无法恢复 视频删除后将无法恢复 请认真考虑～</div>
                </Confirm>

                <Confirm
                    className="nopass-confirm-dialog"
                    ref={ dom => this.noPassConfirmDialog = dom }
                    buttons='none'
                    close={false}
                    onBtnClick={this.deleteConfirmBtnClick.bind(this) }
                >
                    <div className="content">
                        <div className="top">视频审核不通过 <br/> 请编辑好再上传</div>
                        <div className="btn-again" onClick={()=>{locationTo(`/wechat/page/short-knowledge/create?knowledgeId=${this.state.knowledgeId}&liveId=${this.state.liveId}`)}}>重新上传</div>
                        <div className="btn-close" onClick={this.closeNoPassDialog.bind(this)}>暂不修改</div>
                    </div>
                </Confirm>

                <BottomDialog
                    className="edit-bottom-dialog"
                    show={this.state.showBottomDialog}
                    close = {true}
                    onClose={this.hideBottomDialog.bind(this)}
                    showCloseBtn={true}
                    theme={ 'list' }
                    items={
                        [
                            {
                                key: 'edit',
                                content: '编辑',
                                show: ((this.state.editAuthStatus !== 'noPass' && this.state.editType ==='shortVideo' )||this.state.editType ==='ppt') ? true : false,
                            },
                            {
                                key: 'sort',
                                content: '排序',
                                show: true,
                            },
                            {
                                key: 'delete',
                                content: '删除',
                                show: true,
                            },
                        ]
                    }
                    title={''}
                    closeText={'取消'}
                    onItemClick={ this.onItemClick.bind(this) }
                    // activeString={this.state.status}
                    >
                </BottomDialog>
                    {client ==='B' && [
                        <FunctionBtn
                            key='btn'
                            showFunctionMenu={this.showFunctionMenu.bind(this)}
                        />,
                        <FunctionMenu
                            key='menu'
                            liveId={this.state.liveId}
                            showFunctionMenu={this.showFunctionMenu.bind(this)}
                            functionMenuVisible={this.state.functionMenuVisible}
                        />
                    ]}
                    {
                        this.state.showRecommend ? 
                        <RecommendDialog currentState={this.state.openRecommend ? 'open' : 'close'} onClose={this.closeRecommendDialog} onChange={this.changeRecommendDialogStatus}/> : null
                    }
            </Page>
        );
    }

    closeRecommendDialog = () => {
        this.setState({
            showRecommend: false
        })
    }

    changeRecommendDialogStatus = async (state) => {
        let result = await apiService.post({
            url: '/h5/live/entity/updateKnowledgeStatus',
            body: {
                liveId: this.state.liveId,
                status: state == 'open' ? 'Y': 'N'
            }
        })
        if (result.state.code == 0) {
            this.setState({
                showRecommend: false,
                openRecommend: state == 'open' ? true : false
            })
        }
    }
}

function msp(state) {
    return {
        liveInfo: state.connectCourse.liveInfo||{},
        power: state.common.power|| {},
    }
}

const map = {
    getVideoList,
    deleteKnowledge,
    fetchUserPower,
    getLiveInfo,
    fetchFocusLive,
    liveGetFollowNum,
    userBindKaiFang,
}

export default connect(msp, map)(videoList);
