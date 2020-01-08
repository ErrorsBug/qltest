import React, { Component } from "react";
import { connect } from "react-redux";
import { autobind } from "core-decorators";
import errorCatch from "components/error-boundary";
import { formateToDay, formatDate  } from "components/util"

@errorCatch()
@autobind
class AllCalendar extends Component {
    state = {
      // 当月的日历数据
      monthDays: [],
      // 当前日期
      currentDate: this.props.currentDate || Date.now(),
    };

    data = {
        // 一年当中每个月的天数(闰年的2月有29天，平年是28天)
        monthDaysCount: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    }

    constructor(props) {
      super(props)
    }
     /**
     * 生成当月的日历数据
     * @param {Number} timestamp unix时间戳 
     */
    generateCurrentMonthCalendarData(timestamp) {
        let [year, month] = formatDate(timestamp, 'yyyy/MM').split('/').map(num => +num);
        let isLeapYear = (year % 400 == 0) || ((year % 4 == 0) && (year % 100 != 0));
        let monthDaysCount = this.data.monthDaysCount[month - 1];
        if (month == 2) {
            if (isLeapYear) {
                monthDaysCount = 29;
            } else {
                monthDaysCount = 28;
            }
        }
        
        let headWeek = (new Date(`${year}/${month}/01`)).getDay();
        headWeek = headWeek == 0 ? 7 : headWeek;
        let tailWeek = (new Date(`${year}/${month}/${monthDaysCount}`)).getDay();
        tailWeek = tailWeek == 0 ? 7 : tailWeek;
        let monthDays = [], today = formatDate(this.state.currentDate, 'yyyy/M/d');
        for (let i = 1; i <= monthDaysCount; i++) {
            let fullDay = new Date(`${year}/${month}/${i}`).getTime()
            let isToday  = false
            if (`${year}/${month}/${i}` == today) {
                isToday = true
            } 
            monthDays.push({
                date: String(i).padStart(2, '0'),
                thisMonth: true,
                fullDay,
                isToday,
                hasCourse: this.props.hasCourse.includes(formatDate(fullDay)),
                hasAffair: this.props.hasAffair.includes(formatDate(fullDay)),
                hasSupplement: this.props.hasSupplement.includes(formatDate(fullDay)),
            });
        }
        let prevMonthArr = []
        let nextMonthArr = []
        // 查找上个月
        if (headWeek - 1 > 0) {
            let hasDay = headWeek - 1
            let prevMonth = month - 2 < 0 ? 11 :  month - 2 // 上个月日数
            let monthDaysCount = this.data.monthDaysCount[prevMonth]

            let prevMonthNum = month - 1// 上个月是哪一个月
            let prevYearNum = year
            // 判断是否越过了年
            if (prevMonthNum == 0) {
                prevMonthNum = 12
                prevYearNum = year - 1
            }

            if (prevMonth == 1) {
                if (isLeapYear) {
                    monthDaysCount = 29;
                } else {
                    monthDaysCount = 28;
                }
            }

            for (; hasDay; hasDay--) {
                let date = monthDaysCount--
                let fullDay = new Date(`${prevYearNum}/${prevMonthNum}/${date}`).getTime()
                prevMonthArr.unshift({
                    date,
                    thisMonth: false,
                    fullDay,
                    hasCourse: this.props.hasCourse.includes(formatDate(fullDay)),
                    hasAffair: this.props.hasAffair.includes(formatDate(fullDay)),
                    hasSupplement: this.props.hasSupplement.includes(formatDate(fullDay)),
                })
            }
            
        }
        // 查找下个月
        if (7 - tailWeek > 0) {
            let hasDay = 7 - tailWeek
            let start = 1

            let prevMonthNum = month + 1// 上个月是哪一个月
            let prevYearNum = year
            // 判断是否越过了年
            if (prevMonthNum == 13) {
                prevMonthNum = 1
                prevYearNum = year + 1
            }
            for (; hasDay; hasDay--) {
                let startDate = start++
                let fullDay = new Date(`${prevYearNum}/${prevMonthNum}/${startDate}`).getTime()
                nextMonthArr.push({
                    date: startDate,
                    thisMonth: false,
                    fullDay,
                    hasCourse: this.props.hasCourse.includes(formatDate(fullDay)),
                    hasAffair: this.props.hasAffair.includes(formatDate(fullDay)),
                    hasSupplement: this.props.hasSupplement.includes(formatDate(fullDay)),
                })
            }
        }
        monthDays = [...prevMonthArr, ...monthDays, ...nextMonthArr]
        // monthDays = (Array.apply(null, Array(headWeek - 1))).concat(monthDays).concat(Array.apply(null, Array(7 - tailWeek)));
        monthDays = [monthDays.slice(0, 7), monthDays.slice(7, 14), monthDays.slice(14, 21), monthDays.slice(21, 28), monthDays.slice(28, 35), monthDays.slice(35, 42)];
        this.setState({ monthDays });
    }

    /**
     * 日历往前翻一个月
     */
    backOneMonth() {
        let [year, month, day] = formatDate(this.state.currentDate, 'yyyy/MM/dd').split('/').map(num => +num);
        if (month > 1) {
            month = month - 1;
        } else {
            month = 12;
            year = year - 1;
        }
        let newDateTime = (new Date(`${year}/${month}/${day}`)).getTime();
        this.setState({
            currentDate: newDateTime
        });
        this.generateCurrentMonthCalendarData(newDateTime);
    }

    /**
     * 日历往后翻一个月
     */
    forwardOneMonth() {
        let [year, month, day] = formatDate(this.state.currentDate, 'yyyy/MM/dd').split('/').map(num => +num);
        if (month < 12) {
            month = month + 1;
        } else {
            month = 1;
            year = year + 1;
        }
        let newDateTime = (new Date(`${year}/${month}/${day}`)).getTime();
        this.setState({
            currentDate: newDateTime
        });
        this.generateCurrentMonthCalendarData(newDateTime);
    }
    componentDidMount() {
        this.setState({
            currentDate: this.props.currentDate
        },() => {
            this.generateCurrentMonthCalendarData(this.state.currentDate);
        })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.currentDate !== nextProps.currentDate) {
            this.setState({
                currentDate: nextProps.currentDate
            },() => {
                this.generateCurrentMonthCalendarData(this.state.currentDate);
            })
        }
    }

    render() {
        let { monthDays, currentDate } = this.state;
        let { needSignIn, canSupplement } = this.props
        return (
            <div className="calendar-wrap">
                
                <div className="calendar">
                    <div className="font-28 flex flex-row flex-hcenter weeks">
                        <span>周一</span>
                        <span>周二</span>
                        <span>周三</span>
                        <span>周四</span>
                        <span>周五</span>
                        <span>周六</span>
                        <span>周日</span>
                    </div>
                    <div className="month-switcher flex flex-row flex-vcenter jc-between">
                        <span className="icon_enter back" role="button" onClick={this.backOneMonth}></span>
                        <span className="font-28">{formatDate(currentDate, 'yyyy年MM月')}</span>
                        <span className="icon_enter forward" role="button" onClick={this.forwardOneMonth}></span>
                    </div>
                    <div className="dates font-28 expand">
                    {
                        monthDays.map((weekDays, index) => {
                            return (
                                <div className="flex flex-row jc-between" key={index}>
                                {
                                    weekDays.map((day, index) => {
                                        return (
                                            <div key={index} onClick={() => this.props.selectDate(day)}>
                                            <div className={`normal ${!day.thisMonth ? 'placeholder':''}`}>
                                                    <span className={day.isToday ? 'today' : ''}>{day.date}</span>
                                                    <div className="flex flex-vcenter flex-hcenter">
                                                        {
                                                            day.hasCourse && <i className="circle orange-circle"></i>
                                                        }
                                                        {
                                                            day.hasAffair && <i className="circle green-circle"></i>
                                                        }
                                                        {
                                                            day.hasSupplement && <i className="circle bule-circle"></i>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                </div>
                            )
                        })
                    }
                    </div>
                    <div className="tips font-24">
                        <div className="flex flex-row flex-vcenter jc-between">
                            <div className="flex flex-row flex-vcenter">
                                <i className="circle orange-circle"></i>
                                <span>当天有课</span>
                            </div>
                            {
                                needSignIn == 'Y' &&
                                <div className="flex flex-row flex-vcenter">
                                    <i className="circle green-circle"></i>
                                    <span>已打卡</span>
                                </div>
                            }
                            {
                                canSupplement == 'Y' && 
                                <div className="flex flex-row flex-vcenter">
                                    <i className="circle bule-circle"></i>
                                    <span>已补卡</span>
                                </div>
                            }
                            
                        </div>
                    </div>
                    { this.props.children }
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
)(AllCalendar);
