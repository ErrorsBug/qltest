import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import FileInput from 'components/file-input';
// actions
import {
	getTopicInfo
} from '../../actions/topic';

import {
	getChannelInfo
} from '../../actions/channel';

import { uploadImage,getStsAuth } from '../../actions/common';
import { saveComplain } from '../../actions/complain'

import Page from 'components/page';

class ComplainReason extends Component {
    
    state = {
		name: '',
	    creator: '',
        logo: '',
	    content: '',
        contentCount: 0,
        contentMaxLength: 200,
        evidences: [],
        wechatAccount: '',
        phoneNum: ''
    }

	async componentDidMount() {
        // topicId: 100010807000027
        // channelId: 290000273008289
        this.initStsInfo();
        if(this.props.location.query.topicId){
            let topicInfo = await this.getTopicInfo(this.props.location.query.topicId);
            this.setState({
                name: topicInfo.data.topicPo.topic,
                creator: topicInfo.data.createUser && topicInfo.data.createUser.name || '',
                logo: topicInfo.data.topicPo.backgroundUrl,
                userId: topicInfo.data.createUser && topicInfo.data.createUser.userId || 0
            })
        }else if(this.props.location.query.channelId){
            let channelInfo = await this.getChannelInfo(this.props.location.query.channelId);
            this.setState({
                name: channelInfo.data.channel.name,
                creator: channelInfo.data.createUser && channelInfo.data.createUser.name || '',
                logo: channelInfo.data.createUser.headImgUrl,
                userId: channelInfo.data.createUser && channelInfo.data.createUser.userId || 0
            })
        }
		
    }

    // oss上传
    initStsInfo() {
        this.props.getStsAuth();

        const script = document.createElement('script');
        script.src = '//static.qianliaowang.com/frontend/rs/lib/aliyun-oss-sdk.min.js';
        document.body.appendChild(script);
    }

	async getTopicInfo(topicId) {
		let result = await this.props.getTopicInfo(topicId);
		if(result.state.code == 0){
			return result;
		}else{
			window.toast(result.state.msg)
		}

	}

    async getChannelInfo(channelId) {
		let result = await this.props.getChannelInfo(channelId);
		if(result.state.code == 0){
			return result;
		}else{
			window.toast(result.state.msg)
		}

	}

    contentChange(e) {
        let l = e.target.value.length;
        if(l > this.state.contentMaxLength) return
        else{
            this.setState({
                content: e.target.value,
                contentCount: e.target.value.length
            });
        }
    }

    async commitComplain() {
        if(!this.state.content){
            window.toast('投诉内容不能为空');
            return false;
        }else if(!this.state.wechatAccount){
            window.toast('微信号不能为空');
            return false;
        }else if(['null','undefined'].indexOf(this.state.wechatAccount) >= 0){
            window.toast('请输入正确的微信号');
            return false;
        }else if(!this.state.phoneNum){
            window.toast('手机号码不能为空');
            return false;
        }
        const arg = {
            businessId: this.props.location.query.topicId || this.props.location.query.channelId,
            businessType: this.props.location.query.topicId ? 'topic' : 'channel',
            description: this.state.content,
            images: this.state.evidences,
            link: this.props.location.query.link,
            mobile: this.state.phoneNum,
            reasonType: this.props.location.query.type,
            wechatAccount: this.state.wechatAccount,
            sourceIp: '',
            userId: this.state.userId,
        }
        const result = await this.props.saveComplain(arg);
        if(result.state.code == 0){
            location.href = this.props.location.query.topicId ? this.props.location.query.link.replace(/(\?.*)/,'') + '?topicId='+this.props.location.query.topicId+'&preview=Y&intoPreview=Y' : this.props.location.query.link;
        }else{
            window.toast(result.state.msg)
        }
    }

    addEvidence(filePath) {
        let evidences = [...this.state.evidences];
        evidences.push(filePath);
        this.setState({
            evidences: evidences
        })
    }

    removeEvidence(e) {
        let index = e.target.dataset.index;
        let evidences = [...this.state.evidences];
        evidences.splice(index,1);
        this.setState({
            evidences: evidences
        });
    }

    editWechatAccount(e) {
        this.setState({
            wechatAccount: e.target.value
        });
    }

    editPhoneNum(e) {
        this.setState({
            phoneNum: e.target.value,
        });
    }

    // 添加新图片
    async addIntroImageItem(event) {
        const file = event.target.files[0]
        // this.setState({
        //     file,
        // });

        try {
            const filePath = await this.props.uploadImage(file,"complainEvidence");
            if(filePath) this.addEvidence(filePath);
            // this.setState({
            //     filePath: filePath,
            // });
            // if (filePath) {
            //     this.addIntroItem("image",filePath);
            // }


        } catch (error) {
            console.log(error);
        }

    }

    render() {
        return (
            <Page title="投诉" className='complain-details'>
                <div className='complain-title'> 投诉账号 </div>

                <dl className='complain-reason-list'>
                    <div className='info object-info'> 
                        <div className="avatar">
                            <img src={this.state.logo} />
                        </div>
                        <div className="info-wrap">
                            <div className='complain-counter'>{this.state.name}</div>
                            <div className='complain-creator'>创建者: {this.state.creator}</div>
                        </div>
                    </div>
                </dl>
                <div className='complain-title'> 投诉描述 </div>
                <div> </div>
                <div className='complain-reason-list'>      
                    <textarea className='complain-content' onChange={this.contentChange.bind(this)} placeholder='请输入投诉内容' maxLength={this.state.contentMaxLength} value={this.state.content} />
                    <div className='word-counter line'>{this.state.contentCount}/{this.state.contentMaxLength}</div> 

                    <div className='info line'>
                        <span>证据截图</span>
                        <span className='float-right'>{this.state.evidences.length}/4</span>
                        <div className="evidences">
                            {
                                this.state.evidences.map((evidence,i) => {
                                    return (
                                        <div className="item" index={i}>
                                            <img src={evidence} alt=""/>
                                            <div className="icon_cross remove-btn" onClick={this.removeEvidence.bind(this)} data-index={i}></div>
                                        </div>
                                    )
                                })
                            }
                            {
                                this.state.evidences.length < 4 ?
                                <div className="add-btn">
                                    <FileInput
                                        name='channel-portrait'
                                        className = "input-image"
                                        onChange={this.addIntroImageItem.bind(this)}
                                    />
                                </div> :
                                null
                            }
                        </div>
                    </div>

                    <div className='info line input-wrap'>
                        <span>证据链接</span>
                        <input type="text" className="common-input" value={this.props.location.query.link}/>
                        {/*<div className="common-input">{this.props.location.query.link}</div>*/}
                    </div>
                    <div className='info line input-wrap' >
                        <span>微信号</span>
                        <input type="text" className="common-input" value={this.state.wechatAccount} onChange={this.editWechatAccount.bind(this)} placeholder='必填'/>
                    </div>
                    <div className='info input-wrap'>
                        <span>手机号码</span>
                        <input type="text" className="common-input" value={this.state.phoneNum} onChange={this.editPhoneNum.bind(this)} placeholder='请填写手机号码'/>
                    </div>
                </div>
                <div className='complain-button' onClick={this.commitComplain.bind(this)} >提交</div>
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {

    }
}

const mapActionToProps = {
	getTopicInfo,
    saveComplain,
    getChannelInfo,
    getStsAuth,
    uploadImage
}

module.exports = connect(mapStateToProps, mapActionToProps)(ComplainReason);
