const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link} from 'react-router';

import Page from 'components/page';
import { locationTo,updatePageData } from 'components/util';
import { share } from 'components/wx-utils';
import { Confirm } from 'components/dialog'

// actions
import {
    getChannelIntro,
    saveChannelIntro,
} from '../../actions/channel-intro-edit';

class ChannelIntroVideoEdit extends Component {

    state = {
        videoContent:""
    }

    async loadChannelIntro(category,channelId){
        let result = await this.props.getChannelIntro(category,channelId);
        if(Array.isArray(result) && result.length > 0){
            this.setState({
                channelIntroList:result,
                videoContent: (result[0].content || '').trim()
            })
        }
    }

    componentDidMount() {
        if(this.props.params.channelId){
            this.loadChannelIntro("videoDesc",this.props.params.channelId);
        }
    }

    changeContent(e){
        this.setState({
            videoContent: (e.target.value || '').trim()
        })
    }

    async saveCahnnelIntro(tag){
        var list = {}
        list.content = this.state.videoContent;
        list.type = "video";
        list.id = "";

        if(tag=="confirm"){
			let result = await this.props.saveChannelIntro("videoDesc",this.props.params.channelId,[list]);

            if (result.state.code == "0"){
                await window.toast("保存成功",2000);
                updatePageData();
                this.props.router.push('/wechat/page/channel-intro-list/'+this.props.params.channelId);

		    } else {
                result.state && window.toast(result.state.msg);
            }
        }

    }
    showConfirmBox(){
        if(/^(\<iframe ).*((v\.qq\.com)|(player\.youku\.com)).*(\>\<\/iframe\>)$/.test(this.state.videoContent) || /(\.mp4)$/.test(this.state.videoContent)|| this.state.videoContent == '' ){
            this.refs.dialogComfirm.show();
        }else{
			window.toast("只支持mp4地址或腾讯视频ifram通用代码发送");
		}
    }
    showCancelBox(){
        this.refs.dialogCancel.show();
    }
    cancelChange(tag){
        if(tag=="confirm"){
            this.props.router.push('/wechat/page/channel-intro-list/'+this.props.params.channelId);
        }
    }


    render() {

        return (
            <Page title="视频简介" className='channel-video-edit-container flex-body'>
                <div className="flex-main-s">

                    <textarea className="video-textarea"  value={this.state.videoContent} placeholder="此处请粘贴优酷腾讯视频的通用代码（视频网站-分享-复制通用代码）" onChange ={this.changeContent.bind(this)}></textarea>

                </div>


                <div className="bottom-bar flex-other">
                    <span className="btn-cancel" onClick={this.showCancelBox.bind(this)}>取消</span>
                    <span className="btn-submit" onClick={this.showConfirmBox.bind(this)}>保存</span>
                </div>

                <Confirm ref='dialogCancel'
                    onBtnClick={this.cancelChange.bind(this)}
                >
                    <span className='co-dialog-main-content'><p>确定退出编辑？</p></span>
                </Confirm>
                <Confirm ref='dialogComfirm'
                    onBtnClick={this.saveCahnnelIntro.bind(this)}
                >
                    <span className='co-dialog-main-content'><p>确定保存修改？</p></span>
                </Confirm>

            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {

    }
}

const mapActionToProps = {
    getChannelIntro,
    saveChannelIntro,

}

module.exports = connect(mapStateToProps, mapActionToProps)(ChannelIntroVideoEdit);
