import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import Footer from '../../components/footer';
import CourseItem from './components/course-item/other';
import { listRecommend } from '../../actions/home';
import UserHoc from '../../components/user-hoc'
import AppEventHoc from '../../components/app-event'
import { getVal } from 'components/util';
import HandleAppFunHoc from 'components/app-sdk-hoc'

@HandleAppFunHoc
@AppEventHoc
@UserHoc
@autobind
class LearningCamp extends Component {
    state = { 
        isNoMore: false,
        lists: [],
        tabIdx:0
    }
    page = {
        page: 1,
        size: 20
    }
    isLoading = false;
    async componentDidMount() {
        await this.initData();
        
         // 绑定非window的滚动层 
         typeof _qla != 'undefined' && _qla.bindVisibleScroll('ln-scroll-box');
    }
    async initData() {
        const { otherSignCamp = [],prepareCamp=[] } = await listRecommend();
        this.setState({
            otherSignCamp,
            prepareCamp
        })
    }
    async loadNext(next) {
        if(this.isLoading || this.state.isNoMore) return false;
        this.isLoading = true;  
        next && next();
    }  
    render() {
        const { isNoMore, lists ,otherSignCamp = [],prepareCamp=[]} = this.state;
        const { isQlchat,sysTime } = this.props
        return (
            <Page title="千聊学习营" className="ln-camp-other-box">
                <ScrollToLoad 
                    className={"ln-scroll-box ch-scroll-box"}
                    toBottomHeight={300}
                    disable={ true }
                    loadNext={ this.loadNext }>
                    <div className="ln-camp-cont">
                        { otherSignCamp.map((item, index) => (
                            <CourseItem { ...item } idx={index} key={ index } type="direct" sysTime={sysTime} handleAppSdkFun={this.props.handleAppSdkFun}/>
                        )) }
                    </div>
                    {
                        prepareCamp?.length>0&&<Fragment>
                            <div className="ln-camp-title">—— 以下学习营正在筹备 ——</div>
                            <div className="ln-camp-tip">今日内<span>为您打开</span>预约报名通道</div>
                            <div className="ln-camp-cont">
                                { prepareCamp.map((item, index) => (
                                    <CourseItem { ...item } idx={index} key={ index } type="reservation" sysTime={sysTime} 
                                        handleAppSdkFun={this.props.handleAppSdkFun}
                                        />
                                )) }
                            </div>
                        </Fragment>
                    }
                    
                    { isNoMore && <Footer /> }
                </ScrollToLoad>
            </Page>
        );
    }
}

const mapStateToProps = (state) => ({
    sysTime: getVal(state,'common.sysTime'),
});

const mapActionToProps = {

};

module.exports = connect(mapStateToProps, mapActionToProps)(LearningCamp);