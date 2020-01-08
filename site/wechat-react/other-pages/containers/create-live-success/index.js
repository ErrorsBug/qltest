import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Page from 'components/page';
import { connect } from 'react-redux';
import {locationTo} from 'components/util';
import { apiService } from 'components/api-service';

class CreateLiveSuccess extends Component {

    constructor (props) {
        super (props);
    }

    state = {
        isSubsribe: 1,
        qrCode: '',

    }

    componentDidMount () {
        this.getIsSubscribe();
    }

    getIsSubscribe = () => {
        apiService.post({
            url: '/h5/user/get',
            body: {

            }
        }).then(res => {
            if (res.state.code == 0) {
                this.setState({
                    isSubsribe: res.data.user.subscribe
                })
                if (res.data.user.subscribe == 0) {
                    this.getQr();
                }
            }
        }).catch(err => {
            console.error(err);
        })
    }

    visibleLog = () => {
        typeof _qla != 'undefined' && _qla.collectVisible();
    }

    getQr = () => {
        apiService.post({
            url: '/h5/live/getQr',
            body: {
                channel: 'newLiveEntity'
            }
        }).then(res => {
            if (res.state.code == 0) {
                this.setState({
                    qrCode: res.data.qrUrl
                }, () => {
                    this.visibleLog();
                })
            }
        })
    }

    render() {
        return (
            <Page title={`直播间创建成功`} className="create-live-success-page">
                <div className="success-gift-tips clearfix">
                    <div className="title">·加入社群马上领取新手福利·</div>
                    <ul className="content">
                        <li>①手把手教你5天玩转千聊</li>
                        <li>②结识更多的业内讲师，共同进步</li>
                        <li>③入群即可获得价值699元的资料礼包</li>
                        <li>④可享受最新平台扶持计划</li>
                    </ul>
                </div>
                {
                    this.state.isSubsribe == "1" ? 
                    <div className="btn-jion-chat on-log" data-log-region="create_live_novice" onClick={()=>{locationTo('http://qlkthb.zf.qianliao.net/wechat/page/activity/wcGroup/qrCode?id=2000001445246139')}}>马上加入新手社群</div> :
                    <div className="qrcode-box">
                        <img src={this.state.qrCode} className="on-visible" data-log-region="visible-create_live_scan" data-log-pos="newLiveEntity"/>
                        <span class='title'>扫码关注“千聊”加入新手社群</span>
                    </div>
                }
                <div className="btn-next-time on-log" data-log-region="create_live_next" onClick={()=>{locationTo('/wechat/page/backstage')}}>下次再说</div>
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

module.exports = connect(mapStateToProps, mapActionToProps)(CreateLiveSuccess);