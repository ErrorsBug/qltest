import React, { Component } from 'react';
import {browserHistory  } from 'react-router';

import { connect } from 'react-redux';

import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import Checkbox from './components/checkbox';

import {
    locationTo,
    updatePageData,
} from 'components/util';

// actions
import {
    saveSelectPeriodTag,
    setSubscribeStatus,
    fetchPeriodInfo,
    getSelectPeriodTag,
    userBindKaiFang,
} from '../../actions/recommend';


class SubscribeCustomMade extends Component {
    state = {
        inviteKey:this.props.location.query.inviteKey||"",
        subscribeStatus:this.props.subscribeStatus,
        bigLabels: this.props.bigLabels,
        bigTags:this.props.bigTags,
        smLabels:this.props.smLabels,
        del:{},
    }

    componentDidMount() {
        this.initSelectedTag();

        const kfAppId=this.props.location.query.kfAppId;
        const kfOpenId=this.props.location.query.kfOpenId;
        if(kfAppId&&kfOpenId){
            this.props.userBindKaiFang(kfAppId,kfOpenId);
        }
        
    }

    async initSelectedTag(){
        await this.props.getSelectPeriodTag();
        this.setState({
            inviteKey:this.props.location.query.inviteKey||"",
            subscribeStatus:this.props.subscribeStatus,
            bigLabels:this.props.bigLabels,
            bigTags:this.props.bigTags,
            smLabels:this.props.smLabels,
        });
    }

    async saveSelectLabels(){
        var selectedTags=this.state.smLabels.join(",");
        if(this.state.smLabels.length>0&&this.state.bigTags.length>0){
            selectedTags+=",";
        }
        selectedTags+=this.state.bigTags.join(",");
        if(selectedTags!=""){
            var result=await this.props.saveSelectPeriodTag(selectedTags,this.state.inviteKey);
            if(result.state.code == 0){
                await this.props.fetchPeriodInfo();
                localStorage.setItem("getbarrierTip","Y");
                if(this.props.hasMy=="Y"){
                    window.toast("新定制课程将于下期为你推送",2000);
                    setTimeout(()=>{
                        history.go(-1);
                    },2000);
                }else{
                    window.toast("定制成功",1500);
                    setTimeout(function(){
                        locationTo("/wechat/page/subscribe-qrcode");
                    },1000);
                }
                
            }else{
                window.toast(result.state.msg);
            }
        }else{
            window.toast("请至少选择1个标签");
        }
        
    }

    async cancelSubscribe(){
        window.confirmDialog('确定取消定制？', this.cancelSubscribeBtn.bind(this),function(){},"下期将不再收到专属课程,","confirm-cancel");
    }

    async cancelSubscribeBtn () {
        var isOpen=this.state.subscribeStatus=="Y"?"N":"Y";
        var result = await this.props.setSubscribeStatus(isOpen);
        if(result.state.code== 0 ){
            await this.props.fetchPeriodInfo();
            window.toast("取消成功");
            this.setState({
               subscribeStatus:isOpen,
            });
            setTimeout(function(){
                history.go(-1);
            },1000);
        }
    }

    async onSelectLabels(labelId,bigindex,smindex,bigOrsm){
        
        var bigLabelsObj=this.state.bigLabels;
        var sm=this.state.smLabels;
        var big=this.state.bigTags;
        var del=this.state.del;
        
        
        if(bigOrsm=="sm"&&bigLabelsObj[bigindex].smLabels[smindex]){
            if(bigLabelsObj[bigindex].smLabels[smindex].action==true){
                
                var smNum=0;
                bigLabelsObj[bigindex].smLabels.map((val,index)=>{
                    if(val.action==true){
                        smNum++;
                    }
                });
                if(smNum>1){
                    bigLabelsObj[bigindex].smLabels[smindex].action=false;
                    if(sm.indexOf(labelId)>=0){
                        sm.splice(sm.indexOf(labelId),1);
                    }
                }else{
                    window.toast("请至少选择1个小标签");
                }
                
            }else{
                bigLabelsObj[bigindex].smLabels[smindex].action=true;
                sm.push(labelId);
            }
        }else if(bigOrsm=="big"){
            if(bigLabelsObj[bigindex].action==true){
                if(this.state.bigTags.length>1){
                    bigLabelsObj[bigindex].action=false;
                    del[bigindex]=[];
                    bigLabelsObj[bigindex].smLabels.map((val,index)=>{
                        if(sm.indexOf(val.id)>=0){
                            del[bigindex].push(sm.splice(sm.indexOf(val.id),1)[0]);
                        };
                    });
                    if(big.indexOf(labelId)>=0){
                        big.splice(big.indexOf(labelId),1);
                    }
                    
                }else{
                    window.toast("请至少选择1个标签");
                }
            }else{
                if(this.state.bigTags.length<4){
                    bigLabelsObj[bigindex].action=true;
                    big.push(labelId);
                    if(bigLabelsObj[bigindex].smLabels[0]&&bigLabelsObj[bigindex].smLabels.length<1){
                        bigLabelsObj[bigindex].smLabels[0].action=true;
                        sm.push(bigLabelsObj[bigindex].smLabels[0].id);
                        
                    }else if(bigLabelsObj[bigindex].smLabels[0]&&del[bigindex]){
                        sm=sm.concat(del[bigindex]);
                        del[bigindex]=[];
                        
                    }
                }else{
                    window.toast("请选择4个以内的标签");
                }
            }
        }

        await this.setState({
            smLabels:sm,
            bigTags:big,
            del:del,
        });

    };

    render() {
        
        return (
            <Page title="听课定制" className="subscribe-cm-container">
                <ScrollToLoad
                disable={true}
                className="scroll-box" >
                {
                    this.state.subscribeStatus=="Y"&&<div className="btn-cancel on-log" onClick={this.cancelSubscribe.bind(this)} data-log-region="subscribe-custom-made" data-log-pos="subscribe-custom-made" data-log-name="取消定制">取消定制</div>
                }
                    <h2>勾选你想学习的动机</h2>
                    <div className="deco">
                        <div className="line"></div>
                        <div className="dot"></div>
                        <div className="line"></div>
                    </div>
                    <Checkbox
                        bigLabels = {this.state.bigLabels}
                        desc="自信是你有魅力，提高自己的自信"
                        onCheckFunc={this.onSelectLabels.bind(this)}
                    />
                </ScrollToLoad>
                
                {/*<section className="btn-change"><span className="icon_changethis"></span>换一批</section>*/}
                
                <section className="btn-subscribe on-log"
                    onClick={this.saveSelectLabels.bind(this)}
                    data-log-region="subscribe-custom-made"
                    data-log-pos="subscribe-custom-made"
                    data-log-name={this.props.hasMy=="Y"?"保存定制选择":"开启定制"}
                >
                    {this.props.hasMy=="Y"?"保存定制选择":"开启定制"}
                </section>
                
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {
        subscribeStatus: state.periodCourse.subscribeStatus,
        hasMy: state.periodCourse.hasMy,
        bigLabels: state.periodCourse.bigLabels,
        bigTags:state.periodCourse.bigTags,
        smLabels:state.periodCourse.smLabels,
    };
}

const mapActionToProps = {
    saveSelectPeriodTag,
    setSubscribeStatus,
    fetchPeriodInfo,
    getSelectPeriodTag,
    userBindKaiFang,
}

module.exports = connect(mapStateToProps, mapActionToProps)(SubscribeCustomMade);