import React from "react";
import { autobind } from "core-decorators";
import { CopyToClipboard } from 'react-copy-to-clipboard';

const IMG_PATH =
    "https://img.qlchat.com/qlLive/activity/image/4FZUCKCC-GO1M-4O3L-1568620686615-NVZYRI7ETLHI.png";

@autobind
class GroupPushDialog extends React.Component {
    state = {
        show: false
    };
    


    data = {
        textarea: null,
    }

    show() {
        this.setState({ show: true });
    }

    hide() {
        this.setState({ show: false });
    }

    render() {
        const { isRelated } = this.props;
        if (!this.state.show) {
            return "";
        }
        return (
            <div className="group-push-dialog">
                <div className="bg" onClick={this.hide}></div>
                <div className="push-rule-container">
                    <div className="close" onClick={this.hide}>
                        <img src={require('../../img/close.png')} alt=""/>
                    </div>
                    <div className="top">
                        {isRelated ? "社群使用说明" : "如何关联社群？"}
                    </div>
                    <textarea hidden value="123" readOnly ref={ref => this.data.textarea = ref}></textarea>
                    <div className="main-content">
                        <div className="desc">
                            <p>
                                {isRelated ? (
                                    <>
                                        {"如何通过社群把消息推送给我的学员呢？"}
                                        <br />
                                        {
                                            "在本页面的推荐语文本框，输入你要推送的内容。如推荐语为空，则采用系统默认的文案哦~"
                                        }
                                    </>
                                ) : (
                                    "只有课程关联了社群，才能把推送的消息通过微信群送达给学员~"
                                )}
                            </p>
                        </div>
                        <div className="">
                            <b className="title">
                                学员将会在微信群内收到你所推送的内容，如下示例图：
                            </b>
                            <div className="img-wrap">
                                <img src={IMG_PATH} alt="" />
                            </div>
                            <b className="title">
                                {isRelated
                                    ? "其他方法："
                                    : "如何让我的课程关联社群呢？"}
                            </b>
                            <p>
                                {isRelated ? (
                                    <>
                                        登录
                                        <span>【新建社群】</span>
                                        ，根据提示完成关联设置即可
                                    </>
                                ) : (
                                    <>
                                        登录PC端后台首页（链接：http://v.qianliao.tv）-社群模块，选择
                                        <span>
                                            PC端后台-社群模块-自动化管理，
                                        </span>
                                        设置要推送的消息并保存，即可推送成功。
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                    {isRelated ? null : (
                        <div className="btn-group">
                            <CopyToClipboard
                                className="btn"
                                text={"http://v.qianliao.tv"}
                                onCopy={ () =>{
                                    window.toast(`复制成功`)
                                }}
                            >
                               <span>复制PC后台链接</span> 
                            </CopyToClipboard>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default GroupPushDialog;
