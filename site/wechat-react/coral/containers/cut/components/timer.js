import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Timer extends Component {

    state = {
        duration: this.props.second,
        hours: 0,
        minutes: 0,
        second: 0,
        msecond:0,
        num:100,
    }

    componentDidMount() {
        this.doTimer();
    }

    doTimer() {
        this.timer = setInterval(() => {
            const durationtime = this.state.duration - this.state.num;
            let hours= ~~(durationtime / 3600 / 1000),
                minutes= ~~(durationtime/1000 % 3600/60),
                second= ~~(durationtime/1000 % 60),
                msecond= ~~((durationtime/this.state.num) % (1000/this.state.num));

            this.setState({
                duration: durationtime,
                hours: hours<10 ? '0'+hours : hours,
                minutes: minutes<10 ? '0'+minutes : minutes,
                second: second<10 ? '0'+second : second,
                msecond: msecond,
            });
            

            if(durationtime<=0){
                this.props.onFinish();
                clearInterval(this.timer);
            }

        }, this.state.num)
    }
    
    render() {
        const { notSecond, ...ohters } = this.props;

        return (
            <div className='timer-wrap' {...ohters}>
                <span>{ this.state.hours }</span>
                :
                <span>{ this.state.minutes }</span>
                :
                <span>{ this.state.second }</span>
                {!notSecond && <span className="ms">.{ this.state.msecond }</span>}
            </div>
        );
    }
}

Timer.propTypes = {
    // 倒计时的秒数
    second: PropTypes.number.isRequired,

    // 当倒计时结束回调
    onFinish: PropTypes.func.isRequired,

    notSecond: PropTypes.bool,
};

export default Timer;