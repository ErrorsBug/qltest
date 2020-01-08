import React, { Component } from 'react'
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import HeadImg from '../../components/head-img';
import {getListTopicCategory, getTopicList } from '../../actions/community';
import { share } from 'components/wx-utils';
import { fillParams } from 'components/url-utils';
import { getCookie, locationTo } from 'components/util'; 
import UniversityHome from 'components/operate-menu/home'
import UserHoc from '../../components/user-hoc'
import AppEventHoc from '../../components/app-event'
import TopicItem from './components/topic-item' 
import Header from './components/header'
import ChToUniversity from '../../components/ch-to-university'; 

@AppEventHoc 
@UserHoc
@autobind
class CommunityListTopic extends Component {
    state = { 
        isNoMore: false,
        lists: [],
        activeIndex:0,
        categoryList:[]
    }
    page = {
        page: 1,
        size: 20
    }
    isLoading = false;
    async componentDidMount() {
        await this.initData();
        this.initShare();
        
         // 绑定非window的滚动层 
         typeof _qla != 'undefined' && _qla.bindVisibleScroll('ln-scroll-box');
    }
    async initData() {
        const { dataList = [] } = await getListTopicCategory()
        this.setState({
            categoryList:dataList
        })
    }
    async getList(flag){
        const {categoryList,activeIndex} = this.state
        const { dataList = [] } = await getTopicList({source:'ufw',...this.page,businessId:categoryList[activeIndex]?.id});
        if(!!dataList && dataList.length >=0 && dataList.length < this.page.size){
            this.setState({
                isNoMore: true
            })
        } else {
            this.page.page += 1;
        }
        await this.setState({
            lists:flag ? dataList: [...this.state.lists, ...dataList]
        })
        if(this.state.lists.length==0){
            this.setState({
                noData:true
            })
        }

    }
    async loadNext(next) {
        if(this.isLoading || this.state.isNoMore) return false;
        this.isLoading = true;
        await this.getList();
        this.isLoading = false
        next && next();
    }
    initShare() {
        const { shareParams, shareConfig } = this.props;
        let title = '千聊女子大学-话题广场';
        let desc = '期待与你一起交流';
        let shareUrl = fillParams({...shareParams , wcl:'university_share'}, location.href,[])
        let imgUrl = 'https://img.qlchat.com/qlLive/activity/image/7U9OO2L5-Y1W6-WRND-1570504679615-PRIR25AIRY3R.jpg'
        // h5 分享
        share({
            title: title,
            timelineTitle: title,
            desc: desc,
            timelineDesc: desc,
            imgUrl: imgUrl,
            shareUrl: shareUrl
        });

        // app分享
        shareConfig({
            content: shareUrl,
            title: title,
            desc: desc,
            thumbImage: imgUrl,
            success: (res) => {
                console.log('分享成功！res:', res);
            }
        })
    }
    async changeTag(i){
        this.state.activeIndex=i
        this.state.isNoMore=false 
        this.state.noData=false 
        this.page.page= 1;
        this.getList(true)
        // 手动触发打点日志
        typeof _qla != 'undefined' && _qla('click', {
            region:'community-list-topic-tab',
            pos:i+1
        });
    }
    render() {
        const { isNoMore, lists, noData, categoryList } = this.state;
        const { isQlchat } = this.props
        return (
            <Page title="话题广场" className="community-lt-box">
                {
                    categoryList?.length&&<Header changeTag={this.changeTag} lists={ categoryList } />
                }
                <div className="community-lt-1">
                    <ScrollToLoad 
                        id="scrolling-box"
                        className={"ln-scroll-box"}
                        toBottomHeight={300}
                        noMore={ isNoMore }
                        noneOne={ noData }
                        loadNext={ this.loadNext }>
                        { lists.map((item, index) => (
                            <TopicItem 
                            handleSelectTopic={()=>{ locationTo(`/wechat/page/university/community-topic?topicId=${item.id}`)}}
                            { ...item } 
                            idx={index} key={ index } />
                        )) }
                    </ScrollToLoad>
                </div>
                
                <ChToUniversity 
                        initClick={()=>{ locationTo(`/wechat/page/university/community-center`)}}
                        imgUrl="https://img.qlchat.com/qlLive/business/WO6I8XW1-8V4O-GT1E-1571020407965-PABC7DAHRGJA.png"/> 
            </Page>
        );
    }
}

const mapStateToProps = (state) => ({
    
});

const mapActionToProps = {

};

module.exports = connect(mapStateToProps, mapActionToProps)(CommunityListTopic);