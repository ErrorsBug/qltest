import React, { Component } from "react";
import { connect } from "react-redux";
import Page from "components/page";
import { autobind } from "core-decorators";
import { locationTo, getCookie } from "components/util";
import { share } from 'components/wx-utils';
import { getUrlParams, fillParams } from 'components/url-utils'
import ScrollToLoad from "components/scrollToLoad";
import BooksHeader from '../../components/books-header'
import ClassIfyComp from './components/classify-comp'
import { bookSetList, getMenuNode } from '../../actions/books'

@autobind
class BookList extends Component {
    state = {
        isNoMore: false,
        lists: [],
        isOnce: false
    }
    page = {
        page: 1,
        size: 5,
    }
    isLoading = false;
    componentDidMount() {
        this.initShareData()
        this.initData();
        typeof _qla != 'undefined' && _qla.bindVisibleScroll('bl-book-scroll');
    }

    async initData() {
        const { dataList } = await bookSetList(this.page);
        if(!!dataList && dataList.length >=0 && dataList.length < this.page.size){
            this.setState({
                isNoMore: true
            })
        } 
        this.page.page += 1;
        const lists = dataList || []
        this.setState({
            lists: [...this.state.lists, ...lists],
            isOnce: true
        })
    }
    async loadNext(next) {
        if(this.isLoading || this.state.isNoMore) return false;
        this.isLoading = true;
        await this.initData();
        this.isLoading = false
        next && next();
    }
    async initShareData(){
        const { data } = await getMenuNode({ nodeCode: 'QL_LB_HOME' })
        const obj = data?.menuNode || {};
        this.initShare(obj)
    }
    initShare({ keyA, keyB, keyC, keyD }) {
        let title = keyA;
        let desc = keyB; 
        let shareUrl = keyD 
        let imgUrl = keyC
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
        const { isNoMore, lists, isOnce } = this.state
        return (
            <Page title={'千聊书单'} className="bl-book-list">
                <ScrollToLoad
                    className="bl-book-scroll"
                    toBottomHeight={300}
                    noneOne={ isOnce && !lists.length }
                    loadNext={this.loadNext}
                    noMore={isNoMore}>
                        <BooksHeader title="千聊书单" decs="主题阅读，让学习更有系统性" className="books" />
                        <div className="bl-book-cont">
                            { lists.map((item, index) => (
                                <ClassIfyComp key={index} { ...item } />
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
)(BookList);
