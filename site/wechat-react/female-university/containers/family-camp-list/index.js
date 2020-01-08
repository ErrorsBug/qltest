import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import { getUrlParams } from 'components/url-utils';
import CampItem from './components/camp-item'
import { getCampLists } from '../../actions/family'
import { userBindKaiFang } from "../../../actions/common"

@autobind
class FamilyCampList extends Component {
    state = {
        isNoMore: false,
        lists: []
    }
    page = {
        page: 1,
        size: 20,
    }
    isLoading = false;
    async componentDidMount() { 
        this.bindAppKaiFang();
        this.initData();
        // 绑定非window的滚动层 
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('un-class-code');
    }
    async initData() {
        const { campList: dataList } = await getCampLists({ ...this.page, type: 'selectCamp' });
        if(!!dataList && dataList.length >=0 && dataList.length < this.page.size){
            this.setState({
                isNoMore: true
            })
        } 
        this.page.page += 1;
        const lists = dataList || []
        this.setState({
            lists: [...this.state.lists, ...lists]
        });
    }
    async loadNext(next) {
        if(this.isLoading || this.state.isNoMore) return false;
        this.isLoading = true;
        await this.initData();
        this.isLoading = false;
        next && next();
    }
   
    async bindAppKaiFang(){
        const kfAppId = getUrlParams('kfAppId');
        const kfOpenId = getUrlParams('kfOpenId');
        if(kfOpenId && kfAppId){
            await this.props.userBindKaiFang({
                kfAppId: kfAppId,
                kfOpenId: kfOpenId
            });
        }
    }
    render(){
        const { isNoMore, lists } = this.state;
        return (
            <Page title={ '体验营主页' } className="uni-exp-card">
                <ScrollToLoad 
                    className="uni-exp-scroll"
                    toBottomHeight={300}
                    disable={ isNoMore }
                    noMore={ isNoMore }
                    loadNext={ this.loadNext }>
                        { lists.map((item, index) => {
                            return <CampItem key={ index } {...item} />
                        }) }
                </ScrollToLoad>
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {
    userBindKaiFang
};

module.exports = connect(mapStateToProps, mapActionToProps)(FamilyCampList);