import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { imgUrlFormat, digitFormat } from 'components/util';
import SymbolList from './symbol-list';
import { get } from 'lodash';


/**
 * 新版直播间信息模块
 * @author jiajun.li 20180601
 */


export default class LiveInfo extends Component {
    static propTypes = {
        liveInfo: PropTypes.object.isRequired,
        power: PropTypes.object,            // 用户权限
        isFollow: PropTypes.bool,           // 是否已关注
        onClickFollow: PropTypes.func,      // 点击关注回调

        auditStatus: PropTypes.string,      // 是否订阅通知的参数
        isBought: PropTypes.any,            // 是否已购
    }

    static defaultProps = {
        power: {},
    }

    state = {
        isShowFollowNum: true
    }

    // 某些官方直播间不展示关注人数
    superLiveIds = ['100000081018489', '350000015224402', '310000089253623', '320000087047591', '320000078131430', '290000205389044']

    componentDidMount() {
        let superLiveIdsSet = new Set(this.superLiveIds);
        if (superLiveIdsSet.has(get(this.props.liveInfo, 'entity.id') + '')) {
            this.setState({
                isShowFollowNum: false,
            })
        }
    }

    render() {
        let { liveInfo, isFollow, isAlert, power, auditStatus, isCompany, handleCompany, enterprisePo } = this.props;
        if (!liveInfo || !liveInfo.entity) return false;

        let liveId = get(liveInfo, 'entity.id'),
            liveName = get(liveInfo, 'entity.name'),
            liveHeadImg = get(liveInfo, 'entity.logo'),
            liveUrl = auditStatus ?
                `/wechat/page/live/${liveId}?auditStatus=${auditStatus}` :
                `/wechat/page/live/${liveId}`,
            allTopicNum = liveInfo.allTopicNum || 0,
            followNum = liveInfo.followNum || 0;

        const focusState = isFollow ?  (isAlert ? 'pass' : 'attention_pass') : (isAlert ? null : 'no_pass'); 

        return (
            <a href={liveUrl}
                className="co-live-info on-log on-visible"
                data-log-name="进入直播间"
                data-log-region="enter-live"
                data-log-pos="live-info"
                data-log-status={this.props.isBought ? 'bought' : ''}
            >
                <div className="co-live-info-main">
                    <div className="avator" style={{ backgroundImage: `url(${imgUrlFormat(liveHeadImg, '@80w_80h_1e_1c_2o')})` }}></div>

                    <div className="co-live-info-content">
                        <div className="live-name">
                            <p>{liveName}</p>
                            <div className="live-symbol-list">
                                <SymbolList
                                    liveId={liveId}
                                    symbolList={liveInfo.symbolList}
                                    isCompany = { isCompany }
                                    handleCompany={ handleCompany }
                                    enterprisePo={ enterprisePo }
                                    power={power}
                                />
                            </div>
                        </div>

                        <div className="co-live-info-desc">
                            <div className="desc-item">
                                <span>{allTopicNum}</span>话题数
                            </div>
                            {
                                this.state.isShowFollowNum &&
                                <div className="desc-item">
                                    <span>{digitFormat(followNum, 100000)}</span>关注人数
                                </div>
                            }
                        </div>
                    </div>


                    {
                        power.allowMGLive ?
                            <i className="icon_enter" /> :
                            <>
                                {
                                    focusState === "pass" &&
                                    <div 
                                        className="follow-btn is-follow on-log on-visible" 
                                        onClick={this.onClickUnFollow}
                                        data-log-name="取消关注直播间"
                                        data-log-region="cancel-focus"
                                        data-log-pos="live-info"
                                        data-log-status={this.props.isBought ? 'bought' : ''}
                                    >
                                        取消关注
                                    </div>
                                }
                                {
                                    focusState === "no_pass" &&
                                    <div 
                                        className="follow-btn on-log on-visible"
                                        onClick={this.onClickFollow}
                                        data-log-name="关注直播间"
                                        data-log-region="focus"
                                        data-log-pos="live-info"
                                        data-log-status={this.props.isBought ? 'bought' : ''}
                                    >
                                        <i className="icon_plus"></i>
                                        关注
                                    </div>
                                }
                                {
                                    focusState === "attention_pass" &&
                                    <div 
                                        className="follow-btn on-log on-visible"
                                        onClick={this.onClickFollow}
                                        data-log-name="订阅直播间"
                                        data-log-region="subscriber"
                                        data-log-pos="live-info"
                                        data-log-status={this.props.isBought ? 'bought' : ''}
                                    >
                                        <i className="icon_plus"></i>
                                        订阅动态
                                    </div>
                                }
                            </>
                    }
                </div>
            </a>
        )
    }
7
    onClickFollow = e => {
        e.preventDefault();
        e.stopPropagation();
        this.props.onClickFollow && this.props.onClickFollow(true);
    }

    onClickUnFollow = e => {
        e.preventDefault();
        e.stopPropagation();
        this.props.onClickFollow && this.props.onClickFollow(false);
    }
}

