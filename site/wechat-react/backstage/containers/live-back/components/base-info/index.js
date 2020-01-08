import React from 'react';
import PropTypes from 'prop-types';
import { formatDate , locationTo, numberFormat } from 'components/util';
import { CSSTransition } from 'react-transition-group';

import './style.scss'

class BaseInfo extends React.PureComponent {
    render() {
        const {
            liveId,
            liveInfo,
            liveBaseInfo,
            toDoTips = 0
        } = this.props

        const isLiveAdmin = liveBaseInfo.isLiveAdmin === 'Y'

        return liveInfo && liveBaseInfo && liveBaseInfo.isLiveAdmin ? (
            <div className={`live-base-info ${isLiveAdmin ? 'admin' : 'base'}`}>
                <div className="info-head">
                    <div className="info-cover on-log" data-log-region="live-setting" onClick={()=>{locationTo(`/wechat/page/live-setting?liveId=${liveId}`)}}>
                        <img src={`${liveInfo.logo ? (liveInfo.logo+'@300w_300h_1e_1c_2o') :"https://img.qlchat.com/qlLive/liveCommon/liveHead.png@300w_300h_1e_1c_2o"}`} />
                        {toDoTips > 0 ? <span className="to-do-tips">{toDoTips}</span> : null}
                    </div>
                    <div className="info-name">
                        {
                            // 是否专业版
                            isLiveAdmin ?
                            <div className="live-edition admin on-log" data-log-region="upgradeVersion" data-log-pos="paid" onClick={()=>{locationTo(`/topic/live-studio-intro`)}}>
                                <div className="tips-btn"><p>{formatDate(liveBaseInfo.liveAdminOverDue)}到期</p></div>
                            </div>
                            :
                            <div className="live-edition base on-log" data-log-region="upgradeVersion" data-log-pos="free" onClick={()=>{locationTo(`/topic/live-studio-intro`)}}>
                                <div className="tips-btn"><p>升级专业版</p></div>
                            </div>
                        }
                    </div>
                    <div className="info-quick-entry">
                        <div className="btn type-1 on-log" data-log-region="choose-live" onClick={()=>{locationTo(`/wechat/page/live-change?liveId=${liveId}`)}}><span>切换直播间</span><i className="icon icon-toggle"></i></div>
                        <div className="btn type-2 on-log" data-log-region="mine" onClick={()=>{locationTo('/wechat/page/mine')}}><span>个人中心</span><i className="icon icon-back"></i></div>
                    </div>
                </div>

                <div className="info-data">
                    <div>
                        <InfoDateItem
                            title="粉丝"
                            data={liveInfo.fansNum || 0}
                            className="on-log"
                            data-log-region="check-fans" 
                            onTap={()=>{locationTo(`/live/invite/lastNewFollowList/${liveId}.htm`)}}
                            />
                        <InfoDateItem
                            title="历史收益"
                            style={{flex: 0.66}}
                            tips={liveBaseInfo.todayIncome > 0 ? `今日+${liveBaseInfo.todayIncome}` : ''}
                            data={liveBaseInfo.totalIncome ? liveBaseInfo.totalIncome : 0}
                            className="on-log"
							data-log-region="yesterday-earning" 
                            onTap={()=>{locationTo(`/wechat/page/live/profit/checklist/${liveId}?time=YESTERDAY&type=ALL`)}}
                            />
                    </div>
                    <div>
                        <InfoDateItem
                            title="昨日访客"
                            data={liveBaseInfo.yesterDayAddUv || 0}
                            />
                        <InfoDateItem
                            title="昨日订单"
                            data={liveBaseInfo.yesterdayOrderNum || 0}
                            />
                        <InfoDateItem
                            title="昨日收益"
                            data={liveBaseInfo.profits ? liveBaseInfo.profits : 0}
                            />
                    </div>
                </div>
			</div>
        ) : null
    }
}

class InfoDateItem extends React.PureComponent {

    state = {
        show: false
    }

    componentDidMount () {
        setTimeout(() => {
            this.setState({
                show: true
            })
        }, 500);
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.tips !== this.props.tips) {
            this.setState({
                show: true
            })
        }
    }

    

    render () {
        const {title, data, onTap, tips = '', showTime = 3000, className, ...other} = this.props
        return (
            <div className={`info-data-item${className ? ' ' + className : ''}`} {...other}>
                <div className="content">
                    <p className="content-number">{data}</p>
                    {
                        tips ?
                        <CSSTransition
                            in={this.state.show}
                            timeout={{enter: 500, exit: 500}}
                            classNames="item-tips"
                            unmountOnExit
                            onEntered={() => {
                                setTimeout(() => {
                                    this.setState({
                                        show: false
                                    }) 
                                }, showTime);
                            }}
                            >
                            <span className="item-tips">{tips}</span>
                        </CSSTransition> : null
                    }
                </div>
                {
                    onTap ? <p className="item-btn" onClick={onTap}><span>{title}</span></p> : <p className="item-normal">{title}</p>
                }
            </div>
        )
    }
}

BaseInfo.propTypes = {
    liveId: PropTypes.string.isRequired,
};

export default BaseInfo;