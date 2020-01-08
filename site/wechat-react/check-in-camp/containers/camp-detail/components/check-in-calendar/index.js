import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getVal } from 'components/util';
import { autobind } from 'core-decorators';

@autobind
export class CheckInCalendar extends Component {
    static propTypes = {

    }

    constructor(props) {
        super(props)
        
        this.state = {

        }
    }

    render() {
        const {
            currentDays,
            totalDays,
            startDate,
            endDate,
            isBegin,
        } = this.props.dateInfo;

        if (isBegin === 'Y') {
            return null
        }

        let currentDaysText = 0;
        if (currentDays) {
            currentDaysText = currentDays < 0 ? - currentDays : currentDays;
        }
        return (
            <div className="check-in-calendar">
                <div className="title">距离打卡时间还有</div>
                <div className={`calendar common-bg-img ${currentDaysText > 99 ? 'calendar-big' : ''}`}>
                    <span className="days">{currentDaysText > 99 ? 99 : currentDaysText}</span>
                    <span className="text">{currentDaysText > 99 ? '天以上' : '天'}</span>
                    <div className="bg-alpha"></div>
                </div>
                <div className="date">{`${startDate} 至 ${endDate}`}</div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    dateInfo: getVal(state, 'campBasicInfo.dateInfo'),
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckInCalendar)
