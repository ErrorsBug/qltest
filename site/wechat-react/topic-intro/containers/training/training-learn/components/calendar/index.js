import React, { Component } from "react";
import { connect } from "react-redux";
import { autobind } from "core-decorators";
import errorCatch from "components/error-boundary";
import { formateToDay, formatDate } from "components/util"
import AllCalendar from './calendar';

@errorCatch()
@autobind
class Calendar extends Component {
    state = {
      toggle: true,
      daysOfThisWeek: [],
      selectDay: formatDate(this.props.sysTime),
      selectDayTime: this.props.sysTime, // 当前时间戳
    };

    constructor(props) {
      super(props)
    }
    async componentDidMount() {
      this.oneWeek()
    }

    oneWeek(dateOfToday = this.props.sysTime) {
      console.log(222333, this.props.hasCourse)
      const dayOfToday = (new Date(dateOfToday).getDay() + 7 - 1) % 7
      const daysOfThisWeek = Array.from(new Array(7))
        .map((_, i) => {
          const date = new Date(dateOfToday + (i - dayOfToday) * 1000 * 60 * 60 * 24)
          let getTime = date.getTime()
          let today = formatDate(getTime)
          return {
            date: `${String(date.getDate()).padStart(2, '0')}`,
            today,
            toDayName: formateToDay(getTime, new Date(dateOfToday).getTime(), true),
            getTime,
            hasCourse: this.props.hasCourse.includes(today),
            hasAffair: this.props.hasAffair.includes(today),
            hasSupplement: this.props.hasSupplement.includes(today),
          }
        })
      this.setState({
        daysOfThisWeek
      })
    }

    toggleArrow() {
      this.setState({
        toggle: !this.state.toggle
      }, () => {
        this.props.calendarToggle()
      })
    }

    /**
     * 选择当前时间
     * @param {*} data 
     */
    handleSelectDay(data) {
      this.setState({
        selectDay: data.today,
        selectDayTime: data.getTime
      })
      // 通过时间去筛选当前任务
      this.props.fetchTopicMap(data.today)
    }

    // 用于完整日历的点击关闭
    handleToggleCalendar() {
      if(!this.state.toggle) {
        this.toggleArrow()
      }
    }
    // 完整日历选择时间
    handleSelectDate(day) {
      this.oneWeek(day.fullDay)
      this.handleSelectDay({
        today: formatDate(day.fullDay),
        getTime: day.fullDay
      })
      this.handleToggleCalendar()
    }

    render() {
      let { toggle, daysOfThisWeek, selectDay, selectDayTime} = this.state
      let userAffairInfo = this.props.userAffairInfo
      let userReword = this.props.userReword
      let { needSignIn, canSupplement } = this.props.periodPo
        return (
          <div className={toggle ? 'calendar-box' : 'absolute-calendar-box'}>
            {
              <React.Fragment>
                <div className={`week-calendar ${toggle ? 'show': 'hide'}`}>
                  {
                      daysOfThisWeek.map((item, index) => {
                        return (
                          <div className="calendar-item" key={`weel-${index}`} onClick={() => this.handleSelectDay(item)}>
                            <div className="date-name">{item.toDayName}</div>
                            <div className="date">
                              <span className={item.today == selectDay ? 'today': ''}>
                                {item.date}
                              </span>
                              </div>
                            <div className="flex flex-vcenter flex-hcenter">
                                {
                                  item.hasCourse && <i className="circle orange-circle"></i>
                                }
                                {
                                  item.hasAffair && <i className="circle green-circle"></i>
                                }
                                {
                                  item.hasSupplement && <i className="circle bule-circle"></i>
                                }
                            </div>
                          </div>
                        )
                      })
                    }
                </div>
                <div className={`all-calendar ${!toggle ? 'show': 'hide'}`}>
                  <AllCalendar 
                    selectDate={this.handleSelectDate}
                    currentDate={selectDayTime}
                    hasCourse={this.props.hasCourse}
                    hasAffair={this.props.hasAffair}
                    hasSupplement={this.props.hasSupplement}
                    needSignIn={needSignIn}
                    canSupplement={canSupplement}
                  >
                  {
                    needSignIn == 'Y' && 
                    <div className="calendar-reword">
                      <div className="reword-times">
                        <div className="reword-left">
                          打卡<span className="big-day">{userAffairInfo.affairNum}</span>天
                        </div>
                        <div className="reword-right">
                        {
                          userReword.length == 0 &&
                            <div className="reword-day">
                              <div className="reword-num">{userAffairInfo.totalAffairNum}</div>
                              <div className="reword-word">需打卡</div>
                            </div>
                        }
                        {
                          canSupplement == 'Y' && (
                            <React.Fragment>
                              <div className="reword-day">
                                <div className="reword-num">{userAffairInfo.supplementNum}</div>
                                <div className="reword-word">已补卡</div>
                              </div>
                              <div className="reword-day">
                                <div className="reword-num">{userAffairInfo.leftSupplementNum}</div>
                                <div className="reword-word">补卡机会</div>
                              </div>
                            </React.Fragment>
                          )
                        }
                        </div>
                      </div>
                      {
                        userReword.length > 0 &&
                          <React.Fragment>
                            <div className="reword-wrap">
                              {
                                userReword.map((item, index) => {
                                  return (
                                    <div className={`reword-item ${userAffairInfo.affairNum >= item.affairNum? 'active' : ''}`} key={`reword${index}`} 
                                      onClick={() => this.props.fetchRewordDetail(item)}>
                                      <div className="day">
                                        <span>
                                          {item.affairNum}
                                          <span className="grey">天</span>
                                        </span>
                                        {userAffairInfo.affairNum >= item.affairNum && <div className="dui"></div>}  
                                      </div>
                                      <div className="gift"></div>
                                    </div>
                                  )
                                })
                              }
                              </div>
                            <div className="reword-tip">
                              点击礼物可查看打卡奖励
                            </div>
                        </React.Fragment>
                      }
                  </div>
                  }
                  
                  </AllCalendar>
                </div>
              </React.Fragment>
            }
            <div className="arrow" onClick={this.toggleArrow}>
              <div className={toggle ? 'bottom': 'top'}>
                <i className="icon_enter" />
              </div>
            </div>
          </div>
        )
    }
}

function mapStateToProps(state) {
    return {};
}

const mapActionToProps = {};

module.exports = connect(
    mapStateToProps,
    mapActionToProps
)(Calendar);
