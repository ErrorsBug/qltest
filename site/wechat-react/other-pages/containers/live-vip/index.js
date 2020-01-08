import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Page from 'components/page';
import ScrollView from 'components/scroll-view';
import { getPower, getLiveInfo } from '../../actions/live';
import { getGeneralVipInfo, getCustomVipList } from '../../actions/vip';
import { imgUrlFormat, locationTo, getVal, formatMoney } from 'components/util';

function formatTime(expiryTime){
    let currentTime = new Date().getTime()
    let gapTime = (Number(expiryTime) - currentTime) / 1000
    let day = Math.floor(gapTime / 3600 / 24)
    let hour = Math.floor(gapTime / 3600)
    if(gapTime > 0){
        if(day > 0){
            return day + '天后过期'
        } else {
            return hour + '小时后过期'
        }
    }else {
        return '已过期'
    }
}

class LiveVip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            liveId: props.location.query.liveId,
            shareKey: props.location.query.shareKey,

            generalVip: {
                status: '',
                data: null,
                message: '',
            },

            customVipList: {
                status: '',
                data: null,
                message: '',
                page: {
                    page: 0,
                    size: 10
                }
            }
        }
    }

    componentDidMount() {
        this.props.getPower(this.state.liveId);
        this.props.getLiveInfo(this.state.liveId);
        this.getGeneralVipInfo();
        this.getCustomVipList();
    }

    render() {
        let { generalVip, customVipList } = this.state;
        let { liveInfo, power } = this.props;
        let avatar = getVal(liveInfo, 'entity.logo')

        return (
            <Page title="开通会员" className="p-live-vip">
                <ScrollView onScrollBottom={this.getCustomVipList}>

                    <div className="header">
                        {/* {
                            avatar &&
                            <div className="avatar" style={{backgroundImage: `url(${imgUrlFormat(avatar, '?x-oss-process=image/resize,h_60,w_60')})`}}></div>
                        } */}
                    </div>  
            
                    <div className="vip-list-wrap general-vip-list-wrap">
                        <div className="list-title">通用会员卡</div>
                        <div className="list">
                            <GeneralVip
                                data={generalVip.data}
                                liveId={this.state.liveId}
                                isAdmin={power.allowMGLive}
                                shareKey={this.state.shareKey}
                                />
                        </div>
                    </div>

                    {
                        customVipList.data && customVipList.data.length ?
                        <div className="vip-list-wrap custom-vip-list-wrap">
                            <div className="list-title">定制会员卡</div>
                            <div className="list">
                                {
                                    (customVipList.data || []).map(item => {
                                        return <CustomVip key={item.id} 
                                            liveId={this.state.liveId}
                                            data={item}
                                            isAdmin={power.allowMGLive}
                                        />
                                    })
                                }
                            </div>
                            <div className="load-more-status" onClick={this.getCustomVipList}>
                                <span>
                                    {
                                        customVipList.status === 'pending' ? '加载中' :
                                        customVipList.status === 'end' ? '到底啦' : '加载更多'
                                    }
                                </span>
                            </div>
                        </div> : false
                    }
                </ScrollView>
            </Page>
        );
    }

    getGeneralVipInfo = () => {
        
        this.props.getGeneralVipInfo(this.state.liveId)
            .then(res => {
                if (res.status === 'error') throw Error(res.message);
                this.setState({
                    generalVip: {
                        ...this.state.generalVip,
                        status: 'success',
                        data: res.data
                    }
                })
            })
            .catch(err => {
                console.error(err);
                window.toast(err.message);
            })
    }

    getCustomVipList = e => {
        if (/pending|end/.test(this.state.customVipList.status)) return;

        let page = {...this.state.customVipList.page};
        page.page++;

        this.setState({
            customVipList: {
                ...this.state.customVipList,
                status: 'pending'
            }
        })

        this.props.getCustomVipList(this.state.liveId, page)
            .then(res => {
                if (res.state.code) throw Error(res.state.msg);

                let data = (this.state.customVipList.data || []).concat(res.data.list || []);
                let status = data.length >= res.data.count ? 'end' : 'success';

                this.setState({
                    customVipList: {
                        ...this.state.customVipList,
                        count: res.data.count,
                        status,
                        data,
                        page
                    }
                })
            })
            .catch(err => {
                console.error(err);
                window.toast(err.message);
                this.setState({
                    customVipList: {
                        ...this.state.customVipList,
                        status: 'error',
                        message: err.message
                    }
                })
            })
    }
}




class GeneralVip extends Component {
    render() {
        let { data, isAdmin } = this.props,
            isOpenVip = data && data.isOpenVip === 'Y',
            tryoutConfig,
            chargeConfig;
        
        if(!data){
            return ''
        }
        if (isOpenVip && data.vipChargeconfig) {
            chargeConfig = data.vipChargeconfig.filter(item => item.type == 'live').sort((l,r) => {
                return l.amount - r.amount
            })[0]
            tryoutConfig = data.vipChargeconfig.find(item => item.type == 'tryout');
        }

        return (
            <div className="vip-item general-vip" onClick={this.onClick} >
                <div className="left">
                    <div className="img"></div>
                </div>
                <div className="right">
                    <div className="title">直播间通用会员卡</div>
                    <div className="info-item">
                        <div className="desc">有效期内畅听店内所有课程</div>
                    </div>
                    <div className="flex-grow-1"></div>
                    {
                        isOpenVip ? 
                        <div className={`btn${data.isVip === 'Y' ? '' : ' open'}`}>
                            <div className="price-wrap">
                                <var>￥</var>{chargeConfig && formatMoney(chargeConfig.amount)}
                                <span>/{chargeConfig && chargeConfig.chargeMonths}个月</span>
                            </div>
                            {!isAdmin &&
                                <div className="state">
                                    {data.isVip === 'Y' ? '立即续费' : '立即开通'}
                                    {
                                        data.isVip === 'Y' ? 
                                        (data.expiryTime ?  <span className="tip">{formatTime(data.expiryTime)}</span> : null) :
                                        (
                                            tryoutConfig ?
                                            <span className="tip">新用户¥{tryoutConfig && formatMoney(tryoutConfig.amount)}试用</span> : null
                                            
                                        )
                                    }
                                </div>
                            }
                        </div>
                        : <div className="btn admin-not-open">直播间未开启此VIP</div>
                    }
                </div>
            </div>
        )
    }

    onClick = e => {
        // 开启了会员功能或用户是管理员，则跳转
        let { data, isAdmin } = this.props;
        if (data.isOpenVip === 'Y') {
            locationTo(`/wechat/page/live-vip-details?liveId=${this.props.liveId}`)
        } else if(isAdmin) {
            locationTo(`/wechat/page/live-vip-setting?liveId=${this.props.liveId}`)
        }

    }
}



class CustomVip extends Component {
    render() {
        let { id, name, imageUrl, amount, month, chargeconfigPos, authStatus, topicNum, channelNum, authExpireTime } = this.props.data;
        let { isAdmin } = this.props;
        let normalConfig = chargeconfigPos.filter(item => item.type == 'customVip')[0];
        let tryoutConfig = chargeconfigPos.filter(item => item.type == 'tryout')[0];

        return (
            <div className="vip-item custom-vip" onClick={()=>{locationTo(`/wechat/page/live-vip-details?liveId=${this.props.liveId}&id=${id}`)}}>
                <div className="left">
                    <div className="img" style={{backgroundImage: `url(${imgUrlFormat(imageUrl, '?x-oss-process=image/resize,h_180,w_290')})`}}></div>
                </div>
                <div className="right">
                    <div className="title">{name}</div>
                    {
                        channelNum && topicNum ? 
                        <div className="info-item">
                            <div className="desc">{`包含精品${channelNum ? '，' + channelNum + '个系列课' : ''}${topicNum ? '，' + topicNum + '个单课' : ''}`}</div>
                        </div> : null
                    }
                    <div className="flex-grow-1"></div>
                    <div className={`btn${authStatus === 'Y' ? '' : ' open'}`}>
                        <div className="price-wrap">
                            <var>￥</var>{normalConfig && formatMoney(normalConfig.amount)}
                            <span>/{normalConfig && normalConfig.chargeMonths}个月</span>
                        </div>
                        {!isAdmin &&
                            <div className="state">
                                {authStatus === 'Y' ? '立即续费' : '立即开通'}
                                {
                                    authStatus === 'Y' ? 
                                    <span className="tip">{formatTime(authExpireTime)}</span> :
                                    (
                                        tryoutConfig ?
                                        <span className="tip">新用户¥{tryoutConfig && formatMoney(tryoutConfig.amount)}试用</span> : null
                                        
                                    )
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}





function mapStateToProps(state) {
    return {
        liveInfo: state.live.liveInfo,
        power: getVal(state,'live.power',{}),
    }
}

const mapDispatchToProps = {
    getLiveInfo,
    getPower,
    getGeneralVipInfo,
    getCustomVipList,
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(LiveVip)