import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import InviteItem from '../../components/invite-item';
import Footer from '../../components/footer';
import { universityUserProfitList } from '../../actions/home';
import { getUrlParams } from 'components/url-utils'; 
import { locationTo } from 'components/util'; 
import IlEmpty from './components/il-empty'

@autobind
class InviteDetail extends Component {
    state = {
        isNoMore: false,
        isNoneOne: false,
        lists: [],
        info: {}
    }
    page = {
        size: 20,
        page: 1
    }
    isLoading = false; 
    componentDidMount() {
       this.initData(); 
       
         // 绑定非window的滚动层 
         typeof _qla != 'undefined' && _qla.bindVisibleScroll('tl-scroll-box invite-list');
    } 
    async initData() {
        const { profitList = [] } = await universityUserProfitList({ ...this.page });
        if(!!profitList){
            if(profitList.length >= 0 && profitList.length < this.page.size){
                this.setState({
                    isNoMore: true
                })
            } else {
                this.page.page += 1;
            }  
            this.setState({
                lists: [...this.state.lists, ...profitList]
            })
        } 
        if(this.state.lists.length==0){
            this.setState({
                isNoneOne:true,
                isNoMore: false
            })
        }
    } 
     
    async loadNext(next) {
        if(this.isLoading || this.state.isNoMore) return false;
        this.isLoading = true;
        await this.initData();
        this.isLoading = false;
        next && next();
    }
    render(){
        const { isNoMore,isNoneOne, lists } = this.state
        return (
            <Page title="邀请明细" className="invite-detail-page">
                {
                    !isNoneOne?
                        <ScrollToLoad
                            className={"tl-scroll-box invite-list"}
                            toBottomHeight={300}
                            disable={ isNoMore } 
                            loadNext={ this.loadNext }> 
                            { lists.map((item, index) => (
                                <InviteItem
                                    key={ index } 
                                    { ...item } 
                                    isShowCate
                                    resize={{ w: 120, h: 120 }}
                                />
                            )) }
                            { isNoMore && <Footer /> }
                            <div className="invite-btn" onClick={()=>{locationTo(`/wechat/page/university/invitation-card`)}}
                                >继续邀请好友赚奖学金</div>
                        </ScrollToLoad> 
                    :
                        <IlEmpty/>
                    }
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
    user: ''
});

const mapActionToProps = {

};

module.exports = connect(mapStateToProps, mapActionToProps)(InviteDetail);