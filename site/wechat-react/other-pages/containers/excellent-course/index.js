import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ScrollToLoad from 'components/scrollToLoad';
import Page from 'components/page';
import { locationTo ,updatePageData,isNumberValid} from 'components/util';
import { MiddleDialog, Confirm } from 'components/dialog';
import { autobind } from 'core-decorators';
import {
    auditCourse,
    courseAudit,
    quickAudit,
    editCourse,
    editAllCourse,
} from '../../actions/excellent-course';

import {
    qlLiveShareQualify,
    fetchAdminFlag,
} from '../../actions/distribution';

@autobind
class ExcellentCourse extends Component {
    state = {
        openPop: false,
        updatePop: false,
        tipPop: false,
        switch: false,
        isNoMoreCourse: false,
        liveRatio: 0,
        qlRatio: 0,
    }

    componentDidMount() {
        this.getCourses();
        this.tipPopStroge();
        this.init();
    };
    async init(){
        let liveId = this.props.location.query.liveId
        const shareQualify = await this.props.qlLiveShareQualify(liveId)
        if(shareQualify.state.code === 0){
            if (JSON.stringify(shareQualify.data) !== '{}') {
                const qualify = shareQualify.data.qualify
                this.setState({
                    qlRatio: qualify.shareEarningPercent,
                    liveRatio: 100 - qualify.shareEarningPercent
                })
            }else {
                const adminInfo = await this.props.fetchAdminFlag(liveId)
                if(adminInfo.state.code === 0) {
                    let adminFlag = adminInfo.data
                    let now = new Date().getTime()
                    // 未过期的专业版
                    if (adminFlag.isLiveAdmin === 'Y' && adminFlag.liveAdminOverDue > now) {
                        this.setState({
                            liveRatio: 50,
                            qlRatio: 50
                        })
                    // 过期专业版或者非专业版
                    }else if((adminFlag.isLiveAdmin === 'Y' && adminFlag.liveAdminOverDue < now) || adminFlag.isLiveAdmin === 'N') {
                        this.setState({
                            liveRatio: 40,
                            qlRatio: 60,
                        })
                    }
                }else {
                    window.toast(adminInfo.state.msg)
                }
            }
        } else {
            window.toast(shareQualify.state.msg)
        }
    }
    tipPopStroge(){
        let local = window.localStorage.getItem('tipPop'),
            showStatus = window.localStorage.getItem('showStatus');
        if(local === 'Y'){
            this.setState({tipPop: false})
        }else {
            this.setState({tipPop: true});
            window.localStorage.setItem('tipPop','Y');       
        }
        // 判断有此缓存，说明是从课程上架协议页面过来
        if (showStatus) {
            this.setState({
                openPop: true
            },()=>{
                window.localStorage.removeItem('showStatus')
            })
        }
    }

    async getCourses(){
        if(!this.props.isFetch){
            await this.props.auditCourse(
                this.props.location.query.liveId,
                this.props.pageNum,
                this.props.pageSize,
            )
        }
        if (this.props.courses && this.props.courses.length < this.props.pageSize) {
            this.setState({
                isNoMoreCourse: true
            });
        }
    }

    async loadMoreCourse(next) {
        const result = await this.props.auditCourse(
            this.props.location.query.liveId,
            this.props.pageNum + 1,
            this.props.pageSize,
        );

        next && next();

        // 是否没有更多
        if (result && result.length < this.props.pageSize) {
            this.setState({
                isNoMoreCourse: true
            });
        }
    }
    async courseAudit(e){
        let tar = e.currentTarget
        let param = {
            id: tar.getAttribute('business_id'),
            type: tar.getAttribute('type'),
            liveId: this.props.location.query.liveId,
        };
        const result = await this.props.courseAudit(param);
        if(result.state.code === 0){
            if(result.data.isSucceed === 'Y'){
                await this.props.editCourse(this.props.courses, param.id);
                this.setState({
                    updatePop: true,
                });
            }
            else {
                window.toast(result.data.msg);                
            }
        }else {
            window.toast(result.state.msg);
        }
    }

    async switch(){
        const result = await this.props.quickAudit(this.props.location.query.liveId);
        if(result.state.code === 0){
            await this.props.editAllCourse(this.props.courses);
            this.setState({
                switch: true,
            },()=>{
                setTimeout(()=>{
                    let switchEle = document.querySelector("#switch-container");
                    let scrollEle = document.querySelector(".scroll-box");
                    switchEle.classList.add('hide');
                    scrollEle.classList.add('hideSwitch');
                },1000)
            });
        }else {
            window.toast(result.state.msg);
        }
        this.setState({openPop: false});
    }

    openPop(){
        this.setState({openPop: true})
    }

    closePop(){
        this.setState({openPop: false})
    }

    openTipPop(){
        this.setState({tipPop: true})
    }

    closeTipPop(){
        this.setState({tipPop: false})
    }

    closeUpdatePop(){
        this.setState({updatePop: false})
    }

    //跳转到课程上架协议页面时，弹窗时开启的，为了从课程上架协议页面返回此页面的时候可以保持弹窗开启，故存储个缓存作为状态的判断。
    redirectOperation(){
        window.localStorage.setItem('showStatus','Y')
        locationTo('/wechat/page/distribution/protocol?liveId=' + this.props.location.query.liveId)
    }
    render() {
        return (
            <Page title={`我的优质课`} className="excellent-course-container">
                <ScrollToLoad
                    className="scroll-box"
                    toBottomHeight={500}
                    loadNext={ this.loadMoreCourse }
                    noMore={ this.state.isNoMoreCourse } >
                <div className="course-container">
                    {
                        this.props.courses && this.props.courses.length > 0 ?
                        this.props.courses.map((item,index) => {
                            return (
                                <div className="list" key={`course-${index}`}>
                                    <div className="course-detail" onClick = {()=>{locationTo(item.url)}}>
                                        <img src={item.logo} alt=""/>
                                        <div className="detail-content">
                                            <div className="course-title">{item.businessName}</div>
                                            <p className="proportion">分成比例50%</p>
                                            <div className="course-price">课价：<span className="icon">¥</span><span className="price">{item.money/100}</span></div>
                                        </div>
                                    </div>
                                    <div className="spread-detail">
                                    {item.applyStatus === 'R' ? 
                                        <p onClick={this.courseAudit} 
                                            apply_status={item.applyStatus}
                                            business_id={item.businessId} 
                                            type={item.type}
                                        >符合优质课程推广条件， <span>点击允许推广</span></p>
                                        :<p>当前状态：已允许推广</p> 
                                    }
                                    </div>
                                </div>
                            )
                        }):
                        (
                            <div className="empty-container">
                                <div className="empty-tip">
                                    <img src={require('./img/empty.png')} alt=""/>
                                    <p className="tip">加油，您当前暂无符合条件的课程！</p>
                                </div>
                                <ul className="help-content">
                                    <li className="q1">
                                        <p className="title">如何成为优质平台课？</p>
                                        <p className="answer">若您的课程信息充实、学员完播及评价良好、购课转化高，却苦于缺乏更多的推广渠道时。千聊基于大数据算法，实时筛选最优课程，助您获取平台流量的全力扶持。</p>
                                    </li>
                                    <li className="q2">
                                        <p className="title">优质课如何推广？</p>
                                        <div className="answer-list">
                                            <span>1</span>
                                            <p>点击课程下方允许按钮，课程即会实时上架至相应推广渠道。</p>
                                        </div>
                                        <div className="answer-list">
                                            <span>2</span>
                                            <p>暂时不考虑平台推广的课程，不点击允许按钮就好啦。</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        )
                    }
                </div>
                </ScrollToLoad>
                {
                    this.props.isShare === 'N' && this.props.courses && this.props.courses.length > 0 &&
                    <div className="switch-container" id="switch-container">
                        <span>优秀课程快速上架推广</span>
                        {
                            this.state.switch?
                            <div className="switch-after"><span></span></div>
                            :<div className="switch-before" onClick={this.openPop}><span></span></div>
                        }
                    </div>
                }
                <div className="right-tab" onClick={this.openTipPop}>
                    <i className="icon_ask2"></i>
                    <span className="label">推广</span>
                </div>

                {/*一键推广弹窗*/}
                <MiddleDialog
                    show = {this.state.openPop}
                    bghide
                    theme = 'empty'
                    onClose = {this.closePop}
                    className = 'open-pop'
                    contentClassName = 'content'
                >
                    <div className="detail">
                        <div className="title">您正在开启直播间优秀课程平台自动上架功能</div>
                        <p className="tip1">实时查看收益路径</p>
                        <p className="tip2">用户管理-直播间课代表管理-千聊直通车</p>
                        <p className="tip3">开启即代表阅读并同意 <span onClick={this.redirectOperation}>《课程上架协议》</span></p>
                    </div>
                    <div className="confirm" onClick={this.switch}>确认开启</div>
                </MiddleDialog>
                {/************/}

                {/*单个推广弹窗*/}
                <MiddleDialog
                    show = {this.state.updatePop}
                    bghide
                    theme = 'empty'
                    onClose = {this.closeUpdatePop}
                    className = 'update-pop'
                    contentClassName = 'content'
                >
                    <div className="detail">
                        <div className="title">课程推广状态已更新</div>
                        <p className="tip1">当前状态：允许推广</p>
                        <p className="tip2">课程课代表列表下可实时查看推广收益</p>
                    </div>
                    <div className="know" onClick={this.closeUpdatePop}>知道了</div>
                </MiddleDialog>
                {/*************/}

                {/*提示弹窗*/}
                <MiddleDialog
                    show = {this.state.tipPop}
                    bghide
                    theme = 'empty'
                    onClose = {this.closeTipPop}
                    className = 'tip-pop'
                    contentClassName = 'content'
                >
                    <div className="tip-top"></div>
                    <ul className="tip-content">
                        <li className="q1">
                            <p className="title">如何成为优质平台课？</p>
                            <p className="answer">若您的课程信息充实、学员完播及评价良好、购课转化高，却苦于缺乏更多的推广渠道时。千聊基于大数据算法，实时筛选最优课程，助您获取平台流量的全力扶持。</p>
                        </li>
                        <li className="q2">
                            <p className="title">有哪些推广渠道？</p>
                            <div className="span-list">
                                <span>首页推广位</span>
                                <span>分类推荐</span>
                                <span>热门搜索</span>
                                <span>社群</span>
                                <span>课程定制</span>
                                <span>平台活动</span>
                            </div>
                            <p className="answer">包括且不限以上渠道。</p>
                        </li>
                        <li className="q3">
                            <p className="title">收益如何分成？</p>
                            <p className="answer">固定分成比例：直播间<span>{this.state.liveRatio}%</span>，平台<span>{this.state.qlRatio}%</span>。</p>
                        </li>
                    </ul>
                    <div className="know" onClick={this.closeTipPop}>我知道了</div>
                    <span className="tip-pop-close" onClick={this.closeTipPop}></span>
                </MiddleDialog>
            </Page>
        );
    }
}


function mapStateToProps (state) {
    return {
        courses: state.excellentCourse.initCourse,
        isFetch: state.excellentCourse.isFetch,
        isShare: state.excellentCourse.isShare,
        pageNum: state.excellentCourse.pageNum,
        pageSize: state.excellentCourse.pageSize,
    }
}

const mapActionToProps = {
    auditCourse,
    courseAudit,
    quickAudit,
    editCourse,    
    editAllCourse,
    qlLiveShareQualify,
    fetchAdminFlag,
}

module.exports = connect(mapStateToProps, mapActionToProps)(ExcellentCourse);
