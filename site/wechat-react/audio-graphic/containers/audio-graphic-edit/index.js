const isNode = typeof window == 'undefined';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import FileInput from 'components/file-input';

import Page from 'components/page';
import Detect from 'components/detect';

import { eventLog } from 'components/log-util';
import { imgUrlFormat,formatMoney, locationTo, getCookie, validLegal } from 'components/util';
import { Confirm } from 'components/dialog';
import CommonInput from 'components/common-input';
import ConfirmDialog from '../../../components/confirm-dialog';

import { 
    getTopicInfo,
    getChannelList,
    getTopicUpdate,
    changeAudioGraphicChannel,
} from '../../actions/audio-graphic';

import {
    uploadImage,
} from 'thousand_live_actions/common';
import { isRegExp } from 'util';

import { getEditorSummary } from "../../actions/editor";


@autobind
class AudioGraphicEdit extends Component {

    data = {
       
    }

    state = {
        topicInfo:{},
        channelList: [],
        selectChannelPo:{
            id:'',
            name:'',
        },
        imgIsUpload:''
        
    }

    
    constructor(props) {
        super(props);
    }

    

    async componentDidMount() {
        await this.initTopicInfo();
        this.initChannelList();
        this.initStsInfo();
        this.getEditorSummary();
    }

    getEditorSummary = async () => {
        let result = await this.props.getEditorSummary(this.props.location.query.topicId, 'topic');
        if (result.state.code == 0) {
            this.setState({
                topicDesc: result.data.content
            })
        }
    }

    componentWillUnmount() {
       
    }

    // oss上传初始化
    initStsInfo() {
        const script = document.createElement('script');
        script.src = '//static.qianliaowang.com/frontend/rs/lib/aliyun-oss-sdk.min.js';
        document.body.appendChild(script);
    }

    async initTopicInfo(){
       // let result = await this.props.getTopicInfo(this.props.location.query.topicId);
        this.setState({
            topicInfo: this.props.topicInfo,
            topicName: this.props.topicInfo.topic,
            backgroundUrl: this.props.topicInfo.backgroundUrl,
            money: formatMoney(this.props.topicInfo.money),
            selectChannelPo:{
                id: this.props.topicInfo.channelId,
                name: this.props.topicInfo.channelName,
            }
        })
    }


    /**
     * 初始化系列课列表
     * 
     * @memberof AudioGraphicEdit
     */
    async initChannelList() {
        let result = await this.props.getChannelList({
            liveId: this.props.topicInfo.liveId,
            tagId: 0,
            page: {
                size: 100,
                page:1
                
            }
        });
        this.setState({
            channelList:result.data.liveChannels
        })
    }

    
    /**
     * 上传背景框
     * 
     * @param {any} tag 
     * @memberof AudioGraphicEdit
     */
    async dialogsBackgroundHandle(tag) {
        if (tag === 'confirm') {
            
            let topicInfo = {
                ...this.state.topicInfo,
                backgroundUrl: this.state.backgroundUrl,
            }
            this.refs.topicBackgroundDialog.hide();

            this.setState({
                topicInfo:topicInfo,
                imgIsUpload:'上传成功',
            })

            
        }else{
            this.setState({
                backgroundUrl: this.state.topicInfo.backgroundUrl,
            })

        }
    }

    /**
     * 
     * 修改名字弹框
     * @param {any} tag 
     * @memberof AudioGraphicEdit
     */
    async dialogsChangeNameHandle(tag) {
        if (tag === 'confirm') {

            if(validLegal("text", "直播课程", this.state.topicName, 40)){

                let topicInfo = {
                    ...this.state.topicInfo,
                    topic: this.state.topicName,
                }
                this.refs.topicNameDialog.hide();
    
                this.setState({
                    topicInfo:topicInfo
                })
            }

            

            
        }else{
            this.setState({
                topicName: this.state.topicInfo.topic,
            })

        }
    }


    /**
     * 
     * 修改价格
     * @param {any} tag 
     * @memberof AudioGraphicEdit
     */
    async dialogsMoneyHandle(tag) {
        if (tag === 'confirm') {

            if(validLegal("money", "课程价格", this.state.money, 50000, 1)){

                let topicInfo = {
                    ...this.state.topicInfo,
                    money: this.state.money * 100,
                }
                this.refs.topicMoneyDialog.hide();
    
                this.setState({
                    topicInfo:topicInfo
                })
            }

            

            
        }else{
            this.setState({
                money: formatMoney(this.state.topicInfo.money),
            })

        }
    }


    /**
     * 
     * 更新话题信息
     * @param {any} url 
     * @memberof AudioGraphicEdit
     */
    async updateTopic(url) {
        // 训练营内课程没有移动系列课的操作
        if (!this.props.topicInfo.campId) {
            let moveChannel = await this.moveTopicHandle();
            if(!moveChannel){
                return false;
            }
        }

        let result = await this.props.getTopicUpdate({
            ...this.state.topicInfo,
            topicId: this.props.topicInfo.id,
            operate: "updateDetail",
            startTime:'',
            endTime:'',
        });

        if(result.state){
            window.toast(result.state.msg);
        }

        if(result.state.code == 0){
            setTimeout(()=>{
                url?
                locationTo(url)
                :
                locationTo(`/topic/details?topicId=${this.props.location.query.topicId}`);
            },1000)
        }
    }

    

    /**
     * 显示修改名字弹框
     * 
     * @memberof AudioGraphicEdit
     */
    showTopicNameDialog() {
        this.refs.topicNameDialog.show();
    }
    

    /**
     * 
     * 修改名字
     * @param {any} e 
     * @memberof AudioGraphicEdit
     */
    changeTopicName(e) {
        this.setState({
            topicName: e.target.value
        });
        
    }
    
    showTopicBgDialog() {
        this.refs.topicBackgroundDialog.show();
    }


    /**
     * 
     * 修改价格
     * @param {any} e 
     * @memberof AudioGraphicEdit
     */
    changeTopicMoney(e) {
        this.setState({
            money: e.target.value
        });
        
    }
    

    // PC添加新图片
    async updateBackground(event) {
        const file = event.target.files[0]
        event.target.value = '';
        try {
            const filePath = await this.props.uploadImage(file,"liveComment");
            if (filePath) {
                this.setState({
                    backgroundUrl:filePath
                })
            }


        } catch (error) {
            console.log(error);
        }

    }

    selectChannel(item) {
        this.setState({
            selectChannelPo:item,
        })
    }



    /**
     * 移动话题到系列课按钮
     * 
     * @param {any} tag 
     * @memberof AudioGraphicEdit
     */
    async moveChannelBtn(tag){
        if (tag === 'confirm') {
            this.setState({
                topicInfo:{
                    ...this.state.topicInfo,
                    channelName:this.state.selectChannelPo.name,
                }
            })

            this.refs.channelListDialog.hide();

        }else{
            this.setState({
                selectChannelPo:{
                    id : this.state.topicInfo.channelId,
                    name : this.state.topicInfo.channelName,
                }
            })

        }

    }


    /**
     * 移动话题到其他系列课
     * 
     * @returns 
     * @memberof AudioGraphicEdit
     */
    async moveTopicHandle(){
        let result = await this.props.changeAudioGraphicChannel({
            oldChannelId:this.state.topicInfo.channelId ,
            newChannelId:this.state.selectChannelPo.id ,
            topicId: this.props.location.query.topicId,
        });

        if(result.state && result.state.code != 0){
            window.toast(result.state.msg);
            return false;
        }else{
            return true;
        }
    }

    onEditTopicChannel(isRelay) {
        if (isRelay === 'Y') {
            window.toast("转载的课程不支持修改所属系列课");
            return;
        }
        this.refs.channelListDialog.show();
    }

    updateRemarkByH5 = async () => {
        this.setState({
            remarkDialog: false
        })
    }

    updateRemark = async () => {
        if (this.state.topicDesc) {
            this.setState({
                remarkDialog: true
            })
        } else {
            await this.updateTopic(`/live/topic/profile/jump.htm?topicId=${this.props.location.query.topicId}&type=image`)
        }
    }
    
    goToPc = () => {
        this.setState({
            remarkDialog: false
        })
    }

    render() {
        const { isRelay } = this.props.topicInfo;
        return (
            <Page  title={this.state.topicInfo.topic||'音频图文话题编辑'}  className="audio-grapic-edit flex-body">
                
                <div className="flex-main-s">
                    <ul className='edit-ul'>
                        <li>
                            <span className="title">课程头图</span>
                            <span className="content" onClick={this.showTopicBgDialog} >800*500{this.state.imgIsUpload}</span>
                            <i className='icon_enter'></i>
                        </li>
                    </ul>
                    <ul className='edit-ul'>
                        <li>
                            <span className="title">课程名称</span>
                            <span className="content" onClick={this.showTopicNameDialog}>{this.state.topicInfo.topic}</span>
                            <i className='icon_enter'></i>
                        </li>
                        {
                            !this.props.topicInfo.campId &&
                            <li onClick={() => this.onEditTopicChannel(isRelay)} >
                            <span className="title">所属系列课</span>
                            <span className="content" >{this.state.topicInfo.channelName || ''}</span>
                            <i className='icon_enter'></i>
                            </li>
                        }
                        {
                            this.props.topicInfo.isSingleBuy == 'Y'?
                            <li onClick={()=>{ this.refs.topicMoneyDialog.show()}} >
                                <span className="title">课程价格</span>
                                <span className="content" >￥{this.state.money || ''}</span>
                                <i className='icon_enter'></i>
                            </li>
                            :null    
                        }
                        <li  onClick={this.updateRemark}>
                            <span className="title">课程详情</span>
                            <span className="content"></span>
                            <i className='icon_enter'></i>
                        </li>
                    </ul>
                    <div className="tips-box">
                        若{this.props.topicInfo.style =='audioGraphic'? '音频':'视频'}需要替换，请在电脑端-千聊Live管理后台操作<br/>
                        请在PC浏览器输入：<b>v.qianliao.tv</b>
                    </div>
                </div>

                <div className="flex-other">
                    <span className="btn-submit" onClick={()=>{this.updateTopic();}}>保存</span>
                </div>

                <Confirm
                    className="topic-name-dialog"
                    ref='topicNameDialog'
                    title={`课程名称`}
                    titleTheme='white'
                    buttonTheme='line'
                    onBtnClick={this.dialogsChangeNameHandle}
                    buttons='cancel-confirm'
                >
                    <div className="change-topic-name">
                        <CommonInput
                            ref="topicNameInput"
                            placeholder="请输入课程名称"
                            onChange={this.changeTopicName}
                            value={this.state.topicName || ''}
                        />
                    </div>
                </Confirm>

                <Confirm
                    className="topic-name-dialog"
                    ref='topicMoneyDialog'
                    title={`课程价格`}
                    titleTheme='white'
                    buttonTheme='line'
                    onBtnClick={this.dialogsMoneyHandle}
                    buttons='cancel-confirm'
                >
                    <div className="change-topic-name">
                        <CommonInput
                            ref="topicNameInput"
                            placeholder="请输入课程价格"
                            onChange={this.changeTopicMoney}
                            value={this.state.money || ''}
                        />
                    </div>
                </Confirm>

                <Confirm
                    className="topic-background-dialog"
                    ref='topicBackgroundDialog'
                    title={`课程头图`}
                    titleTheme='white'
                    buttonTheme='line'
                    onBtnClick={this.dialogsBackgroundHandle}
                    buttons='cancel-confirm'
                >
                    <div className="change-topic-bg">

                        <img src={`${this.state.backgroundUrl}?x-oss-process=image/resize,m_fill,limit_0,h_300,w_300 `} alt="" />
                        
                        <FileInput
                            className='img-input'
                            onChange={this.updateBackground}
                        />
                    </div>
                </Confirm>

                <Confirm
                    className="channel-list-dialog"
                    ref='channelListDialog'
                    title={`选择系列课`}
                    titleTheme='white'
                    buttonTheme='line'
                    onBtnClick={this.moveChannelBtn}
                    buttons='cancel-confirm'
                >
                    <div className="change-list">
                        <ul>
                            {
                                this.state.channelList.map((item) => {
                                    
                                    return <li onClick={() => { this.selectChannel(item) }} key={`channel-item-${item.id}`}>
                                        <pre>{item.name}</pre>
                                        {
                                            this.state.selectChannelPo.id == item.id ?
                                                <i className='icon_checked'></i>
                                            :null    
                                        }
                                    </li>
                                })
                            }
                        </ul>
                        
                    </div>
                </Confirm>

                 {
                    this.state.remarkDialog ? 
                    <ConfirmDialog
                        headerText="课程概要"
                        onClose={() => { this.setState({
                            remarkDialog: false
                        })}}
                        confirmText="复制地址"
                        cancelText="我知道了"
                        onConfirm={this.goToPc}
                        onCancel={this.updateRemarkByH5}
                    >   
                        <div>此介绍含有富文本模版内容，请到千聊电脑端管理后台进行编辑</div>
                        <div>访问地址：<a style={{color: '#4A8DE3'}} href="http://pc.qlchat.com">http://pc.qlchat.com</a></div>
                    </ConfirmDialog> : null
                }
            </Page>
        );
    }
}



function mapStateToProps (state) {
    return {
        sid: state.thousandLive.sid,
        topicInfo: state.thousandLive.topicInfo,
    }
}

const mapActionToProps = {
    getTopicInfo,
    getChannelList,
    getTopicUpdate,
    uploadImage,
    changeAudioGraphicChannel,
    getEditorSummary
}

module.exports = connect(mapStateToProps, mapActionToProps)(AudioGraphicEdit);
