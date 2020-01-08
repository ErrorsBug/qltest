import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Detect from 'components/detect';
import { autobind } from 'core-decorators';

import BottomRecorder from '../../../../components/bottom-recorder'
import ImgUpload from '../../../../components/img-upload'

@autobind
class BottomEditMenu extends Component {

    state = {
        showRecord: false,
        // 总共能选图片
        imgMaxCount:10,
        // 总共能选图片
        audioMaxCount:10,
    }


    toggleShowRecord() {
        let audioItemLength = this.props.contentList.filter(item => {
            return item.type == 'audio' || item.type == 'audioId';
        }).length;

        if (audioItemLength >=  this.state.audioMaxCount) {
            window.toast('最多只能添加' + this.state.audioMaxCount + '个语音');
            return false;
        }

        this.setState({
            showRecord:!this.state.showRecord
        })
    }

    onSelectAudio(e) {
        if(Detect.os.ios){
        } else {
        }
    }

    // pc录音发送处理
    pcSendRecHandle(audioItem) {
        let { url, second } = audioItem;
        this.props.addAudioItem({content:url, second}, true);
        this.setState({
            showRecord:false
        })
        return {
            state: {
                code:0
            }
        }
    }

    // 微信录音处理
    wxUploadHandle(audioItem) {
        let { recLocalId, second, serverId } = audioItem;
        if (serverId) {
            this.props.addAudioItem({content:serverId, second, recLocalId }, false);
            this.setState({
                showRecord:false
            })
            return {
                state: {
                    code:0
                }
            }
        }
    }

    uploadHandle(imgItems) {
        
        if (!imgItems) {
            return false;
        }
        let imgLinks = imgItems.map((item,idx) => {
            return {
                id:Date.now()+idx,
                ...item,
                content: item.type == 'image' ? item.url :item.serverId,
            }
        })
        this.props.addImage(imgLinks);
    }


    render() {
        return (
            <div className='bottom-edit-menu'>
                <div className='btn-add'>
                    <img src={ require('./img/icon-img.png') } />
                    <ImgUpload
                        multiple = "multiple"
                        count = {this.state.imgMaxCount - (this.props.contentList.filter(item => {
                            return item.type=='image' ||item.type=='imageId' ;
                        }).length)}
                        maxCount = {this.state.imgMaxCount}
                        uploadHandle = {this.uploadHandle}
                    />
                </div>
                <div className='btn-add'
                    onClick={this.toggleShowRecord}
                >
                    <img src={ require('./img/icon-voice.png') } />
                </div>
                {/* <div className="btn-fold-keyboard"><img src={ require('./img/icon-keyboard.png') } /></div> */}
                <div
                    className="btn-send"
                    onClick = {this.props.addOrUpdate}
                >
                    发布
                </div>
                

                <BottomRecorder
                    show={this.state.showRecord}    
                    pcSendRecHandle = {this.pcSendRecHandle}
                    wxUploadHandle = {this.wxUploadHandle}
                    onClose={this.toggleShowRecord}
                />
            </div>
        );
    }
}

BottomEditMenu.propTypes = {

};

export default BottomEditMenu;