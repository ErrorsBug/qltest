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

import rocket from './img/big-rocket.png'
import InformBar from './components/inform-bar'

// 教师节活动临时
import doctorSmall from './img/temp/main-doctor-small.png';
import doctor from './img/temp/main-standard.png';
import ranking from './img/temp/main-ranking.png';
// 教师节活动临时

// actions
import {
    getPower,
    getActiveInfo,
    getFinishLiveList,
} from '../../actions/active-value';

const mapActionToProps = {
    getPower,
    getActiveInfo,
    getFinishLiveList,
}

function mapStateToProps (state) {
    return {

    }
}

class ActiveValue extends Component {

    constructor(props, context) {
        super(props, context);

        this.liveId = this.props.location.query.liveId || 0
    }


    state = {
        informList: [],
        rank: 0,
        activeValue: 0,
    }

    data = {

    }

    async componentDidMount() {
        const power = await this.props.getPower(this.liveId)
        if(!power || !power.allowMGLive) {
            locationTo('/wechat/page/live/'+ this.liveId)
        }

        const activeInfo = await this.props.getActiveInfo(this.liveId)
        const finishList = await this.props.getFinishLiveList(this.liveId)

        const informList = []
        finishList.map((item) => {
            informList.push(item.name + "已完成达标活动，奖励话题推送次数1次")
        })

        this.setState({
            informList,
            rank: activeInfo.rank || 0,
            activeValue: activeInfo.score || 0,
        })

    }

    routerToHandle = (url) => {
        this.props.router.push(url)
    }

    render() {
        
        return (
            <Page title={"群英冲榜"} className='active-value-main'>
                <div className="value-con">
                    <div className="hi">Hi，以下是你当前的活跃值</div>
                    
                    <div className="relative-con">
                        <img src={rocket} alt="" className="rocket"/>
                        <span className="ab-text number1">{parseInt(this.state.activeValue/2)}</span>
                        <span className="ab-text number2">{parseInt(this.state.activeValue/1.5)}</span>
                        <span className="ab-text number3">{parseInt(this.state.activeValue/1.25)}</span>
                        <span className="ab-text number4">{this.state.activeValue}</span>
                        {/* <span className="ab-text active-text">活跃值</span> */}
                    </div>

                    <div className="rank-today">活跃值显示有24小时延迟</div>

                    <div className="btn-con">
                        <div className="btn" onClick={locationTo.bind(this, "/wechat/page/activity/teachers-day/report?liveId=" + this.liveId)}>我的成就报告</div>
                        <div className="btn" onClick={this.routerToHandle.bind(this, '/wechat/page/active-value/promote?liveId=' + this.liveId)}>提升活跃值</div>
                    </div>
                    <div className="bottom-con">
                        <div className="item">教师节专属礼包</div>
                        <div className="item">4项任务可提升</div>
                    </div>
                </div>

                <InformBar informList={this.state.informList}/>

                <div className="active-center">
                    <div className="title-with-back">
                        <span>教师节·活动中心</span>
                    </div>
                    
                    <div className="active-item">
                        <div className="left-con">
                            <div className="logo-con">
                                <img src={doctor} alt="" className="doctor"/>
                            </div>
                        </div>
                        <div className="right-con">
                            <div className="text-con">
                                <div className="active-name">讲师达标活动</div>
                                <div className="reword-con">
                                    <div className="reword">奖励:</div>
                                    <div className="reword-des">
                                        <span className="doctor-logo"></span>
                                        博士帽徽章
                                        <br/>
                                        所有话题推送次数增加一次
                                    </div>
                                </div>
                            </div>
                            <div className="btn-con">
                                <div className="btn" onClick={locationTo.bind(this, '/wechat/page/activity/teachers-day/standard?liveId=' + this.liveId)}>去达标</div>
                            </div>
                        </div>
                    </div>

                    <div className="active-item">
                        <div className="left-con">
                            <div className="logo-con">
                                <img src={ranking} alt="" className="ranking"/>
                            </div>
                        </div>
                        <div className="right-con last">
                            <div className="text-con">
                                <div className="active-name">冲榜活动</div>
                                <div className="reword-con">
                                    <div className="reword">奖励:</div>
                                    <div className="reword-des">
                                        直播中心课程推荐3次
                                        <br/>
                                        千聊优质讲师证书
                                    </div>
                                </div>
                            </div>
                            <div className="btn-con">
                                <div className="btn" onClick={locationTo.bind(this, '/wechat/page/activity/teachers-day/rank?liveId=' + this.liveId)}>去冲榜</div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="interpretation">本活动最终解释权归千聊所有</div>

            </Page>
        );
    }
}



module.exports = connect(mapStateToProps, mapActionToProps)(ActiveValue);