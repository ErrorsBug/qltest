import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Detect from 'components/detect';
import { BottomDialog, Confirm } from 'components/dialog';
import Switch from 'components/switch';
import { locationTo,getVal } from 'components/util';
import { getQlchatVersion} from 'components/envi';
import { autobind } from 'core-decorators';
import { fixScroll } from 'components/fix-scroll';
import { request } from 'common_actions/common';

@autobind
class BottomControlDialog extends PureComponent {

    state = {
        // 是否是千聊app
        isInQlchatApp: false,
        showAppDownload: true,
        //是否点击过课程列表按钮
        clickMoreCourse: false,
        isOpenEvaluate:false,
        collected:false,
    }

    data = {
        downloadAudioConfirmData :{
            headText: '语音合成中，大概需要20分钟',
            detail: ['1.请打开微信电脑客户端', '2.进入此直播的页面', '3.点击此按钮，即可下载音频', '（只支持合成千聊录音的音频，不支持上传音频合成）'],
        },
        downloadAudioBtnText: '导出语音',
        downloadAudioBtnClass: 'icon-download-audio on-log',
    }

    componentDidMount() {
        fixScroll("#bottom-control-main");
        this.checkIsInQlchatApp();
        this.isCollected();
        this.getIsOpenEvaluate();

        // 按钮曝光打点
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 500);
    }

    // 检查是否在千聊app中
    checkIsInQlchatApp() {
        if (getQlchatVersion()) {
            this.setState({
                isInQlchatApp: true,
            });
        } else {
            this.setState({
                isInQlchatApp: false,
            });
        }
    }

    initDownloadAudioData() {
        switch(this.props.topicInfo.audioAssemblyStatus) {
            // 未合成
            case 0:
                if (!Detect.os.phone) {
                    this.data.downloadAudioConfirmData.detail[0] = '导出请求已发送，后台正在合成语音';
                    this.data.downloadAudioConfirmData.detail[1] = '请20分钟后返回此页面';
                    this.data.downloadAudioConfirmData.detail[2] = '点击此按钮下载';
                }
                break;
            // 已合成
            case 1:
                if (Detect.os.phone) {
                    this.data.downloadAudioConfirmData.headText = '语音已经合成好';
                }
                this.data.downloadAudioBtnClass = "icon-download-audio-ready on-log";
                this.data.downloadAudioBtnText = "下载语音";
                break;
            // 正在合成
            case 2:
                if (!Detect.os.phone) {
                    this.data.downloadAudioConfirmData.detail[0] = '导出请求已发送，后台正在合成语音';
                    this.data.downloadAudioConfirmData.detail[1] = '请20分钟后返回此页面';
                    this.data.downloadAudioConfirmData.detail[2] = '点击此按钮下载';
                }
                this.data.downloadAudioBtnClass = "icon-download-audio-processing on-log";
                this.data.downloadAudioBtnText = "语音合成中";
                break;
            default:
                break;
        }
    }

    onMuteButtonChange() {
        if (this.props.mute) {
            window.confirmDialog(
                '确认关闭禁言？',
                () => this.props.setMute('N', this.props.topicId)
            );
        } else {
            window.confirmDialog(
                '确认开启禁言？',
                () => this.props.setMute('Y', this.props.topicId)
            );
        };
    }
    onShowRewordButtonChange() {
        if (this.props.showReword) {
            window.confirmDialog(
                '确认关闭打赏信息？',
                () => this.props.setRewordDisplay('Y')
            );
        } else {
            window.confirmDialog(
                '确认开启打赏信息？',
                () => this.props.setRewordDisplay('N')
            );
        };
    }

    toggleTeacherOnly() {
        if (this.props.teacherOnly) {
            window.confirmDialog('是否关闭只看讲师的发言', () => this.props.toggleTeacherOnly(!this.props.teacherOnly));
        } else {
            window.confirmDialog('是否开启只看讲师的发言', () => this.props.toggleTeacherOnly(!this.props.teacherOnly));
        }
    }

    hideDownloadAudioConfirm() {
        this.refs.downloadAudioConfirm.hide();
    }

    handleDownLoadAudioClick() {
        console.log(222233, this.props.topicInfo.status, 'audioAssemblyStatus:',this.props.topicInfo.audioAssemblyStatus)
        if (this.props.topicInfo.status === 'ended') {
            switch(this.props.topicInfo.audioAssemblyStatus) {
                // 已合成
                case 1:
                    // download
                    if (Detect.os.phone) {
                        this.refs.downloadAudioConfirm.show();
                    } else {
                        // const a = document.createElement('a');
                        // a.download = '';
                        // a.href = `${this.props.topicInfo.audioAssemblyUrl}`;
                        // a.click();
                        // window 微信需要跳转到 新页面引导下载
                        if (!Detect.os.phone && Detect.os.weixin) {
                            locationTo(`/wechat/page/tablet-audio?topicId=${this.props.topicId}`)
                        } else {
                            location.href = this.props.topicInfo.audioAssemblyUrl;
                        }
                    }
                    break;
                // 正在合成
                case 2:
                    this.refs.downloadAudioConfirm.show();
                    break;
                // 无音频
                case 3:
                    window.confirmDialog('本次直播没有语音', null, null, null, 'confirm');
                    break;
                // 合成失败
                case 4:
                    window.confirmDialog('自动合成失败，请重新尝试', this.requestAssemblyAudio, null, null, 'cancel-confirm');
                    break;
                // 未合成
                default:
                    this.requestAssemblyAudio();
                    break;
            }
        } else {
            window.confirmDialog('直播结束后才能导出', null, null, null, 'confirm');
        }
    }

    get isWeapp() {
        return typeof window != 'undefined' && window.__wxjs_environment === 'miniprogram'
    }

    async requestAssemblyAudio() {
        const res = await this.props.AssemblyAudio(this.props.topicId);
        if (res.state.code === 0) {
            switch(res.data.assemblyStatus) {
                case 3:
                    window.confirmDialog('本次直播没有语音', null, null, null, 'confirm');
                    break;
                case 4:
                    window.confirmDialog('自动合成失败，请重新尝试', null, null, null, 'confirm');
                    break;
                default:
                    this.refs.downloadAudioConfirm.show();
                    break;
            }
        }
    }

    /**
     * 上麦权限开关
     *
     * @param {any} type
     * @param {any} status
     *
     * @memberof BottomControlDialog
     */
    async audioSwitch() {
        let params = {};
        params.topicId = this.props.topicId;
        params.isAudioOpen = this.props.isAudioOpen == 'Y' ? 'N' : 'Y';

        if (params.isAudioOpen == 'Y') {
            let comcontent = (
                    <ul className='text-audio-switch-tips'>
                        <li>开启后，听众可语音发言且语音消息可直接上墙（文字发言除外）。</li>
                        <li>关闭后，听众不可语音发言。</li>
                        <li>开启或关闭操作，消息流有相应提示。</li>
                    </ul>
            )
            window.confirmDialog(
                comcontent,
                () => {
                    this.audioSwitchHandle(params);
                },
                () => { },
                '用户语音发言',
                'confirm'
            )

        } else {
            this.audioSwitchHandle(params);
        }
    }

    async audioSwitchHandle(params) {
        let result = await this.props.textOrAudioSwitch(params);
    }

    async textSwitch() {
        let params = {};
        params.topicId = this.props.topicId;
        params.isTextOpen = this.props.isTextOpen == 'Y' ? 'N' : 'Y';

        if (params.isTextOpen == 'Y') {
            let comcontent = (
                    <ul className='text-audio-switch-tips'>
                        <li>开启后，听众文字发言可直接上墙。</li>
                        <li>关闭后，听众文字发言显示至弹幕区。</li>
                        <li>开启或关闭操作，消息流有相应提示。</li>
                    </ul>
            )
            window.confirmDialog(
                comcontent,
                () => {
                    this.textSwitchHandle(params);
                },
                () => { },
                '用户上墙讨论',
                'confirm'
            )

        } else {
            this.textSwitchHandle(params);
        }

    }

    async textSwitchHandle(params) {
        let result = await this.props.textOrAudioSwitch(params);
    }




    /**
     *
     * 结束话题按钮
     *
     * @memberof BottomControlDialog
     */
    onEndTopicClick () {
        this.refs.overTopicDialog.show();
    }

    /**
     *
     * 结束话题处理
     *
     * @memberof BottomControlDialog
     */
    async endTopicHandle(tag) {
        if (tag === 'confirm') {
            await this.props.fetchEndTopic(this.props.topicId, true);
            this.refs.overTopicDialog.hide();
            window.location.reload(true);
        } else {
            this.refs.overTopicDialog.hide();
        }
    }


    toggleAppDownload () {
        if (this.props.isOpenAppDownload == 'Y') {
            window.confirmDialog('关闭后听众不显示千聊APP下载入口，确认关闭？', () => this.props.toggleAppDownloadOpen('N'));
        } else {
            window.confirmDialog('开启后听众将显示千聊APP下载入口', () => this.props.toggleAppDownloadOpen('Y'));
        }
    }

    get canShowCreateLive() {
        return !(this.props.power.allowMGTopic || this.props.power.allowSpeak) && this.props.hasNotLive && this.props.isLiveAdmin != 'Y';
    }

    gotoTopicIntro() {
        if (getQlchatVersion()) {
            locationTo(`qlchat://dl/live/topic/introduce?topicId=${this.props.topicId}`)
        } else if (this.isWeapp) {
            wx.miniProgram.redirectTo({ url: `/pages/intro-topic/intro-topic?topicId=${this.props.topicId}` });
        } else {
            locationTo(`/wechat/page/topic-intro?topicId=${this.props.topicId}${this.props.auditStatus ? '&auditStatus=' + this.props.auditStatus : ''}`)
        }
    }

    gotoMine() {
        if (this.isWeapp) {
            wx.miniProgram.redirectTo({ url: `/pages/index/index?key=mine` });
        } else {
            locationTo(`/wechat/page/mine?liveId=${this.props.liveId}`)
        }
    }

    showMoreCourse(){
        this.setState({clickMoreCourse: true})
        this.props.showCourseListDialog()
    }

    get canShowAppDownload() {
        let hadViewRecommond = false;

        if (typeof sessionStorage != 'undefined') {
            hadViewRecommond = /recommend/.test(sessionStorage.getItem('trace_page'))
        }

        const isNormal = /(normal|ppt)/.test(this.props.topicInfo.style);

        console.log(this.props.isLiveAdmin, this.props.isOfficialLive, this.props.isOpenAppDownload, hadViewRecommond);
        
        return hadViewRecommond || 
            (isNormal 
            && !this.props.power.allowMGTopic
            && this.props.isOpenAppDownload == 'Y' 
            && ((this.props.isLiveAdmin == 'Y' && this.props.isOfficialLive) || this.props.isLiveAdmin == 'N')
            && !this.isWeapp
            && this.props.isWhiteLive === 'N');
    }

    //获取是否开启评价
    getIsOpenEvaluate() {
        if (!getVal(this.props,'topicInfo.liveId','')) {
            return
        }
        return request({
            url: '/api/wechat/evaluation/getIsOpenEvaluate',
            method: 'GET',
            body: {
                liveId:this.props.topicInfo.liveId
            }
        }).then(res => {
            let isOpenEvaluate = getVal(res, 'data.isOpenEvaluate', '');
            this.setState({
                isOpenEvaluate:isOpenEvaluate=='Y'
            })
        })
    }

    // 获取是否收藏
    async isCollected(){
        return request({
            url: '/api/wechat/mine/isCollected',
            method: 'POST',
            body: {
                businessId: this.props.topicInfo.id,
                type: 'topic'
            }
        }).then(res => {
            if(res.state.code === 0){
                this.setState({
                    collected: res.data.isCollected === 'Y'
                });
            }
        })
    	
    }
    async collect(){
        if(this.state.collected){
            this.cancelCollect();
    		return false;
	    }
        return request({
            url: '/api/wechat/mine/addCollect',
            method: 'POST',
            body: {
                businessId: this.props.topicInfo.id,
                type: 'topic'
            }
        }).then(res => {
            if(res.state.code === 0){
                window.toast('收藏成功');
                this.setState({
                    collected: true
                });
            }else{
                window.toast(res.state.msg);
            }
        })
    	
    }

    async cancelCollect() {
        return request({
            url: '/api/wechat/mine/cancelCollect',
            method: 'POST',
            body: {
                businessId: this.props.topicInfo.id,
                type: 'topic'
            }
        }).then(res => {
            if(res.state.code === 0){
                window.toast('已取消收藏');
                this.setState({
                    collected: false
                });
            }else{
                window.toast(res.state.msg);
            }
        })
		
	}



    render() {
        const topicInfo = this.props.topicInfo;
        const isNormal = /(normal|ppt)/.test(topicInfo.style);
        const isInteraction = /(^audio|^video)$/.test(topicInfo.style);
        this.initDownloadAudioData();
        return (
            <div className={["bottom-control-dialog", this.props.customerClassName].join(' ')}>
                <div className="blank-area on-log"
                    onClick={this.props.onCloseSettings}
                    data-log-region="bottom-control-dialog"
                    data-log-pos="blank-area"
                    />
                <div className="close-top-dialog on-log"
                    onClick={this.props.onCloseSettings}
                    data-log-region="bottom-control-dialog"
                    data-log-pos="close-top-dialog-btn"
                    >
                    更多操作
                    <span className="icon_cross"></span>
                </div>
                <div className="main" id='bottom-control-main'>
                    {
                        this.canShowCreateLive && !this.isWeapp &&
                            <ul className="control-list">
                                <li className='icon-create on-log'
                                    onClick={ () => {locationTo(`/wechat/page/create-live?ch=create-live_topic_setting`)} }
                                    data-log-region="bottom-control-dialog"
                                    data-log-pos="create-btn"
                                    >
                                    <span className = "title">一键创建直播间</span>
                                </li>
                            </ul>
                    }
                    {
                        this.props.excludeItems.indexOf('gotoTop') < 0 && !/(videoLive|audioLive)$/.test(this.props.topicInfo.style)?
                        <ul className = "control-list">
                            <li className='icon-up on-log'
                                onClick = {this.props.loadFirstMsg}
                                data-log-region="bottom-control-dialog"
                                data-log-pos="up-btn"
                                >
                                <span className = "title">回顶部</span>
                            </li>
                            <li className='icon-down on-log'
                                onClick = {this.props.loadLastMsg}
                                data-log-region="bottom-control-dialog"
                                data-log-pos="down-btn"
                                >
                                <span className = "title">回底部</span>
                            </li>
                        </ul>
                        :null    
                    }

                    {
                        /(audio|video)$/.test(this.props.topicInfo.style)?
                        this.props.showLiveBox !== undefined &&
                        <ul className = "control-list">
                            <li className={`${this.props.showLiveBox?'icon-pack-up':'icon-pack-down'} on-log`}
                                onClick = {this.props.changgeLiveBox}
                                data-log-region="top-bar"
                                data-log-pos="switch-video-btn"
                                data-log-name={`${this.props.showLiveBox? '收起': '展开'}`}
                                data-log-business_id={this.props.topicInfo.id}
                                >
                                <span className = "title">
                                    {
                                        this.props.showLiveBox ? '收起' : '展开'
                                    }
                                </span>
                            </li>
                        </ul>
                        :/(ppt)$/.test(this.props.topicInfo.style)?
                        this.props.showLiveBox !== undefined &&
                        <ul className = "control-list">
                        {
                            (topicInfo.style === 'audio' || topicInfo.style === 'video') ?
                            <li className='icon-only-teacher on-log on-visible'
                                onClick={ this.toggleTeacherOnly }
                                data-log-region="bottom-control-dialog"
                                data-log-pos="only-teacher-btn"
                                >
                                <span className = "title">只看讲师</span>
                                <Switch
                                    className = "control-switch"
                                    size = 'md'
                                    active={ !!this.props.teacherOnly }
                                />
                            </li> :
                            null
                        }
                            <li className='icon-collapse on-log'
                                onClick = {this.props.changgeLiveBox}
                                data-log-region="top-bar"
                                data-log-pos="switch-video-btn"
                                data-log-name={`${this.props.showLiveBox? '收起': '幻灯'}`}
                                data-log-business_id={this.props.topicInfo.id}
                                >
                                <span className = "title">收起幻灯片</span>
                                <Switch
                                    className = "control-switch"
                                    size = 'md'
                                    active={ !this.props.showLiveBox }
                                />
                            </li>
                        </ul>
                        :null
                    }
                    <ul className="control-list">
                        {
                            (!(this.props.power.allowMGTopic||this.props.power.allowSpeak) && this.state.isOpenEvaluate && topicInfo.isAuditionOpen !== 'Y') ?
                            <li className='icon-appraise on-log'
                                onClick={ () => {locationTo(`/wechat/page/evaluation-create/${this.props.topicId}`)} }
                                data-log-name={'评价课程'}
                                data-log-region="bottom-control-dialog"
                                data-log-pos="appraise-btn"
                                >
                                    <span className="title">评价课程</span>
                                    <i className='icon_enter'></i>
                            </li>:null
                        }
                    </ul>
                    <ul className="control-list">
                        {/*/!* 课程列表 *!/*/}
                        {/*{*/}
                            {/*this.props.topicInfo.channelId && !(/(video|audio)$/.test(this.props.topicInfo.style)) &&*/}
                            {/*<li className='icon-list on-log'*/}
                                {/*onClick={this.showMoreCourse}*/}
                                {/*data-log-region="bottom-control-dialog"*/}
                                {/*data-log-pos="list-btn"*/}
                            {/*>*/}
                                {/*<span className="title">*/}
                                    {/*课程列表*/}
                                    {/*{(this.props.dot && !this.state.clickMoreCourse) && <span className="dot"></span>}*/}
                                {/*</span>*/}
                            {/*</li>*/}
                        {/*}*/}
                        {
                            /(videoLive|audioLive)$/.test(this.props.topicInfo.style)?
                                <li className='icon-home'
                                    onClick={() => {locationTo(`/wechat/page/live/${this.props.liveId}`)} }
                                >
                                    <span className="title">返回直播间</span>
                                </li>
                            :null
                        }
                        {
                            this.props.excludeItems.indexOf('liveIntro') < 0 && !this.props.isCampCourse && <li className='icon-details on-log on-visible'
                                onClick={this.gotoTopicIntro}
                                data-log-region="bottom-control-dialog"
                                data-log-pos="details-btn"
                            >
                                <span className="title">直播简介</span>
                            </li>
                        }

                        {
                            (this.props.power.allowMGTopic && topicInfo.status === 'beginning' && topicInfo.isRelay !== 'Y' && !/(videoLive|audioLive)$/.test(this.props.topicInfo.style))?
                            <li className='icon-man on-log on-visible'
                                onClick={ () => {locationTo(`/wechat/page/guest-list?topicId=${this.props.topicId}&liveId=${this.props.liveId}`)} }
                                data-log-region="bottom-control-dialog"
                                data-log-pos="invite-btn"
                                >
                                <span className = "title">邀请嘉宾</span>
                            </li>:null
                        }
                    </ul>
                    {
                        this.canShowAppDownload && 
                            <ul className='control-list'>
                                <li className='icon-app on-log'
                                    onClick={() => locationTo('http://a.app.qq.com/o/simple.jsp?pkgname=com.thinkwu.live')}
                                    data-log-region="bottom-control-dialog"
                                    data-log-pos="app-download-c">
                                    <span className='title'>下载APP听课</span>
                                </li>
                            </ul>
                    }
                    <ul className="control-list">
                        {
                            (topicInfo.style === 'audio' || topicInfo.style === 'video') ?
                            <li className='icon-only-teacher on-log on-visible'
                                onClick={ this.toggleTeacherOnly }
                                data-log-region="bottom-control-dialog"
                                data-log-pos="only-teacher-btn"
                                >
                                <span className = "title">只看讲师</span>
                                <Switch
                                    className = "control-switch"
                                    size = 'md'
                                    active={ !!this.props.teacherOnly }
                                />
                            </li> :
                            null
                        }

                        {
                            (this.props.power.allowMGTopic && topicInfo.status === 'beginning' && isNormal) ?
                            <li className='icon-openText on-log'
                                data-log-region="tab-menu"
                                data-log-pos={this.props.isTextOpen == 'Y' ? 'switch-open-discussion-true' : 'switch-open-discussion-false'}
                            ><span className = "title">用户上墙讨论</span>
                                <Switch
                                    className = "control-switch"
                                    size = 'md'
                                    active={this.props.isTextOpen === 'Y'}
                                    onChange={this.textSwitch}
                                />
                            </li>:null
                        }
                        {
                            (this.props.power.allowMGTopic && topicInfo.status === 'beginning' && isNormal)?
                            <li className='icon-openAudio on-log'
                                data-log-region="tab-menu"
                                data-log-pos={this.props.isAudioOpen == 'Y' ? 'switch-open-voice-true': 'switch-open-voice-false'}
                            ><span className = "title">用户语音发言</span>
                                <Switch
                                    className = "control-switch"
                                    size = 'md'
                                    active={this.props.isAudioOpen === 'Y'}
                                    onChange={this.audioSwitch}
                                />
                            </li>:null
                        }
                        {
                            this.props.power.allowMGTopic ?
                            <li className='icon-banned on-log on-visible'
                                data-log-region="bottom-control-dialog"
                                data-log-pos="mute-btn"
                                ><span className="title">禁言模式</span>
                                <Switch
                                    className = "control-switch"
                                    size = 'md'
                                    active={this.props.mute}
                                    onChange ={ this.onMuteButtonChange }
                                />
                            </li>:null
                        }
                        {
                            (this.props.power.allowMGTopic && !/(videoLive|audioLive)$/.test(this.props.topicInfo.style)) ?
                            <li className='icon-lucky-money on-log on-visible'
                                data-log-region="bottom-control-dialog"
                                data-log-pos="show-lucky-money-btn"
                                ><span className = "title">显示打赏信息</span>
                                <Switch
                                    className = "control-switch"
                                    active={this.props.showReword}
                                    size = 'md'
                                    onChange = {this.onShowRewordButtonChange}
                                />
                            </li>:null
                        }
                        {
                            (isNormal && this.isWeapp && this.props.power.allowMGTopic && this.props.isLiveAdmin == 'N') ?
                            <li className='icon-app on-log'
                                >
                                <span className = "title"
                                    onClick={() => locationTo('http://a.app.qq.com/o/simple.jsp?pkgname=com.thinkwu.live')}
                                    data-log-region="bottom-control-dialog"
                                    data-log-pos="app-download-b"
                                >
                                    180s高音质录音APP
                                </span>
                                {/* <Switch
                                    className = "control-switch"
                                    size = 'md'
                                    onChange={ this.toggleAppDownload }
                                    active={ this.props.isOpenAppDownload == 'Y' }
                                /> */}
                            </li> :
                            null
                        }
                    </ul>
                    {
                        (this.props.power.allowMGTopic && topicInfo.status === 'beginning') ?
                        <ul className="control-list">
                            <li className='icon-close on-log'
                                onClick={this.onEndTopicClick}
                                data-log-region="bottom-control-dialog"
                                data-log-pos="close-topic-btn"
                                >
                                <span className = "title">结束直播</span>
                            </li>
                        </ul> : null
                    }
                    <ul className="control-list">
                        {
                            (this.props.power.allowMGTopic && isNormal && this.props.isQlLive != 'Y') ?
                            <li
                                className={this.data.downloadAudioBtnClass}
                                onClick={ this.handleDownLoadAudioClick }
                                data-log-region="bottom-control-dialog"
                                data-log-pos="download-audio-btn"
                                >
                                <span className = "title">{this.data.downloadAudioBtnText}</span>
                            </li>:null
                        }
                        {
                            this.props.excludeItems.indexOf('shareFile') < 0 && ((isNormal || isInteraction ) && !this.isWeapp) ?
                            <li className='icon-file on-log'
                                onClick={ () => {locationTo(`/wechat/page/topic-docs?topicId=${this.props.topicId}`)} }
                                data-log-region="bottom-control-dialog"
                                data-log-pos="share-file-btn"
                                >
                                <span className = "title">共享文件</span>
                            </li>:null
                        }
                        {
                            (isNormal && topicInfo.isRelay !== 'Y') ?
                            <li className='icon-ask on-log'
                                onClick={ () => {locationTo(`/live/whisper/list.htm?topicId=${this.props.topicId}`)} }
                                data-log-region="bottom-control-dialog"
                                data-log-pos="ask-btn"
                                >
                                <span className = "title">私问</span>
                            </li>:null
                        }
                    </ul>
                    <ul className="control-list">
                        {
                            (this.props.power.allowMGTopic && topicInfo.type === 'encrypt' && topicInfo.isRelay !== 'Y') ?
                            <li className='icon-password on-log'
                                onClick={ () => {locationTo(`/wechat/page/topic-intro-edit?topicId=${this.props.topicId}&showPwdBox=Y`)} }
                                data-log-region="bottom-control-dialog"
                                data-log-pos="password-btn"
                                >
                                <span className = "title">密码设置</span>
                            </li>:null
                        }
                        
                        {
                            <li className={`on-log ${this.state.collected?'icon-collected':'icon-collect'}`}
                                onClick={this.collect}
                                data-log-region="bottom-control-dialog"
                                data-log-pos="favarite-btn"
                                >
                                <span className = "title">{this.state.collected && '已'}收藏</span>
                            </li>
                        }
                        {
                            !(this.props.power.allowMGTopic||this.props.power.allowSpeak)?
                            <li className='icon-report on-log'
                                onClick={ () => {locationTo(`/wechat/page/complain-reason?topicId=${this.props.topicId}&link=${typeof location != 'undefined' && encodeURIComponent(location.href)}`)} }
                                data-log-name="举报"
                                data-log-region="bottom-control-dialog"
                                data-log-pos="report-btn"
                                >
                                <span className = "title">举报</span>
                            </li>:null
                        }
                        {
                            (!(this.props.power.allowMGTopic||this.props.power.allowSpeak) && this.props.isLiveAdmin == 'N') ?
                            <li className='icon-return on-log'
                                onClick={ this.gotoMine }
                                data-log-region="bottom-control-dialog"
                                data-log-pos="return-btn"
                                >
                                <span className = "title">返回个人中心</span>
                            </li>:null
                        }
                        {
                            // !(this.props.power.allowMGTopic||this.props.power.allowSpeak) && this.props.hasNotLive || true?
                            // <li className='icon-create on-log'
                            //     onClick={ () => {locationTo(`/wechat/page/backstage`)} }
                            //     data-log-region="bottom-control-dialog"
                            //     data-log-pos="create-btn"
                            //     >
                            //     <span className = "title">一键创建直播间</span>
                            // </li>:null
                        }
                    </ul>
                </div>
                <Confirm
                    ref="downloadAudioConfirm"
                    buttons = 'confirm'
                    confirmText = '知道了'
                    onBtnClick = {this.hideDownloadAudioConfirm}
                >
                    <div className="download-audio-container">
                        <div className="header">
                            <span className="icon icon_cloud"></span>
                            <span>{ this.data.downloadAudioConfirmData.headText }</span>
                        </div>
                        <ul className="detail">
                            {
                                this.data.downloadAudioConfirmData.detail.map((content) => {
                                    return <li key={content}>{content}</li>
                                })
                            }
                        </ul>
                    </div>
                </Confirm>
                <Confirm
                    className="over-topic-dialog"
                    ref='overTopicDialog'
                    title={`结束直播`}
                    titleTheme='white'
                    buttonTheme='line'
                    buttons='cancel-confirm'
                    onBtnClick = {this.endTopicHandle}
                >
                    <ul className='over-topic-tips' >
                        <li>结束直播后，讲师嘉宾将不能继续发言。</li>
                        <li>结束本次直播，用户将从头开始回顾。</li>
                        <li>若在话题开播前结束直播，将导致该话题门票收益无法提现。</li>
                    </ul>
                </Confirm>
            </div>
        );
    }
}

BottomControlDialog.defaultProps = {
    excludeItems: [],
    customerClassName: ''
}

BottomControlDialog.propTypes = {
    // 直播间ID
    liveId: PropTypes.string.isRequired,
    // 话题ID
    topicId: PropTypes.string.isRequired,
    // 是否开启评价
    isEvaluationOpen: PropTypes.string,
    // 是否官方直播间
    isOfficialLive: PropTypes.bool,
    // 是否服务号白名单对应直播间
    isWhiteLive: PropTypes.oneOf(['Y', 'N']),
};


export default BottomControlDialog;
