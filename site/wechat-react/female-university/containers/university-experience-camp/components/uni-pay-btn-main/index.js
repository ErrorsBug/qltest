import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import { formatDate } from 'components/util'; 
import countdownHoc from '../../../../hoc/countdown'

const Countdown = ({ h, m, s, sm }) => {
    return (
        <>
        <span>{m}</span>分<span>{s}</span>秒<span>{sm}</span>
        </>
    )
}

const CountComp = countdownHoc(Countdown)

@autobind
class UniPayBtnMain extends Component {
    state = { 
    }
     
    componentDidMount() { 
    }
  
    render() {
        const { bestPrice,price,studyDays,startTime,payBtn,countEndTime } = this.props; 
        return (
            <div className="uni-pay-btn-main">
                <div className="uni-pay-com uni-pay-info">
                    <p><strong>仅需￥{bestPrice!==null? bestPrice : price  }</strong>{ bestPrice!==null && <em>原价￥{ price || 0 }</em> }</p>
                    <span>
                        { studyDays && <>{ studyDays || 0 }天带学  </> }
                        { startTime && <>| { formatDate(startTime, 'MM/dd') }开营</> }
                    </span>
                </div>
                <div className="uni-pay-com uni-pay-red on-log on-visible" 
                    data-log-name={ "立即加入" }
                    data-log-region="experience-camp-pay"
                    data-log-pos={ 0 }    
                    onClick={ payBtn }>
                    <div className="uni-pay-red-text">
                        {bestPrice==0?"限时免费":"立即加入"}
                    </div>
                    <div className="uni-pay-red-timer">优惠倒计时<CountComp endTime={countEndTime}/> </div>
                </div>
            </div>
        );
    }
}
 

export default UniPayBtnMain;