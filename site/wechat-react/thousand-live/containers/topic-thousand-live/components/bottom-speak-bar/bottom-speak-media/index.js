import React, { PureComponent, Component } from "react";
import PropTypes from "prop-types";
import { findDOMNode, createPortal } from "react-dom";
import { autobind, debounce, throttle } from "core-decorators";
import FileInput from "components/file-input";

import MediaItem from "./media-item";
import Detect from "components/detect";
import { Confirm } from "components/dialog";
import { normalFilter, getVal, formatDate } from "components/util";
import FileUploader from "../../dialogs/file-uploader";
import { apiService } from "components/api-service";
import errorCatch from "components/error-boundary";
import { fixScroll } from "components/fix-scroll";
import CourseCardDialog from "../../course-card-dialog";

const fromSource = {
    tencent: "腾讯视频",
    youku: "优酷视频",
    mobile: "手机上传"
};

class BottomDialog extends React.Component {
    render() {
        if (this.props.show) {
            return createPortal(
                <div
                    className="bottom-dialog-wrap_ERWERWE"
                    onClick={this.props.onClose}
                >
                    {this.props.children}
                </div>,
                document.querySelector(".portal-low")
            );
        } else {
            return null;
        }
    }
}

class MiddleDialog extends React.Component {
    render() {
        if (this.props.show) {
            return createPortal(
                <div
                    className="middle-dialog-wrap_ERWERFS"
                    onClick={this.props.onClose}
                >
                    {this.props.children}
                </div>,
                document.querySelector(".portal-low")
            );
        } else {
            return null;
        }
    }
}

class VideoList extends React.Component {
    componentDidMount() {
        fixScroll(".video-list");
    }
    render() {
        return this.props.children;
    }
}

class VideoItem extends React.Component {
    status = {
        awaiting: "审核中",
        pass: "已通过",
        no_pass: "审核失败"
    };

    fromSource = {
        tencent: "腾讯视频",
        youku: "优酷视频",
        mobile: "手机上传"
    };

    currentVideo = {};

    onEditVideoItem = () => {
        this.props.onEditVideoItem(this.props.id);
    };

    uiStatusColor = status => {
        let colorS = {
            awaiting: "#FF9F00",
            pass: "#999999",
            no_pass: "#F73657"
        };
        return colorS[status];
    };

    render() {
        let { headImage, name } = this.props;
        return (
            <div className="video-item">
                <div
                    className="video-avatar"
                    style={{
                        backgroundImage: `url(${headImage ||
                            "https://img.qlchat.com/qlLive/liveComment/KWBI59M4-KQBK-WXGM-1542261973196-YB4TLKNODP2X.png?x-oss-process=image/resize,h_200,w_200"})`
                    }}
                    onClick={() => {
                        if (this.props.status == 'no_pass') return window.toast('审核失败，视频源已被删除，无法预览')
                        this.props.onPreview(
                            this.props.id,
                            this.props.resourceUrl,
                            this.props.source,
                            this.props.headImage
                        );
                    }}
                >
                    <video
                        id={this.props.id}
                        src={this.props.resourceUrl}
                        style={{ width: 1, height: 1}}
                        x5-video-player-type="h5"
                        x5-video-player-fullscreen="true" 
                    />
                    <img
                        className="icon-play"
                        src={require("./img/icon-play.svg")}
                    />
                </div>
                <div className="video-info" onClick={this.onEditVideoItem}>
                    <div className="video-title">
                        <span className="title">
                            <span className="title-name">{name}</span>
                        </span>{" "}
                        <span
                            className="audit-status"
                            style={{
                                color: this.uiStatusColor(this.props.status)
                            }}
                        >
                            {this.status[this.props.status]}
                        </span>
                    </div>
                    <div className="video-info-wrap">
                        <div className="video-from">
                            来源：{this.fromSource[this.props.source]}
                        </div>
                        <div className="upload-time">
                            上传时间:{" "}
                            {formatDate(
                                this.props.createTime,
                                "yyyy-MM-dd hh:mm"
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

@errorCatch
@autobind
export default class SpeakMedia extends PureComponent {
    state = {
        /*mp3上传进度*/
        mp3Progress: 0,
        uploadStatus: "",
        videoList: [],
        showPhonePrompt: false,
        qrUrl: "",
        showUploadDialog: false,
        showOverNum: false,
        showEditVideo: false,
        renameDialog: false,
        deleteDialog: false,
        previewVideo: "",
        topicVideoLimit: 10
    };

    currentVideo = {
        name: ""
    };

    componentDidMount() {
        console.log('componentDidMountcomponentDidMount')
        if (!/(audio|video)/.test(this.props.topicStyle)) {
            this.ajaxGetVideoList();
            this.getQr();
        }
    }

    onSelectImage(e) {
        if (Detect.os.weixin && Detect.os.phone) {
            this.props.addSpeakImageWx();
        } else {
            this.props.addSpeakImagePc(e);
        }

        this.props.onFinished();
    }

    onSelectAudio(e) {
        if (Detect.os.ios) {
            window.toast("使用安卓手机或PC浏览器才可以上传");
        } else {
            this.addSpeakAudio(e);
        }
    }

    /**
     * 开启文件选择弹框
     *
     *
     * @memberof ThousandLive
     */
    onOpenDocDialog() {
        if (Detect.os.ios) {
            window.toast("使用安卓手机或PC浏览器才可以上传");
        } else {
            this.refs.fileUploader.show();
        }
    }

    /**
     * 开启视频输入弹框
     *
     *
     * @memberof ThousandLive
     */
    onOpenVideoDialog() {
        this.setState({
            showVideoLinkDialog: true
        });
    }

    onOpenVideoUrlInputDialog() {
        try {
            if (this.state.videoList.length >= this.state.topicVideoLimit) {
                this.setState({
                    showOverNum: true
                });
                return;
            }
            this.refs.videoLinkDialog.show();
        } catch (error) {
            console.error(error);
        }
    }

    uploadingNormalCode = false;

    /**
     * 输入视频链接提交
     *
     *
     * @memberof ThousandLive
     */
    async onConfirmVideoInput(type) {
        if (type === "cancel") {
            return;
        }

        if (this.uploadingNormalCode) {
            return;
        }

        try {
            _qla && _qla('click', {
                region: 'online-video',
                position: 'upload-confirm'
            })
        } catch (error) {
            console.error(error)
        }

        let videoLink = findDOMNode(this.refs.videoLinkInput).value;
        videoLink =
            videoLink && typeof videoLink === "string" && videoLink.trim();
        try {
            this.uploadingNormalCode = true;
            let result = await apiService.post({
                url: "/h5/topic/video/normalCodeUpload",
                body: {
                    topicId: this.props.topicId,
                    liveId: this.props.liveId,
                    code: videoLink
                }
            });
            if (result.state.code == 0) {
                window.toast("上传成功");
                this.setState({
                    videoList: [
                        getVal(result, "data.topicVideo", {}),
                        ...this.state.videoList
                    ]
                });
                this.refs.videoLinkDialog.hide();
            } else {
                window.toast(result.state.msg);
            }
        } catch (error) {
            console.error(error);
        } finally {
            this.uploadingNormalCode = false;
        }
    }

    /**
     * 上传MP3
     *
     * @param {any} event
     *
     * @memberof SpeakMedia
     */
    async addSpeakAudio(event) {
        const file = event.target.files[0];
        event.target.value = "";

        this.setState({
            uploadStatus: "uploading",
            mp3Progress: 0
        });

        const result = await this.props.uploadAudio(file, "audio", ".mp3", {
            showLoading: false,
            startUpload: progress => {
                console.log("开始回调");
                this.startUpload();
            },
            onProgress: progress => {
                this.onProgress(~~(progress * 100));
            },
            interruptUpload: () => {
                return this.state.uploadStatus === "interrupted";
            },
            onError: () => {
                this.refs.uploadConfirm.hide();
            }
        });

        this.props.addForumSpeak("pcAudioUrl", result.url, result.duration);
    }

    /**
     * 中断上传
     *
     *
     * @memberof SpeakMedia
     */
    onInterruptUpload() {
        this.setState({
            uploadStatus: "interrupted"
        });

        this.refs.uploadConfirm.hide();
    }

    /**
     * 上传进度
     * @param {*} progress
     */
    onProgress(progress) {
        this.setState({
            mp3Progress: progress
        });

        if (progress == 100) {
            this.refs.uploadConfirm.hide();
        }
    }

    /**
     * 开始上传
     */
    startUpload() {
        this.refs.uploadConfirm.show();
    }

    get isWeapp() {
        return (
            typeof window != "undefined" &&
            window.__wxjs_environment === "miniprogram"
        );
    }

    ajaxGetVideoList = async () => {
        try {
            let result = await apiService.post({
                url: "/h5/topic/video/videoList",
                body: {
                    topicId: this.props.topicId
                }
            });
            if (result.state.code == 0) {
                let { videoList, topicVideoLimit } = result.data;
                this.setState({
                    videoList: videoList,
                    topicVideoLimit
                });
            } else {
                window.toast(result.state.msg);
            }
        } catch (error) {
            console.error(error);
        }
    };

    onClickUpload() {
        if (!Detect.os.phone) {
            this.setState({
                showPhonePrompt: true
            });
            return;
        }
        if (this.state.videoList.length >= this.state.topicVideoLimit) {
            this.setState({
                showOverNum: true
            });
            return;
        }
        if (this.state.qrUrl) {
            this.setState({
                showUploadDialog: true
            });
            return;
        }
    }

    addForumSpeak = async video => {
        try {
            let result = await this.props.addForumSpeak(
                "topic-video",
                video.id.toString()
            );
            this.setState({
                showEditVideo: false
            });
            if (result.state.code == 0) {
                window.toast("发送成功！", 3000);
                this.setState({
                    showVideoLinkDialog: false
                });
            } else {
                window.toast(result.state.msg);
            }
        } catch (error) {
            console.error(error);
        }
    };

    renameVideo = async name => {
        let video = this.currentVideo;
        try {
            let result = await apiService.post({
                url: "/h5/topic/video/renameVideo",
                body: {
                    id: video.id,
                    liveId: this.props.liveId,
                    name: name
                }
            });
            if (result.state.code == 0) {
                let newVideoList = this.state.videoList.map(item => {
                    if (item.id == video.id) {
                        return {
                            ...item,
                            name
                        };
                    }
                    return item;
                });
                this.setState({
                    videoList: newVideoList,
                    renameDialog: false
                });
                window.toast("修改成功！", 3000);
            }
        } catch (error) {
            console.error(error);
        }
    };

    deleteVideo = async () => {
        let video = this.currentVideo;
        try {
            let result = await apiService.post({
                url: "/h5/topic/video/deleteVideo",
                body: {
                    liveId: this.props.liveId,
                    id: video.id
                }
            });
            if (result.state.code == 0) {
                let newVideoList = this.state.videoList.filter(item => {
                    return item.id != video.id;
                });
                this.setState({
                    videoList: newVideoList,
                    deleteDialog: false
                });
                window.toast("删除成功！", 3000);
            } else {
                window.toast(result.state.msg);
            }
        } catch (error) {
            console.error(error);
        }
    };

    onClosePhonePrompt = () => {
        this.setState({
            showPhonePrompt: false
        });
    };

    // getIsSubscribe = async () => {
    //     try {
    //         let result = await apiService.post({
    //             url: "/h5/user/isSubscribe",
    //             body: {
    //                 liveId: this.props.liveId
    //             }
    //         });
    //         if (result.state.code == 0) {
    //             this.isSubscribe = result.data.subscribe;
    //             if (!this.isSubscribe) {
    //                 this.getQr();
    //             }
    //         } else {
    //             window.toast(result.state.msg);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    getQr = async () => {
        try {
            let result = await apiService.post({
                url: "/h5/live/getQr",
                body: {
                    liveId: this.props.liveId,
                    topicId: this.props.topicId,
                    channel: "topicVideoUpload"
                }
            });
            if (result.state.code == 0) {
                this.setState({
                    qrUrl: result.data.qrUrl
                });
            } else {
                window.toast(result.state.msg);
            }
        } catch (error) {
            console.error(error);
        }
    };

    onCloseUploadDialog = () => {
        this.setState({
            showUploadDialog: false
        });
    };

    onCloseOverNum = () => {
        this.setState({
            showOverNum: false
        });
    };

    onCloseEditVideo = () => {
        this.setState({
            showEditVideo: false
        });
    };

    onShowVideoMenu = videoId => {
        this.currentVideo = this.state.videoList.find(
            item => item.id == videoId
        ) || { name: "" };
        this.setState({
            showEditVideo: true
        });
    };

    showRenameDialog = () => {
        this.setState({
            renameDialog: true,
            showEditVideo: false,
            inputValue: this.currentVideo.name
        });
    };

    showDeleteDialog = () => {
        this.setState({
            deleteDialog: true,
            showEditVideo: false
        });
    };

    onClickConfirmRename = () => {
        let value = this.renameInput.value;
        if (!value) {
            return window.toast("名字不能为空！");
        }
        if (String(value).length > 30) {
            return window.toast("最多不能超过30字");
        }
        this.renameVideo(value);
    };

    onClickSendSpeak = () => {
        let video = this.currentVideo;
        this.addForumSpeak(video);
    };

    onPreviewVideo = (id, url, source, headImage) => {
        let video = document.getElementById(id);
        if (Detect.os.iphone && source == 'mobile') {
            video.play();
            return ;
        }
        this.setState({
            previewVideo: url,
            previewVideoHeadImage: headImage
        });
    };

    showSelectCourseCard = () => {
        this.setState({
            showSendCourseCardDialog: true
        })
        if (!localStorage.getItem("no-new-course-card")) {
            localStorage.setItem("no-new-course-card", true);
        }
    }

    closeSelectCourseCard = () => {
        this.setState({
            showSendCourseCardDialog: false
        })
    }

    onSelectCourseCard = async (item) => {
        const res = await this.props.addForumSpeak('image-text-card', item)
        if (res && res.state && res.state.code == 0) {
            this.closeSelectCourseCard()
            this.props.onFinished();
        }
    }

    render() {
        if (typeof document == "undefined") {
            return null;
        }

        const portalBody = document.querySelector(".portal-high");

        if (!portalBody) {
            return null;
        }

        return (
            <div className={`speak-media-container`}>
                <MediaItem
                    icon="pictures"
                    label="图片"
                    logPos="pic"
                    upload={!(Detect.os.weixin && Detect.os.phone)}
                    uploadOptions={{
                        accept:
                            "image/jpg,image/jpeg,image/png,image/gif,image/bmp"
                    }}
                    onClick={this.onSelectImage}
                />
                {!(this.isWeapp && Detect.os.ios) && (
                    <MediaItem
                        icon="upload_file"
                        label="文件"
                        upload={false}
                        logPos="file"
                        onClick={this.onOpenDocDialog}
                    />
                )}
                {/* {!(this.isWeapp && Detect.os.ios) && (
                    <MediaItem
                        icon="redpack"
                        label="红包"
                        upload={false}
                        logRegion={`tab-menu`}
                        logPos={`hb-build`}
                        onVisible={true}
                        onClick={this.props.locationToRedpack}
                    />
                )} */}

                {!/(audio|video)/.test(this.props.topicStyle) ? (
                    <MediaItem
                        icon="records"
                        label="音频"
                        logPos="audio"
                        upload={!Detect.os.ios}
                        uploadOptions={{ accept: "audio/*" }}
                        onClick={this.onSelectAudio}
                    />
                ) : null}
                {!/(audio|video)/.test(this.props.topicStyle) ? (
                    <MediaItem
                        icon="videos"
                        label="视频"
                        logPos="video"
                        onClick={this.onOpenVideoDialog}
                    >
                    </MediaItem>
                ) : null}
                
                <MediaItem
                    icon="course_card"
                    label="图文卡"
                    logPos="card"
                    onClick={this.showSelectCourseCard}
                >
                    {localStorage.getItem("no-new-course-card") ? null : (
                        <span className="no-new-interactive-dotted" />
                    )}
                </MediaItem>

                {/*文件上传弹框*/}
                <FileUploader
                    ref="fileUploader"
                    uploadDoc={this.props.uploadDoc}
                    onProgress={this.onProgress}
                    startUpload={this.startUpload}
                    saveFile={this.props.saveFile}
                    isLiveAdmin={this.props.isLiveAdmin || "N"}
                />

                {/*上传进度*/}
                <Confirm
                    className="dialog-fixed"
                    ref="uploadConfirm"
                    buttons="confirm"
                    confirmText="取消上传"
                    onBtnClick={this.onInterruptUpload}
                >
                    <main className="upload-confirm-dialog">
                        <div className="progress-title">上传进度</div>
                        <span className="progress-number">
                            {this.state.mp3Progress}%
                        </span>
                    </main>
                </Confirm>

                {/*视频连接发言弹框*/}
                {createPortal(
                    <Confirm
                        className="middle-dialog-wrap-video-url-input"
                        ref="videoLinkDialog"
                        buttons="cancel-confirm"
                        confirmText="上传"
                        title="网址上传"
                        onBtnClick={this.onConfirmVideoInput}
                    >
                        <main className="video-link-dialog">
                            <div className="step">
                                <div className="head">步骤一</div>
                                <p className="desc">从优酷、腾讯视频网站的视频播放页面点击分享<span className="icon-share"></span>按钮</p>
                            </div>
                            <div className="step">
                                <div className="head">步骤二</div>
                                <p className="desc">找到通用代码复制</p>
                                <p className="tip">(记得不要上传需要会员才能播放的视频哦)</p>
                                <img src={require('./img/templet.png')} alt=""/>
                            </div>
                            <textarea
                                ref="videoLinkInput"
                                placeholder="请粘贴网址通用代码"
                            />
                        </main>
                    </Confirm>,
                    portalBody
                )}

                <BottomDialog
                    show={this.state.showVideoLinkDialog}
                    onClose={() => {
                        this.setState({
                            showVideoLinkDialog: false
                        });
                    }}
                >
                    <div
                        className="bottom-dialog"
                        onClick={e => {
                            e.stopPropagation();
                        }}
                    >
                        <div
                            className="header"
                            onClick={() => {
                                this.setState({
                                    showVideoLinkDialog: false
                                });
                            }}
                        >
                            视频
                            <img
                                className="icon-arrow"
                                src={require("./img/icon-arrow.svg")}
                            />
                        </div>
                        <VideoList>
                            <div className="video-list">
                                {this.state.videoList.map((item, idx) => {
                                    return (
                                        <VideoItem
                                            key={idx}
                                            {...item}
                                            onEditVideoItem={() => {
                                                this.onShowVideoMenu(item.id);
                                            }}
                                            onPreview={this.onPreviewVideo}
                                        />
                                    );
                                })}
                                {this.state.videoList.length == 0 ? (
                                    <div className="empty-video-container">
                                        <img
                                            src={require("./img/empty-video.png")}
                                        />
                                        <div className="empty-text">
                                            没有视频，快去上传哦
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </VideoList>
                        <div className="btn-panel">
                            <div
                                className="btn primary-btn on-log"
                                data-log-region="short-video"
                                data-log-positon="upload"
                                onClick={this.onClickUpload}
                            >
                                <div className="btn-inner">
                                    <img
                                        className="icon"
                                        src={require("./img/icon-upload.svg")}
                                    />
                                    <span className="text">上传短视频</span>
                                </div>
                            </div>
                            <div className="btn on-log"
                                data-log-region="online-video"
                                data-log-position="upload" >
                                <div
                                    className="btn-inner"
                                    onClick={this.onOpenVideoUrlInputDialog}
                                >
                                    <img
                                        className="icon"
                                        src={require("./img/icon-net.svg")}
                                    />
                                    <span className="text">网址上传</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </BottomDialog>

                <MiddleDialog
                    show={this.state.showPhonePrompt}
                    onClose={this.onClosePhonePrompt}
                >
                    <div className="middle-dialog-phone">
                        <div className="header">提示</div>
                        <div className="prompt">请在手机上传。</div>
                        <div
                            className="confirm-btn"
                            onClick={this.onClosePhonePrompt}
                        >
                            <span className="text">好的</span>
                        </div>
                    </div>
                </MiddleDialog>

                <MiddleDialog
                    show={this.state.showOverNum}
                    onClose={this.onCloseOverNum}
                >
                    <div className="middle-dialog-phone">
                        <div className="header">提示</div>
                        <div className="prompt">
                            每个课程仅允许上传
                            <span
                                style={{
                                    color: "red"
                                }}
                            >
                                {this.state.topicVideoLimit}
                            </span>
                            个视频， <br />
                            如需上传请删除部分已有视频再上传。
                        </div>
                        <div
                            className="confirm-btn"
                            onClick={this.onCloseOverNum}
                        >
                            <span className="text">好的</span>
                        </div>
                    </div>
                </MiddleDialog>

                <MiddleDialog
                    show={this.state.showUploadDialog}
                    onClose={this.onCloseUploadDialog}
                >
                    <div
                        className="middle-dialog-upload"
                        onClick={e => {
                            e.stopPropagation();
                        }}
                    >
                        <div className="header">上传短视频</div>
                        <div className="qrcode">
                            <img src={this.state.qrUrl} />
                        </div>
                        <div className="prompt">
                            手机上传短视频需要通过千聊公众号上传，长按识别进入公众号后按提示进行上传。
                        </div>
                        <div className="btn-panel">
                            <div
                                className="btn"
                                onClick={this.onCloseUploadDialog}
                            >
                                <span>取消</span>
                            </div>
                        </div>
                    </div>
                </MiddleDialog>

                <BottomDialog
                    show={this.state.showEditVideo}
                    onClose={this.onCloseEditVideo}
                >
                    <div
                        className="bottom-dialog-edit-video"
                        onClick={e => {
                            e.stopPropagation();
                        }}
                    >
                        <div className="edit-panel">
                            {this.currentVideo.status == "pass" ? (
                                <div
                                    className="op-btn-item"
                                    onClick={this.onClickSendSpeak}
                                >
                                    <span>发送</span>
                                </div>
                            ) : null}
                            {this.currentVideo.status != "no_pass" ? (
                                <div
                                    className="op-btn-item"
                                    onClick={this.showRenameDialog}
                                >
                                    <spoan>重命名</spoan>
                                </div>
                            ) : null}
                            <div
                                className="op-btn-item"
                                onClick={this.showDeleteDialog}
                            >
                                <span style={{ color: "#F73657" }}>删除</span>
                            </div>
                        </div>
                        <div className="cancel-panel">
                            <div
                                className="op-btn-item"
                                onClick={() => {
                                    this.setState({
                                        showEditVideo: false
                                    });
                                }}
                            >
                                <span>取消</span>
                            </div>
                        </div>
                    </div>
                </BottomDialog>

                <MiddleDialog
                    show={this.state.renameDialog}
                    onClose={this.onCloseRenameDialog}
                >
                    <div
                        className="middle-dialog-rename"
                        onClick={e => {
                            e.stopPropagation();
                        }}
                    >
                        <div className="title">重命名</div>
                        <div className="body">
                            <input
                                autoFocus
                                className="rename-input"
                                value={this.state.inputValue}
                                ref={input => {
                                    this.renameInput = input;
                                }}
                                onChange={e => {
                                    this.setState({
                                        inputValue: e.target.value
                                    });
                                }}
                                onFocus={() => {
                                    try {
                                        let range = document
                                            .getSelection()
                                            .getRangeAt(0);
                                        let el = document.querySelector(
                                            ".rename-input"
                                        );
                                        range.setStartAfter(el);
                                        el.focus();
                                    } catch (error) {
                                        console.log(error);
                                    }
                                }}
                            />
                        </div>
                        <div className="btn-panel">
                            <div
                                className="btn"
                                onClick={() => {
                                    this.onCloseRenameDialog();
                                    window.toast("没做任何修改！");
                                }}
                            >
                                <span>取消</span>
                            </div>
                            <div
                                className="btn"
                                onClick={this.onClickConfirmRename}
                                style={{
                                    color: !this.state.inputValue
                                        ? "#999999"
                                        : "#333333"
                                }}
                            >
                                <span>确定</span>
                            </div>
                        </div>
                    </div>
                </MiddleDialog>

                <MiddleDialog
                    show={this.state.deleteDialog}
                    onClose={this.onCloseDeleteDialog}
                >
                    <div
                        className="middle-dialog-delete"
                        onClick={e => {
                            e.stopPropagation();
                        }}
                    >
                        <div className="title">删除</div>
                        <div className="name">{this.currentVideo.name}</div>
                        <div className="other-info">
                            <div className="from-source">
                                来源：
                                {fromSource[this.currentVideo.source]}
                            </div>
                            <div className="createTime">
                                {formatDate(
                                    this.currentVideo.createTime,
                                    "yyyy-MM-dd hh:mm"
                                )}
                            </div>
                        </div>
                        <div className="btn-panel">
                            <div
                                className="btn"
                                onClick={this.onCloseDeleteDialog}
                            >
                                <span>取消</span>
                            </div>
                            <div className="btn" onClick={this.deleteVideo}>
                                <span
                                    style={{
                                        color: "#F73657"
                                    }}
                                >
                                    确定删除
                                </span>
                            </div>
                        </div>
                    </div>
                </MiddleDialog>

                <MiddleDialog
                    show={this.state.previewVideo}
                    onClose={() => {
                        this.setState({
                            previewVideo: ""
                        });
                    }}
                >
                    <div
                        className="video-preview-container"
                        onClick={e => {
                            e.stopPropagation();
                        }}
                        // style={{
                        //     visibility:
                        //         this.state.previewVideo.indexOf("youku") > -1 ||
                        //         this.state.previewVideo.indexOf("v.qq") > -1
                        //             ? "visible"
                        //             : "hidden"
                        // }}
                    >
                        {this.state.previewVideo.indexOf("youku") > -1 ||
                        this.state.previewVideo.indexOf("v.qq") > -1 ? (
                            <iframe
                                ref="ifm"
                                id="ifm"
                                frameBorder="0"
                                src={this.state.previewVideo.replace(
                                    /(http:\/\/)/,
                                    "https://"
                                )}
                                allowFullScreen={true}
                            />
                        ) : (
                            <video
                                id="video-preview"
                                src={this.state.previewVideo}
                                preload="auto"
                                poster={this.state.previewVideoHeadImage}
                                x5-video-player-type="h5"
                                x5-video-player-fullscreen='true'
                                style={{
                                    objectFit: 'fill'
                                }}
                                controls
                                autoPlay="autoplay"
                            />
                        )}
                    </div>
                </MiddleDialog>

                <CourseCardDialog 
                    liveId={this.props.liveId} 
                    show={this.state.showSendCourseCardDialog} 
                    onClose={this.closeSelectCourseCard} 
                    onConfrim={this.onSelectCourseCard} 
                    />
            </div>
        );
    }

    onCloseRenameDialog = () => {
        this.setState({
            renameDialog: false
        });
    };

    onCloseDeleteDialog = () => {
        this.setState({
            deleteDialog: false
        });
    };
}

SpeakMedia.propTypes = {
    addForumSpeak: PropTypes.func,
    addSpeakImagePc: PropTypes.func,
    addSpeakImageWx: PropTypes.func,
    onFinished: PropTypes.func,
    addSpeakAudio: PropTypes.func,
    onOpenVideoDialog: PropTypes.func,
    onOpenDocDialog: PropTypes.func,
    uploadDoc: PropTypes.func,
    saveFile: PropTypes.func,
    uploadAudio: PropTypes.func
};
