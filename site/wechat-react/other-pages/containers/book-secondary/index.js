import React, { Component } from "react";
import { connect } from "react-redux";
import Page from "components/page";
import { autobind } from "core-decorators";
import { locationTo, getCookie } from "components/util";
import { share } from 'components/wx-utils';
import { getUrlParams, fillParams } from 'components/url-utils'
import ScrollToLoad from "components/scrollToLoad";
import BooksList from '../../components/books-list'
import { bookList } from '../../actions/books'

@autobind
class BookSecondary extends Component {
    state = {
        isNoMore: false,
        lists: [],
        bookObj: {},
        isOnce: false
    }
    page = {
        page: 1,
        size: 20,
    }
    get nodeCode() {
        return getUrlParams('nodeCode', '')
    }
    get sourceType() {
        return getUrlParams('sourceType', '')
    }
    isLoading = false;
    componentDidMount() {
        this.initShare();
        this.initData();
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('bl-book-scroll');
    }

    async initData() {
        const { bookListData: dataList, sourceData } = await bookList({ ...this.page, nodeCode: this.nodeCode, sourceType: this.sourceType });
        if(!!dataList && dataList.length >=0 && dataList.length < this.page.size){
            this.setState({
                isNoMore: true
            })
        } 
        this.page.page += 1;
        const lists = dataList || []
        this.setState({
            lists: [...this.state.lists, ...lists],
            bookObj: sourceData || {},
            isOnce: true
        }, () => {
            this.initShare()
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
        const { bookObj } = this.state;
        let title = bookObj.title;
        let desc = bookObj.keyB; 
        let shareUrl = fillParams( { wcl:'book-list'}, location.href) 
        let imgUrl = 'https://img.qlchat.com/qlLive/activity/image/PPTKBG6X-ZI5E-EANZ-1573561198923-GXWK6TSGRUMH.png'
        share({
            title: title,
            timelineTitle: title,
            desc: desc,
            timelineDesc: desc,
            imgUrl: imgUrl,
            shareUrl: shareUrl
        });
        
    }
    render() {
        const { isNoMore, lists, bookObj, isOnce } = this.state
        return (
            <Page title={bookObj.title} className="bd-book-secondary">
                <ScrollToLoad
                    className="bl-book-scroll"
                    toBottomHeight={300}
                    noneOne={ isOnce && !lists.length }
                    loadNext={this.loadNext}
                    noMore={isNoMore}>
                    { lists.map((item, index) => (
                        <BooksList key={index} index={ index } {...item} />
                    )) }
                </ScrollToLoad>
            </Page>
        );
    }
}

function mapStateToProps(state) {
    return {
        
    };
}

const mapActionToProps = {
  
};

module.exports = connect(
)(BookSecondary);
