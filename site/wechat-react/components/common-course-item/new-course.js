import React, { Fragment } from 'react';
import classNames from 'classnames';
import { autobind } from 'core-decorators'
import { formatMoney, digitFormat, getCookie } from 'components/util';
import Detect from "components/detect";
import Picture from 'ql-react-picture';
import FlagUI from '../flag-ui';
import ScoreStar from 'components/score-star';

/**
 * 新的course-item
 */
@autobind
export default class NewCourseItem extends React.Component {
  get isEven() { // true: B类型 false: A类型
    // if (typeof document != 'undefined') {
    //   const userId = getCookie("userId");
    //   const lastNum = userId.split("")[userId.length - 1];
    //   let flag = lastNum % 2 == 0;
    //   return flag;
    // }
    return true;
  }

  get isWeapp() {
    return typeof window != 'undefined' && window.__wxjs_environment === 'miniprogram'
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (
      (nextProps.playStatus && nextProps.playStatus != this.props.playStatus) ||
      (nextProps.selctId != this.props.selctId) ||
      (nextProps.bsId && nextProps.bsId != this.props.bsId)
    ) {
      return true;
    } else {
      return false;
    }
  }
  componentWillReceiveProps(nextProps) {
    // if((Object.is(nextProps.playStatus, 'playing') && nextProps.bsId ==this.props.bsId)){
    //   this.setState({
    //     loading: true
    //   })
    // }
  }

  onClick = e => {
    if (this.props.onClick) {
      e.preventDefault();
      this.props.onClick(e);
    }
  }
  // 播放
  onPlaying(e) {
    e.preventDefault();
    e.stopPropagation();
    const { data, bsId, idx, playStatus, selctId } = this.props;
    if (data.businessId == bsId && Object.is(playStatus, 'playing')) {
      this.props.auditionPause();
    } else {
      this.props.playing && this.props.playing(data.businessType, data.businessId, idx);
    }
  }
  
  get flagStr () {
    const flag = this.props.data.flag

    switch (flag) {
      case 'normal':
          return ''
      case 'boutique':
          return '精品'
      case 'recommend':
          return '热推'
      case 'surge':
          return '飙升'
      case 'star':
          return '大咖'
      default:
          return flag
    }
  }

  render() {
    let { 
      data,
      onClick, 
      href = '', 
      className, 
      isFlag = false, 
      isTag = false, 
      playing, 
      auditionPause, 
      showHotComment = false, 
      bsId, 
      selctId, 
      type, 
      playStatus, 
      ...otherProps 
    } = this.props;

    let isDashi = data.regionType === 'master';
    let isCamp = data.regionType === 'camp';
    let isRank = data.regionType === 'rank';

    className = classNames('common-course-item', className, {
      'type-dashi': isDashi,
      "type-com": isDashi,
      "type-rank": data.regionType === 'rank',
      "type-comment": this.props.showHotComment
    });
    let avatarUrl = data.logo || data.headImage;
    let w, h;
    if (data.regionType === 'rank') {
      w = 288;
      h = 180;
    } else if (isDashi) {
      w = 160;
      h = 205;
    } else {
      w = 240;
      h = 148;
    }

    if (data.regionType === 'rank' && this.props.idx === 0) {
      return (
        <a
          className='common-course-item rank-first on-log'
          href={href}
          onClick={this.onClick}
          {...otherProps}
        >
          <div className="head">
            <div className="img-wrap">
              <div className="c-abs-pic-wrap">
                <Picture src={avatarUrl} placeholder={true} resize={{ w: 400, h: 250 }} />
              </div>
            </div>
            <div className="rank">
              <div className={`play-btn on-log
                ${ Object.is(playStatus, 'loading') && this.props.idx === this.props.selctId ? 'loading' : ''} 
                ${ (data.businessId == bsId && Object.is(playStatus, 'playing')) ? 'played' : ''}`}
                onClick={this.onPlaying}
                data-log-region={`audition-btn-${this.isEven ? 'b' : 'a'}`}
                data-log-pos={this.props.idx}
              >
                <p></p>
                <div>
                  <span className="line1"></span>
                  <span className="line2"></span>
                  <span className="line3"></span>
                </div>
                {Object.is(playStatus, 'loading') && this.props.idx === this.props.selctId && <i></i>}
                {
                  (!Object.is(playStatus, 'loading') && this.props.idx === this.props.selctId) ?
                    !!bsId && data.businessId == bsId && Object.is(playStatus, 'playing') ?
                      <span className="pause">暂停</span> :
                      (!data.money ? '播放' : '试听')
                    :
                    (Object.is(playStatus, 'loading') && this.props.idx === this.props.selctId) ? '' : (!data.money ? '播放' : '试听')

                }
              </div>
            </div>
          </div>
          <div className="info">
            <p className="info-name">
            {
              this.flagStr && !isCamp &&
              <span className="hottest"><span className="text">{this.flagStr}</span></span>
            }
            {data.businessName}
            </p>
            <div className="score">
                <div className="star-box">
                  {
                    data.score && data.score > 0 ? (
                      <React.Fragment>
                        <ScoreStar score={data.score} />
                        <span className="star-str">{data.score}分</span>
                      </React.Fragment>
                    ) : null
                  }
                </div>
              <p>
                {data.learningNum ? `${digitFormat(data.learningNum)}次学习 | ` : '0次学习 | '}
                {
                  data.businessType === 'channel' ? <span>{data.planCount || data.topicNum || 0}课</span> :
                    data.businessType === 'topic' ? <span>单课</span> : false
                }
              </p>
            </div>
            {
              showHotComment && data.remark && (
                <div className="hot-comment">
                  <div className="content">{data.remark}</div>
                </div>
              )
            }
          </div>
        </a>
      )
    } else if (this.props.showHotComment) {
      return (
        <a
          className={className}
          href={href}
          onClick={this.onClick}
          {...otherProps}
        >
          <div className="head">
            <div className="img-wrap">
              <div className={classNames('poster', `flag-${data.flag}`)}>
                <div className="c-abs-pic-wrap">
                  <Picture src={avatarUrl} placeholder={true} resize={{ w: w, h: h }} />
                </div>
              </div>
              {
                do {
                  if(isRank){
                    null
                  }else if(isCamp){
                    <div className="learn-num">{data.flag}</div>
                  }else if(data.imgDesc){
                    <div className="learn-num">
                      {data.imgDesc}
                    </div>
                  }else{
                    <div className="learn-num">
                      {digitFormat(data.learningNum || data.authNum || 0)}次学习
                    </div>
                  }
                }
              }
              {!!data.flag2 && isFlag && <FlagUI flag={data.flag2} />}
            </div>
            <div className="info">
              <div className="c-flex-grow1 c-flex-name">
                <div className="name">
                  {
                    this.flagStr && !isCamp &&
                    <div className="hottest"><div className="text">{this.flagStr}</div></div>
                  }
                  {data.businessName}
                </div>
                {
                  data.regionType !== 'rank' ? isDashi ?
                    (<Fragment>
                      {data.remark && <div className="remark">{data.remark}</div>}
                      {!this.isEven && <div className="live-name">{data.liveName}</div>}
                    </Fragment>)
                    :
                    (<div className="remark">{data.remark || data.liveName}</div>)
                    : (data.score && data.score > 0 ? (
                      <div className="star-box">
                        <ScoreStar score={data.score} />
                        <span className="star-str">{data.score}分</span>
                      </div>
                    ) : null)
                }
                {this.isEven && !isTag && isDashi && <p className="font-learn">
                  <span className="learn-num">
                    {data.learningNum ? `${digitFormat(data.learningNum)}次学习 | ` : '0次学习 | '}
                  </span>
                  {
                    data.businessType === 'channel' ? <span>{data.planCount || data.topicNum || 0}课</span> :
                      data.businessType === 'topic' ? <span>单课</span> : false
                  }
                </p>}
              </div>
              <div className="des-statue">
                <div className="num">
                  {
                    (data.regionType === 'rank' || !this.isEven) && !isTag &&
                    (
                        <p>
                          {(isDashi || data.regionType === 'rank') &&
                          <span className="learn-num">
                            {data.learningNum ? `${digitFormat(data.learningNum)}次学习 | ` : '0次学习 | '}
                          </span>
                          }
                          {
                            data.businessType === 'channel' ? <span>{data.planCount || data.topicNum || 0}课</span> :
                                data.businessType === 'topic' ? <span>单课</span> : false
                          }
                        </p>
                    )
                  }
                  {
                    this.isEven && data.regionType !== 'rank' && <div>
                      {
                        data.money > 0
                            ? (
                                ((!Detect.os.ios && this.isWeapp) || !this.isWeapp) ?
                                    <div className="price">
                                      {
                                        data.discount == -1 ||
                                        (
                                            data.discountStatus === 'K' &&
                                            data.shareCutStartTime > data.currentTime &&
                                            data.shareCutEndTime < data.currentTime
                                        )
                                            ?
                                            <span className="current">￥{formatMoney(data.money)}</span>
                                            :
                                            <span>
                                      <span className="current">¥{formatMoney(data.discount)}</span>
                                              {!isTag && <span className="origin">¥{formatMoney(data.money)}</span>}

                                    </span>
                                      }
                                      {!isDashi && (
                                          data.businessType === 'channel' ? <span> | {data.planCount || data.topicNum || 0}课</span> :
                                              data.businessType === 'topic' ? <span> | 单课</span> : false
                                      )}
                                    </div>
                                    : null
                            )
                            :
                            <div className="price">
                              <div className="free">免费</div>
                            </div>
                      }
                    </div>
                  }

                  <div className={`play-btn on-log
                    ${ Object.is(playStatus, 'loading') && this.props.idx === this.props.selctId ? 'loading' : ''}
                    ${ (data.businessId == bsId && Object.is(playStatus, 'playing')) ? 'played' : ''}`}
                       onClick={this.onPlaying}
                       data-log-region={`audition-btn-${this.isEven ? 'b' : 'a'}`}
                       data-log-pos={this.props.idx}
                  >
                    <p></p>
                    <div>
                      <span className="line1"></span>
                      <span className="line2"></span>
                      <span className="line3"></span>
                    </div>
                    {Object.is(playStatus, 'loading') && this.props.idx === this.props.selctId && <i></i>}
                    {
                      (!Object.is(playStatus, 'loading') && this.props.idx === this.props.selctId) ?
                          !!bsId && data.businessId == bsId && Object.is(playStatus, 'playing') ?
                              <span className="pause">暂停</span> :
                              (!data.money ? '播放' : '试听')
                          :
                          (Object.is(playStatus, 'loading') && this.props.idx === this.props.selctId) ? '' : (!data.money ? '播放' : '试听')

                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          {
            showHotComment && data.remark && (
              <div className="hot-comment">
                <div className="content">{data.remark}</div>
              </div>
            )
          }
        </a>
      )
    }

    return (
      <a
        className={className}
        href={href}
        onClick={this.onClick}
        {...otherProps}
      >
        <div className="img-wrap">
          <div className={classNames('poster', `flag-${data.flag}`)}>
            <div className="c-abs-pic-wrap">
              <Picture src={avatarUrl} placeholder={true} resize={{ w: w, h: h }} />
            </div>
          </div>
          {
            do {
              if(isRank){
                null
              }else if(isCamp){
                <div className="learn-num">{data.flag}</div>
              }else if(data.imgDesc){
                <div className="learn-num">
                  {data.imgDesc}
                </div>
              }else{
                <div className="learn-num">
                  {digitFormat(data.learningNum || data.authNum || 0)}次学习
                </div>
              }
            }
          }
          {!!data.flag2 && isFlag && <FlagUI flag={data.flag2} />}
        </div>
        <div className="info">
          <div className="c-flex-grow1 c-flex-name">
            <div className="name">
              {
                this.flagStr && !isCamp &&
                <div className="hottest"><div className="text">{this.flagStr}</div></div>
              }
              {data.businessName}
            </div>
            {
              data.regionType !== 'rank' ? isDashi ?
                (<Fragment>
                  {data.remark && <div className="remark">{data.remark}</div>}
                  {!this.isEven && <div className="live-name">{data.liveName}</div>}
                </Fragment>)
                :
                (<div className="remark">{data.remark || data.liveName}</div>)
                : (data.score && data.score > 0 ? (
                  <div className="star-box">
                    <ScoreStar score={data.score} />
                    <span className="star-str">{data.score}分</span>
                  </div>
                ) : null)
            }
            {this.isEven && !isTag && isDashi && <p className="font-learn">
              <span className="learn-num">
                {data.learningNum ? `${digitFormat(data.learningNum)}次学习 | ` : '0次学习 | '}
              </span>
              {
                data.businessType === 'channel' ? <span>{data.planCount || data.topicNum || 0}课</span> :
                  data.businessType === 'topic' ? <span>单课</span> : false
              }
            </p>}
          </div>
          {
            do {
              if (isCamp) {
                <div className="joined">
                  <div className="flag-icon"></div>
                  <div className="user-list">
                    {
                      data.userHeadImageList && data.userHeadImageList.map((avatar, i) => {
                        if (i < 3) {
                          return (
                              <div className="avatar" key={i}>
                                <Picture
                                    src={avatar}
                                    resize={{
                                      w: 32,
                                      h: 32,
                                    }}
                                />
                              </div>
                          )
                        }
                      })
                    }
                    {
                      data.userHeadImageList?.length > 3 && <div className="more-user"></div>
                    }
                  </div>
                  <div className="count">{digitFormat(data.learningNum)}人参加</div>
                </div>
              }else{
                <div className="des-statue">
                  <div className="num">
                    {
                      (data.regionType === 'rank' || !this.isEven) && !isTag &&
                      (
                          <p>
                            {(isDashi || data.regionType === 'rank') &&
                            <span className="learn-num">
                        {data.learningNum ? `${digitFormat(data.learningNum)}次学习 | ` : '0次学习 | '}
                      </span>
                            }
                            {
                              data.businessType === 'channel' ? <span>{data.planCount || data.topicNum || 0}课</span> :
                                  data.businessType === 'topic' ? <span>单课</span> : false
                            }
                          </p>
                      )
                    }
                    {
                      this.isEven && data.regionType !== 'rank' && <div>
                        {
                          data.money > 0
                              ? (
                                  ((!Detect.os.ios && this.isWeapp) || !this.isWeapp) ?
                                      <div className="price">
                                        {
                                          data.discount == -1 ||
                                          (
                                              data.discountStatus === 'K' &&
                                              data.shareCutStartTime > data.currentTime &&
                                              data.shareCutEndTime < data.currentTime
                                          )
                                              ?
                                              <span className="current">￥{formatMoney(data.money)}</span>
                                              :
                                              <span>
                                  <span className="current">¥{formatMoney(data.discount)}</span>
                                                {!isTag && <span className="origin">¥{formatMoney(data.money)}</span>}

                                </span>
                                        }
                                        {!isDashi && (
                                            data.businessType === 'channel' ? <span> | {data.planCount || data.topicNum || 0}课</span> :
                                                data.businessType === 'topic' ? <span> | 单课</span> : false
                                        )}
                                      </div>
                                      : null
                              )
                              :
                              <div className="price">
                                <div className="free">免费</div>
                              </div>
                        }
                      </div>
                    }

                    <div className={`play-btn on-log
                ${ Object.is(playStatus, 'loading') && this.props.idx === this.props.selctId ? 'loading' : ''}
                ${ (data.businessId == bsId && Object.is(playStatus, 'playing')) ? 'played' : ''}`}
                         onClick={this.onPlaying}
                         data-log-region={`audition-btn-${this.isEven ? 'b' : 'a'}`}
                         data-log-pos={this.props.idx}
                    >
                      <p></p>
                      <div>
                        <span className="line1"></span>
                        <span className="line2"></span>
                        <span className="line3"></span>
                      </div>
                      {Object.is(playStatus, 'loading') && this.props.idx === this.props.selctId && <i></i>}
                      {
                        (!Object.is(playStatus, 'loading') && this.props.idx === this.props.selctId) ?
                            !!bsId && data.businessId == bsId && Object.is(playStatus, 'playing') ?
                                <span className="pause">暂停</span> :
                                (!data.money ? '播放' : '试听')
                            :
                            (Object.is(playStatus, 'loading') && this.props.idx === this.props.selctId) ? '' : (!data.money ? '播放' : '试听')

                      }
                    </div>
                  </div>
                </div>
              }
            }
          }
        </div>
      </a>
    )
  }


}