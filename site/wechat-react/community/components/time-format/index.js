import React, { Component, Fragment } from 'react'
import { formatDate } from 'components/util'

/**
 * 集成app分享、app分享朋友圈、是否为app
 * @param {*} WrappedComponent
 * @returns
 */
const TimeFormat = (WrappedComponent) => {
    return class extends Component {
        state = {
        }

        //是否今天
        isToday=(time)=> {
            if (new Date(time).toDateString() === new Date().toDateString()) {
                return true
            }
            return false
        }
        //是否昨天
        isYesterday=(time)=> {
            let date = new Date()
            date.setDate(date.getDate() - 1)
            if (new Date(time).toDateString() === new Date(date).toDateString()) {
                return true
            }
            return false
        }
        //是否今年
        isThisYear=(time)=> {
            if (new Date(time).getFullYear() === new Date().getFullYear()) {
                return true
            }
            return false
        }
        formatIdeaTime=(createTime)=> { 
            let str = this.isToday(createTime) ?
                '今天'
                : this.isYesterday(createTime) ?
                    `昨天`
                    : this.isThisYear(createTime) ?
                        formatDate(createTime, 'MM/dd')
                        :
                        formatDate(createTime, 'yyyy/MM/dd')
            return str
        }
        
        calDay=(startTime,time=new Date().getTime() )=> { 
            let dayTime=new Date(new Date().toDateString()).getTime() 
            let day=Math.ceil((dayTime-startTime)/(1000*60*60*24)) 
            let hours=Math.floor((time-startTime)/(1000*60*60))
            let min=Math.floor((time-startTime)/(1000*60))
            if(day>3){
                return formatDate(startTime,'yyyy/MM/dd hh:mm')
            }else if(day>0){
                return day+`天前`
            }else if(hours>0){
                return hours+`小时前`
            }else if(min>0){
                return min+'分钟前'
            }else{
                return '刚刚'
            } 
        }
        render() {
            return (<Fragment>
                <WrappedComponent 
                    formatIdeaTime={this.formatIdeaTime} 
                    calDay={this.calDay}
                    {...this.props} /> 
            </Fragment>)
        }
    }
}

export default TimeFormat