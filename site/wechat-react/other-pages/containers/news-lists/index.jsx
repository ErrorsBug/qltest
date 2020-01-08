import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';
import { autobind } from 'core-decorators'
import { collectVisible } from 'components/collect-visible';
import ScrollToLoad from 'components/scrollToLoad';
import { share } from 'components/wx-utils';
import ShareUserApp from 'components/share-user-app';
import classnames from 'classnames'
import NewsItem from './components/news-item';
import FamousList from "./components/famous-list";
import { getNewsLists, getUserInfo, bindOfficialKey, getLike, addLikeIt } from '../../actions/common'
import { locationTo, getCookie } from 'components/util';
import { getUrlParams, fillParams } from 'components/url-utils'
import HomeFloatButton from "components/home-float-button";
import CommentBox from './components/comment-box';

const ShowPrompt = () => (
  <div className="prompt-box"></div>
)

@autobind
class NewsLists extends Component {
  state = { 
    isNoMore: false,
    noneData:false,
    isShowPrompt: false,
    isShowShare: true, // 分享按钮
    lists: [], // 知识新闻列表
    famousList: [], // 名师解惑
    isShare: this.props.location.query && !!this.props.location.query.userId && (getCookie("userId") !== this.props.location.query.userId), // 是否分享
    isShareYin: false, // 分享阴影层
    title: '', // 分区标题
    desc: '', // 详情
    name: '', // 页面标题
    topicIdList: [],
    likeList: [],

    showComment: false,
    liveId: '',
  }
  data = {
    pageSize: 20,
    pageNum: 1,
    isLock: false,
    shareObj: {},
    type: 'teacher',//默认先加载名师解惑列表，再接着加载普通的知识新闻列表（type='default'）
  }

  get tracePage() {
    return window.sessionStorage && sessionStorage.getItem('trace_page')
  }

  set tracePage(tp) {
      window.sessionStorage && sessionStorage.setItem('trace_page', tp)
  }

  async componentDidMount(){
    await this.initData();
    this.setState({ isShowPrompt: true })
    this.initScroll();
    this.initStorage();

    if(this.props.location.query.officialKey||this.props.location.query.source=="coral"){
			this.tracePage = 'coral'
    }
    //officialKey，就绑定关系
    if(this.props.location.query.officialKey){
        this.props.bindOfficialKey({
            officialKey: this.props.location.query.officialKey
        });
    }


    let userId = this.props.location.query.userId || getCookie("userId");
    if(this.props.location.query.userId){
      await this.props.getUserInfo('',userId);
    }else{
      await this.props.getUserInfo();
    }
    
    setTimeout(() => {
      typeof _qla != 'undefined' && _qla.bindVisibleScroll('news-box');
    }, 1000);
    this.initShare();
  }

  get urlParams(){
    return getUrlParams("","")
  }

  initShare(){
    const { userInfo } = this.props;
    const urlParams = this.urlParams;
    const hreFUrl = window.location.href;
    let url = '';
    urlParams.name = encodeURIComponent(urlParams.name || '');
    if(urlParams && urlParams.userId){
        const userId = getCookie("userId");
        urlParams.userId = userId;
    } else {
        urlParams.userId = userInfo.user ? userInfo.user.userId : '';
    }
    /** 珊瑚来源分享出去带上 officialKey */
    if(this.tracePage === 'coral'){
      urlParams.officialKey = getCookie("userId");
    }
    url = fillParams(urlParams,hreFUrl);
    const { shareObj } = this.data;
    share({
      title: shareObj.shareTitle,
      timelineTitle: "",
      desc: shareObj.shareDesc,
      timelineDesc: "", // 分享到朋友圈单独定制
      imgUrl: shareObj.image,
      shareUrl: url,
      successFn: function() {
        this.calllog("news-list-share");
        toast('分享成功');
      }
    });
  }

  calllog (category) {
    typeof _qla !== 'undefined' && _qla('event',{
        category: category,
        action: "success",
        business_type: 'short-video',
        business_id: this.state.knowledgeId,
    })
  }
  // 初始化缓存
  initStorage(){
    setTimeout(() => {
      this.setState({
        isShowPrompt: false
      })
    },4000)
  }

  getLikeList (newsList) {
    if(newsList.length>0 ){
      const famousList = this.state.famousList;
      let data = newsList.map(async (item,index)=>{
        let topicIdList = [];
        (item.topicList).forEach(element => {
          topicIdList.push(element.id);
        });
        const likeResult = await this.props.getLike({
          speakIds: topicIdList.join(',')
        });
        item.likeList = likeResult.data.speaks || [];
        return item;
      })
      Promise.all(data).then((resultList) => {
        const flag = resultList.length < this.data.pageSize;
        this.setState({
          famousList:[...famousList,...resultList],
          isNoMore: flag
        });
      })
    }
  }

  // 下拉加载数据
  loadMore(next){
    if(!this.data.isLock){
      this.initData();
    }
    next && next();
  }
  // 初始化更多数据
  async initData(){
    this.data.isLock = true;
    const params = {
      pageSize: this.data.pageSize,
      pageNum: this.data.pageNum,
      type: this.data.type,
    }
    const { data } = await getNewsLists(params);
    this.data.shareObj = {
      image: data.image,
      shareDesc: data.shareDesc,
      shareTitle: data.shareTitle,
    }
    this.setState({
      title: data.title,
      desc: data.desc,
      name: data.pageTitle,
    })
    if(data && !!data.newsList && !!data.newsList.length || !!this.state.lists.length){
      const flag = data.newsList.length < this.data.pageSize;
      if(this.data.type === 'default'){
        this.setState({
          lists: [...this.state.lists, ...data.newsList],
          isNoMore: flag
        })
      }else{
        this.getLikeList(data.newsList)
      }

      if(!flag){
        this.data.pageNum = this.data.pageNum + 1;
      }else{
        if(this.data.type ==='teacher'){
          this.data.type = 'default';
          this.data.pageNum = 1;
        }else{
          this.data.pageNum = this.data.pageNum + 1;
        }
      }
      
      
    } else {
      if(this.data.type ==='teacher'){
        this.data.type = 'default';
        this.data.pageNum = 1;
        this.data.pageSize = 5;
      }else{
        this.setState({
          noneData: true
        })
      }
    }
    this.data.isLock = false
    if( this.data.type === 'default' && this.data.pageNum === 1 ){
      this.loadMore();
    }
    collectVisible();
  }
  // 防抖
  debounce(fn, delay){
    var timer;
    const that = this;
    return function (){
      var context = this;
      that.setState({
        isShowShare: false
      })
      var args = arguments
      clearTimeout(timer)
      timer = setTimeout(function () {
        fn.apply(context, args)
      }, delay)
    }
  }
  // 初始化监听滚动条
  initScroll(){
    const scrollNode = document.querySelector(".news-box");
    scrollNode.addEventListener("scroll", this.debounce(() => {
      this.setState({
        isShowShare: true
      })
    },200))
  }
  // 显示阴影层
  showShareYin(){
    this.setState({
      isShareYin: !this.state.isShareYin
    })
  }
  // 链接跳转
  goTopic(id){
    return locationTo(`/topic/details-listening?topicId=${id}`);
  }

  updateCommentNum(count){
    let famousList =  this.state.famousList;
    famousList[this.state.famousIndex].topicList[this.state.currentIndex].commentNum += count;
    this.setState({
      commentNum: this.state.commentNum + 1,
      famousList,
    });
  }


  async likeClick(famousIndex, currentIndex, businessId, liveId){
    let famousList =  this.state.famousList;
    let type = 'news';
    let status = false;
    status = !famousList[famousIndex].likeList[currentIndex].likes;
    if(status){
      let likeResult = await this.props.addLikeIt({
        topicId: businessId,
        speakId: businessId,
        type,
      });
      if(likeResult.state.code === 0){
        famousList[famousIndex].likeList[currentIndex].likesNum = likeResult.data.likesNum;
        famousList[famousIndex].likeList[currentIndex].likes = status;
        this.setState({
          famousList,
        });
      }
    }
    window.toast('已支持，好内容发给好友一起听');
  }

  commentClick(famousIndex, currentIndex, businessId, liveId, commentNum){
    this.setState({
      famousIndex,
      currentIndex,
      businessId,
      liveId,
      commentNum,
      showComment: true,
    });
  }
  onHideComment(){
    this.setState({
      showComment: false,
    });
  }

  dangerHtml(content){
    if (content) {
        content = content.replace(/\</g, (m) => "&lt;");
        content = content.replace(/\>/g, (m) => "&gt;");
        content = content.replace(/(&lt;br(\/)?&gt;)/g, (m) => "\n");
    }

    return { __html: content }
  };


  scrollingFunc(){
    this.setState({
      scrolling: 'Y',
    });
    clearTimeout(this.timer)
    this.timer=setTimeout(()=>{
      this.setState({
        scrolling: 'S',
      });
    }, 300)
  }

  render() {
    const { noneData, isNoMore, isShowPrompt, isShowShare, lists, famousList, isShare, isShareYin, desc, title, name } = this.state;
    return (
      <Page title={ name || '千聊知识新闻'} className={`news-lists-box ${!!lists.length && isShare ?'home-pos-share':''}`}>
        <ScrollToLoad 
          className="news-box"
          ref={ r => this.scroll = r }
          toBottomHeight={500}
          noneOne={noneData}
          loadNext={ this.loadMore }
          scrollToDo={this.scrollingFunc.bind(this)}
          noMore={ isNoMore }>
          
          {
            famousList && famousList.map((item, index)=>{
              return <FamousList key={ index } likeList = {item.likeList} likeClick={this.likeClick} famousIndex ={index} isOne={ index === 0 } commentClick = {this.commentClick} goTopic={ this.goTopic } {...item}   />;
            })
          }
            
          {!!lists.length && <div className="more-recommend"><span>更多推荐</span></div>}
          <div className="news-items">
            { !!lists.length && lists.map((item,index) => (
              <NewsItem key={ index } isOne={ index === 0 } goTopic={ this.goTopic } {...item} />
            ))}
          </div>
        </ScrollToLoad>
        { isShowPrompt && <ShowPrompt/> }
        { !!lists.length && isShare && <ShareUserApp show="news" userInfo={ this.props.userInfo && this.props.userInfo.user  } />}
        { isShareYin && (
          <div className="share-yin" onClick={ this.showShareYin }>
            <div>点击右上角，把好内容发送给好友</div>
          </div>
        )}

        <HomeFloatButton scrolling = { this.state.scrolling }/>

        <CommentBox show= {this.state.showComment} 
          onHideComment = {this.onHideComment} 
          // setStatNum = {this.setStatNum.bind(this)}
          businessId= {this.state.businessId}
          liveId = {this.state.liveId}
          userInfo= {this.props.userInfo}
          commentNum = {this.state.commentNum || 0}
          dangerHtml= {this.dangerHtml}
          updateCommentNum = {this.updateCommentNum}
          />
      </Page>
    );
  }
}

function mapStateToProps (state) {
  return {
    userInfo: state.common.userInfo || {},
  }
}

const mapActionToProps = {
  getUserInfo,
  bindOfficialKey,
  getLike,
  addLikeIt,
};

module.exports = connect(mapStateToProps, mapActionToProps)(NewsLists);
