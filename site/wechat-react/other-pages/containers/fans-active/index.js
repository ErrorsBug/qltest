import React,{Component} from 'react';
import Page from 'components/page';
import {connect} from 'react-redux';

import { autobind } from 'core-decorators';

import { locationTo } from 'components/util';

// action
import { pushOpsLive, fetchOpsLiveInfo, updateLeftPushNum, refreshFanNum } from '../../actions/fans-active';
/**
 * 粉丝激活页面
 */
@autobind
class FansActive extends Component {
    constructor(props){
        super(props);
        // this.liveId = props.location.query.liveId;
    }

    data = {
        // 是否刷新粉丝成功，只允许刷新一次
        refreshed: false,
    }

    state = {
        // 是否对接服务号
        isBind: !!(this.props.opsLiveInfo && this.props.opsLiveInfo.appId),
    }

    componentDidMount() {
        // 初始化三方直播间绑定信息
        if (!this.props.opsLiveInfo) {
            this.props.fetchOpsLiveInfo(this.props.location.query.liveId);
        }
    }

    // 推送按钮点击事件处理
    async onPushBtnClick() {
        let result = await this.props.pushOpsLive(this.props.location.query.liveId);

        if (result && result.state && result.state.code == 0) {
            window.toast('推送成功');
            this.props.updateLeftPushNum(this.props.opsLiveInfo.leftPushNum - 1);
        } else {
            window.toast(result.state.msg);
        }
    }

    // 刷新粉丝数点击事件处理
    async onRefreshBtnClick() {

        if (this.data.refreshed) {
            window.toast('已刷新成功，请稍后刷新页面查看');
            return;
        }


        let result = await this.props.refreshFanNum(this.props.location.query.liveId, this.props.opsLiveInfo.appId);

        if (result && result.state && result.state.code == 0) {
            window.toast('操作成功');

            this.data.refreshed = true;

        } else {
            window.toast(result.state.msg);
        }
    }

    render() {
        let { appName, totalFansNum, liveFocusNum, leftPushNum, appId, isSynced, } = this.props.opsLiveInfo;

        return (
            <Page title={'公众号粉丝激活'} className='fans-active-container'>
                {
                    this.state.isBind ? (
                        <div>
                            <div className="status block">
                                <div className="active">你已对接服务号</div>
                            </div>
                            <div className="wechat-info block">
                                <div className="title"><div className="app-name">公众号：{appName}</div>
                                {
                                    isSynced === 'Y'? null: (
                                        <div className="refresh-btn" onClick={this.onRefreshBtnClick}>刷新</div>
                                    )
                                }
                                </div>
                                <div className="info">公众号粉丝数：{totalFansNum}</div>
                                <div className="info">公众号已关注直播间粉丝数：{liveFocusNum}</div>
                                <div className="info">公众号未关注直播间粉丝数：{totalFansNum - liveFocusNum}</div>
                            </div>
                            <div className="push-info block">
                                <div className="title">推送直播间消息给未关注直播间的公众号粉丝<span>（本月剩余 <em>{leftPushNum}</em> 次机会）</span></div>
                                <div className="info">此功能用于推送给未关注直播间的粉丝来进行激活，激活后关注了直播间的粉丝才可收到新课通知。</div>
                                <div className="info">每次推送间隔需大于48小时，若当天推送粉丝过多，会隔天继续推送。</div>

                                <div className="btn push-btn" onClick={this.onPushBtnClick}>推送直播间</div>
                            </div>
                        </div>
                    ): (
                        <div>
                            <div className="status block">
                                <div className="no-active">你暂时未完成对接服务号</div>
                            </div>
                            <div className="tip">此功能需对接服务号后方可使用</div>
                            <div className="btn link-mobile" onClick={() => {
                                locationTo('/live/bindKaiFang.htm');
                            }}>
                            立即手机对接服务号</div>
                            <div className="btn link-pc"
                                onClick={() => {
                                locationTo('http://mp.weixin.qq.com/s/r5s3tMAxYd40VwFARuTbcw');
                            }}>
                            查看电脑对接方法</div>
                        </div>
                    )
                }
            </Page>
        );
    }
};

function mapStateToProps(state) {
    return {
        opsLiveInfo: state.fansActive.opsLiveInfo,
    };
}
const mapActionToProps = {
    pushOpsLive,
    fetchOpsLiveInfo,
    updateLeftPushNum,
    refreshFanNum,
};
module.exports = connect(mapStateToProps, mapActionToProps)(FansActive);
