import React, { Component } from "react"
import { autobind } from 'core-decorators'
import classnames from 'classnames'
import Swiper from 'react-swipe';
import { locationTo } from 'components/util';
import { fillParams } from 'components/url-utils';

@autobind
export default class HeadBanner extends Component{
  swiper = null;
  state = {
    activeBannerIndex: 0,
  }
  onSwiped(index){
    this.setState({
      activeBannerIndex: index
  });

  // 手动触发打曝光日志
  setTimeout(() => {
      typeof _qla != 'undefined' && _qla.collectVisible();
  }, 0);
  }
  handleBannerClick(b, index){
    let url = fillParams({
      name: 'free-banner',
      pos: index,
    }, b.url);
    console.log(url)
    locationTo(url);
  }
  onItemClick(index){
    if ( this.swiper && this.swiper.swipe) {
      this.swiper.swipe.slide(index, 50);
  }
  }
  render(){
    const { banners } = this.props;
    const { activeBannerIndex } = this.state;
    return (
      <div className="free-recommend-box">
        <Swiper
          ref={ r => this.swiper = r }
          className='free-recommend-swiper'
          swipeOptions={{ auto: 5000, callback: this.onSwiped }} >
          {
            banners.map((item, index) =>{
              return (
                <div
                    key={`recommend-swiper-item${index}`}
                    data-url={`${item.url}`}
                    onClick={e => {
                        this.handleBannerClick(item, index);
                    }}
                    className='recommend-swiper-item on-log on-visible'
                    data-log-region="free-banner"
                    data-log-pos={index}
                    data-log-business_id={item.mainId}
                    data-log-name={item.topic}
                    data-log-business_type={item.type}>
                    <span style={{ backgroundImage: `url(${item.backgroundUrl}@200h_668w_1e_1c_2o)` }}></span>
                </div>
              )
            })
          }
        </Swiper>
        <div className="swiper-indicator">
          { Array.from({ length: banners.length }).map((_,index) => (
            <span onClick={() => this.onItemClick(index)} key={`swiper-indicate-item-${index}`} className={ classnames('swiper-indicate-item', {'active': activeBannerIndex === index})}></span>
          )) }
        </div>
      </div>
    )
  }
}