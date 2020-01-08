import React, {Component} from 'react';
import PropTypes from 'prop-types';

/*
倒计时组件
参数：

*/
class Timer extends Component {

    state = {
        hours: 0,
        minutes: 0,
        seconds: 0,
        mseconds:0,
        days:0,
        duration: this.props.durationtime,
        num:100,
    }

    componentDidMount() {
        this.setState({
            duration: this.props.durationtime,
            num: this.props.num || 100,
        },() => {
            this.doTimer()
        })
    }
    componentWillUnmount() {
        clearInterval(this.timer)
    }

    doTimer() {
        this.timer = setInterval(() => {
            const durationtime = this.state.duration - this.state.num;
            let days= ~~(durationtime /1000 /3600 /24),
                hours= this.props.typeStyle==='timer-style-day'? ~~(durationtime /1000/3600%24 ) : ~~(durationtime /1000 /3600 ),
                minutes= ~~(durationtime/1000 % 3600/60),
                seconds= ~~(durationtime/1000 % 60),
                mseconds= ~~((durationtime/this.state.num) % (1000/this.state.num));

            this.setState({
                duration: durationtime,
                days:days,
                hours: hours<10 ? '0'+hours : hours,
                minutes: minutes<10 ? '0'+minutes : minutes,
                seconds: seconds<10 ? '0'+seconds : seconds,
                mseconds: mseconds,
            });

            if(durationtime <= 0){
                this.props.onFinish();
                this.setState({
                    days: 0,
                    hours:0,
                    minutes: 0,
                    seconds: 0,
                    mseconds: 0,
                });
                clearInterval(this.timer);
            }
        }, this.state.num)
    }
    
    render() {
        const { onFinish, notSecond, typeStyle, ...ohters } = this.props;
        if(typeStyle ==='timer-style-day'){
            return (
                <div className='timer-wrap' {...ohters}>
                    <span>{ this.state.days }</span>
                    天
                    <span>{ this.state.hours }</span>
                    时
                    <span>{ this.state.minutes }</span>
                    分
                    <span>{ this.state.seconds }</span>
                    秒
                    {!notSecond&&"."}
                    {!notSecond&&<span>{ this.state.mseconds }</span>}
                </div>
            );
        }else{
          
            return (
                <div className='timer-wrap' {...ohters}>
                    <span>{ this.state.hours }</span>
                    :
                    <span>{ this.state.minutes }</span>
                    :
                    <span>{ this.state.seconds }</span>
                    {!notSecond&&"."}
                    {!notSecond&&<span>{ this.state.mseconds }</span>}
                </div>
            );
          
        }
    }
}

Timer.propTypes = {
    // 倒计时的秒数
    durationtime: PropTypes.number.isRequired,

    // 当倒计时结束回调
    onFinish: PropTypes.func.isRequired,

    num: PropTypes.number,

    typeStyle: PropTypes.string,

    notSecond: PropTypes.bool,
};

export default Timer;