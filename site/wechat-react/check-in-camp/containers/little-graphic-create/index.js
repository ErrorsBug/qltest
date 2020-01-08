import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { autobind,throttle } from 'core-decorators';

import Page from 'components/page';
import {validLegal, getVal, normalFilter} from 'components/util';
import Detect from 'components/detect';
import { AudioPlayer } from 'components/audio-player';


import TopicTitle from './components/topic-intro-list/title';
import ItemText from './components/topic-intro-list/item-text';
import ItemImage from './components/topic-intro-list/item-image';
import ItemAudio from './components/topic-intro-list/item-audio';
import BottomEditMenu from './components/bottom-edit-menu';

import { 
    littleGraphqlModel
} from '../../model';

const {
    requestAddOrUpdateLittleGraphic,
    updateLittleGraphicBaseInfo,
    updateLittleGraphicContentList,
    updateLittleGraphicContent,
    deleteLittleGraphicContent,
} = littleGraphqlModel;
import {
    uploadImage,
    uploadRec,
} from 'thousand_live_actions/common';

@autobind
class LittleGraphicCreate extends Component {
    state = {
        // 播放状态
        playStatus: 'pause',
        // 播放中的url
        audioUrl: '',
        // 播放中的id
        audioMsgId:'',
        // 焦点idx
        focusId:'',
    }

    data ={
        isSend:false,
    }
    
    componentDidMount() {
        this.initState();
        // 上传初始化
        this.initAudio();

    }

    /**
     * 
     * 初始化状态
     * @memberof LittleGraphicCreate
     */
    async initState() {

        this.initContentList();
    }
    
    /**
     * 初始化介绍数据
     * 
     * @memberof LittleGraphicCreate
     */
    initContentList() {
        let tampId = String(Date.now());
        let contentList = [{
            id: tampId,
            type: 'text',
            content: '',
        }];
        if (!this.props.location.query.topicId) {
            updateLittleGraphicContentList({ contentList })
            this.setState({
                focusId: tampId
            })
        } else {
            setTimeout(() => {
                if (this.props.contentList.length < 1) {
                    updateLittleGraphicContentList({contentList})
                } else  {
                    let propsContentList = this.props.contentList;
                    if (propsContentList[propsContentList.length - 1].type != 'text') {
                        propsContentList = [...propsContentList,...contentList]
                        updateLittleGraphicContentList({ contentList:propsContentList });
                    }    
                }

                this.setState({
                    focusId: tampId
                })
            }, 2500);
        }
    }

    /**
     * 
     * 图片尺寸修正
     * @memberof LittleGraphicCreate
     */
    fixImgSize() {
        let imgs = document.querySelectorAll('.intro-image');

        Array.prototype.map.call(imgs, (item) => {
            if (item.complete) {
                item.style.width = item.width >= 800 ? '100%' : (item.width*window.dpr + 'px');
            }
        });

    }

    /**
     * 播放器初始化监听
     *
     *
     * @memberOf ThousandLive
     */
    initAudio(){
        this.audioPlayer = new AudioPlayer();
        this.audioPlayer.playWav();
        this.audioPlayer.on('ended',this.audioEnded);
        this.audioPlayer.on('pause',this.audioPause);
        this.audioPlayer.on('playing',this.audioPlaying);


        wx.ready(() => {
            wx.onVoicePlayEnd({
                success: (res) => {
                   this.audioEnded();
                }
            });
        });
    }

    audioPlaying(e){

        this.setState({
            playStatus:'play',
            audioLoading : false,
        })
    }

    audioPause(e){
        this.setState({
            playStatus:'pause',
        })
    }

    audioEnded(e){

        this.setState({
            playStatus:'ready',
            audioLoading:false,
            audioUrl:'',
            audioMsgId:''
        })


    }


    /**
     * 播放音频总控
     * 
     * @param {any} type 
     * @param {any} id 
     * @memberof LittleGraphicCreate
     */
    playAudio(type,id) {
        if (type == 'audio') {
            this.playAudioPc(id);
        } else {
            this.playAudioWx(id);
        }
    }
    /**
     * 暂停音频总控
     * 
     * @param {any} type 
     * @param {any} id 
     * @memberof LittleGraphicCreate
     */
    stopAudio(type) {
        if (type == 'audio') {
            this.pauseAudioPc();
        } else {
            this.pauseAudioWx();
        }
    }

    /**
     * 
     * 播放音频PC
     * @param {any} id 
     * @returns 
     * @memberof LittleGraphicCreate
     */
    playAudioPc(id) {
        this.pauseAudioWx();

        // 获取要播放的音频所在总列表下标
        let audioIndex = this.props.contentList.findIndex((item, index, arr) => {
            return item.id == id;
        });
        // 获取音频消息
        let audioMsg = this.props.contentList[audioIndex];
        // 获取音频路径
        let url = audioMsg.content;

        


        if (this.state.audioMsgId != id) {
            this.setState({
                audioUrl:url,
                playStatus: 'play',
                audioMsgId: audioMsg.id,
                audioLoading : true,
            })
            this.audioPlayer.volume = 1;
            try {
                this.audioPlayer.pause();
            } catch (error) {
                console.log(error);
            }
            this.audioPlayer.play(url);
    
        } else {
            this.setState({
                playStatus: 'play',
                audioMsgId: audioMsg.id,
            })
            this.audioPlayer.resume();
        }
    }

    pauseAudioPc() {
        this.audioPlayer.pause();
    }

    /**
     * 播放微信录音
     * 
     * @memberof LittleGraphicCreate
     */
    @throttle(1500)
    async playAudioWx(id) {
        this.pauseAudioPc();
        this.pauseAudioWx();
        // 获取要播放的音频所在总列表下标
        let audioIndex = this.props.contentList.findIndex((item, index, arr) => {
            return item.id == id;
        });
        // 获取音频消息
        let audioMsg = this.props.contentList[audioIndex];
        // 获取音频路径
        let url = audioMsg.recLocalId;

        setTimeout(() => {
            wx.playVoice({
                localId: url,
                success: () => {
                    this.setState({
                        audioUrl: url,
                        playStatus: 'play',
                        audioMsgId: audioMsg.id,
                    })
                },
                fail: () => {
                }
            });
        },300)

    }

    pauseAudioWx() {
        wx.stopVoice({
            localId: this.state.audioUrl,
            success: () => {
            },
            fail: () => {
            }
        });
        this.setState({
            audioUrl: '',
            playStatus: 'stop',
            audioMsgId: '',
        })
        
    }


    /**
     * 修改标题
     * 
     * @param {any} e 
     * @memberof LittleGraphicCreate
     */
    changeTitle(e) {
        updateLittleGraphicBaseInfo({baseInfo:{topicName:e.target.value}})
    }


    /**
     * 修改文本内容
     * 
     * @param {any} e 
     * @param {any} idx 
     * @memberof LittleGraphicCreate
     */
    changeData(e,idx) {
        updateLittleGraphicContent({index:idx,content:e.target.value})
    }



    /**
     * 
     * 添加文本组件
     * @param {any} index 
     * @returns 
     * @memberof LittleGraphicCreate
     */
    addTextItem(id) {
        let contentList = this.props.contentList;
        let listLength = contentList.length;
        let index = this.props.contentList.findIndex((item, index, arr) => {
            return item.id == id;
        });

        let textItem = {
            id:String(Date.now()),
            type: 'text',
            content: '',
        }

        contentList = contentList.filter((item, idx) => {
            if (item.type=='text' && item.content == '' && idx < listLength - 1 && idx < index) {
                index--;
            }
            return !(item.type=='text' && item.content == '' && idx < listLength - 1) ;
        })

        if (index < 0) {
            index = 0;
        }

        index = index + 1;
        if (contentList.length >= index  && (!contentList[index] || contentList[index].type != 'text')) {
            contentList.splice(index, 0, textItem); 
        }
        updateLittleGraphicContentList({ contentList })
    }

    /**
     * 删除组件
     * 
     * @param {any} index 
     * @returns 
     * @memberof LittleGraphicCreate
     */
    delItem(id, type = '') {
        
        let contentList = this.props.contentList;
        let index = this.props.contentList.findIndex((item, index, arr) => {
            return item.id == id;
        });
        if (type == 'text' && contentList.length <= index + 1) {
            return false;
        }

        if ( type != 'text'  && contentList[index+1] && contentList[index+1].type == 'text' && contentList[index-1] && contentList[index-1].type == 'text') {
            // 如果被删除的选项 上下都是文本，则需要合并
            contentList[index - 1].content = contentList[index - 1].content + '\n' + contentList[index + 1].content;

            
            if (index < 0) {
                index = 0;
            }

            contentList.splice(index, 2);
            updateLittleGraphicContentList({ contentList })
            
        } else {
            deleteLittleGraphicContent({
                index
            })
            
        }

        if (index < 0) {
            index = 0;
        }
        if (contentList[index - 1]) {
            this.setState({
                focusId:contentList[index-1].id
            })
        }
    }


    /**
     * 
     * 更新焦点id
     * @param {any} id 
     * @memberof LittleGraphicCreate
     */
    imFocus(id) {
        this.setState({
            focusId: id
        })
    }


    
    /**
     * 
     * 添加图片组件
     * @param {any} index 
     * @returns 
     * @memberof LittleGraphicCreate
     */
    addImage(imgItems) {
        let contentList = this.props.contentList;
        let index = this.props.contentList.findIndex((item, index, arr) => {
            return item.id == this.state.focusId;
        });

        if (index < 0) {
            index = 0;
        }

        index++;
        contentList.splice(index,0,...imgItems);
                
        this.setState({
            focusId:imgItems[imgItems.length-1].id
        })

        updateLittleGraphicContentList({
            contentList
        })

        this.addTextItem(imgItems[imgItems.length - 1].id);
    }

    
    /**
     * 
     * 添加音频组件WX
     * @param {any} index 
     * @returns 
     * @memberof LittleGraphicCreate
     */
    addAudioItem(val,isPc) {
        let contentList = this.props.contentList;

        let index = this.props.contentList.findIndex((item, index, arr) => {
            return item.id == this.state.focusId;
        });

        
        
        let newId = Date.now();
        let audioItem = {
            id:newId,
            type: isPc?'audio':'audioId',
            ...val,
        }

        if (index < 0) {
            index = 0;
        }

        index++;

        contentList.splice(index, 0, audioItem);
        
        this.setState({
            focusId:newId
        })
        
        updateLittleGraphicContentList({
            contentList
        })

        this.addTextItem(newId);
    }


    addOrUpdate() {
        if (this.data.isSend) {
            return false;
        }
        this.data.isSend = true;
        let title = this.props.topicName;
        if (!validLegal('text', '课程标题', title, 40)) {
            this.data.isSend = false;
            return false;
        }
        let contentList = this.props.contentList.filter(item =>{
            return !(item.type=='text' && item.content == '');
        })
        let noLegal = contentList.find((item) => {
            return item.type == 'text' && !validLegal('text', '话题简介', item.content, 2000);
        })
        
        if (noLegal) {
            this.data.isSend = false;
            return false;
        }

        setTimeout(() => {
            this.data.isSend = true;
        }, 3000);

        contentList = contentList.map(item => {
            if (item.type == 'text') {
                item.content = normalFilter(item.content);
            }
            return item;
            
        })

        let imgItem = contentList.find((item) => {
            return item.type == 'image' || item.type=='imageId';
        })

        let randomBg = "https://img.qlchat.com/qlLive/topicHeaderPic/thp-" + Math.ceil(Math.random(0.1, 1) * 8) + ".jpg";

            
        requestAddOrUpdateLittleGraphic({
            campId: this.props.params.campId,
            name: normalFilter(title),
            topicId: this.props.location.query.topicId,
            liveId: this.props.params.liveId,
            contentList: contentList,
            backgroundUrl:imgItem ? imgItem.content : randomBg,
            imageType:imgItem?imgItem.type:'image',
        });
        
    }

    



    render() {
        return (
            <Page title={this.props.topicName ||'新建小图文'} className="little-graphic-page flex-body">
                <div className="flex-main-s">
                    <div className="topic-intro-list">
                        <TopicTitle
                            title = {this.props.topicName}
                            changeData={this.changeTitle}
                            edit={true}
                        />
                        {
                            this.props.contentList.map((item, index) => {
                                switch(item.type){
                                    case 'text':
                                        return <ItemText
                                            key={`intro-${index}`}    
                                            item={item}
                                            index={index}
                                            changeData={this.changeData}
                                            imFocus={this.imFocus}
                                            focusId={this.state.focusId}
                                            delItem={this.delItem}
                                            edit={true}
                                            />;
                                    case 'image':
                                    case 'imageId':
                                            return <ItemImage
                                                key={`intro-${index}`}    
                                                item={item}
                                                index={index}
                                                addTextItem={this.addTextItem}
                                                delItem={this.delItem}
                                                imFocus={this.imFocus}
                                                focusId={this.state.focusId}
                                                edit={true}    
                                            />;
                                            case 'audio':
                                            case 'audioId':
                                            return <ItemAudio
                                                key={`intro-${index}`}    
                                                item={item}
                                                index={index}
                                                addTextItem={this.addTextItem}
                                                delItem={this.delItem}
                                                imFocus={this.imFocus}
                                                playAudio={this.playAudio}
                                                stopAudio={this.stopAudio}
                                                playStatus={this.state.playStatus}
                                                focusId={this.state.focusId}
                                                audioMsgId={this.state.audioMsgId}
                                                edit={true}    
                                        />;
                                    default : return null;
                                        
                                }
                            })
                        }
                    </div>    
                </div>
                <div className="flex-other">
                    <BottomEditMenu
                        addImage = {this.addImage}
                        addAudioItem = {this.addAudioItem}
                        addOrUpdate = {this.addOrUpdate}
                        contentList = {this.props.contentList}
                    
                    />    
                </div>
            </Page>
        );
    }
}

LittleGraphicCreate.propTypes = {

};

function mapStateToProps(state) {
    return {
        topicName: getVal(state, 'littleGraphic.topicName',''),
        contentList : getVal(state, 'littleGraphic.contentList',[]),

    }
}

const mapActionToProps = {
    uploadImage,
    uploadRec,
}

export default connect(mapStateToProps, mapActionToProps)(LittleGraphicCreate);