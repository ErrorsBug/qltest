const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Page from 'components/page';
// import TabBar from 'components/tabbar';
import { BottomDialog, Confirm } from 'components/dialog';
import { locationTo, dangerHtml, imgUrlFormat, digitFormat } from 'components/util';
import { share } from 'components/wx-utils';
import ScrollToLoad from 'components/scrollToLoad';

// actions
import {
    getPower,
} from '../../../actions/active-value';

const mapActionToProps = {
    getPower
}

function mapStateToProps (state) {
    return {

    }
}

class PromoteActiveValue extends Component {

    constructor(props, context) {
        super(props, context);
        this.liveId = this.props.location.query.liveId || 0
    }


    state = {
        showExplain : false,
        showToolTipDialog: false,
        showFocusTipDialog: false,
    }

    async componentDidMount() {
        const power = await this.props.getPower(this.liveId)
        if(!power || !power.allowMGLive) {
            locationTo('/wechat/page/live/'+ this.liveId)
        }


    }

    showExplainHandle = () => {
        this.setState({
            showExplain: true
        })
    }

    hideExplainHandle = () => {
        this.setState({
            showExplain: false
        })
    }

    showToolTipHandle = () => {
        this.setState({
            showToolTipDialog: true
        })
    }
    hideToolTipHandle = (e) => {
        if(e.target.className == "conform" || e.target.className == "promote-tip-back") {
            this.setState({
                showToolTipDialog: false
            })
        }
    }

    showFocusTipHandle = () => {
        this.setState({
            showFocusTipDialog: true
        })
    }
    hideFocusTipHandle = (e) => {
        if(e.target.className == "conform" || e.target.className == "promote-tip-back") {
            this.setState({
                showFocusTipDialog: false
            })
        }
    }

    routerToHandle = (url) => {
        this.props.router.push(url)
    }

    render() {
        
        return (
            <Page title={"提升活跃值"} className='promote-active-value'>
                <div className="promote-active-con">
                    <div className="active-value-explain">
                        <div className="title-with-back">
                            <span>什么是活跃值</span>
                        </div>

                        <div className="explain">
                        活跃值代表直播间的活跃度，活跃值越高，获得的奖励和讲师福利越多。 <br/>
                        从8月1日起，直播间完成以下动作即可获得相应活跃值：
                    </div>

                        {
                            this.state.showExplain ?
                                <div className="example">
                                1.建立话题：获得5活跃值<br />
                                2.开课发言：获得5活跃值<br />
                                3.课程报名人数增加1人：获得0.1活跃值<br />
                                4.直播间关注人数增加1人：获得0.5活跃值<br />
                                （活跃值数据显示有24小时延迟）<br />
                                </div> : ""
                        }

                        {
                            this.state.showExplain ?
                                <div className="fold-handle" onClick={this.hideExplainHandle}><span className='icon_up'></span>收起</div>
                                :
                                <div className="fold-handle" onClick={this.showExplainHandle}><span className='icon_down'></span>展开</div>
                        }

                    </div>

                    <div className="promote">

                        <div className="title-with-back">
                            <span>如何提高活跃值</span>
                        </div>

                        <div className="promote-item">
                            <div className="left-con">
                                <div className="sort">1</div>
                            </div>
                            <div className="right-con">
                                <div className="text-con">
                                    <div className="method-name">建立话题、系列课</div>
                                    <div className="method-des">
                                        完成1次，活跃值+5
                                    <br />
                                        每日获得活跃值上限20
                                </div>
                                </div>
                                <div className="btn-con">
                                    <div className="btn" onClick={locationTo.bind(this, '/wechat/page/backstage?qlfrom=qledu&liveId=' + this.liveId)}>前往建立</div>
                                </div>
                            </div>
                        </div>

                        <div className="promote-item">
                            <div className="left-con">
                                <div className="sort">2</div>
                            </div>
                            <div className="right-con">
                                <div className="text-con">
                                    <div className="method-name">开课发言</div>
                                    <div className="method-des">
                                        完成1次，活跃值+5
                                    <br />
                                        每日获得活跃值上限20
                                </div>
                                </div>
                                <div className="btn-con">
                                    <div className="btn" onClick={locationTo.bind(this, '/wechat/page/live/' + this.liveId)}>前往开课</div>
                                </div>
                            </div>
                        </div>

                        <div className="promote-item">
                            <div className="left-con">
                                <div className="sort">3</div>
                            </div>
                            <div className="right-con">
                                <div className="text-con">
                                    <div className="method-name">提高课程报名人数</div>
                                    <div className="method-des">
                                        报名人数增加1，活跃值+0.1
                                </div>
                                </div>
                                <div className="btn-con">
                                    <div className="btn" onClick={this.showToolTipHandle}>查看方法</div>
                                </div>
                            </div>
                        </div>

                        <div className="promote-item">
                            <div className="left-con">
                                <div className="sort">4</div>
                            </div>
                            <div className="right-con">
                                <div className="text-con">
                                    <div className="method-name">提高直播间关注人数</div>
                                    <div className="method-des">
                                        关注人数增加1，活跃值+0.5
                                </div>
                                </div>
                                <div className="btn-con">
                                    <div className="btn" onClick={this.showFocusTipHandle}>查看方法</div>
                                </div>
                            </div>
                        </div>

                        <dd className='btn-con'>
                            <div className="btn" onClick={this.routerToHandle.bind(this, '/wechat/page/active-value?liveId=' + this.liveId)}>返回活动中心</div>
                        </dd>
                    </div>
                </div>

                        {
                            this.state.showToolTipDialog ?
                                <div className="promote-tip-back" onClick={this.hideToolTipHandle}>
                                    <div className="promote-tip-dialog">

                                        <div className="pink-title">善用营销工具能让你的课程报名人数猛增哦</div>

                                        <div className="tip-item">
                                            <div className="con">
                                                <div className="left">分销功能，让课代表帮你提高课程报名人数。</div>
                                                <div className="right" onClick={locationTo.bind(this, 'https://mp.weixin.qq.com/s?__biz=MzA4MTk0OTY1MQ==&mid=100016086&idx=1&sn=f9680363ab7464c14b4e9ff7bbeae455&scene=19#wechat_redirect')}>点击了解 <span className='icon_enter'></span></div>
                                            </div>
                                        </div>
                                        <div className="tip-item">
                                            <div className="con">
                                                <div className="left">拼课功能，让你的课程报名人数裂变式增长。</div>
                                                <div className="right" onClick={locationTo.bind(this, 'https://mp.weixin.qq.com/s/m92orMBHLCH6dBG2ljdkSg?scene=25#wechat_redirect')}>点击了解 <span className='icon_enter'></span></div>
                                            </div>
                                        </div>
                                        <div className="tip-item">
                                            <div className="con">
                                                <div className="left">报名人数超过4位数的课程介绍页都这么设计。</div>
                                                <div className="right" onClick={locationTo.bind(this, 'https://mp.weixin.qq.com/s/FIymxAgWLjKihoCWpDfKHA')}>点击了解 <span className='icon_enter'></span></div>
                                            </div>
                                        </div>

                                        <dd className="conform">
                                            确定
                                        </dd>

                                    </div>
                                </div> : ""
                        }

                        {
                            this.state.showFocusTipDialog ?
                                <div className="promote-tip-back" onClick={this.hideFocusTipHandle}>
                                    <div className="promote-tip-dialog">

                                        <div className="pink-title">善用营销工具能让你的直播间关注数猛增哦</div>

                                        <div className="tip-item">
                                            <div className="con">
                                                <div className="left">掌握这些涨粉知识，躺着直播间也能涨粉！</div>
                                                <div className="right" onClick={locationTo.bind(this, 'https://mp.weixin.qq.com/s?__biz=MzA4MTk0OTY1MQ==&mid=100014138&idx=1&sn=bd3bdeb3199fad0a3e0aa1584ecd7ac4&scene=19#wechat_redirect')}>点击了解 <span className='icon_enter'></span></div>
                                            </div>
                                        </div>
                                        <div className="tip-item">
                                            <div className="con">
                                                <div className="left">学会这几招，再也不用担心课程推广不出去。</div>
                                                <div className="right" onClick={locationTo.bind(this, 'https://mp.weixin.qq.com/s?__biz=MzA4MTk0OTY1MQ==&mid=100015578&idx=5&sn=cce462ac733fa6d178f55f36b35b41f8&scene=19#wechat_redirect')}>点击了解 <span className='icon_enter'></span></div>
                                            </div>
                                        </div>
                                        <div className="tip-item">
                                            <div className="con">
                                                <div className="left">公众号菜单栏配置直播间地址，让粉丝快速关注。</div>
                                                <div className="right" onClick={locationTo.bind(this, 'http://t.cn/RKEH11U')}>点击了解 <span className='icon_enter'></span></div>
                                            </div>
                                        </div>

                                        <dd className="conform">
                                            确定
                                        </dd>

                                    </div>
                                </div> : ""
                        }

            </Page>
        );
    }
}



module.exports = connect(mapStateToProps, mapActionToProps)(PromoteActiveValue);