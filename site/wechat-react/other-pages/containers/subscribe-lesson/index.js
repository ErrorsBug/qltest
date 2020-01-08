import React, { Component } from 'react';

import { connect } from 'react-redux';

import { share } from 'components/wx-utils';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import SmallAvatarGroup from './components/small-avatar-group';
import LessonList from './components/lesson-list';
import { Link } from 'react-router';
import classnames from 'classnames';
import {
    locationTo,
    formatDate,
    refreshPageData,
} from 'components/util';

import searchImg from './img/search.png'


// actions
import {
    subscribePunchCard,
    getPeriodCourseList,
    userBindKaiFang,
	getCustomCoursePaster
} from '../../actions/recommend';


class SubscribeLesson extends Component {
    state = {
        IsNoOne: false,
        IsNoMore: false,
        isSignIn: this.props.periodInfo.isSignIn === 'Y',
        signInNum: this.props.periodInfo.signInNum || '',
        locaDisable: false,
        showBarrier: false, // 是否显示蒙层

	    showPaster: false,
        paster: '',
        pasterUrl: '',
    };

    data = {};

    componentWillMount() {

    }
    componentDidMount() {
        refreshPageData();
        this.loadMoreFunc();

        //微信分享定制
        share({
            title: '【千聊】专属定制的精品课程',
            desc: "为你定制的高价值听课大礼包，一起组队听课吧！",
            timelineDesc: '为你定制的高价值听课大礼包，一起组队听课吧！', // 分享到朋友圈单独定制
            imgUrl: "https://img.qlchat.com/qlLive/liveCommon/period-share-logo.jpg",
            shareUrl: window.location.origin + "/wechat/page/dingzhi?inviteKey="+this.props.periodInfo.inviteKey
        });

        //曝光
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.bindVisibleScroll('co-scroll-to-load');
        }, 1000);

        // 设置首页渠道session给其他页面统计用
        this.setTraceSession();

        this.getbarrierTip();

        const kfAppId=this.props.location.query.kfAppId;
        const kfOpenId=this.props.location.query.kfOpenId;
        if(kfAppId&&kfOpenId){
            this.props.userBindKaiFang(kfAppId,kfOpenId);
        }

        this.getCustomCoursePaster();
        
        if (this.props.periodInfo.canceledCustom) {
            setTimeout(() => {
                if (window.toast) {
                    window.toast('已成功取消定制课程推送', 3000)
                }
            }, 1000);
        }
    }

    getbarrierTip(){
        var getbarrierTipSession=localStorage.getItem("getbarrierTip");
        if(getbarrierTipSession!="Y"){
             this.setState({
                showBarrier:true,
            });
        }
    }
    

    getperiodId(periodid){
        
    }

    setTraceSession() {
        let tracePage = '';
        tracePage = 'subscribe-period-time';
        typeof window.sessionStorage != 'undefined' && sessionStorage.setItem('trace_page', tracePage);
    }

    async loadMoreFunc(next){
        if(this.props.periodNextId == -1){
            this.setState({
                IsNoMore:true,
                locaDisable:true,
            });
            return false;
        }else{
            var result=await this.props.getPeriodCourseList(this.props.periodNextId);
            if(result.state.code =="0"){
                if(result.data.length<0){
                    this.setState({
                        IsNoMore:true,
                    });
                }
            }else{
                window.toast(result.state.msg);
            }
        }
        next && next();
        
    }

    async punchCard(){
        const result = await this.props.subscribePunchCard();
        if(result.state.code == "0"){
            window.toast('打卡成功');
            this.setState({
                isSignIn:true,
                signInNum:result.data.signInNum,
            },() => {
	            locationTo("/wechat/page/subscribe-card?inviteKey="+this.props.periodInfo.inviteKey);
            });
        }else{
            window.toast(result.state.msg);
        }
    }

    //蒙层点击消失
    touchBarrier(e) {
        this.setState({
            showBarrier: false
        });
        localStorage.setItem("getbarrierTip","Y");
    }

    // 获取用户贴图
	async getCustomCoursePaster(){
        const res = await this.props.getCustomCoursePaster();
        if(res.state.code === 0){
            this.setState({
                showPaster: true,
                paster: res.data.imgUrl,
	            pasterUrl: res.data.url || ''
            });
        }
    }

	pasterClickHandle = () => {
	    if(this.state.pasterUrl){
		    locationTo(this.state.pasterUrl);
        }
    };
	pasterTouchStartHandle = () => {
		if(this.data.pasterLongTapTimer){
			clearTimeout(this.data.pasterLongTapTimer);
		}
	    this.data.pasterLongTapTimer = setTimeout(() => {
		    window._qla && _qla('event', {
			    category: 'customCoursePasterLongTap',
			    action:'success'
		    });
        },600);
    };
	pasterTouchCancelHandle = ()=> {
	    if(this.data.pasterLongTapTimer){
		    clearTimeout(this.data.pasterLongTapTimer);
        }
    };


    render() {
        return (
            <Page title="定制课程" className="subscribe-lesson-container">
                
                <div className="search on-log"
                    data-log-name="定制课程搜索"
                    data-log-region="subscribe-lesson"
                    onClick  = {() => { locationTo("/wechat/page/search") }}
                >
                    <img src={searchImg} alt=""/>
                </div>

                <ScrollToLoad
                    className={this.state.showBarrier?"scroll-box barrierbody":"scroll-box"}
                    toBottomHeight={500}
                    loadNext={ this.loadMoreFunc.bind(this) }
                    noneOne={this.state.IsNoOne}
                    noMore={ this.state.IsNoMore }
                    notShowLoaded={true} 
                    disable={this.state.locaDisable}
                >
                {this.state.showBarrier&&<div className={classnames("barrier")} ref="barrier" onClick={this.touchBarrier.bind(this)}></div>}
                
                <header>
                    <img className="lesson-top-head" src="https://img.qlchat.com/qlLive/liveCommon/lession_bg_header.jpg" />
                    <div className="lesson-top" >
                        <h3 className="lesson-time">每周二、周五上课</h3>
                        <section className="small-ag-wrap" onClick={()=>{locationTo("/wechat/page/subscribe-card?inviteKey="+this.props.periodInfo.inviteKey)}}>
                            {
                                //+this.props.periodInfo.inviteKey
                            }
                            <SmallAvatarGroup
                                avatars={this.props.periodInfo.headImgList||[]}
                                describution={'正在学习'}
                                acount={this.props.periodInfo.orderNum}
                            />
                        </section>
                        {
                            this.state.isSignIn?
                            <div className="btn-sign signed" onClick={() => locationTo(`/wechat/page/subscribe-card?inviteKey=${this.props.periodInfo.inviteKey}`)}>你已学习了{this.state.signInNum}期</div>
                            :
                            <div className="btn-sign on-log"
                                onClick={this.punchCard.bind(this)}
                                data-log-region="subscribe-lesson"
                                data-log-pos="subscribe-lesson"
                                data-log-name="定制课程打卡"
                            >打卡</div>
                        }
                    </div>
                </header>
                <Link className="tip on-log" 
                    to="/wechat/page/subscribe-custom-made"
                    data-log-region="subscribe-lesson"
                    data-log-pos="subscribe-lesson"
                    data-log-name="定制课程管理"
                >
                    {/*<p className="txt"><span className="icon-crown"></span>你的专属定制课程</p>*/}

                    {
                        this.props.periodInfo.status=="Y"?
                        <div className="trailer-tip">
                            <div className="trailer-word">下期课程预告</div>
                            <div className="trailer-time">{formatDate(this.props.periodInfo.nextTimeStamp,"MM月dd日 hh:mm")}</div>
                        </div>
                        :
                        <div className="trailer-tip">您已取消定制，点击右侧按钮重新定制</div>
                    }
                    
                    <div className="btn-subscribe" onClick={this.touchBarrier.bind(this)}>定制{this.state.showBarrier&&<div className={classnames("barrier-tip")} ref="barrierTip"></div>}</div>
                </Link>
                {
                    this.state.showPaster &&
                    <img className="on-log" src={this.state.paster} alt="" style={{width:'100%'}} onClick={this.pasterClickHandle} data-log-region="subscribe-lesson" data-log-name="定制课程贴片" onTouchStart={this.pasterTouchStartHandle} onTouchEnd={this.pasterTouchCancelHandle} onTouchCancel={this.pasterTouchCancelHandle}/>
                }
                <LessonList periodList={this.props.periodData} sessionTrace={this.getperiodId.bind(this)}/>
                
                </ScrollToLoad>
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
        periodData:state.periodCourse.periodData||[],
        periodInfo:state.periodCourse.periodInfo,
        periodNextId:state.periodCourse.periodId,
    };
}

const mapActionToProps = {
    subscribePunchCard,
    getPeriodCourseList,
    userBindKaiFang,
	getCustomCoursePaster
    // fetchPeriodInfo,
}

module.exports = connect(mapStateToProps, mapActionToProps)(SubscribeLesson);