import React, { Component } from "react";
import { connect } from "react-redux";
import Page from "components/page";
import { autobind } from "core-decorators";
import { locationTo, getCookie } from "components/util";
import { share } from 'components/wx-utils';
import { getUrlParams, fillParams } from 'components/url-utils'
import ScrollToLoad from "components/scrollToLoad";
import BooksHeader from '../../components/books-header'
import BooksList from '../../components/books-list';
import { bookList } from '../../actions/books'

@autobind
class BooksRanking extends Component {
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
    get status() {
        return getUrlParams('status', '')
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
        })
    }
    async loadNext(next) {
        if(this.isLoading || this.state.isNoMore || Object.is(this.status, 'hot')) return false;
        this.isLoading = true;
        await this.initData();
        this.isLoading = false
        next && next();
    }
    initShare() {
        let title, desc;
        if(Object.is(this.status, 'hot')) {
            title = '千聊本周听书热榜'
            desc = '快来听听大家这周都在听哪些书吧！'
        } else {
            title = '千聊新书榜'
            desc = '快来抢先收听最近上新的好书吧！'
        }
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
            <Page title={bookObj.title} className="br-books-ranking">
                <ScrollToLoad
                    className="br-books-scroll"
                    toBottomHeight={300}
                    disable={!!lists.length && Object.is(this.status, 'hot')}
                    noneOne={ isOnce && !lists.length }
                    loadNext={this.loadNext}
                    noMore={isNoMore}>
                        <BooksHeader title={ bookObj.title } decs={ bookObj.keyC } className={ this.status } />
                        <div className="br-books-cont">
                            { lists.map((item, index) => (
                                <BooksList key={ index } index={ index } isNumb={ Object.is(this.status, 'hot') } isRanking={ Object.is(this.status, 'hot') } {...item}/>
                            )) }
                        </div>
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
)(BooksRanking);
