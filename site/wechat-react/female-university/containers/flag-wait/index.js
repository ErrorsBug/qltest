import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import FlagItem from '../../components/flag-item';
import FwHead from './components/fw-head';
import FwFlag from './components/fw-flag';
import Footer from '../../components/footer';
import { universityFlag,universityFlagList,flagHelpList } from '../../actions/flag';
import {fillParams, getUrlParams } from 'components/url-utils'; 
import PosterDialog from '../../components/poster-dialog'; 
import { initMinCards } from '../../components/poster-card'
import { getCookie,formatDate } from 'components/util'; 
import { falgShareProgress } from '../../components/flag-share';
import { locationTo } from 'components/util'
import { limitScrollBoundary } from 'components/scroll-boundary-unlimit';
import DialogRule from './components/dialog'; 

@autobind
class FlagWait extends Component {
    state = {
        flagHelpListData:[],
        isShowRule:false,
        isShowProcess:false
    } 
    get code(){
        return getUrlParams('nodeCode', '')
    }
    componentDidMount() { 
       this.initData();
       this.initShare()
       
         // 绑定非window的滚动层 
         typeof _qla != 'undefined' && _qla.bindVisibleScroll('flag-wait-page');
    }
    componentDidUpdate(){
        document.querySelector('.co-dialog-container')&&limitScrollBoundary(document.querySelector('.co-dialog-container')) 
    }
    async initData() {
        const universityFlagData = await universityFlag({cardDate:formatDate(new Date())}); 
        const flagHelpListData = await flagHelpList();
        const { flagList = [] } = await universityFlagList({
            indexPage:'Y',
            order:'time'

        });
        this.setState({  
            universityFlagData,
            flagHelpListData,
            flagList
        })  
        if(getUrlParams('status','')=='join'){
            this.initMinCards()
            return
        }
    } 
    initShare(){
        falgShareProgress({ 
             successFn:  ()=> {
                 // 分享成功日志 
                typeof _qla != 'undefined' && _qla('event', {
                    category:`${this.state.isShowProcess?'pd-init':'flag-wait'}`,
                    action:'success'
                });
                 this.setState({
                    isShowProcess:false
                 }) 
                 this.initShare()
                
             }
         }) 
    }
      
    async initMinCards(){  
        const {universityFlagData,flagHelpListData} =this.state 
        initMinCards(universityFlagData,flagHelpListData?.data?.flagHelpList,(url)=>{
            this.setState({
                processUrl:url
            },()=>{
                this.showProcess()
            })
        })
    }

    showProcess(){
        this.setState({
            isShowProcess: true,
        })
    } 
    colseProcess(){
        this.setState({ 
            isShowProcess: false, 
            isShowType:''
        }) 
    } 
    
    showRule(){
        this.setState({
            isShowRule:true
        })
    }
    closeRule(){
        this.setState({
            isShowRule:false
        })
    }

    updateDesc(desc){
        let universityFlagData = this.state.universityFlagData;
        universityFlagData.desc = desc;
        this.setState({
            universityFlagData
        });
    }

    render(){
        const { universityFlagData, flagHelpListData  ,flagList,  isShowProcess,processUrl,isShowRule } = this.state; 
        return (
            <Page title="等待生效" className="flag-wait-page">
                <FwHead {...universityFlagData} flagList={flagList}  flagHelpList={flagHelpListData?.data?.flagHelpList||[]}  initMinCards={this.initMinCards}  showRule={this.showRule}/>
                <FwFlag {...universityFlagData} flagHelpList={flagHelpListData?.data?.flagHelpList||[]} initMinCards={this.initMinCards} updateDesc={this.updateDesc}/>
               
                <PosterDialog 
                    isShow={ isShowProcess } 
                    imgUrl={processUrl}
                    on={2}
                    hideBtn={false}
                    close={ this.colseProcess }
                    children={
                        <img src={processUrl}/>
                    }
                     />
                     
                <DialogRule  isRule={ isShowRule } close={ this.closeRule } />
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
     
});

const mapActionToProps = {

};

module.exports = connect(mapStateToProps, mapActionToProps)(FlagWait);