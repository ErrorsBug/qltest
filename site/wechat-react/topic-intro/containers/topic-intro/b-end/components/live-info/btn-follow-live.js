import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getVal } from 'components/util';
import { autobind} from 'core-decorators';

import FollowDialog from 'components/follow-dialog';

import {
    followLive,
} from '../../../../../actions/topic-intro';
import { whatQrcodeShouldIGet } from 'common_actions/common';

import FollowLiveQlMidDialog from '../follow-live-ql-middle-dialog';


@autobind
class BtnFollowLive extends Component {

    state = {
        showDialog:false,
        qrUrl :'',
        qrAppId: '',
    }
    
    async followLive(state) {
        await this.props.followLive(this.props.liveId, state);

        
        this.getQrCode(state)
        
    }

    async getQrCode(state) {
        if (state == 'N') {
            return false;
        }
        let {liveId, id } = this.props.topicInfo;
        let {isLiveAdmin } = this.props.isLiveAdmin;

        let result = await whatQrcodeShouldIGet({
            isLiveAdmin,
            isBindThird: this.props.isSubscribe.isBindThird ? 'Y' : 'N',
            isFocusThree: this.props.isSubscribe.isFocusThree ? 'Y' : 'N',
            options: {
                subscribe: this.props.isSubscribe.subscribe ? 'Y' : 'N', 
                channel: '210',
                liveId: liveId,
                topicId: this.props.topicInfo.id,
            }
        });

        if(result){
            this.setState({
                showDialog:true,
                qrUrl: result.url,
                qrAppId: result.appId,
            }, () => {
                if (this.state.qrUrl) {
                    this.followDialogDom.show()
                }
            })
        }
    }

    hideDialog() {
        this.setState({
            showDialog:false,
        })
    }

    render() {
        if (this.props.power.allowMGLive) {
            // 管理权限不显示关注按钮
            return null;
        } else if (this.props.isFollow.isFollow) {
            const followDialogOption = {
                traceData: 'topicIntroFollowLiveQrcode',
                channel: '210',
                appId: this.state.qrAppId
            }
            return (
                [
                    <span key='btn'
                          className="btn-follow-live is-follow on-log"
                          onClick={() => { this.followLive('N') }}
                          data-log-name="取消关注"
                          data-log-region="btn-follow-live"
                          data-log-pos="N"
                    >
                        取消关注
                    </span>,
                    <FollowDialog
                        ref={ dom => dom && (this.followDialogDom = dom) }
                        title='关注我们'
                        desc='接收开课提醒、优惠福利再也不怕漏掉精彩内容了'
                        qrUrl={ this.state.qrUrl }
                        option={ followDialogOption }
                    />
                ]
            );
            
        } else {
            return (
                <span className="btn-follow-live icon_plus on-log"
                      onClick={()=>{this.followLive('Y')}}
                      data-log-name="关注"
                      data-log-region="btn-follow-live"
                      data-log-pos="Y"
                >
                    关注
                </span>
            );
            
        }
    }
}


function mapStateToProps (state) {
    return {
        userId: getVal(state, 'topicIntro.userId'),
        liveId: getVal(state, 'topicIntro.topicInfo.liveId'),
        topicInfo : getVal(state, 'topicIntro.topicInfo', {}),
        liveInfo : getVal(state, 'topicIntro.liveInfo', {}),
        isSubscribe:getVal(state, 'topicIntro.isSubscribe',{}),
        isFollow:getVal(state, 'topicIntro.isFollow',{}),
        isLiveAdmin:getVal(state, 'topicIntro.isLiveAdmin',{}),
        shareKey:getVal(state, 'topicIntro.shareKey',{}),
        power:getVal(state, 'topicIntro.power', {}),
    }
}

const mapActionToProps = {
    followLive
}

module.exports = connect(mapStateToProps, mapActionToProps)(BtnFollowLive);