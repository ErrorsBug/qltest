import * as React from 'react';
import {connect} from 'react-redux';
import {autobind} from 'core-decorators';
import Page from 'components/page';

@autobind
class UserManager extends React.Component {

    get liveId() {
        let param = this.props.params.liveId || ''
        if(/\.htm|\.html/gi.test(param)) {
            param = param.replace(/\.htm|\.html/gi, '')
        }
        return param || ''
    }

    render() {
        return (
            <Page title="权限管理" className="user-manager-container">
                <div className="main_box_4">
                    <dl className="user_manage_list">
                        <dd className="user_dd on-log" data-log-region="live-black-list">
                            <a href={`/live/invite/mgrList/${this.liveId}.htm`}
                            className="list_btn_2 qlbmb_black_user">直播间管理员</a>
                        </dd>
                        <dd className="user_dd on-log" data-log-region="guest-separate">
                            <a href={`/wechat/page/guest-separate/channel-list-b?liveId=${this.liveId}`}
                               className="list_btn_2 qlbmb_black_user">直播间嘉宾分成</a>
                        </dd>
                        <dt className="user_dt">
                            <dd className="user_dd on-log" data-log-region="keep-silent">
                                <a href={`/live/entity/blackList/${this.liveId}.htm`}
                                className="list_btn_2 qlbmb_user_shutup">直播间禁言用户</a>
                            </dd>
                            <dd className="user_dd on-log" data-log-region="live-black-list">
                                <a href={`/live/entity/enterBlacklist.htm?liveId=${this.liveId}`}
                                className="list_btn_2 qlbmb_black_user">直播间黑名单用户</a>
                            </dd>
                        </dt>
                        <dt className="user_dt">
                            <dd className="user_dd on-log" data-log-region="live-black-list">
                                <a href={`/live/entity/liveReward/${this.liveId}.htm`}
                                className="list_btn_2 qlbmb_black_user">赞赏设置</a>
                            </dd>
                            <dd className="user_dd on-log" data-log-region="live-black-list">
                                <a href={`/wechat/page/evaluation-setting?liveId=${this.liveId}`}
                                className="list_btn_2 qlbmb_black_user">评价设置</a>
                            </dd>
                        </dt>
                        {/* <dd className="user_dd on-log on-visible" data-log-region="recycle-btn">
                            <a href={`/wechat/page/recycle?liveId=${this.liveId}`}
                               className="list_btn_2 qlbmb_black_user">回收站管理</a>
                            </dd> */}
                    </dl>
                    <div className="back-btn on-log" data-log-region="btn-goto-backstage">
                        <a href="/wechat/page/backstage">返回直播间工作台</a>
                    </div>
                </div>
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({});

const mapActionToProps = {}

export default connect(mapStateToProps, mapActionToProps)(UserManager);
