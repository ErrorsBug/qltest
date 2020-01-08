import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import HeadImg from '../../components/head-img';
import JoinDialog from '../../components/join-dialog';
import JoinHoc from '../../components/join-dialog/join-hoc';
import BooksItem from '../../components/books-item'
import Footer from '../../components/footer';
import { bookList } from '../../actions/home';
import { fillParams, } from 'components/url-utils';
import { getCookie } from 'components/util';
import { share } from 'components/wx-utils';
import UserHoc from '../../components/user-hoc'
import UniversityHome from 'components/operate-menu/home'
import { createPortal } from 'react-dom'
import AppEventHoc from '../../components/app-event'
import HandleAppFunHoc from 'components/app-sdk-hoc'

@HandleAppFunHoc
@AppEventHoc
@UserHoc
@JoinHoc
@autobind
class BooksList extends Component {
    state = {
        isNoMore: false,
        lists: []
    }
    page = {
        page: 1,
        size: 20,
    }
    isLoading = false;
    componentDidMount() {
        this.initData();
        
         // 绑定非window的滚动层 
         typeof _qla != 'undefined' && _qla.bindVisibleScroll('cp-scroll-box');
    }

    async initData() {
        const { dataList } = await bookList(this.page);
        if(!!dataList && dataList.length >=0 && dataList.length < this.page.size){
            this.setState({
                isNoMore: true
            })
        } 
        this.page.page += 1;
        const lists = this.handleData(dataList || []);
        this.setState({
            lists: [...this.state.lists, ...lists]
        })
        this.initShare();
    }
    // 处理数据
    handleData(lists) {
        let isOnce = false;
        const path = this.props.location && this.props.location.pathname || '';
        let isPath = false;
        if(path){
            isPath = localStorage.getItem(path) === 'Y';
        }
        return lists.map((item, index) => {
            item.isJoin = Object.is(item.isJoin, 'Y');
            if(item.isJoin && !isOnce && !isPath && !!path){
                item.isOnce = true;
                isOnce=true;
                localStorage.setItem(path, 'Y')
            }
            return item;
        })
    }
    async loadNext(next) {
        if(this.isLoading || this.state.isNoMore) return false;
        this.isLoading = true;
        await this.initData();
        this.isLoading = false
        next && next();
    }
    initShare() {
        const { shareParams, shareConfig, saveImage } = this.props;
        let title = '千聊女子大学图书馆';
        let desc = '腹中有书气自华，高效吸收热门好书'; 
        let shareUrl = fillParams( {...shareParams, wcl:'university_share'}, location.href,['couponCode']) 
        let imgUrl = 'https://img.qlchat.com/qlLive/business/PB3IZTMQ-5G29-N62W-1559616205086-16ERNM7H7K3R.png'
        // h5分享
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
    render(){
        const { isShowDialog, close, joinPlan, isQlchat, ...otherProps } = this.props;
        const { isNoMore, lists } = this.state;
        return (
            <Page title="听书列表" className={`cp-books-box ${isShowDialog?'pointer-events-none':''}`}>
                <ScrollToLoad
                    className={"cp-scroll-box"}
                    toBottomHeight={300}
                    disable={ isNoMore }
                    loadNext={ this.loadNext }
                    >
                    <HeadImg url={ require('./img/books_bg_top.png') } />
                    <div className="cp-books-cont">
                        <BooksItem lists={ lists } isOne isHideNum={true} { ...otherProps } />
                    </div>
                    { isNoMore && <Footer /> }
                </ScrollToLoad>
                { !isQlchat && <UniversityHome isUnHome /> }
                {
                    createPortal(
                        <JoinDialog 
                            isShowDialog={ isShowDialog } 
                            close={ close } 
                            joinPlan={joinPlan} />,
                            document.getElementById('app')
                        ) 
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

module.exports = connect(mapStateToProps, mapActionToProps)(BooksList);