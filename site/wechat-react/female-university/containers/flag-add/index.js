import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import { locationTo } from 'components/util'
 
import {    universityFlagAdd } from '../../actions/flag';

 
@autobind
class FlagAdd extends Component {
    state = {
        value:'',
        guangbiao: false, //模拟光标
    }
    page = {
        page: 1,
        size: 3,
    }
    componentDidMount(){ 
        //  universityFlagAdd({
        //     userId:'2000000541210023',
        //     desc:'2000000541210023我要30天内读完7本书！并分享30份读后感，大家一起监督我吧！'
        // })
        
         // 绑定非window的滚动层 
         typeof _qla != 'undefined' && _qla.bindVisibleScroll('scroll-content-container');
    }
    // 初始化获取数
    async initData(){
         
    } 
    async submit(){
        if(this.state.value==''){
            window.toast("请输入目标", 1000);
            return
        }
        await universityFlagAdd({
            desc:this.state.value
        })
        locationTo('/wechat/page/university/flag-wait')
    }
    textChange= (e) => { 
        const value = e.target.value.trim(); 
        if(value.length >150){
            window.toast("字数不能超过150个字~");
            return false
        }
        this.setValue(value)
    }
    setValue =(val) =>{ 
        this.setState({
            value:val
        },()=>{ 
            this.textarea.style.height = 'auto';
            this.textarea.style.height =  this.textarea.scrollHeight + 'px';
        }) 
    }
    render(){
        const {value, guangbiao} =this.state
        return (
            <Page title="我要定目标" className="un-flag-add-box">
                <section className="scroll-content-container">
                    <div className="fla-container">
                        <div className="fla-title">写下你想达成的目标</div>
                        <div className="fla-intro">挑战自己，30天坚持完成目标，最高得160元奖学金</div>
                        <div className={`fla-input  ${guangbiao?'':'guangbiao'}`}>
                            <textarea 
                                ref={ ref => this.textarea = ref } 
                            maxLength="150" placeholder="例如：我要30天学完7本书，并坚持写至少30份心得！" 
                            onChange={this.textChange}
                            onFocus={()=>{this.setState({guangbiao:true});}}
                            ></textarea>
                            <div className={`fla-num${value.length>=150?' on':''}`}>{value.length}/150</div>
                        </div>
                    </div>
                    <div className="fla-rule">
                        <div className="fla-title">创建流程</div>
                        <div className="fla-content">1.填写目标 <span>>></span>2. 请3位姐妹帮点 <span>>></span>3.创建成功</div>
                        
                    </div>
                    
                </section>

                <div className={`on-log on-visible fla-btn${value.length>0?' on':''}`} 
                    data-log-name='确定目标'
                    data-log-region="un-flag-add-confirm"
                    data-log-pos="0"
                    onClick={this.submit}>确定</div> 
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {

};

module.exports = connect(mapStateToProps, mapActionToProps)(FlagAdd);