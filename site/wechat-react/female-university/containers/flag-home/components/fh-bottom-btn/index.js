import React, { PureComponent, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { autobind } from 'core-decorators'; 
import { locationTo } from 'components/util'
 
@autobind
export default class extends PureComponent{
    state = { 
         
    }
    componentDidMount = () => {
    }; 
    render() { 
        const {  cardDate ,cardStatus  } = this.props
        const time =(new Date() ).getTime() 
        const {    } = this.state;
        return (
            <Fragment>
                <div className="fh-bottom-btn">
                     {
                         time<cardDate?
                         <div className="fhb-btn begin on-log on-visible"  
                             data-log-name='明天开始打卡'
                             data-log-region='un-flag-be-card'
                             data-log-pos="0" 
                            onClick={()=>{window.toast('明天才正式开始打卡哦')}}>明天开始打卡</div>
                         :cardStatus=='N'?
                         <div className="fhb-btn now on-log on-visible" 
                            data-log-name='今日打卡'
                            data-log-region='un-flag-on-card'
                            data-log-pos="0" 
                            onClick={()=>{locationTo(`/wechat/page/university/flag-publish`)}}>今日打卡</div>
                         :""
                     }
                    
                </div> 
            </Fragment>
        )
    }
}
