import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import { formatMoney, locationTo } from 'components/util'; 
import ScrollToLoad from 'components/scrollToLoad';
import RecordItem from './components/record-item'
import { getUrlParams } from 'components/url-utils';
import {getWithdrawRecordList} from '../../actions/experience'

@autobind
class WithdrawList extends Component {
    state = {
        isNoMore:false,
        withdrawRecordList: []
    }
    page={
        page:1,
        size:20,
    }
    get type(){
        return getUrlParams("type")||'intention'
    } 
    get accountType(){
        return this.type=='financial'?'FINANCING_DISTRIBUTE':'UFW_CAMP_DISTRIBUTE'
    }  
    componentDidMount() {
        this.initData()
    }
 
    
    async initData(){ 
        const { withdrawRecordList } = await getWithdrawRecordList({
            ...this.page,
            accountType:this.accountType
        })   
        
        if(!!withdrawRecordList){
            if(withdrawRecordList.length >= 0 && withdrawRecordList.length < this.page.size){
                this.setState({
                    isNoMore: true
                }) 
            }  
            this.setState({
                withdrawRecordList: [...this.state.withdrawRecordList, ...withdrawRecordList],
            },()=>{
                if(!this.state.withdrawRecordList||this.state.withdrawRecordList.length==0){
                    this.setState({
                        noData:true
                    })
                }
            })
        } 
    }
    async loadNext(next) {  
        this.page.page += 1; 
        await this.initData(); 
        next && next();
    }
    
    render(){
        const { isNoMore,noData, withdrawRecordList } = this.state;
        return (
            <Page title="提现记录" className="wl-page-box">
                <ScrollToLoad 
                    className={"wl-scroll-box"}
                    toBottomHeight={300}
                    noMore={isNoMore}
					noneOne={noData}
                    loadNext={ this.loadNext }>
                        { withdrawRecordList?.map((item, index) => (
                            <RecordItem key={index} {...item}/>
                        )) }
                </ScrollToLoad>
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {

};

module.exports = connect(mapStateToProps, mapActionToProps)(WithdrawList);