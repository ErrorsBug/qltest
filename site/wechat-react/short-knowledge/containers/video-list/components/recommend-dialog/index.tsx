import * as React from "react";
import * as ReactDOM from "react-dom";

interface Props {
    currentState: OpenRecommendState;
    onClose(): void;
    onChange(state: OpenRecommendState):void;
}

export enum OpenRecommendState {
    close = 'close',
    open = 'open'
}

const RecommendDialog = ({ currentState, onClose, onChange }: Props) => {
    return ReactDOM.createPortal(
        <div className="recommend-dialog_FDGDG">
            <div className="dialog-middle">
                <div className="header">热门推荐规则</div>
                <div className="body">
                    <ul>
                        <li>
                            ·如果开启了热门推荐，直播间内的短知识会被推荐给更多用户，还有机会在千聊首页曝光；
                        </li>
                        <li>
                            ·点赞数、评论数、播放数和分享数越高，短视频越容易被推荐
                        </li>
                        <li>
                            ·开启后，直播间内的短知识，都被加上“热门推荐”入口，如下图
                        </li>
                    </ul>
                    <div className="img-wrap">
                        <img src={'https://img.qlchat.com/qlLive/liveComment/LLQAFPZ2-R8YM-9LQT-1556263731979-8H7PCLSI2NHP.png?x-oss-process=image/resize,h_800,w_800'} />
                    </div>
                </div>
                <div className="footer">
                    <div className="btn-wrap" onClick={() => {
                        currentState == OpenRecommendState.open ? onChange(OpenRecommendState.close) : onClose()
                    }}>
                        {currentState == OpenRecommendState.open ? (
                            <span >关闭功能</span>
                        ) : (
                            <span>取消</span>
                        )}
                    </div>
                    <div className="btn-wrap" onClick={() => {
                            currentState == OpenRecommendState.close ? onChange(OpenRecommendState.open) : onClose()
                        }}>
                        {currentState == OpenRecommendState.open ? (
                            <span style={{
                                color: '#F73657'
                            }}>继续使用</span>
                        ) : (
                            <span style={{
                                color: '#F73657'
                            }}>开启</span>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.querySelector(".portal-high")
    );
};

RecommendDialog.defaultProps = {
    currentState: OpenRecommendState.close,
    onClose: () => {},
    onChange: () => {}
};

export default RecommendDialog;
