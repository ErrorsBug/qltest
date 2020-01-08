import * as React from "react";
import { imgUrlFormat } from "components/util";
import { connect } from "react-redux";

class MessageComponent extends React.Component<
    {   
        headImgUrl: string;
        name: string;
        content: string;
        consultTime: number;
        isReply?: string;
        replyTime?: number;
        replyContent?: string;
        replyId?: number;
        id: number;
        status: string;
        setSelection: (id: number, status: string) => void;
        onClickReply: (
            replyPeople: string,
            replyType: string,
            initialValue: string,
            id: number,
            replyId: number
        ) => void;
        sysTime: number
    },
    {}
> {
    setSelection = () => {
        this.props.setSelection(
            this.props.id,
            this.props.status == "recall" ? "publish" : "recall"
        );
    };

    formatDate = (timeStamp, now = Date.now())=>{
        let date = new Date(timeStamp);
        const timeDiff = now - timeStamp;
        if (timeDiff < 0) return '刚刚';
        if (timeDiff / 1000 / 60 / 60 / 24 > 7) {
            return date.getFullYear() + '年' + (date.getMonth()+1) + '月' + date.getDate() + '日';
        } else if (timeDiff / 1000 / 60 / 60 < 1) {
            if (timeDiff / 1000 / 60 > 1) return Math.floor(timeDiff / 1000 / 60) + '分钟前';
            return '刚刚'
        } else if (timeDiff / 1000 / 60 / 60 / 24 < 1) {
            return Math.floor(timeDiff / 1000 / 60 / 60) + "个小时前";
        } else {
            return Math.floor(timeDiff / 1000 / 60 / 60 / 24) + "天前"
        }
    }

    reply = () => {
        let replyType = this.props.isReply == "Y" ? "modify" : "first";
        let replyPeople = this.props.name;
        this.props.onClickReply(
            replyPeople,
            replyType,
            this.props.replyContent,
            this.props.id,
            this.props.replyId
        );
    };

    render() {
        return (
            <div className="message">
                <div className="left-part">
                    <img src={imgUrlFormat(this.props.headImgUrl)} alt="" />
                </div>
                <div className="right-part">
                    <div className="nickname">{this.props.name}</div>
                    <div className="date">{this.formatDate(this.props.consultTime, this.props.sysTime)}</div>
                    <div className="info">{this.props.content}</div>
                    {this.props.isReply == "Y" ? (
                        <div className="reply-container">
                            <div className="live-reply">直播间回复</div>
                            <div className="reply-date">
                                {this.formatDate(this.props.replyTime, this.props.sysTime)}
                            </div>
                            <div className="reply-info">
                                {this.props.replyContent}
                            </div>
                        </div>
                    ) : null}
                    <div className="btn-panel">
                        <div className="pick-up" onClick={this.setSelection}>
                            <span
                                className={
                                    "icon-pick " +
                                    (this.props.status == "publish"
                                        ? "publish"
                                        : "")
                                }
                            >
                                <svg
                                    height="100%"
                                    width="100%"
                                    version="1.1"
                                    viewBox="0 0 35 32"
                                    style={{
                                        fill: "currentColor"
                                    }}
                                >
                                    <g
                                        id="整理"
                                        strokeLinecap="round"
                                        strokeWidth="1"
                                    >
                                        <g
                                            id="iPhone-8-Copy-3"
                                            stroke={
                                                this.props.status == "publish"
                                                    ? "#F73657"
                                                    : "#666666"
                                            }
                                            strokeWidth="3.1"
                                            transform="translate(-382.000000, -1287.000000)"
                                        >
                                            <g
                                                id="Group-2-Copy"
                                                transform="translate(381.000000, 1285.000000)"
                                            >
                                                <path
                                                    id="形状-7"
                                                    d="M31.9893469,19.2187484 C34.9492194,15.400127 34.7066532,9.80287622 31.2504243,6.28245981 C27.7793611,2.74673069 22.2502384,3.22535079 18.500149,6.28245981 C14.7498094,3.22535079 9.22093692,2.74673069 5.74940907,6.28245981 C2.29343034,9.80287622 2.05082838,15.400127 5.01045073,19.2187484 L5.35271001,19.6265309 C5.48275067,19.7768441 5.6081802,19.9304619 5.74940907,20.0740676 L17.0800958,31.6153287 C17.8525641,32.4021529 19.1121216,32.3970174 19.8820974,31.6153287 L31.2504243,20.0740676 C31.3916532,19.9304619 31.5170827,19.7768441 31.647588,19.6265309 L31.9893469,19.2187484 Z"
                                                />
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </span>
                            <span className="text">
                                {this.props.status == "publish"
                                    ? "取消精选"
                                    : "设为精选"}
                            </span>
                        </div>
                        <div className="modify-remain" onClick={this.reply}>
                            <span className="icon-modify">
                                <svg
                                    height="100%"
                                    width="100%"
                                    version="1"
                                    viewBox="0 0 34 34"
                                >
                                    <g fill="none">
                                        <path
                                            d="M11 31l6 1a15 15 0 1 0-12-6v5l1 1 5-1z"
                                            stroke="#666"
                                            strokeWidth="3"
                                        />
                                        <path
                                            d="M11 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM23 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                                            fill="#666"
                                        />
                                    </g>
                                </svg>
                            </span>
                            <span className="text">
                                {this.props.isReply == "Y"
                                    ? "修改留言"
                                    : "回复留言"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    static defaultProps = {
        headImgUrl: ''
    }
}

const mapState2Props = state => {
    return {
        sysTime: state.common.sysTime
    }
}

let Message = connect(mapState2Props, {})(MessageComponent)

export { Message }