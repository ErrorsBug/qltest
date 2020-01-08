import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { autobind, throttle } from 'core-decorators';
import Page from 'components/page';   
import {InviteItem} from './components/invite-rank/index'
import ScrollToLoad from 'components/scrollToLoad';
import {getInviteList} from '../../actions/experience'
import { getUrlParams } from 'components/url-utils';

@autobind
class ExperienceCampInviteList extends Component { 
    state = { 
        isShow: true,
        isSure: false, 
        clientHeight:'auto',
        listInvite:[]
    }  
    page={page:1,size:20}
    get campId(){
        return getUrlParams('campId')
    }
    async componentDidMount() {
        this.initData() 
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('experience-camp-invite-scroll-box');
    } 
    async initData(){  
        const params={campId:this.campId,rank:'SECOND',...this.page}
        let {dataList} =await getInviteList(params)
        if(!dataList){dataList=[]}
        if(dataList.length >= 0 && dataList.length < this.page.size){ 
            this.setState({noMore:true})
        } 
        this.setState({listInvite:this.page.page == 1?dataList:[...this.state.listInvite,...dataList]})
        if(this.state.listInvite.length<=0){
            this.setState({noneOne:true})
        }
    } 
    async loadNext(next) { 
        this.page.page += 1;
        await this.initData();
        next && next();
    }
 
    render(){ 
        const {listInvite,noneOne,noMore} = this.state
        return (
            <Page title={ '邀请列表' } className="experience-camp-invite-list"> 
                <ScrollToLoad
                    ref="scrollContainer"
                    className={`experience-camp-invite-scroll-box`}
                    toBottomHeight={300} 
                    noneOne={noneOne}
                    noMore={noMore}
                    loadNext={ this.loadNext }>
                    <div className="experience-camp-invite-container">
                        {
                            listInvite?.map((item,index)=>{
                                return <InviteItem {...item}/>
                            })
                        } 
                    </div>
                </ScrollToLoad>  
            </Page> 
        )
    }
}

const mapStateToProps = (state) => ({ 
});

const mapActionToProps = {  
};

module.exports = connect(mapStateToProps, mapActionToProps)(ExperienceCampInviteList);