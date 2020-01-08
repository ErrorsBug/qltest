import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import {imgUrlFormat,formatMoney,dangerHtml,locationTo} from 'components/util';
import Detect from 'components/detect';
import SpeakMsgContainer from './speak-msg-container'
import { autobind } from 'core-decorators';
import RewordCard from './speak-msg-reward-card';
// import shallowCompare from 'react-addons-shallow-compare';



/**
 *
 * 文本消息
 * @export
 * @class TextItem
 * @extends {Component}
 */
@autobind
export class TextItem extends PureComponent {

    addLink(content){
        var linkReg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#\*]*[\w\-\@?^=%&/~\+#\*])?/gi;
        var reContent = content,
            hasHttp = "",
            linkArr;
        let __html = reContent.__html;
        if(linkReg.test(__html)){
            linkArr = __html.match(linkReg);
            for(let ia1 in linkArr){
                __html = __html.replace(linkArr[ia1],"@lA"+ia1+"@");
            };
            for(let ia2 in linkArr){
                if(/(http|https|ftp)/.test(linkArr[ia2])){
                    hasHttp="";
                }else{
                    hasHttp="http://";
                };
                __html = __html.replace("@lA"+ia2+"@","<a href='"+hasHttp+linkArr[ia2]+"' >"+linkArr[ia2]+"</a>");
            };
            reContent.__html = __html;
        };
        return reContent;
    };

    get isWeapp() {
        return typeof window != 'undefined' && window.__wxjs_environment === 'miniprogram'
    }

    textNewLine(content){
        var reContent = content;
        let __html = reContent.__html;
        __html = __html.replace('\n','<br>');

        reContent.__html = __html;

        return reContent;
    }

    textHandle(content){
        let reContent = this.addLink(content);
        reContent = this.textNewLine(reContent);
        return reContent;
    }

    onFeedback(e){
        e.preventDefault();
        e.stopPropagation();
        this.props.onFeedback({
            name: this.props.content,
            id: this.props.id,
            type: 'replyMic',
            userId: this.props.createBy
        },true);
    }

    scrollIntoView(){
		setTimeout(() => {
			this.refs['msg-text'].scrollIntoView(true);//自动滚动到视窗内
		},300)
    }

	getOffsetTop(){
		// console.log(this.refs['speakMsgContainer'].getWrappedInstance())
		return this.refs['speakMsgContainer'].getWrappedInstance().getOffsetTop();
	}

    render() {
        return (
            <SpeakMsgContainer
                ref="speakMsgContainer"
                isRight = {this.props.creatorRole == 'visitor'}
                {...this.props}
            >
                    {
                        this.props.relateType === 'comment'?
                        <div className="msg-text" ref="msg-text">
                            <pre className='div-p'><b dangerouslySetInnerHTML={this.props.dangerHtml(this.props.relateName) }></b>：<var dangerouslySetInnerHTML={this.props.dangerHtml(this.props.relateContent) }></var></pre>
                            <pre className='div-p'><b>回复:</b><var dangerouslySetInnerHTML={this.props.creatorRole != 'visitor'?this.textHandle(this.props.dangerHtml(this.props.content)):this.props.dangerHtml(this.props.content)}></var></pre>
                        </div>
                        :(this.props.commentId&& this.props.commentCreateByName && this.props.commentCreateByName != '' )?
                        <div className="msg-text" ref="msg-text">
                            <pre className='div-p'><b dangerouslySetInnerHTML={this.props.dangerHtml(this.props.commentCreateByName) }></b>：<em  className="ask-label" >问</em><var dangerouslySetInnerHTML={this.props.dangerHtml(this.props.commentContent) }></var></pre>
                            {
                                this.props.content ?
                                <pre className='div-p'><b>回复:</b><var dangerouslySetInnerHTML={this.props.creatorRole != 'visitor'?this.textHandle(this.props.dangerHtml(this.props.content)):this.props.dangerHtml(this.props.content)}></var></pre>
                                :null
                            }
                        </div>
                        :
                        <div className="msg-text" ref="msg-text">
                            <pre className='div-p' dangerouslySetInnerHTML={this.props.creatorRole != 'visitor'?this.textHandle(this.props.dangerHtml(this.props.content)):this.props.dangerHtml(this.props.content)}></pre>
                            {
                                this.props.isMicMsg({type: this.props.type,creatorRole: this.props.creatorRole}) && this.props.power.allowSpeak &&
                                    <span className='feedback on-log'
                                        onClick={this.onFeedback}
                                        data-log-region="speak-list"
                                        data-log-pos="msg-feedback-btn"
                                        >
                                        回复
                                    </span>
                            }
                        </div>
                    }
            </SpeakMsgContainer>
        )
    };
}

/**
 *
 * 图片消息
 * @export
 * @class ImageItem
 * @extends {Component}
 */
@autobind
export class ImageItem extends PureComponent {

    imgView(){
        this.props.imgView(this.props.content);
    }

    render() {
        return (
            <SpeakMsgContainer
                {...this.props}
            >
                <div className="msg-img">
                    <img className="on-log" src={` ${imgUrlFormat(this.props.content,'?x-oss-process=image/resize,h_400,w_400')}`}
                        onClick={this.imgView}
                        data-log-region="speak-list"
                        data-log-pos="img-msg"
                    />
                </div>
            </SpeakMsgContainer>
        )
    }
};



/**
 *
 * 禁言消息
 * @export
 * @class BannedTip
 * @extends {Component}
 */
export class BannedTip extends Component {
    render() {
        return (
            <div className='speak-item-tip'>
                <span>
                    {
                        this.props.isBanned == 'Y' ?
                            '讨论区现在禁止发言'
                            :
                            '讨论区现在允许发言'
                    }
                </span>
            </div>
        )
    }
};


/**
 *
 * 红包消息
 * @export
 * @class Reword
 * @extends {Component}
 */
export class Reword extends PureComponent {
    render() {
        // 音视频跟普通话题返回对象不统一
        const name = this.props.name || this.props.speakCreateByName;
        const relateName = this.props.relateName || this.props.content.replace('赞赏了','');
        const relateContent = this.props.relateContent || formatMoney(this.props.rewardMoney);
        // const createId = this.props.createBy
        // // 判断赞赏用户是否是自己（如果自己是当前赞赏的人，则自己能看到打赏之后的画卡）

        // let own = (createId === this.props.userInfo.userId) && this.props.showCard !== 'N'? true : false
        return (
            <div className={`tips-container ${this.props.showReword &&!(this.isWeapp&&Detect.os.ios)?'':'hide'}`}>
                <span className='main fix-lucky-msg-bg'>
                    <span className="lucky-msg">
                        <var>{name}</var><b>赞赏了</b><var dangerouslySetInnerHTML={dangerHtml(relateName)}></var><b className="money"> {relateContent}元</b>
                    </span>
                </span>
                {/* {
                    own? 
                    <RewordCard
                        {...this.props}
                    ></RewordCard>:null
                } */}
            </div>
        )
    }
};
/**
 *
 *
 * @export
 * @class Redpack
 * @extends {Component}
 */
@autobind
export class Redpack extends Component {
    
    componentDidMount(){
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0);
        

    }
    render(){
        // 游客无权限看到红包
        if(!this.props.userId){
            return false;
        }
        const {
            desc, totalCount, acceptCount, acceptUserSet // 红包状态（初始为空），红包个数，已领取个数，领取用户列表
        } = this.props
        let type = '',remark = '查看红包',hasOpenedByMe = false
        // 课堂红包的初始化状态
        if(!totalCount){
            type = 'expiry' // 过期红包
            remark = '红包已过期'
        }else {
            // 自己是否已经领取
            let receivedByMe = acceptUserSet.find(item => item == this.props.userId)
            // B端C端自己已领取
            if(receivedByMe){
                type = 'success' 
                remark = '红包已领取'
                hasOpenedByMe = true
            }
            // B端已有人领取
            if(this.props.createBy == this.props.userId && acceptUserSet.length > 0){
                type = 'received' 
                remark = '红包已被领取'
            }
            // B端C端红包已领完，自己未领
            if(totalCount == acceptCount && !receivedByMe) {
                type = 'empty'
                remark = '红包已被领完'
            }
        }
        // 课堂红包点击领取按钮之后的各种状态（这种情况是点击开红包按钮之后更新redux）
        if(desc == 'empty'){
            type = desc
            remark = '红包已被领完'
        } else if (desc == 'success'){
            type = desc
            remark = '红包已领取'
            hasOpenedByMe = true
        } else if (desc == 'expiry'){
            type = desc
            remark = '红包已过期'
        }

        let channel = `${this.props.topicInfo.channelId?'&channelId='+this.props.topicInfo.channelId:''}`;
        let camp = `${this.props.topicInfo.campId?'&campId='+this.props.topicInfo.campId:''}`;
        return (
            <SpeakMsgContainer
                ref="speakMsgContainer"
                {...this.props}
                redpack = {true}
            >
            {
             /* c端红包已开（open）
              * c端红包已过期 （expiry）
              * b端红包已被领取 （received）
              */
            }
                <div 
                    data-log-region="hb-btn"
                    data-log-region={type === 'empty' ? ' unget-over' : (type === 'expiry' ? ' unget-overdue' : 'get-being')}
                    className={`on-log on-visible redpack-container ${type}`} 
                    onClick={()=>{this.props.redpackClick(this.props, type, hasOpenedByMe)}}
                >
                    <div className="redpack-remark">
                        <div className="remark">{this.props.content}</div>
                        <div className="tip">{remark}</div>
                    </div>
                    <div className="redpack-tip">课堂红包</div>
                </div>
                {
                    this.props.createBy == this.props.userId ? 
                    <div 
                        data-log-region = 'hb-btn'
                        data-log-pos = 'hb-checkmore'
                        className="b-open-redpack-tip on-log on-visible" 
                        onClick={()=>{locationTo(`/wechat/page/red-envelope-detail?redEnvelopeId=${this.props.commentId || this.props.relateId}${channel}${camp}&topicId=${this.props.topicId}&liveName=${encodeURIComponent(encodeURIComponent(this.props.topicInfo.liveName))}&url=${encodeURIComponent(window.location.href)}`)}}
                    ><em>{this.props.topicInfo.liveName}点击查看领取详情</em>
                    </div>:
                    type === 'success' && <div className="c-open-redpack-tip" onClick={()=>{this.props.locationToShare(this.props.commentId || this.props.relateId)}}>红包已入袋 <em>为老师推广课程</em></div>//音视频互动的红包id为relateId，其他为commentId
                }
            </SpeakMsgContainer>
        )
    }
};



/**
 *
 * 通用消息
 * @export
 * @class Prompt
 * @extends {Component}
 */
export class Prompt extends Component {
    render() {
        return (
            <div className='tips-container'>
                <span className='main'>{this.props.content}</span>
            </div>
        )
    }
};




/**
 *
 * 嘉宾进入消息
 * @export
 * @class InviteItem
 * @extends {Component}
 */
export class InviteItem extends Component {
    render() {
        return (
            <div className='tips-container'>
                <span className='main'>{this.props.title}{this.props.userName }加入直播间</span>
            </div>
        )
    }
};


/**
 *
 * 结束消息
 * @export
 * @class FinishTopicTip
 * @extends {Component}
 */
export class FinishTopicTip extends Component {
    render() {
        return (
            <div className="speak-item-tip" >
                <span>直播已结束</span>
            </div>
        )
    }
};


/**
 *
 * 课程卡消息
 * @export
 * @class CourseCardItem
 * @extends {Component}
 */
@autobind
export class CourseCardItem extends PureComponent {
    render() {
        const {
            businessId,
            businessType,
            headImage,
            url,
            title
        } = this.props.imageTextCard || {}
        return (
            <SpeakMsgContainer
                {...this.props}
            >
                <div 
                    className="msg-course-card on-log on-visible"
                    data-log-region="speak-list"
                    data-log-pos={`course-card-${this.props.power.allowMGLive ? 'B' : 'C'}`}
                    onClick={() => { locationTo(url) }}
                    >
                    <div className="title">{title}</div>
                    <img src={imgUrlFormat(headImage,'?x-oss-process=image/resize,m_fill,limit_0,w_418,h_262')} />
                    <p className="teacher-recommend"><span>荐</span>老师推荐</p>
                </div>
            </SpeakMsgContainer>
        )
    }
};