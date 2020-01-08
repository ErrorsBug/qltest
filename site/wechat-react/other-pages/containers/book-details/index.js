import React, { Component } from "react";
import { connect } from "react-redux";
import Page from "components/page";
import { autobind } from "core-decorators";
import { locationTo, getCookie } from "components/util";
import { share } from 'components/wx-utils';
import { getUrlParams, fillParams } from 'components/url-utils'
import ScrollToLoad from "components/scrollToLoad";
import Header from './components/header'
import BooksList from '../../components/books-list'
import { bookList } from '../../actions/books'

@autobind
class BookDetails extends Component {
    state = {
        isNoMore: false,
        lists: [],
        bookObj: {}
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
            bookObj: sourceData || {}
        }, () => {
            this.initShare();
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
        const  { bookObj } = this.state;
        let shareUrl = fillParams( { wcl:'book-details'}, location.href) 
        share({
            title: bookObj.title,
            timelineTitle: bookObj.title,
            desc: bookObj.keyD,
            timelineDesc: bookObj.keyD,
            imgUrl: bookObj.keyC,
            shareUrl: shareUrl
        });
    }
    render() {
        const { isNoMore, lists, bookObj } = this.state
        return (
            <Page title={bookObj.title} className="bd-book-box">
                <ScrollToLoad
                    className="bl-book-scroll"
                    toBottomHeight={300}
                    noneOne={ !lists.length }
                    loadNext={this.loadNext}
                    noMore={isNoMore}>
                    <Header title={ bookObj.title } decs={ bookObj.keyD } />
                    <div className="bd-book-cont">
                        { lists.map((item, index) => (
                            <BooksList key={index} index={ index } {...item} />
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
)(BookDetails);
