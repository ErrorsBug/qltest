import Page from 'components/page';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import classNames from 'classnames';
import {getPushCourseInfo, addPush, pushTimeline} from '../../actions/course-info';
import {appPushInfo,allPushInfo, restPushTimes, getLiveInfo} from '../../actions/live'
import {getLivecenterTags} from 'actions/learn-everyday';
import {fetchIsAdminFlag} from '../../actions/live-studio';
import CourseSortDialog from './components/course-sort-dialog';
import PushRuleDialog from './components/push-rule-dialog';
import UseMethodDialog from './components/use-method-dialog';
import AddTagDialog from './components/add-tag-dialog';
import OfficialDialog from './components/official-dialog';
import GroupPushDialog from './components/group-push-dialog';
import { locationTo } from 'components/util';
import { request, isFunctionWhite, getCommunity } from 'common_actions/common';
import { modal,render } from 'components/indep-render';
import { createPortal } from "react-dom";
import { MiddleDialog } from 'components/dialog';
import { CopyToClipboard } from 'react-copy-to-clipboard';

@autobind
class LivePushMessage extends Component {
    state = {
        // 推荐语
        recommend: '',
        // 推荐语字数
        count: 0,
        // 类型
        type: '',
        // id
        businessId: '',
        // 直播间id
        liveId: '',
        // 是否是专业版
        isLiveAdmin: false,
        // 标签列表
        tagList: [],
        // 选中的课程分类对象
        tagObj: {},
        // 适合人群&其他标签列表
        customTagList: [],
        // 每天学推送信息
        qlchatInfo: {},
        // 服务号推送信息
        kaifangInfo: {},
        // 千聊课程推送信息
        kechengInfo: {},
        // 动态最大推送次数
        maxFeedPushNum: 0,
        // 动态剩余推送次数
        leftFeedPushNum: 0,
        // 是否选择每天学
        selectLearnEveryday: false,
        // 是否选择直播间动态
        selectLiveDynamic: false,
        // 是否选择自己的服务号
        selectService: false,
        // 是否选择千聊公众号矩阵
        selectQlCoursePush: false,
        selectGroupPush: false,

        // 是否选择短信
        selectSms: false,
        smsInfo: {},
        // 是否选择app
        selectApp: true,
        appPushInfoData: {},
        // 是否短信白名单
        isMsgWhite: false,
        isPushWhite:false,
        isRelatedGroup: false // 是否关联社群
    }

    data = {
        suitbleCount: 0,//适用人群已选的数量
        otherCount: 0//其他标签已选的数量
    }

    componentDidMount(){
        this.initType()
       
    }

    initType(){
        let channelId = this.props.location.query.channelId || ''
        let topicId = this.props.location.query.topicId || ''
        let campId = this.props.location.query.campId || ''
        let isSingleBuy = this.props.location.query.isSingleBuy || ''
        let type = ''
        let headImg = ''
        let title = ''
        if(campId){
            type = 'camp'
            headImg = this.props.campInfo.headImage
            title = this.props.campInfo.name
        }else if(!channelId || channelId && isSingleBuy == 'Y'){
            type = 'topic'
            headImg = this.props.topicInfo.backgroundUrl
            title = this.props.topicInfo.topic
        }else {
            type = 'channel'
            headImg = this.props.channelInfo.headImage
            title = this.props.channelInfo.name
        }
        let liveId = '', businessId = ''
        if(type == 'channel'){
            this.initLiveAdmin(this.props.channelInfo.liveId)
            liveId = this.props.channelInfo.liveId
            businessId = channelId
        }else if (type == 'topic'){
            this.initLiveAdmin(this.props.topicInfo.liveId)
            liveId = this.props.topicInfo.liveId
            businessId = topicId
        }else if(type == 'camp'){
            liveId = this.props.campInfo.liveId
            businessId = campId
        }
        this.setState({
            businessId,type,headImg,title,liveId
        }, () => {
            this.initSms();
            this.getPushTaskRecord();
            this.dispatchGetCommunity();
        })
        type !== 'camp'&&this.initAppPushInfo(liveId,type, businessId);//训练营暂不支持app推送
        this.initPushInfo(type, businessId);
        this.initPageInfo(liveId, businessId, type)
    }

    // app推送信息
    async initAppPushInfo(liveId,businessType, businessId){  
        const result = await Promise.resolve(appPushInfo({liveId,businessType,businessId}));   
        this.setState({
            appPushInfoData:  result.data.appPushInfo
        },()=>{  
            if(this.state.appPushInfoData.dayIsPush==='Y'||this.state.appPushInfoData.weekLeft==0||this.state.appPushInfoData.dayLeft==0){
                this.setState({
                    selectApp: false
                }) 
            }    
        })
        
        
    }
    
   
    async initSms() {
        let data = await isFunctionWhite(this.state.liveId, 'sms_push');
        this.setState({ isMsgWhite: data.isWhite === 'Y' });

        if (data.isWhite === 'Y') {
            request.post({
                url: '/api/wechat/transfer/h5/live/push/smsInfo',
                body: {
                    liveId: this.state.liveId,
                    businessType: this.state.type,
                    businessId: this.state.businessId,
                }
            }).then(res => {
                this.setState({
                    smsInfo: res.data || {}
                })
            }).catch(err => {
                // window.toast('获取短信配置失败')
            })
            
        }
    }

    async getPushTaskRecord() {
        let data = await isFunctionWhite(this.state.liveId, 'pushTaskRecord');
        this.setState({ isPushWhite: data.isWhite === 'Y' });
    }

    // 初始化推送信息
    async initPushInfo(type, businessId){
        const result = await Promise.all([allPushInfo(type, businessId),restPushTimes(type, businessId)])
        let {kaifangInfo = {}, qlchatInfo = {}, kechengInfo = {}} = result[0].data
        let {maxFeedPushNum, leftFeedPushNum} = result[1].data
        this.setState({ kaifangInfo, qlchatInfo, kechengInfo, maxFeedPushNum, leftFeedPushNum })
    }

    // 初始化页面数据，推送课程消息和标签列表
    async initPageInfo(liveId, businessId, businessType){
        const result = await Promise.all([getPushCourseInfo(liveId, businessId, businessType.toUpperCase()),getLivecenterTags()])
        let tagList = result[1].data && result[1].data.tagList || []
        let tagId = result[0].data && result[0].data.tagId || ''
        let tagObj = {}
        // 有选中的标签id，直接填充
        if(tagId){
            tagObj.id = tagId
            if(result[1].data && result[1].data.tagList.length > 0){
                tagList = result[1].data.tagList.map(iP => {
                    if(iP.childenList.length > 0){
                        let childenList = iP.childenList.map(iC => {
                            if(iC.id == tagId) {
                                tagObj.name = iC.name
                                return {...iC, active: true}
                            }else {
                                return {...iC}
                            }
                        })
                        return {...iP, childenList}
                    }else {
                        return {...iP}
                    }
                })
            }
        }
        let customTagList = this.initSelectCount(result[0].data.customTagList || [])
        this.setState({
            tagObj,
            customTagList,
            tagList
        })
        
        this.props.getLiveInfo(liveId);
    }

    // 初始化标签选中的个数
    initSelectCount(customTagList){
        this.data.suitbleCount = 0
        this.data.otherCount = 0
        if(customTagList.length < 1){
            return []
        }
        return customTagList.map(i => {
            if(i.type == 'CROWD' && i.isSelect == 'Y'){
                ++this.data.suitbleCount
            }
            if(i.type == 'OTHER_TAG' && i.isSelect == 'Y'){
                ++this.data.otherCount
            }
            return {
                ...i,
                _id: i.id//_id用于点选的时候用，因为新增的是没有id的，所以区分不出来
            }
        })
    }

    // 初始化判断是否是专业版
    async initLiveAdmin(liveId){
        const result = await this.props.fetchIsAdminFlag({liveId})
        if(result.state.code === 0){
            this.setState({isLiveAdmin: result.data.isLiveAdmin === 'Y'})
        }
    }

    //选中课程分类
    selectCourseSort(id){
        let tagList = this.state.tagList.map(iP => {
            if(iP.childenList.length > 0){
                let childenList = iP.childenList.map(iC => {
                    if(iC.id == id){
                        this.tagObj = {
                            name: iC.name,
                            id,
                        }
                        return {...iC, active: true}
                    }else {
                        return {...iC, active: false}
                    }
                })
                return {...iP,childenList}
            }else {
                return {...iP}
            }
        })
        this.setState({tagList})
    }

    // 确认选中课程分类
    selectTag(tagObj){
        this.setState({tagObj})
    }

    /**
     * 推送
     */
    async pushData(){
        if(this.lock){
            return
        }
        this.lock = true
        let {selectLearnEveryday, selectLiveDynamic, selectService, selectSms, selectApp, selectQlCoursePush, liveId, type, businessId, selectGroupPush} = this.state
        if(!selectLearnEveryday && !selectLiveDynamic && !selectService && !selectSms&& !selectApp && !selectQlCoursePush && !selectGroupPush){
            window.toast('未选择推送渠道')
            this.lock = false
            return false
        }
        // 只推送直播间动态
        if(selectLiveDynamic && !selectLearnEveryday && !selectService && !selectSms && !selectApp && !selectQlCoursePush && !selectGroupPush){
            this.pushDynamic(liveId, businessId, type, true)
        }else if (selectLearnEveryday || selectService || selectSms || selectApp || selectQlCoursePush || selectGroupPush){
            this.pushMessage()
        }
    }

    /**
     * 发布推送
     * @param {*} type 
     * @param {*} id 
     * @param {*} liveId 直播间id
     * @param {*} only 是否只发布推送
     */
    async pushMessage(){
        let {selectLiveDynamic, recommend, selectLearnEveryday, selectService, selectSms, selectApp, selectQlCoursePush, customTagList, businessId, tagObj, liveId, type, selectGroupPush} = this.state
        let typeList = []
        if(selectLearnEveryday){
            typeList.push('qlchat')
            // 如果选择了每天学，则课程分类必填
            if(!tagObj.id){
                window.toast('请选择课程分类！')
                this.lock = false
                return
            }
        }
        if(selectService){
            typeList.push('kaifang')
        }
        if (selectSms) {
            typeList.push('sms')
        }
        if (selectQlCoursePush) {
            typeList.push('kecheng')
        }
        if (selectApp) {
            typeList.push('app')
        } 
        if (selectGroupPush) {
            typeList.push('community');
        }
        // 去除customTagList中每一项的_id
        if(customTagList.length > 0){
            customTagList = customTagList.map(i => {
                delete i._id
                return i
            })
        }
        let params = {
            liveId,
            typeList,
            businessId,
            businessType: type.toUpperCase(),
            recommend,
        }
        // 勾选了每天学，则加上这两个字段
        if(selectLearnEveryday){
            params.tagId = tagObj.id,
            params.customTagList = customTagList
        }
        const result = await addPush(params)
        if(result.state.code === 0){
            if(selectLiveDynamic){
                this.pushDynamic(liveId, businessId, type)
            }else {
                window.toast(`推送成功`)
                this.goBack()
            }
        }else {
            if(selectLiveDynamic){
                this.pushDynamic(liveId, businessId, type, false, result.state.msg)
            }else {
                window.toast(result.state.msg)
            }
        }
        this.lock = false
    }

    /**
     * 发布动态
     * @param {*} liveId 直播间id
     * @param {*} relateId 业务id
     * @param {*} relateType 业务类型
     * @param {*} only 是否只发布动态
     * @param {*} loseReason 推送失败原因，为空表示推送成功
     */
    async pushDynamic(liveId, relateId, relateType, only = false, loseReason = ''){
        const result = await pushTimeline(this.state.recommend, liveId, relateId, relateType)
        let msg = ''
        if(result.state.code === 0 && result.data.code === 0){
            if(only){
                msg = '动态发布成功'
            }else {
                if(loseReason){
                    msg = `推送失败：${loseReason}；\n动态发布成功`
                }else{
                    msg = `推送成功，动态发布成功`
                }
            }
            window.toast(msg)
            this.goBack()
        }else {
            const failMsg = result.data ? result.data.msg : result.state.msg
            if(only){
                msg = `${failMsg}`
            }else {
                if(loseReason){
                    msg = `推送失败：${loseReason}；\n ${failMsg}`
                }else{
                    msg = `推送成功；\n ${failMsg}`
                }
            }
            window.toast(msg)
            this.goBack()
        }
        this.lock = false
    }

    // 返回上一页
    goBack(){
        setTimeout(()=>{
            window.history.go(-1)
        }, 1000)
    }

    // 输入推荐语
    textareaInput(e){
        let value = e.target.value.trim()
        let recommend = '', count = 0
        if(value.length > 26) {
            recommend = value.slice(0, 26)
            count = 26
        } else {
            recommend = value
            count = value.length
        }
        this.setState({recommend, count})
    }

    // 显示课程分类弹窗
    showCourseSortDialogEle(){
        if(this.state.tagList.length < 1){
            window.toast('暂无课程分类！')
            return
        }
        this.courseSortDialogEle.show()
    }

    // 显示社群推送弹窗
    showGroupPushDialogEle() {
        this.GroupPushDialogEle.show();
    }

    // 选中适用人群和其他标签
    selectCustomTag(i){
        // 取消选中
        if(i.isSelect == 'Y'){
            if(i.type == 'CROWD'){
                --this.data.suitbleCount
            }else if(i.type == 'OTHER_TAG'){
                --this.data.otherCount
            }
        // 选中
        }else {
            if(i.type == 'CROWD'){
                if(this.data.suitbleCount >= 3 ){
                    window.toast('适用人群最多只能选三个！')
                    return
                }else {
                    ++this.data.suitbleCount
                }
            }else if(i.type == 'OTHER_TAG'){
                if(this.data.otherCount >= 4 ){
                    window.toast('其他标签最多只能选四个！')
                    return
                }else {
                    ++this.data.otherCount
                }
            }
        }
        let customTagList = this.state.customTagList.map(t => {
            if(t._id == i._id){
                return {...t, isSelect: i.isSelect == 'Y' ? 'N' : 'Y'}
            }else {
                return {...t}
            }
        })
        this.setState({customTagList})
    }

    // 增加自定义标签
    addTag(tag){
        let customTagList = this.state.customTagList.concat(tag)
        this.setState({customTagList})
    }

    // 提示信息
    prompt(message) {
        window.simpleDialog({
            msg: message,
            buttons: 'confirm'
        });
    }

    gotRecordPage() {
        locationTo(`/wechat/page/channel-topic-statistics?tabType=push&businessId=${this.state.businessId}&businessType=${this.state.type}`)
    }
    
    async dispatchGetCommunity() {
        let type = this.state.type;
        if(type === 'camp') type = 'liveCamp';
        const res = await getCommunity(this.state.liveId, type, this.state.businessId);
        if(res) {
            this.setState({
                isRelatedGroup: res.showStatus === 'Y' ? true : false
            });
        }
    }

    render(){
        const { recommend, isLiveAdmin, count, type, title, headImg, tagList,tagObj, customTagList, qlchatInfo, kaifangInfo, kechengInfo, maxFeedPushNum, leftFeedPushNum, selectLearnEveryday, selectLiveDynamic, selectService, liveId, isMsgWhite,isPushWhite, selectGroupPush } = this.state
        let _type = ''
        if(type === 'topic'){
            _type = '话题'
        }else if(type === 'channel'){
            _type = '系列课'
        }else if(type === 'camp'){
            _type = '打卡'
            // _type = '训练营'
        }else if(type === 'liveCamp') {
            _type = '打卡'
        } else if(type === 'training') {
            _type = '训练营'
        }
        return (
            <Page title={'推送课程'} className='live-push-message'>
                <div className="push-message-container">
                    <div className="part">
                        <div className="header">
                            <div className="label red-dot">您正在推送{_type}</div>
                            {
                                isPushWhite?
                                    <div className="push-rule" onClick={this.gotRecordPage}>推送记录 <b className='icon_enter'></b></div>
                                :null
                            }
                        </div>
                        <div className="course">
                            <img className="course-img" src={headImg} alt=""/>
                            <div className="course-title">{title}</div>
                        </div>
                    </div>
                    <div className="placeholder-rect"></div>
                    <div className="part">
                        <div className="header">
                            <div className="label red-dot">推送渠道</div>
                        </div>
                        <div className="select">
                        
                            {/* <div className="item disabled-item">
                                <div className="s_i"><div className="select-item disabled">微信群</div></div>
                                <var className="tips">玩命开发中，敬请期待…</var>
                            </div> */}
                            {
                                type!=='camp'&&
                                <AppPushEle
                                appPushInfoData={this.state.appPushInfoData}
                                checked={this.state.selectApp} 
                                isLiveAdmin={this.state.isLiveAdmin}
                                onClick={() => this.setState({selectApp: !this.state.selectApp})}
                                liveInfo={this.props.liveInfo}
                                businessName={title}
                                />
                               
                            }
                            {
                                isMsgWhite?
                                <SmsSelectEle
                                    smsInfo={this.state.smsInfo}
                                    checked={this.state.selectSms}
                                    disabled={!(this.state.smsInfo.leftNum > 0) || !(this.state.smsInfo.liveTodaySmsPushNum > 0)}
                                    isLiveAdmin={this.state.isLiveAdmin}
                                    onClick={() => this.setState({selectSms: !this.state.selectSms})}
                                    liveInfo={this.props.liveInfo}
                                    businessName={title}
                                    liveId={liveId}
                                />:null
                            }
                            {
                                type !== 'camp' &&
                                <QlCoursePush
                                    selectQlCoursePush={this.state.selectQlCoursePush}
                                    kechengInfo={kechengInfo}
                                    type={type}
                                    typeStr={_type}
                                    isLiveAdmin={isLiveAdmin}
                                    methodDialogClick = {()=>{this.OfficialDialogEle.show()}}
                                    onClick={() => this.setState({selectQlCoursePush: !this.state.selectQlCoursePush})}
                                />
                            }
                            {/* 每天学 */}
                            <LearnEveryDaySelectEle 
                                type = {type}
                                qlchatInfo = {qlchatInfo}
                                methodDialogClick = {()=>{this.useMethodDialogEle.show()}}
                                learnEverydaySelect = {(event)=>{
                                    if (event.target.className.indexOf('use-method') < 0) {
                                        this.setState({selectLearnEveryday: !this.state.selectLearnEveryday});
                                    }
                                }}
                                selectLearnEveryday = {selectLearnEveryday}
                                isLiveAdmin = {isLiveAdmin}
                            />
                            {
                                selectLearnEveryday &&
                                <div className="course-message-container">
                                        <div className="select-category">
                                            <div className="label" onClick={() => {
                                                this.prompt('准确的分类标签，可以使推送更精准');
                                            }}><span>课程分类</span><i className="icon_why"></i></div>
                                            <div className={`select-icon${tagObj.name ? '' : ' empty'}`} onClick={this.showCourseSortDialogEle}>{tagObj.name || '请选择'} <span className="icon_enter"></span></div>
                                        </div>
                                        <div className="suitble-people">
                                            <div className="label">
                                                <span className="left" onClick={() => {
                                                this.prompt('选择合适的适用人群，吸引学员快速选择课程');
                                            }}><span>适用人群</span><i className="icon_why"></i><em>(最多3个)</em></span>
                                                <span className="custom-item custom" onClick={()=>{this.addTagDialogEle.show('CROWD')}}>+自定义</span>
                                            </div>
                                            <div className="group">
                                                {
                                                    customTagList.length > 0 && customTagList.map((i,d) => {
                                                        if(i.type == 'CROWD'){
                                                            return (
                                                                <span className={`tag-item${i.isSelect == 'Y' ? ' select' : ''}`} key={`l-${d}`} onClick={()=>{this.selectCustomTag(i)}}>{i.name}</span>
                                                            )
                                                        }
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div className="other-label">
                                            <div className="label">
                                                <span className="left" onClick={() => {
                                                this.prompt('此处标签会显示在推送头图');
                                            }}><span>其他标签</span><i className="icon_why"></i><em>(最多4个)</em></span>
                                                <span className="custom-item custom" onClick={()=>{this.addTagDialogEle.show('OTHER_TAG')}}>+自定义</span>
                                            </div>
                                            {
                                                customTagList.length > 0 &&
                                                <div className="group">
                                                {
                                                    customTagList.map((i, d) => {
                                                        if(i.type == 'OTHER_TAG'){
                                                            return (
                                                                <span className={`tag-item${i.isSelect == 'Y' ? ' select' : ''}`} key={`l-${d}`} onClick={()=>{this.selectCustomTag(i)}}>{i.name}</span>
                                                            )
                                                        }
                                                    })
                                                }
                                                </div>
                                            }
                                        </div>
                                    </div>
                            }
                            {/* 自己的服务号 */}
                            <ServiceSelectEle 
                                type = {type}
                                kaifangInfo = {kaifangInfo}
                                selectService = {selectService}
                                isLiveAdmin = {isLiveAdmin}
                                liveId={liveId}
                                serviceClick = {()=>{this.setState({selectService: !this.state.selectService})}}
                            />

                            <GroupPush 
                                methodDialogClick={this.showGroupPushDialogEle}
                                isRelatedGroup={this.state.isRelatedGroup}
                                selectGroupPush={selectGroupPush}
                                groupClick={() => {this.setState({selectGroupPush: !this.state.selectGroupPush})}}
                                type={type}
                            />
                            {/* 直播间动态 */}
                            {/*<LiveDynamic 
                                maxFeedPushNum = {maxFeedPushNum}
                                leftFeedPushNum = {leftFeedPushNum}
                                selectLiveDynamic = {selectLiveDynamic}
                                liveDynamicClick = {()=>{this.setState({selectLiveDynamic: !this.state.selectLiveDynamic})}}
                            />*/}
                        </div>
                    </div>
                    <div className="placeholder-rect"></div>
                    <div className="part recommend-text-part">
                        <div className="header">
                            <div className="label">推荐语</div>
                        </div>
                        <div className="textarea-container">
                            <textarea placeholder="请输入课程推荐语，将发布在推送消息中，可以提升课程吸引力~" value={recommend} onChange={this.textareaInput}></textarea>
                            <span className="num">{count}/26</span>
                        </div>
                    </div>
                </div>
                <div className="bottom-content">
                    <div className="btn cancel" onClick={()=>{ window.history.go(-1)}}>取消</div>
                    <div className={`btn confirm`} onClick={this.pushData.bind(this)}>确认发布</div>
                </div>

                {/* 推送规则弹窗 */}
                <PushRuleDialog ref={el => this.pushRuleDialogEle = el} />
                

                <OfficialDialog ref={el => this.OfficialDialogEle = el} />
                
                <GroupPushDialog isRelated={this.state.isRelatedGroup} ref={el => this.GroupPushDialogEle = el} />

                {/* 课程分类弹窗 */}
                <CourseSortDialog 
                    ref = {el => this.courseSortDialogEle = el}
                    tagList = {tagList}
                    tagObj = {tagObj}
                    selectCourseSort = {this.selectCourseSort}
                    selectTag = {this.selectTag}
                />

                {/* 适用攻略弹窗 */}
                <UseMethodDialog ref={el => this.useMethodDialogEle = el}/>

                {/* 新增自定义标签弹窗 */}
                <AddTagDialog 
                    ref={el => this.addTagDialogEle = el}
                    addTag = {this.addTag}
                />
            </Page>
        )
    }
}

// 每天学选择组件
const LearnEveryDaySelectEle = (
{
    type,
    qlchatInfo,
    isLiveAdmin,
    methodDialogClick,
    learnEverydaySelect,
    selectLearnEveryday,
}) => {
    if(type == 'camp' || type === 'topic'){
        // 最近有推过或者没有剩余次数则显示disabled
        if(qlchatInfo.lastPushTime || (qlchatInfo.pushedNum >= qlchatInfo.totalNum && qlchatInfo.pushedNum != 0)){
            return (
                <div className='item disabled-item'>
                    <div className="s_i">
                        <div className={`select-item disabled`}>我的订阅(原"每天学")</div>
                        <span className="use-method" onClick={methodDialogClick}>规则</span>
                    </div>
                    {
                        (qlchatInfo.pushedNum >= qlchatInfo.totalNum && qlchatInfo.pushedNum != 0) ? 
                        <var className="tips">{type == 'camp' ? '该训练营' : `该话题`}每周总共{qlchatInfo.totalNum}次机会，{type == 'camp' ? '本周' : ''}还剩{qlchatInfo.totalNum - qlchatInfo.pushedNum}次</var>:
                        qlchatInfo.lastPushTime ? 
                        <var className='tips'>{qlchatInfo.oneInterval}小时内只能推1次</var>
                        :null
                    }
                </div>
            )
        }else {
            return (
                <div className={`item ${selectLearnEveryday ? 'active' : ''}`} onClick={learnEverydaySelect}>
                    <div className="s_i">
                        <div className={`select-item`}>我的订阅(原"每天学")</div>
                        <span className="use-method" onClick={methodDialogClick}>规则</span>
                    </div>
                    <var className="tips">{type == 'camp' ? '该训练营' : `该话题`}每周总共{qlchatInfo.totalNum}次机会，{type == 'camp' ? '本周' : ''}还剩{qlchatInfo.totalNum - qlchatInfo.pushedNum}次</var>
                </div>
            )
        }
    } else if (type === 'channel'){
        // 最近有推过或者没有剩余次数则显示disabled
        if(qlchatInfo.lastPushTime || (!qlchatInfo.weekLeft && qlchatInfo.weekSum)){
            return (
                <div className='item disabled-item'>
                    <div className="s_i">
                        <div className={`select-item disabled`}>我的订阅(原"每天学")</div>
                        <span className="use-method" onClick={methodDialogClick}>规则</span>
                    </div>
                    {
                        (!qlchatInfo.weekLeft && qlchatInfo.weekSum) ? 
                        <var className="tips">该系列课每周总共{qlchatInfo.weekSum}次机会，本周还剩{qlchatInfo.weekLeft}次</var>:
                        qlchatInfo.lastPushTime ? 
                        <var className='tips'>{qlchatInfo.oneInterval}小时内只能推1次</var>
                        :null
                    }
                </div>
            )
        }else {
            return (
                <div className={`item ${selectLearnEveryday ? 'active' : ''}`} onClick={learnEverydaySelect}>
                    <div className="s_i">
                        <div className={`select-item`}>我的订阅(原"每天学")</div>
                        <span className="use-method" onClick={methodDialogClick}>规则</span>
                    </div>
                    <var className="tips">该系列课每周总共{qlchatInfo.weekSum}次机会，本周还剩{qlchatInfo.weekLeft}次</var>
                </div>
            )
        }
    }else {return ''}
}

class SmsSelectEle extends React.Component {
    render() {
        const cln = classNames('item', {
            active: this.props.checked,
            'disabled-item': this.props.disabled
        })

        const { smsInfo, isLiveAdmin, liveId } = this.props;
        const smsPushInterval = Math.round((smsInfo.smsPushInterval || 0) / 3600);

        return <div className={cln} onClick={this.onClick}>
            <div className="s_i">
                <div className={`select-item`}>短信<span className="desc">（专业版免费用）</span></div>
                {
                    isLiveAdmin ?
                    <span className="use-method" onClick={this.onClickExample}>短信示例</span>
                    :
                    <span className="use-method" onClick={() => locationTo(`/topic/live-studio-intro?liveId=${ liveId }`)}>升级为专业版</span>
                }
            </div>
            <var className="tips">为所有关注直播间的粉丝进行短信推送，{smsPushInterval}小时内推送1次，还剩{smsInfo.liveTodaySmsPushNum || 0}次</var>
            {
                this.props.checked &&
                <div className="item-desc">
                    <p>当前直播间粉丝数<span className="red">{smsInfo.followerNum || 0}</span></p>
                    <p>其中<span className="red">{smsInfo.sendNum || 0}</span>粉丝学员有手机号且接受订阅</p>
                    <p>系统将发送<span className="red">{smsInfo.sendNum || 0}</span>条推送短信，剩余短信<span className="red">{smsInfo.leftNum || 0}</span>条<span className="red">（发送数为预估值，具体以短信流水为准）</span></p>
                </div>
            }
        </div>
    }

    onClick = () => {
        if (!this.props.disabled) this.props.onClick();
    }

    onClickExample = e => {
        e.stopPropagation();

        modal({
			className: 'dialog-modal push-message-example',
            close: true,
            title: '短信示例',
            children: <div className="example-content" style={{textAlign: 'left'}}>
                <p style={{color: '#666'}}>{this.props.smsInfo.smsContent || ''}</p>
                <p className="desc">（短信因服务商限制，不可使用自定义推荐语，仅可使用标准模板推送）</p>
            </div>,
            buttons: 'confirm',
        })
    }
}

class AppPushEle extends React.Component {
    state={
        isShow:false
    }
    render() {
        const cln = classNames('item', {
            active: this.props.checked 
        })

        const { appPushInfoData } = this.props;
          
        //  每日用完直接显示disabled
           return (
                <div> 
                    {
                        (appPushInfoData.weekLeft==0||appPushInfoData.dayLeft==0||appPushInfoData.dayIsPush=='Y')?
                        <div className='item disabled-item'>
                            <div className="s_i">
                                <div className={`select-item`}>APP推送<span className="desc">（ <img className="push-addvice" src={require("./img/push-addvice.png")}/> 建议 ）</span></div>
                                <span className="use-method" onClick={()=>{this.setState({isShow:true})}}>规则</span>
                            </div>
                            {
                                    appPushInfoData.weekLeft==0 ?
                                    <var className="tips">该课本周推送次数已用完</var>
                                    :appPushInfoData.dayLeft==0 ?
                                    <var className="tips">直播间今日已用完APP推送机会</var>
                                    :<var className="tips">24小时内只能推送1次</var>
                                }
                            
                        </div>
                        : 
                        <div className={cln} onClick={this.onClick}>
                            <div className="s_i">
                            <div className={`select-item`}>APP推送<span className="desc">（ <img className="push-addvice" src={require("./img/push-addvice.png")}/> 建议 ）</span></div>
                                <span className="use-method" onClick={()=>{this.setState({isShow:true})}}>规则</span>
                            </div>
                            <var className="tips"> 已安装APP的用户可从手机上接收到你的课程推送。 该课每周有{appPushInfoData.weekSum|| 0}次机会,本周还剩{appPushInfoData.weekLeft || 0}次。</var> 
                        </div>
                    }
                   { createPortal(
                        <MiddleDialog 
                            show={this.state.isShow} 
                            buttonTheme="line" 
                            className={classNames( 'dialog-modal push-app-example' )}
                        >
                            <div className="bg" onClick={this.onClose}></div>
                            <div className="example-content">
                                <div className="content">
                                    <div className="co-dialog-title white">什么是APP推送?</div>
                                    <p className="p">选择该项后,已安装千聊APP的用户可在手机上获得您的课程推送(<span className="red">锁屏、手机通知栏</span>都可以收到) , 让您的课程获得更多的曝光机会。<span className="important">84%</span> 的直播间使用后,有效提升了课程转化。</p>

                                    <div className="co-dialog-title white">推送规则</div>
                                    <p className="p" style={{position:'relative',paddingLeft:'1em'}}><span style={{position:'absolute',left: 0,color:'#333'}}>1.</span>设置推送后,系统将于每天上班时间、中午休息时间、晚上下班时间、夜间学习高峰时间,向你的学员推送你的课程。<span className="important">(非实时推送)</span></p>
                                    <p className="p" style={{position:'relative',paddingLeft:'1em'}}><span style={{position:'absolute',left: 0,color:'#333'}}>2.</span>每个课程/系列课一周有<span className="important">{this.props.appPushInfoData.weekSum|| 0}</span>次推送机会,间隔时间需大于<span className="important">24</span>小时；直播间每天有<span className="important">{this.props.appPushInfoData.daySum|| 0}</span>次推送机会。</p>
                                    
                                    <div className="app-tips">温馨提示：千聊APP是千聊为各直播间提供的额外销售渠道，千聊不收取手续费。 但<span className="red">iOS客户端</span>的学员购买，苹果公司会收取<span className="red">32%</span>的抽成，您将获得剩余部分的收益。</div>
                                </div>

                                <div className="footer">
                                    <div className="co-dialog-btn-line">
                                    <CopyToClipboard  className='co-dialog-btn-line-confirm'
                                        text={"https://a.app.qq.com/o/simple.jsp?pkgname=com.thinkwu.live"}
                                        onCopy={ () =>{
                                            this.onClose()
                                            window.toast(`复制成功`)
                                            
                                        }}
                                    >
                                        <span> 复制APP下载链接  </span> 
                                    </CopyToClipboard>
                                    </div> 
                                    <div className="btn-tips">可复制链接发送给学员,以便快速下载</div>
                                </div>
                            </div>
                        </MiddleDialog>,
                        document.getElementById("app"))}
               </div>
           )
       
    }
    onClose = () => {
        this.setState({
            isShow:false
        })  
    }
    onClick = () => {
        if (!this.props.disabled) this.props.onClick();
    }  
}
// 自己的服务号选择组件
const ServiceSelectEle = (
{
    type, 
    kaifangInfo,
    selectService,
    serviceClick,
    isLiveAdmin,
    liveId
}) => {
    // 选择事件
    const serviceEleClick = (bol) => {
        if(bol){
            return
        }
        serviceClick && serviceClick()
    }

    // 未绑定三方直接显示disabled
    if(!kaifangInfo.isBindKaifang) {
        return (
            <div className='item disabled-item'>
                <div className="s_i">
                    <div className={`select-item disabled`}>自己的服务号</div>
                    <span className='use-method' onClick={()=>{locationTo(`http://kaifang.qlchat.com/wechatAccess/mobile/preJoinUp.htm?liveId=${liveId}`)}}>立即对接</span>
                </div>
                <var className="tips">您尚未对接服务号</var>
            </div>
        )
    }
    if((type === 'camp' || type === 'topic') && kaifangInfo && kaifangInfo.isBindKaifang) {
        let disabled = kaifangInfo.lastPushTime || kaifangInfo.pushedNum >= kaifangInfo.totalNum
        return (
            <div className={`item ${selectService ? 'active' : ''}`} onClick={()=>{serviceEleClick(disabled)}}>
                <div className="s_i">
                    <div className={`select-item ${disabled? 'disabled':''}`}>自己的服务号</div>
                </div>
                {
                    kaifangInfo.lastPushTime ? 
                    <var className="tips">24小时内只能推1次</var>:
                    kaifangInfo.pushedNum >= kaifangInfo.totalNum ? 
                    <var className='tips'>本周次数已用完</var>
                    :<var className='tips'>{type == 'camp' ? '该训练营每周' : `${isLiveAdmin ? '您是专业版，' : ''}该话题`}总共{kaifangInfo.totalNum}次机会，{type == 'camp' ? '本周' : ''}还剩{kaifangInfo.totalNum - kaifangInfo.pushedNum}次</var>
                }
            </div>
        )
    }else if(type === 'channel' && kaifangInfo && kaifangInfo.isBindKaifang) {
        let disabled = kaifangInfo.lastPushTime || !kaifangInfo.weekLeft && kaifangInfo.weekSum > 0
        return (
            <div className={`item ${selectService ? 'active' : ''}`} onClick={()=>{serviceEleClick(disabled)}}>
                <div className="s_i">
                    <div className={`select-item ${disabled ? 'disabled':''}`}>自己的服务号</div>
                </div>
                {
                    kaifangInfo.lastPushTime ? 
                    <var className="tips">24小时内只能推1次</var>:
                    !kaifangInfo.weekLeft && kaifangInfo.weekSum > 0 ? 
                    <var className='tips'>本周次数已用完</var>
                    :<var className='tips'>{isLiveAdmin ? '您是专业版，' : ''}该系列课每周总共{kaifangInfo.weekSum}次机会，本周还剩{kaifangInfo.weekLeft}次</var>
                }
            </div>
        )
    }else {return ''}
}

// 直播间动态选择组件
const LiveDynamic = ({
    maxFeedPushNum, leftFeedPushNum, selectLiveDynamic, liveDynamicClick
}) => {
    let disabled = maxFeedPushNum > 0 && !leftFeedPushNum
    const click = (bol) => {
        if(bol) return
        liveDynamicClick && liveDynamicClick()
    }
    return (
        <div className={`item ${selectLiveDynamic ? 'active' : ''}`} onClick={()=>{click(disabled)}}>
            <div className="s_i">
                <div className={`select-item ${disabled ? 'disabled' : ''}`}>直播间动态</div>
            </div>
            <var className="tips">直播间动态推送次数总共{maxFeedPushNum}次，还剩{leftFeedPushNum}次</var>
        </div>
    )
}

// 千聊公众号矩阵推送
const QlCoursePush = ({
    selectQlCoursePush,
    kechengInfo, 
    type,
    isLiveAdmin,
    typeStr,
    methodDialogClick,
    onClick
}) => {
    let disabled = false
    let weekSum = 0
    let weekLeft = 0
    if(type === 'topic'){
        // 最近有推过或者没有剩余次数则显示disabled
        if(kechengInfo.lastPushTime || (kechengInfo.pushedNum >= kechengInfo.totalNum && kechengInfo.pushedNum != 0)){
            disabled = true
        }
        weekSum = kechengInfo.totalNum
        weekLeft = kechengInfo.totalNum - kechengInfo.pushedNum
    } else if (type === 'channel'){
        // 最近有推过或者没有剩余次数则显示disabled
        if(kechengInfo.lastPushTime || (!kechengInfo.weekLeft && kechengInfo.weekSum)){
            disabled = true
        }
        weekSum = kechengInfo.weekSum
        weekLeft = kechengInfo.weekLeft
    }
    if (weekLeft < 0) {
        weekLeft = 0;
    }

    const click = (bol) => {
        if(bol) return
        onClick && onClick()
    }
    if (disabled) {
        return (
            <div className={`item disabled-item`}>
                <div className="s_i">
                    <div className={`select-item`}>千聊公众号矩阵</div>
                    <span className="use-method" onClick={methodDialogClick}>规则</span>
                </div>
                {
                    isLiveAdmin ? 
                    <var className="tips">您是专业版，已关注千聊公众号矩阵的粉丝可以接收到推送。该{typeStr}每周共{weekSum}次机会，本周还剩{weekLeft}次</var>
                    :
                    <var className="tips">已关注千聊公众号矩阵的粉丝，可以接收推送。该{typeStr}每周共{weekSum}次机会，本周还剩{weekLeft}次</var>
                }
            </div>
        )
    }
    return (
        <div className={`item ${selectQlCoursePush ? 'active' : ''}`} onClick={()=>{click(disabled)}}>
            <div className="s_i">
                <div className={`select-item`}>千聊公众号矩阵</div>
                <span className="use-method" onClick={methodDialogClick}>规则</span>
            </div>
            {
                isLiveAdmin ? 
                <var className="tips">您是专业版，已关注千聊公众号矩阵的粉丝可以接收到推送。该{typeStr}每周共{weekSum}次机会，本周还剩{weekLeft}次</var>
                :
                <var className="tips">已关注千聊公众号矩阵的粉丝，可以接收推送。该{typeStr}每周共{weekSum}次机会，本周还剩{weekLeft}次</var>
            }
        </div>
    )
}

//  推送社群
const GroupPush = ({methodDialogClick, isRelatedGroup, selectGroupPush, groupClick, type}) => {
    const disabled = (!isRelatedGroup)
    console.log(selectGroupPush);
    return (
        <div className={[`item`, disabled ? `disabled-item` : null, selectGroupPush ? 'active' : null].join(' ')} onClick={() => { if(disabled) return; groupClick && groupClick()}}>
            <div className="s_i">
                <div className={[`select-item`, disabled ? 'disabled': null].join(' ')}>课程社群</div>
                <span className="use-method" onClick={methodDialogClick}>规则</span>
            </div>
            <var className="tips">可向课程微信群里的学员进行消息推送，{type === 'channel' ? '每周2次机会' : '每日3次机会'}</var> 
        </div>
    );
}

function mapStateToProps (state) {
    return {
        topicInfo: state.courseInfo.topicInfo,
        channelInfo: state.courseInfo.channelInfo,
        campInfo: state.courseInfo.campInfo,
        liveInfo: state.live.liveInfo,
    }
}

const mapActionToProps = { 
    fetchIsAdminFlag,
    getLiveInfo,
}

export default connect(mapStateToProps, mapActionToProps)(LivePushMessage);