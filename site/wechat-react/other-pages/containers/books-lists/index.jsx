import React, { Component } from "react";
import { connect } from "react-redux";
import Page from "components/page";
import { autobind } from "core-decorators";
import ScrollToLoad from "components/scrollToLoad";
import { locationTo, getCookie } from "components/util";
import { getUserInfo } from '../../actions/common';
import { share } from 'components/wx-utils';
import { getUrlParams, fillParams } from 'components/url-utils'
import BooksItem from './component/books-item'
import HomeFloatButton from "components/home-float-button";
import { getBooksLists, clearBooks } from "../../actions/books";
import Picture from 'ql-react-picture';


@autobind
class BooksLists extends Component {
  state = {
    progress: {},
    page: 0,
  };
  get urlParams(){
    return getUrlParams("","")
  }
  async componentDidMount() {
    await this.init();
    this.initShare();
    // 绑定滚动区捕捉曝光日志
    setTimeout(() => {
      typeof _qla != 'undefined' && _qla.bindVisibleScroll('books-scroll');
    }, 1000);
  }
  async componentWillUnmount() {
      this.setState({ page: 0 });
      this.props.clearBooks();
  }
  // 初始化获取数据
  async init() {
    const param = {
      page: this.props.pageNumb,
      size: 5
    }
    await this.props.getBooksLists(param);
  }
  initShare(){
    const { shareObj } = this.props;
    share({
        title: shareObj.title,
        timelineTitle: shareObj.title,
        desc: shareObj.content,
        timelineDesc: shareObj.content, // 分享到朋友圈单独定制
        imgUrl: shareObj.picurl,
        shareUrl: shareObj.targetUrl
    });
  }
  // 加载更多
  loadNext(next) {
    const { pageNumb, isNoMore } = this.props;
    if (this.state.page !== pageNumb) {
      this.setState(
        {
          page: pageNumb
        },
        async () => {
          if (!isNoMore) {
            await this.init();
          }
        }
      );
    }
    next && next();
  }

  scrollingFunc(){
    this.setState({
      scrolling: 'Y',
    });
    clearTimeout(this.timer)
    this.timer=setTimeout(()=>{
      this.setState({
        scrolling: 'S',
      });
    },1000)
  }

  render() {
    const { bookLists, shareObj, bookSubjectHeadImage  } = this.props;
    return (
      <Page title={'千聊听书'} className="books-lists">
        <ScrollToLoad
          className="books-scroll"
          toBottomHeight={300}
          noneOne={this.props.noData}
          loadNext={this.loadNext}
          scrollToDo={this.scrollingFunc.bind(this)}
          noMore={this.props.isNoMore}>

            {/* 临时代码 */}
            <div className="book-head">
              <Picture 
                src={bookSubjectHeadImage}
                resize={{
                  w: 750,
                  h: 468
                }}
              />
            </div>
            {/* 临时代码 */}

            {bookLists.map((item, index) => (
              item.bookList && !!item.bookList.length && <BooksItem key={index} latest={ index === 0 } {...item} />
            ))}
        </ScrollToLoad>
        <HomeFloatButton scrolling = { this.state.scrolling }/>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    bookLists: state.books.bookLists || [],
    pageNumb: state.books.pageNumb || 0,
    noData: state.books.noData || false,
    isNoMore: state.books.isNoMore || false,
    shareObj: state.books.shareObj || {},
    bookSubjectHeadImage: state.books.bookSubjectHeadImage
  };
}

const mapActionToProps = {
  getBooksLists,
  clearBooks
};

module.exports = connect(
  mapStateToProps,
  mapActionToProps
)(BooksLists);
