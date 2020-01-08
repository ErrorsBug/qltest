import React from "react";
import dayjs from "dayjs";
import { locationTo } from "../../../../../components/util";

import "./style.scss";
/**
 * 消息组件，用于代理消息属性，方法
 * 抽出公共样式
 */
export default (param = {}) => WrappedComponent =>
    class extends React.Component {
        clickMessage = () => {
            if (this.props.message.url) {
                locationTo(this.props.message.url);
            }
            this.props.onClick &&
                this.props.onClick(this.props.tabType, this.props.message);
        };

        render() {
            const { header, message } = this.props;
            return (
                <div
                    className={[
                        "message-item",
                        message.isRead === "N" ? "never-read" : null
                    ].join(" ")}
                    onClick={this.clickMessage}
                >
                    {header !== null && (
                        <div className="header">
                            <span className="title">
                                {message.title || param.title}
                            </span>
                            <span className="time">
                                {message.createTime &&
                                    dayjs(message.createTime).format(
                                        "YYYY-MM-DD HH:mm"
                                    )}
                            </span>
                        </div>
                    )}
                    <WrappedComponent {...this.props} />
                </div>
            );
        }
    };
