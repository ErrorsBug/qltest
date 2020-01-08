import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind, throttle } from 'core-decorators';

import ScrollToLoad from 'components/scrollToLoad';
import Page from 'components/page';
import {
    locationTo,
	formatMoney
} from 'components/util';
import {
	getUrlParams,
	fillParams
} from 'components/url-utils';
import { Confirm } from 'components/dialog';
import SelectList from './components/selecting-list';
import LaunchList from './components/launch-list';
import { selectCourseList, launchCourseList, setCourseLaunch, getConditions } from '../../actions/author';


@autobind
class Author extends Component {
    
    state = {
        tabType:'selecting',
        selectPageSize:20,
        selectPageNum:1,
        selectNoOne:false,
        selectNoMore:false,
        launchPageSize:20,
        launchPageNum:1,
        launchNoOne:false,
        launchNoMore:false,
        selectCourseList:[],
        launchCourseList:[],
        liveId: this.props.location.query.liveId,

        tabClickBoolean:true,
        ruleStateShow:false,

        conditionAuthNum: 100,
        conditionLearningNum: 300,

    }
    
    componentDidMount() {
        this.loadSelectCourseList();
    }

    async loadLaunchCourseList(next){
        let result = await this.props.launchCourseList({
            liveId: this.state.liveId,
            pageSize: this.state.launchPageSize,
            pageNum: this.state.launchPageNum,
        });
        if(result.state.code ===0 &&result.data.list.length>0){
            this.setState({
                launchCourseList: [...this.state.launchCourseList,...result.data.list],
            });
        }
        if(this.state.launchPageNum==1&&result.data.list.length<=0){
            this.setState({launchNoOne:true});
        }else if(this.state.launchPageNum>=1&&result.data.list.length<this.state.launchPageSize){
            this.setState({launchNoMore:true});
        }
        this.setState({
            launchPageNum: this.state.launchPageNum+1,
        },()=>{
            next&&next();
        });
    }
    async loadSelectCourseList(next){
        let result = await this.props.selectCourseList({
            liveId: this.state.liveId,
            pageSize: this.state.selectPageSize,
            pageNum: this.state.selectPageNum,
        });
        if(result.state.code ===0&&result.data.list.length>0){
            this.setState({
                selectCourseList: [...this.state.selectCourseList,...result.data.list],
            });
        }
        if(this.state.selectPageNum==1&&result.data.list.length<=0){
            this.setState({selectNoOne:true});
        }else if(this.state.selectPageNum>=1&&result.data.list.length<this.state.selectPageSize){
            this.setState({selectNoMore:true});
        }
        this.setState({
            selectPageNum: this.state.selectPageNum+1,
        },()=>{
            next&&next();
        });
        console.log(this.state.selectCourseList);
    }


    changeTabClick(type){
        this.setState({
            tabType:type,
        });
        if(this.state.tabClickBoolean && type === 'launch'&& this.state.launchPageNum==1 ){
            this.setState({tabClickBoolean:false});
            console.log('fukfukufkufkuckug')
            this.loadLaunchCourseList();
        }
    }

    async setLaunch(type){
        if(type=='confirm'){
            let listArray = this.state.selectCourseList;
            const res = await this.props.setCourseLaunch({
                reserveCourseId: listArray[this.state.thisIndex].id,
                // businessId: listArray[this.state.thisIndex].businessId,
                // businessType: listArray[this.state.thisIndex].businessType,
                status:  this.state.thisApplyStatus,
            });

            if(res.state.code === 0){
	            listArray[this.state.thisIndex].status = this.state.thisApplyStatus;
	            this.setState({
		            selectCourseList:listArray
	            });

	            this.refs.showSetApplyBox.hide();
            }else{
                window.toast(res.state.msg);
            }

        }else{
            this.refs.showSetApplyBox.hide();
        }
        
    }

    showDropTipDialog(){
        this.refs.showDropTipBox.show();
    }
    hideDropTipDialog(){
        this.refs.showDropTipBox.hide();
    }

    showSetApplyBox(index){
        this.setState({
            thisIndex:index,
            thisApplyStatus:(this.state.selectCourseList[index].status==='R')?'N':'R'
        },()=>{
            this.refs.showSetApplyBox.show();
        });
        
        
    }

    goToCourse(type,id){
        console.log(type);
        console.log(id);
        if(type === 'CHANNEL'){
            locationTo('/live/channel/channelPage/'+ id +'.htm');
        }else{
            locationTo('/topic/details?topicId=' + id);
        }
    }

    showRuleTipDialog(){
        this.refs.showRuleTipBox.show();
    }
    showRuleState(){
        this.setState({
            ruleStateShow:true,
        });
    }
    hideRuleState(){
        this.setState({
            ruleStateShow:false,
        });
    }

    /**
     * 获取进入备选库的条件
     */
    fetchConditions = async () => {
        const result = await this.props.getConditions();
        if (result.state.code === 0) {
            const data = result.data;
            this.setState({
                conditionAuthNum: data.authNum,
                conditionLearningNum: data.learningNum
            });
        } else {
            window.toast(result.state.msg);
        }
    }

    render() {
        return (
            <Page title = {this.state.ruleStateShow?"课程上架协议":"推广投放"} className="author-coral" >
                <div className="tab-bar">
                    <div className={ this.state.tabType=='selecting'?'tab acitve':'tab ' } onClick={()=>this.changeTabClick('selecting')}><span>备选课程</span></div>
                    <div className={ this.state.tabType=='launch'?'tab acitve':'tab ' } onClick={()=>this.changeTabClick('launch')}><span>成功投放中</span></div>
                </div>
                <div className={`course-list-wrap${this.state.tabType === 'selecting' ? '' : ' second'}`}>
                    <ScrollToLoad
                        className='course-list-scroll'
                        ref='shopListScroll'
                        toBottomHeight={200}
                        loadNext={this.loadSelectCourseList}
                        noMore={this.state.selectNoMore}
                        // emptyPicIndex={this.state.emptyPicIndex}
                    >
		                {!this.state.selectNoOne&&<SelectList courseList = {this.state.selectCourseList} setLaunchClick={this.showSetApplyBox} goToCourse={this.goToCourse} />}
                    </ScrollToLoad>
                    <ScrollToLoad
                        className='course-list-scroll'
                        ref='shopListScroll'
                        toBottomHeight={200}
                        loadNext={this.loadLaunchCourseList}
                        noneOne={this.state.launchNoOne}
                        noMore={this.state.launchNoMore}
                        emptyPicIndex={1}
                    >
                        <LaunchList courseList = {this.state.launchCourseList} showDropTipBox = {this.showDropTipDialog} goToCourse= {this.goToCourse} />
                    </ScrollToLoad>
                </div>

                {/*空页面*/
                    this.state.tabType=='selecting'&&this.state.selectNoOne&&
                    <div className="empty-box">
                        <img className="empty-pic" src={require("./img/icon-empty.png")} />
                        <div className="empty-tips">加油,您当前暂无满足条件的系列课</div>
                        <div className="point">
                            <div className="title">进入备选库的条件</div>
                            <div>报名人数满{this.state.conditionAuthNum}，学习次数{this.state.conditionLearningNum}</div>
                        </div>
                    </div>
                }

                <div className="btn-push-rule" onClick={this.showRuleTipDialog}>推广</div>

                <Confirm 
                    className="drop-tip-dialog"
                    ref='showDropTipBox'
                    titleTheme='white'
                    buttonTheme='line'
                    cancelText = '知道了'
                    buttons='cancel'
                    >
                    <div className="content">如您需要下架课程，请与千聊“班主任”联系千聊“班主任”与您核实信息后，将在3个工作日内完成处理，微信号：qlbzr01</div>
                    <div className="qr-img">
                        <img src={require('./img/qr-pic.jpg')} />
                    </div>
                    <div className="qr-tip">长按识别二维码添加</div>
                    
                </Confirm>
                <Confirm 
                    className="rule-tip-dialog"
                    ref='showRuleTipBox'
                    buttons='none'
                    close={true}
                    >
                    <div className="content">
                        <div className="rule-p state">
                            <h5>说明</h5>
                            <span>为帮老师们提升课程销量，千聊珊瑚计划课代表分享团队，利用社交方式分发优质课程。系列课被采用后，即可按合作比例享受分成收益。<var>90%</var>的课程被推广后销量得到大幅提升。</span>
                        </div>
                        <div className="rule-p condition">
                            <h5>备选条件</h5>
                            <span>报名数满<var>{this.state.conditionAuthNum}</var>，学习人次满<var>{this.state.conditionLearningNum}</var>即可加入备选库，课程申请推广后，需等待5个工作日进行课程审核，详情可添加珊瑚课程十师姐了解 ，添加微信号：qlbzr10</span>
                        </div>
                        {/*<div className="rule-p">*/}
                            {/*<span>小提示：若你不希望课程被投放，可手动关闭</span>*/}
                        {/*</div>*/}
                        <div className="bottom"><div className="btn-know" onClick={()=>{this.refs.showRuleTipBox.hide()}}>我知道了</div></div>
                    </div>
                    
                </Confirm>
                <Confirm 
                    className="apply-tip-dialog"
                    ref='showSetApplyBox'
                    title = {this.state.thisApplyStatus ==='R'?'您是否确认申请推广该系列课？':'您是否确定取消推广该系列课？'}
                    titleTheme='white'
                    buttonTheme='line'
                    buttons='cancel-confirm'
                    onBtnClick={this.setLaunch}
                    >
                    {
                        this.state.thisApplyStatus ==='R'?
                        <div className="content">
                            1、点击确认加入备选库，等待课程评测结果，通过即可上架，评审时间需要约5个工作日，详情可添加珊瑚课程十师姐了解：qlbzr10
                            <br />
                            2、评测通过之后，您即可按照合作的分成比例享受收益（默认分成比例30%）。
                            <br />
                            申请即代表阅读并同意 <var className="btn-course-up-rule" onClick={this.showRuleState}>《课程上架协议》</var>
                        </div>
                        :
                        <div className="content">
                            确认取消后，该课程将没有机会被官方推广投放。您可通过重新申请获得推广机会。
                        </div>
                    }
                    
                </Confirm>
                {
                    this.state.ruleStateShow&&
                    <div className="rule-state-page">
                        <div className="content">
                           <div className="title">知识产品授权协议</div>
                            <p>本协议为千聊平台知识产品授权协议，由千聊平台讲师/课程权利人自愿将其投放在千聊平台上的知识产品，授权予千聊，由千聊将其知识产品通过千聊“珊瑚会员商城”进行推广销售，旨在为千聊平台讲师/课程权利人提供更为广阔的课程销售/传播渠道，为讲师/课程权利人获得更大收益。</p>
                            <p>各服务条款前所列索引关键词仅为帮助您理解该条款表达的主旨之用，不影响或限制本协议条款的含义或解释。协议涉及权利转移，为维护您自身权益，请您务必仔细阅读各条款的具体表述。</p>
                            <p><b>【审慎阅读】</b>请您在授权知识产品上架前，应当认真阅读（未成年人应当在监管人陪同下阅读）本协议。请您务必审慎阅读、充分理解各条款内容，特别是免除或者限制责任的条款、法律适用和争议解决条款。<span className="underscore">免除或者限制责任的条款将以粗体下划线标识，您应重点阅读。</span>如您对协议有任何疑问，可向千聊客服咨询。</p>
                            <p><b>【签约/授权主体】</b>当您登录千聊账户并操作本授权过程，即表示您是被选课程的知识产权权利人，并且您有权同意本协议授权内容并签署本协议；如您并非被选课程的权利人，请停止本授权操作，或取得权利人的授权后继续进行本授权操作。“千聊”是指千聊平台运营商及关联公司、合作方，包括广州沐思信息科技有限公司、广州思坞信息科技有限公司等。</p>
                            <p><b>【签约/授权动作】</b>当您登录千聊平台账户、阅读并同意本协议且完成知识产品上架操作后，即表示已充分阅读、理解并接受本协议的全部内容，并与千聊达成一致，同意千聊按照协议约定的方式使用您的知识产品。<span className="underscore">阅读本协议的过程中，如果您不同意本协议或其中任何条款约定，您应立即停止知识产品的授权操作，取消知识产品的上架程序。</span></p>
                            <div className="sub-title">一.定义</div>
                            <p>1.授权知识产品：是指甲方按照本协议约定授权乙方使用的知识产品，该产品为数字化课程及推文，表现形式包括但不限于文字、语音、图片、视频等，本文又称“课程”。</p>
                            <p>2.珊瑚会员商城：是指千聊“珊瑚计划”特有的课程库。用户通过购买珊瑚会员礼包可成为珊瑚计划课代表，珊瑚计划课代表可从珊瑚会员商城中购买或通过微信分享功能分发销售选定的课程，从而获得返利或分销收益。</p>
                            <div className="sub-title">二.权利保证及许可</div>
                            <p>1.授权内容：授权知识产品及与授权知识产品相关的商标、个人姓名（含艺名）以及肖像，前述授权内容由以您实际选择上架并通过千聊审核的知识产品为准。 </p>
                            <p>2.授权性质及地域范围：授权知识产品在中华人民共和国境内（包括香港、澳门和台湾地区）的信息网络传播权、汇编权、转授权，以及授权知识产品录制角色的姓名权、肖像权。</p>
                            <p>3.授权期限：自知识产品上架到珊瑚会员商城起至该知识产品被操作下架；您同意，即便授权期满、知识产品下架，千聊平台仍有权永久保留您的知识产品，以便已购买用户继续使用。 </p>
                            <p>4.您应保证对授权知识产品拥有合法完整的知识产权，包括但不限于信息网络传播权在内的著作权,及其转授权权利；且您应保证授权知识产品不违反法律法规及相关规范性文件，亦不侵犯任何第三方的合法权利；否则，千聊有权下架您的课程，或依法删除您的知识产品。</p>
                            <p>5.您应尽量保证知识产品内容的质量，不得存在虚假宣传、内容抄袭、无故断更等情况，如您的课程遭到消费者投诉或举报，千聊有权根据投诉、举报的情况下架您的知识产品。</p>
                            <p>6.除上述的权利保证及授权外，您同意授权千聊及珊瑚计划会员按照本协议约定的方式使用您上传的知识产品，并与您分享收益。</p>
                            <div className="sub-title">三.上架“珊瑚会员商城”须知</div>
                            <p>1.您同意将选定课程上架到珊瑚会员商城，供珊瑚会员进行选购分销；通过该种方式的销售，您同意仅保留课程收益的【 <span className="underscore">30 %</span>】，其余课程收益（ 60%）将作为“珊瑚计划”的分销成本；如需修改分销比例的，可与千聊联系进行修改。</p>
                            <p>2.您将选定课程上架到珊瑚会员商城，即表示您同意授权千聊及千聊珊瑚会员有权通过网络分销的方式对您的选定课程进行分发销售，并按约定的比例获得分销收益，但千聊不保证收益的总量，报名的课程粉丝沉淀至您自有的直播间/知识店铺。</p>
                            <p>3.课程上架珊瑚会员商城后，您应尽力维护课程更新，保证开课时间，提高课程质量，如因课程质量、课程宣传、课程更新、课程内容不如实等原因造成用户投诉的，千聊有权对您的课程进行下架处理，如用户要求退款的，全部费用由您承担。</p>
                            <p>4.如您需要下架选定课程，请与千聊“班主任”（微信号：qlbzr01）联系，千聊“班主任”与您核实信息后，将在3个工作日内完成处理。</p>
                            <div className="sub-title">四.争议解决</div>
                            <p>本协议签订地为中国广东省广州市天河区。</p>
                            <p>您和千聊均同意，因本协议解释或执行引起的任何争议，双方应首先友好协商解决。协商不成的，你同意将纠纷或争议提交本协议签订地有管辖权的人民法院管辖。</p>
                            <div className="sub-title">五.协议的修改权及可分性</div>
                            <p>为更好地提供服务并符合相关监管政策，千聊有权及时修改本协议条款。本协议如果变更，千聊将提前发布通知。如果本协议修改或变更，而您不能接受修改或变更后的内容，您可以停止使用千聊知识店铺升级版。如果您继续使用，则表明您完全接受并愿意遵守修改或变更后的本协议。</p>
                            <p>本协议任一条款被视为废止、无效或不可执行，该条应视为可分的且并不影响本协议其余条款的有效性及可执行性。</p>
                            <br/>
                            <p>请您再次确认您已全部阅读并充分理解上述协议。</p>
                            <br/>
                            <p style={{textAlign:'right'}}>2018年3月23日</p>
                        </div>
                        <div className="bottom" onClick={this.hideRuleState}>返回</div>
                    </div>
                }
                
            </Page>
        );
    }
}

function mapStateToProps(state) {
    return {
        
    };
}

const mapActionToProps = {
    selectCourseList,
    launchCourseList,
    setCourseLaunch,
    getConditions,
}

module.exports = connect(
    mapStateToProps,
    mapActionToProps,
)(Author);