const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { autobind } from 'core-decorators';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';

import Page from 'components/page';
// import TabBar from 'components/tabbar';
import { BottomDialog, Confirm } from 'components/dialog';
import { locationTo, imgUrlFormat } from 'components/util';
import { share } from 'components/wx-utils';

import VipCardNoVip from './components/vip-card-no-vip';
import VipCardIsVip from './components/vip-card-is-vip';
import VipCardMgr from './components/vip-card-mgr';

@graphql(gql`
    query LiveVip($liveId: String) {
        # 权限
        power(liveId: $liveId) {
            allowMGLive
        }

        # 用户VIP信息
        liveVipInfo(liveId: $liveId) {
            # VIP收费描述
            vipDesc
            # VIP过期时间
            expiryTime
            # 直播间是否打开VIP: Y or N
            isOpenVip
            # 是否直播间VIP: Y or N
            isVip
        }

        # 用户信息
        curUserInfo {
            userId
            headImgUrl
            name
        }
    }
`, {
    options: props => ({
        variables: {
            liveId: props.params.liveId,
        },
        ssr: false
    })
})
@withApollo
@autobind
class LiveVip extends Component {

    constructor(props, context) {
        super(props, context);

        this.liveId = props.params.liveId;
        this.shareKey = props.location.query.shareKey;
    }

    state = {
    }

    data = {
    }

    async componentDidMount() {
        // share({
        //     title: '千聊-最有用的知识分享平台',
        //     timelineTitle: '千聊-最有用的知识分享平台，海量精选课程等你来听',
        //     desc: '海量专家、老师、达人正在为您分享',
        //     timelineDesc: '海量专家、老师、达人正在为您分享', // 分享到朋友圈单独定制
        //     imgUrl: 'https://img.qlchat.com/qlLive/liveCommon/ql-logo-2.png',
        // });
    }

    dangerHtml = content => {
        content = content.replace(/\n/g, '<br />')
        return { __html: content }
    }

    render() {
        const { loading, power, liveVipInfo, curUserInfo } = this.props.data;
        if (loading) {
            return null;
        }

        const isB = power.allowMGLive;

        return (
            <Page title={"会员"} className='live-vip-container'>
                {
                    isB ?
                        <VipCardMgr liveId={ this.liveId } isOpenVip={ liveVipInfo.isOpenVip } shareKey={ this.shareKey } />
                        :
                    liveVipInfo.isVip === 'Y' ?
                        <VipCardIsVip {...liveVipInfo} {...curUserInfo} liveId={ this.liveId } shareKey={ this.shareKey } />
                        :
                        <VipCardNoVip liveId={ this.liveId }  isOpenVip={ liveVipInfo.isOpenVip } shareKey={ this.shareKey } />
                }
                

                <section className='intro-container'>
                    <header className='intro-head'>特权说明</header>

                    <ul className='power-list'>
                        <li>
                            <span>尊贵标识</span>
                            <p>直播间VIP将带有醒目的会员标识，尽显尊贵的学员身份</p>
                        </li>
                        <li>
                            <span>付费课程</span>
                            <p>直播间VIP在会员期间内可享受收听所有加密和付费课程，性价比更高</p>
                        </li>
                        <li>
                            <span>专属服务</span>
                            <p>直播间VIP与讲师走得更近，享有更多一对一的专属会员服务</p>
                        </li>
                        {
                            liveVipInfo.vipDesc && 
                                <li>
                                    <span>*直播间VIP服务描述*</span>
                                    <p dangerouslySetInnerHTML={ this.dangerHtml(liveVipInfo.vipDesc) }></p>
                                </li>
                        }
                    </ul>
                </section>
            </Page>
        );
    }
}


function mapStateToProps (state) {
    return {
    }
}

const mapActionToProps = {
}

module.exports = connect(mapStateToProps, mapActionToProps)(LiveVip);
