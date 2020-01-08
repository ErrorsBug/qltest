import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

import PurchaseCourseItem from './purchase-course-item';
import PlanCourseItem from './plan-course-item';
import { timeAfterFix } from 'components/util';

const CourseList = ({ list, style }) => {
    if (style == 1) {
        return <CourseListByMonth list={ list && list.list } />
    } else {
        // 预告里不显示隐藏的课程
        return <CourseListByWeek list={ list } />
    }
};

const CourseListByMonth = ({ list }) => {
    const result = {};
    
    list.forEach(item => {
        let timeObj = new Date(Number(item.time));
        let timeStr = dayjs(timeObj).format('YYYY年MM月');
        let newItem = { ...item, timeStr };
        if (result[timeStr]) {
            result[timeStr].push(newItem);
        } else {
            result[timeStr] = [newItem];
        }
    });

    const listElements = [];
    for (let key in result) {
        if (result.hasOwnProperty(key)) {
            let item = result[key];

            listElements.push(<div key={`course-item-time-${key}`} className={ 'item-time-str' }>{ key }</div>)
            
            listElements.push(
                <div key={`course-item-wrap-${key}`} className='course-item-wrap'>
                    {
                        item.map(i => (
                            <PurchaseCourseItem key={`course-item-${i.bussinessId}`} {...i} />
                        ))
                    }
                </div>
            );
        }
    }

    return (
        <div className='course-list'>
            { listElements }
        </div>
    );
}

const CourseListByWeek = ({ list }) => {
    const result = list.map(item => {
        let timeObj = new Date(Number(item.startTime));
        let timeStr = dayjs(timeObj).format('MM月DD日 HH:mm');

        // let week = '';
        // switch (timeObj.getDay()) {
        //     case 1: week = '周一';break;
        //     case 2: week = '周二';break;
        //     case 3: week = '周三';break;
        //     case 4: week = '周四';break;
        //     case 5: week = '周五';break;
        //     case 6: week = '周六';break;
        //     case 0: week = '周日';break;
        // }

        let fromNow = timeAfterFix(item.startTime);
        return { ...item, timeStr, fromNow };
    });

    return (
        <div className='course-list'>
            {
                result.map((item) => {
                    if (item.displayStatus === 'N') return false;
                    return <div key={`course-plan-item-${item.id}`}>
                        <div className={ 'item-time-str' }>
                            
                            <span className='week-badge'>{ item.fromNow }</span>
                            <span className='time-str'>{ item.timeStr }</span>
                        </div>
                        <div className='course-item-wrap'>
                            <PlanCourseItem {...item} />
                        </div>
                    </div>
                })
            }
        </div>
    );
}

export default CourseList;
