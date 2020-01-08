import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';

import Page from 'components/page'
import ScrollToLoad from 'components/scrollToLoad'
import { formatDate, imgUrlFormat, locationTo } from 'components/util'
import { liveGetSubscribeInfo, fetchGetQr } from 'actions/live';
import { doPay } from 'common_actions/common'
import { fetchCampInfo } from '../../actions/camp'

import qrcodeImg from './qrcode.png'

function mstp(state) {
    return {
        sysTime: state.common.sysTime,
        payCampObj: state.payCamp,
    }
}

const matp = {
    liveGetSubscribeInfo,
    fetchGetQr,
    fetchCampInfo,
}

class CampPayFinish extends Component {

    constructor(props){
        super(props);
        this.liveId = 140000000000101;
        this.campId = props.location.query.campId;
    }

    state = {
        qrUrl: '',
        campInfo: {},
        subResult: {},
    }

    componentDidMount = () => {
        this.initInfo()
        setTimeout(()=>{
            this.initQrCode()
        },0)
    }
    async initInfo(){
        const result = await this.props.fetchCampInfo(this.campId);
        if(result.state.code === 0){
            this.setState({campInfo: result.data.trainCampPo})
        }
    }
    initQrCode = async () => {
        const subResult = await this.props.liveGetSubscribeInfo(this.liveId)
        let qrUrl = ''
        let qrResult
        if(!subResult.subscribe) {
            qrResult = await this.props.fetchGetQr('traincamp', this.liveId, '', this.campId, '', 'Y');
            qrUrl = qrResult && qrResult.data && qrResult.data.qrUrl || ''
        } else {
            qrUrl = this.state.campInfo.communityUrl
        }

        this.setState({
            qrUrl: qrUrl,
            subResult,
        })
    }
    render() {
        let campInfo = this.state.campInfo;
        return (
            <Page title={'支付成功'} className='camp-finish-pay-page'>
                <div className='pay-header'>
                    <div className="icon_choosethis"></div>
                    <p className="success">恭喜你，支付成功</p>
                    <p className="des">课程购买后可支持回听哦</p>
                </div>

                <div className="des-con">
                    <span className="type">训练营名称: </span>
                    <span className="course">{campInfo.name}</span>
                </div>

                <div className="enter-camp-btn on-log" 
                    onClick={()=>{locationTo('/wechat/page/camp/' + this.campId + '?actId=' + campInfo.activityCode)}}
                    data-log-camp_id={this.campId}
                    data-log-region="enter-camp">进入训练营</div>

                {
                    this.state.qrUrl && !this.state.subResult.subscribe && <div className="qrcode-con">
                        <img src={this.state.qrUrl} />
                        <p className="red-des">长按二维码，关注我们</p>
                        <p className="des">再也不用担心找不到上课入口啦</p>
                    </div>
                }

                {
                    this.state.qrUrl && this.state.subResult.subscribe && <div className="qrcode-con">
                        <img className='img' src={qrcodeImg}/>
                        <p className="des1"> 
                            扫码添加千聊小管家  
                            <div className="line-wrap">
                            添加好友后，在对话聊天框中回复<var>【变美】</var>加入训练营社群
                            </div>
                        </p>
                    </div>
                }

            </Page>
        );
    }
}




export default connect(mstp, matp)(CampPayFinish);
