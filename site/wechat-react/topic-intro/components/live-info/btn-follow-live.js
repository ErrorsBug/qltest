import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getVal } from 'components/util';
import { autobind} from 'core-decorators';

import {
    followLive,
} from '../../actions/topic-intro';
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
        if(this.props.tracePage === 'coral'){
            return false;
        }

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
                    (
                    (this.state.qrUrl && this.state.showDialog)?
                        <FollowLiveQlMidDialog
                            key = 'dialog'
                            qrUrl = {this.state.qrUrl}
                            appId = {this.state.qrAppId}
                            hide = {this.hideDialog}
                            channel = "210"
                        />
                    :null    
                    )
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