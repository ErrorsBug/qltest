import React, { Component } from 'react'
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';

import TabLabel from './components/tab';
import ScrollToLoad from 'components/scrollToLoad';
import BooksItem from 'components/books-item';
import { formatDate, locationTo } from 'components/util';
import { getBuyLists } from '../../actions/buy'

const firstTag = [
  { 
    sign: '1',
    labelName: '系列课',
    type: 'channel'
  },
  { 
    sign: '2',
    labelName: '话题',
    type: 'topic'
  },
  { 
    sign: '3',
    labelName: '听书',
    type: 'book'
  },
  { 
    sign: '4',
    labelName: '会员',
    type:"live"
  },
  { 
    sign: '5',
    labelName: '打卡',
    type:"checkin"
  },
  { 
    sign: '6',
    labelName: '赠礼',
    type:"gift"
  },
  { 
    sign: '7',
    labelName: '文件',
    type:"doc"
  },
]

@autobind
class BuyHistory extends Component {
  state = {
    nowFirstTagId: "3", // 当前选中标签id
    type: this.props.location.query.type || 'book'
  }
  data = {
    page: 1,
    size: 20,
    flag: false
  }
  componentDidMount(){
    this.loadMoreCourse();
  }
  async loadMoreCourse(){
    const { noneData, isNoMoreCourse } = this.props;
    if(this.data.flag || noneData || isNoMoreCourse) return false;
    this.data.flag = true;
    const { type } = this.state;
    const params = Object.assign(this.data,{ purchaseType:type });
    await this.props.getBuyLists(params);
    this.data.page += 1;
    this.data.flag = false;
  }
  switchFirstTag(tagId) {
    if (tagId == this.state.nowFirstTagId) return false;
    const type = firstTag.filter((item) => item.sign === tagId)[0].type;
    this.setState({
      type: type
    })
    locationTo(`/live/entity/myPurchaseRecord.htm?type=${ type }`)
    // this.setState({
    //   isNoMoreCourse: false,
    //   nowFirstTagId:tagId,
    //   noneData: false,
    // }, () => {

    // });
  }
  goTopic(id){
    console.log(`/wechat/page/topic-intro?topicId=${id}`)
    locationTo(`/wechat/page/topic-intro?topicId=${id}`)
  }
  render() {
    const { noneData, isNoMoreCourse, buyLists } = this.props;
    const { nowFirstTagId } =  this.state;
    return (
      <Page title="我的购买记录" className="buy-history-box">
        <div className="buy-menu">
          {/* <article className="two-level-label free-low-contain">
            <TabLabel 
              listInfo = {firstTag}
              liClassName = "free-low-f-menu-li"
              sectionClassName = "free-low-f-menu-section"
              ulClassName = "free-low-f-menu-ul"
              labelClickFunc = {this.switchFirstTag}
              activeLabelSign = {nowFirstTagId}
              region={'menu'}/>
          </article> */}
          <ul>
            { firstTag.map((item, index) => (
              <li onClick={ () =>  this.switchFirstTag(item.sign) } className={ nowFirstTagId === item.sign ? 'select' : '' }>
                { item.labelName }
              </li>
            )) }
          </ul>
        </div>
        <ScrollToLoad
          className="buy-scroll"
          toBottomHeight={500}
          noneOne={noneData}
          loadNext={ this.loadMoreCourse }
          noMore={ isNoMoreCourse }>
          { buyLists.map((item, index) => (
            <div key={index} className="buy-books-item" onClick={ () => this.goTopic(item.businessId) }>
              <BooksItem 
                name={item.name} 
                description={item.description}
                iconUrl={ item.iconUrl }
                learningNum={item.learningNum }
                duration={ item.duration }
                id={ item.businessId }
                key={ index } />
              <div className="buy-books-info">
                <h3>实付款：<span>￥{ (Number(item.amount)/100).toFixed(2) }</span>{ !!item.benifit && `（已优惠抵扣￥${(Number(item.benifit)/100).toFixed(2)}）` }</h3>
                <p>购买时间：{ formatDate(item.payTime,'yyyy-MM-dd hh:mm:ss') }</p>
              </div>
            </div>
          )) }
        </ScrollToLoad>
      </Page>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    buyLists: state.buy.buyLists || [],
    noneData: state.buy.noneData || false,
    isNoMoreCourse: state.buy.isNoMoreCourse || false,
  }
};

const mapActionToProps = {
  getBuyLists
};

module.exports = connect(mapStateToProps, mapActionToProps)(BuyHistory);