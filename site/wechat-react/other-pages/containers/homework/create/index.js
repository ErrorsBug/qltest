/**
 * Created by dylanssg on 2017/6/13.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import classnames from 'classnames';
import { autobind, throttle } from 'core-decorators';

import Page from 'components/page';
import Confirm from 'components/dialog/confirm';
import ConfirmDialog from 'components/confirm-dialog'

import {
	setHomeworkTitle,
	setHomeworkTarget,
	setHomeworkContent,
	setHomeworkAudio,
	saveHomework,
	setHomeworkRelatedCourse,
	getJoinCampInfo
} from '../../../actions/homework';

import {
	dangerHtml,
	simpleFilter,
	htmlTransfer
} from 'components/util';

@autobind
class Create extends Component {
    state = {
        // 标题编辑框是否打开
        showTitleSetBox: false,
        title: '',
	    inputTitle: htmlTransfer(this.props.homeworkInfo.title) || '',
        className: "homework-create",

        showSetContentPage: false,
        homeworkContent: "",
        homeworkAudio: "",


        showConectPage: false,
        ifConnectCourse: true,

        onlyEntryCommit: false,
		applicantSwitchStatus: 'off', // on,off
		remarkDialog: false,
		campInfo:{}
    };
    componentWillMount(){
	    if(typeof sessionStorage !== 'undefined'){
		    if(sessionStorage.getItem('title')){
			    this.props.setHomeworkTitle(sessionStorage.getItem('title'));
			    this.setState({
				    inputTitle: sessionStorage.getItem('title')
			    });
		    }
		    if(sessionStorage.getItem('content')){
			    this.props.setHomeworkContent(sessionStorage.getItem('content'))
		    }
		    if(sessionStorage.getItem('second')){
			    this.props.setHomeworkAudio({
				    audioUrl: sessionStorage.getItem('audioUrl'),
				    second: sessionStorage.getItem('second'),
				    audioId: sessionStorage.getItem('audioId')
			    });
		    }else{
			    this.props.setHomeworkAudio('');
		    }
		    if(sessionStorage.getItem('target')){
			    this.props.setHomeworkTarget(sessionStorage.getItem('target'));
		    }

		    let topic = sessionStorage.getItem('topic');
		    if(topic){
			    topic = JSON.parse(topic);
			    if(topic.topicId !== this.props.homeworkInfo.topicId){
				    this.props.setHomeworkRelatedCourse(topic);
			    }
		    }
	    }
    }
    componentDidMount() {
    	// 每次回来判断是否被取消了课程关联
		if(this.props.homeworkInfo.target !== 'all' && !this.props.homeworkInfo.topicId){
			this.props.setHomeworkTarget('all');
		}
		if(this.props.homeworkInfo.topicId){
			this.initCampInfo();
		}
	}
	
	async initCampInfo(){
		const { data={} } = await getJoinCampInfo({
			topicId: this.props.homeworkInfo.topicId
		})
		this.setState({
			campInfo:data
		})
	}

    // 打开标题编辑框
    openTitleSetBox(){
        this.setState({
            showTitleSetBox: true
        },() => {
	        this.refs.titleInput.focus();
        });
        this.refs['setHomeworkTitleConfirm'].show();
    }

    titleInputHandle(e){
    	let value = e.target.value;
	    this.setState({
		    inputTitle: value
	    });
    }

    setTitleHandle(tag){
    	if(tag === 'confirm'){
		    if(!this.state.inputTitle.trim()){
			    window.toast('作业标题不能为空');
			    return false
		    }
		    if(this.state.inputTitle.trim().length > 40){
			    window.toast('标题长度不能超过40个字');
			    return false
		    }
		    this.refs['setHomeworkTitleConfirm'].hide();
		    this.props.setHomeworkTitle(this.state.inputTitle.trim());
		    sessionStorage.setItem('title', this.state.inputTitle.trim());
	    }else{
		    this.setState({
			    inputTitle: this.props.homeworkInfo.title
		    });
	    }
    }

    // 切换交作业方式
    toggleHandInMode() {
    	if(!this.props.homeworkInfo.topicId){
    		window.toast('请先关联课程');
    		return false;
	    }
	    if(this.props.homeworkInfo.target === 'all'){
		   this.props.setHomeworkTarget('topic');
		   sessionStorage.setItem('target','topic');
	    }else{
		    this.props.setHomeworkTarget('all');
		    sessionStorage.setItem('target','all');

	    }
    }

    clearSessiongStorage(){
	    sessionStorage.removeItem('title');
	    sessionStorage.removeItem('content');
	    sessionStorage.removeItem('audioUrl');
	    sessionStorage.removeItem('second');
	    sessionStorage.removeItem('audioId');
	    sessionStorage.removeItem('target');
	    sessionStorage.removeItem('topic');
    }

	async saveHandle(){
    	if(!this.props.homeworkInfo.title){
    		window.toast('请输入标题');
    		return false;
	    }else if(!this.props.homeworkInfo.content){
		    window.toast('请输入内容');
		    return false;
	    }
		let result = await this.props.saveHomework( Object.assign({},this.props.homeworkInfo,{
			title: simpleFilter(this.props.homeworkInfo.title),
			content: simpleFilter(this.props.homeworkInfo.content)
		}));
		if(result.state.code === 0){
			this.clearSessiongStorage();
			window.toast('保存成功', 3000);
			location.href = `/wechat/page/homework-card?id=${this.props.location.query.id || result.data.id}`;
		}
	}
	// 编辑
	goEdit(){
		const { homeworkInfo } = this.props;
		const { campInfo } = this.state;
		const flag = (Object.is(campInfo.isCamp,"Y") && Object.is(campInfo.hasPeriod, "Y")) || Object.is(campInfo.joinCamp,"Y")
		if(Object.is(homeworkInfo.contentType, 'rich') && flag){
			this.setState({
				remarkDialog: true
			})
		} else {
			(location.href = `/wechat/page/homework/set-homework-content?liveId=${this.props.location.query.liveId}&id=${this.props.location.query.id || ''}`)
		}
	}
	goToPc(){
		this.setState({
			remarkDialog: false
		})
	}
	updateRemarkByH5(){
		this.setState({
			remarkDialog: false
		})
	}

    render() {
        return (
            <Page title="布置作业" className={this.state.className}>
                <div>
                    <div className="homework-set-list">
                        <div className="set-item">
                            <div className="title">作业标题</div>
                            <div className="content" onClick={this.openTitleSetBox}>
	                            <span dangerouslySetInnerHTML={dangerHtml(this.props.homeworkInfo.title || '请输入标题')}></span>
                            </div>
                        </div>
                        <div className="set-item" onClick={this.goEdit}>
                            <div className="title">作业内容</div>
	                        <div className="content"><span dangerouslySetInnerHTML={dangerHtml(this.props.homeworkInfo.content || (this.props.homeworkInfo.contentType === 'rich' ? '' : '未填写'))}></span></div>
                        </div>
                    </div>
                    <div className="homework-set-list">
                        <Link className="set-item" to={{pathname: `/wechat/page/homework/relate-course`, query: {liveId: this.props.location.query.liveId}}}>
                            <div className="title">关联课程</div>
                            <div className="content">
                                <span>{this.props.homeworkInfo.topicName || '未关联'}</span>
                            </div>
                        </Link>
                        <div className="set-item">
                            <div className="title">仅课程报名者可交作业</div>
                            <div className="content switch-wrap">
                                <div className={`switch ${this.props.homeworkInfo.target}`} onClick={this.toggleHandInMode}></div>
                            </div>
                        </div>
                    </div>

                    <div className="btn-create" onClick={this.saveHandle}>保存并获取作业卡</div>

                    <Confirm
                        ref="setHomeworkTitleConfirm"
                        buttons='cancel-confirm'
                        title='作业标题'
                        onBtnClick={this.setTitleHandle}
                    >
	                    <div className="title-input-wrap">
		                    <input type="text" ref="titleInput" placeholder="请输入标题" value={this.state.inputTitle} onChange={this.titleInputHandle} />
	                    </div>
                    </Confirm>
					{ this.state.remarkDialog && (
						<ConfirmDialog
						// headerText="课程概要"
							className="creat-box-dialog"
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
						</ConfirmDialog>
					)}
					
                </div>
            </Page>
        );
    }
}

const mapDispatchToProps = {
	setHomeworkTitle,
	setHomeworkTarget,
	setHomeworkContent,
	setHomeworkAudio,
	saveHomework,
	setHomeworkRelatedCourse
};

function mapStateToProps(state) {
    return {
    	homeworkInfo: state.homework.info
    };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Create);