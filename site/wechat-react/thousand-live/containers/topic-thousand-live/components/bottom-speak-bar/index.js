import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { findDOMNode } from "react-dom";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { autobind } from "core-decorators";
import SpeakRecording from "./bottom-speak-recording";
import SpeakMedia from "./bottom-speak-media";
import SpeakTextInput from "./bottom-speak-text";
import FileInput from "components/file-input";
import Detect from "components/detect";
import { createPortal } from "react-dom";
import { getQlchatVersion } from "components/envi";
import PrepareLessons from "../prepare-lessons";
import { CSSTransition } from 'react-transition-group';

@autobind
class BottomSpeakBar extends PureComponent {
    state = {
        speakTab: "",
        // 第一次录音提示
        showFirstTips: false,

        showPrepareLessons: false,

        isRedDot: true,

        // 展示互动引导
        showMediaGuide: false,
        
        showCourseCardTips: false
    };

    componentDidMount() {
        this.initState();
    }

    initState() {
        // 初始化第一次录音提示
        if (
            !localStorage.getItem("firstRecord") &&
            !(!Detect.os.phone && Detect.os.weixin)
        ) {
            this.setState({
                showFirstTips: true
            });
        }
        if (localStorage.getItem("no-new-interactive-outer")) { 
            this.setState({
                isRedDot: false
            });
        }
        if (!(this.props.power.allowMGLive && this.props.isRelayChannel == "Y") && !localStorage.getItem('course_card_tips')) {
            this.setState({showCourseCardTips: true})
            localStorage.setItem('course_card_tips','Y')
        }
    }

    /**
     * 切换处理
     *
     * @param {any} type
     *
     * @memberof BottomSpeakBar
     */
    switchTabHandle(type) {
        this.setState({
            speakTab: type
        });
        if (type === "media") {
            // 红包按钮曝光打点
            setTimeout(() => {
                typeof _qla != "undefined" && _qla.collectVisible();
            }, 0);
            // 红包引导
            // if(!localStorage.getItem('media_guide')){
            //     this.setState({showMediaGuide: true})
            //     localStorage.setItem('media_guide','Y')
            // }
        }

        this.props.onSwitchTab(type);
        let ui = typeof window == "undefined" ? "" : navigator.userAgent || "";
        if (type == "text" && Detect.os.phone && !ui.match(/11_\d/)) {
            // 兼容手机 使用第三方输入法，自动弹起键盘被挡住
            setTimeout(() => {
                let textInput = findDOMNode(this.refs.textInputBox);
                textInput.scrollIntoView(true);
            }, 550);
        }
    }

    /**
     * 切换的中间判断过程
     *
     * @param {any} type
     * @param {boolean} [isOn=false]
     *
     * @memberof BottomSpeakBar
     */
    switchTab(type, isOn = false) {
        const speakTab =
            this.state.speakTab == type ? (!isOn ? "" : type) : type;
        if (type != "control" && this.isReplyB()) {
            return;
        }
        if (
            this.refs.speakRecording.state.recordingStatus != "ready" &&
            speakTab != "audio"
        ) {
            window.confirmDialog("确定取消录音吗？", () => {
                this.refs.speakRecording.outResetRecording();
                this.switchTabHandle(speakTab);
            });
        } else if (type == "material") {
            this.setState({
                showPrepareLessons: true
            });
            this.switchTabHandle("");
        } else if (type == "control") {
            this.props.showControlDialog();
            this.switchTabHandle("");
        } else {
            this.switchTabHandle(speakTab);
        }
    }

    isReplyB = () => {
        if (this.props.power.allowMGLive && this.props.isRelayChannel == "Y") {
            window.toast("转载方不能发言");
            return true;
        }
        return false;
    };

    hideFirstTips() {
        if (this.state.showFirstTips) {
            this.setState({
                showFirstTips: false
            });
            try {
                localStorage.setItem("firstRecord", "Y");
            } catch (error) {} //记录已录过语音
        }
    }

    closePrepareLesson() {
        this.setState({
            showPrepareLessons: false
        });
    }

    hideRedDot() {
        this.setState({
            isRedDot: false
        });
        localStorage.setItem("no-new-interactive-outer", "Y");
    }

    render() {
        return (
            <div className="bottom-container-speak">
                <ul className="tab-speak">
                    {!getQlchatVersion() ? (
                        <li
                            className={`${
                                this.state.speakTab === "audio" ? "on" : ""
                            } on-log`}
                            onClick={() => {
                                this.switchTab("audio");
                                this.hideFirstTips();
                            }}
                            data-log-region="tab-menu"
                            data-log-pos="record-btn"
                            data-log-name="语音"
                        >
                            <span className="mic" />
                            <span className="text">语音</span>
                            {
                                // this.state.showFirstTips ? <b className="first-record"><i></i>点击开始语音讲课</b> :null
                            }
                        </li>
                    ) : null}
                    <li
                        className={`${
                            this.state.speakTab === "text" ? "on" : ""
                        } on-log`}
                        onClick={() => {
                            this.switchTab("text");
                        }}
                        data-log-region="tab-menu"
                        data-log-pos="text-btn"
                        data-log-name="文字"
                    >
                        <span className="write" />
                        <span className="text">文字</span>
                    </li>
                    <li
                        className={`${
                            this.state.speakTab === "media" ? "on" : ""
                        } on-log ${
                            this.state.isRedDot ? "red-dot" : ""
                        }`}
                        onClick={() => {
                            this.switchTab("media");
                            this.hideRedDot();
                        }}
                        data-log-region="tab-menu"
                        data-log-pos="media-btn"
                        data-log-name="媒体库"
                    >
                        <span className="interactive"></span>
                        <span className="text">互动</span>
                        <CSSTransition
                            in={this.props.canShowNewFuncTips && this.state.showCourseCardTips}
                            timeout={{enter: 500, exit: 500}}
                            classNames="bubbling-tips"
                            unmountOnExit
                            onEntered={() => {
                                setTimeout(() => {
                                    this.setState({
                                        showCourseCardTips: false
                                    }) 
                                }, 3000);
                            }}
                            >
                            <p className="bubbling-tips">想在课程中发送链接？试试图文卡吧～</p>
                        </CSSTransition>
                    </li>
                    {!(
                        this.props.topicStyle === "audio" ||
                        this.props.topicStyle === "video"
                    ) ? (
                        <li
                            className={`on-log`}
                            onClick={() => {
                                this.switchTab("material");
                            }}
                            data-log-region="tab-menu"
                            data-log-pos="material-btn"
                            data-log-name={"备课"}
                        >
                            <span className="material" />
                            <span className="text">备课</span>
                        </li>
                    ) : null}
                    <li
                        className="on-log"
                        onClick={() => {
                            this.switchTab("control");
                        }}
                        data-log-region="tab-menu"
                        data-log-pos="opt-btn"
                        data-log-name="操作"
                    >
                        <span className="opration" />
                        <span className="text">操作</span>
                    </li>
                </ul>

                {/*此处判断为了输入框自动获取焦点*/}
                {this.state.speakTab == "text" ? (
                    <SpeakTextInput
                        ref="textInputBox"
                        isShow={this.state.speakTab == "text"}
                        addForumSpeak={this.props.addForumSpeak}
                        feedbackTarget={this.props.feedbackTarget}
                        showPasteBox={this.props.showPasteBox}
                        getQuestionList={this.props.getQuestionList}
                        topicId={this.props.topicId}
                        topicStyle={this.props.topicStyle}
                    />
                ) : null}
                <SpeakRecording
                    isShow={this.state.speakTab == "audio"}
                    ref="speakRecording"
                    {...this.props}
                    autoRec={true}
                />
                {this.state.speakTab == "media" ? (
                    <SpeakMedia
                        addSpeakImagePc={this.props.addSpeakImagePc}
                        addSpeakImageWx={this.props.addSpeakImageWx}
                        addSpeakAudio={this.props.addSpeakAudio}
                        addForumSpeak={this.props.addForumSpeak}
                        onOpenVideoDialog={this.props.onOpenVideoDialog}
                        onOpenDocDialog={this.props.onOpenDocDialog}
                        onFinished={() => {
                            this.switchTab("");
                        }}
                        uploadDoc={this.props.uploadDoc}
                        saveFile={this.props.saveFile}
                        uploadAudio={this.props.uploadAudio}
                        topicStyle={this.props.topicStyle}
                        isLiveAdmin={this.props.isLiveAdmin || "N"}
                        locationToRedpack={this.props.locationToRedpack}
                        topicId={this.props.topicId}
                        liveId={this.props.liveId}
                    />
                ) : null}

                <PrepareLessons
                    show={this.state.showPrepareLessons}
                    close={this.closePrepareLesson}
                    topicId={this.props.topicId}
                    liveId={this.props.liveId}
                    addTopicSpeak={this.props.addForumSpeak}
                    topicStyle={this.props.topicStyle}
                    currentPPTFileId={this.props.currentPPTFileId}
                    onPPTSwiped={this.props.onPPTSwiped}
                />

                {this.state.showMediaGuide &&
                    createPortal(
                        <div
                            className="media-first-bg"
                            onClick={() => {
                                this.setState({ showMediaGuide: false });
                            }}
                        />,
                        document.querySelector("#app")
                    )}
            </div>
        );
    }
}

BottomSpeakBar.propTypes = {
    feedbackTarget: PropTypes.object,
    // tab状态改变
    onSwitchTab: PropTypes.func
};

export default BottomSpeakBar;
