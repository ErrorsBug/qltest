import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { autobind, throttle } from 'core-decorators';
import { formatDate } from 'components/util';

import { fetchMyCheckInCalendar } from '../../actions/mine';

@autobind
class MyCheckinCalendar extends Component {

        state = {
            // 头部日期时间戳
            headDate: null,
            // 打卡的详细日历
            calendar: [],
        }
        
        data = {
            // 用于显示横向滚动条的div
            dateBox: null,
            // 用于显示横向滚动条的div的宽度
            dateBoxWidth: 0,
            // 包含所有日期元素的div
            dateWrapper: null,
            // 包含所有日期元素的div的宽度
            dateWrapperWidth: 0,
            // 每个日期数字所占的宽度
            dateItemWidth: 0,
            // 今日零点零分零秒的时间戳
            todayTime: null,
            // 将日期滚动到今日需要滚动的距离
            scrollDistance: 0,
            // 日期滚动到今日
            scrollToTodayFlag: false,
        }

    /**
     * 滚动日期，头部的年和月关联变化
     */
    @throttle(100)
    handleScroll(){
        const scrollLeft = this.data.dateBox.scrollLeft;
        // 左侧不可见的日期个数
        const itemsCountScrolled = Math.ceil(scrollLeft / this.data.dateItemWidth);
        // 选取可视区域的第五个日期
        const targetItem = this.props.calendar[itemsCountScrolled + 4];
        if (targetItem) {
            this.setState({
                headDate: targetItem.date
            });
        }
    }

    

    /**
     * 将日期滚动到今日
     */
    scrollToToday(){
        const scrollDistance = this.data.scrollDistance;
        const scrollLeft = this.data.dateBox.scrollLeft;
        if (scrollLeft < scrollDistance && (scrollLeft + this.data.dateBoxWidth < this.data.dateWrapperWidth)) {
            const speed = Math.ceil((scrollDistance - scrollLeft) * 0.3);
            this.data.dateBox && (this.data.dateBox.scrollLeft = (scrollLeft + speed));
            requestAnimationFrame(this.scrollToToday);
        }
    }

    // async componentDidMount(){
        //     await this.updateCalendar()
        // }

    componentDidUpdate() {
        const { startTime, endTime, calendar} = this.props
        if (startTime && endTime && calendar) {
            if (!this.data.dateBox) {
                this.data.dateBox = document.querySelector('.my-checkin-calendar-container .date-week');
            }
            this.data.dateWrapper = document.querySelector('.my-checkin-calendar-container .date-week-wrapper');
            this.data.dateBoxWidth = this.data.dateBox.offsetWidth;
            this.data.dateWrapperWidth = this.data.dateWrapper.offsetWidth;
            this.data.dateItemWidth = this.data.dateWrapper.offsetWidth / calendar.length;
            // 如果打卡正在进行中，则将日期滚动到今日
            const todayTime = new Date(formatDate(this.props.sysTime, 'yyyy/MM/dd')).getTime();
            if (todayTime <= endTime && !this.data.scrollToTodayFlag) {
                const todayIndex = this.props.calendar.map((item) => item.date).indexOf(todayTime);
                this.data.scrollDistance = Math.floor((todayIndex - 3) * this.data.dateItemWidth);
                this.data.scrollToTodayFlag = true;
                setTimeout(()=>{this.scrollToToday()}, 1000);
            }
        }
    }

    render(){
        let {
            className,
            sysTime,
            calendar,
            startTime,
        } = this.props;
        // console.log(calendar)
        // if (!calendar) {
        //     return null;
        // }
        calendar = calendar || [];
        const {headDate} = this.state;
        const day = (new Date(sysTime)).getDay();
        const date = (new Date(sysTime)).getDate();
        const yearMonth = formatDate(headDate || startTime, 'yyyy年MM月');
        const weekText = ['日', '一', '二', '三', '四', '五', '六'];
        return (
            <div className={classnames("my-checkin-calendar-container", className)}>
                <div className="year-month">{yearMonth}</div>
                <div className="date-week-container">
                    <div className="date-week" onScroll={this.handleScroll}>
                        <div className="date-week-wrapper" style={{width: `${calendar.length / 7 * 100}%`}}>
                        {
                            calendar.map((item, index) => 
                                <div key={`date-week-item-${index}`} className={classnames("date-week-item", {"date-item-checkined": item.isAffair === 'Y'})}>
                                    {
                                        formatDate(sysTime, 'yyyy/MM/dd') === formatDate(item.date, 'yyyy/MM/dd') ?
                                            <span className="week-text today-week-text">今</span>
                                        :
                                            <span className="week-text">{weekText[new Date(item.date).getDay()]}</span>
                                    }
                                    <span className="date-number">{new Date(item.date).getDate()}</span>
                                    {
                                        item.isAffair === 'Y' ?
                                            <em className="modifier checkined-sign"></em>
                                        :
                                            index === 0 ?
                                                <em className="modifier">开始</em>
                                            :
                                                index === calendar.length - 1 ?
                                                    <em className="modifier">结束</em>
                                                : null
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    sysTime: state.common.sysTime,
});

const mapActionToProps = {
    fetchMyCheckInCalendar,
}

export default connect(mapStateToProps, mapActionToProps)(MyCheckinCalendar);




