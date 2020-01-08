import React, { PureComponent } from 'react';


//component parameter definition
const params = {
    startTime: 'number',
    currentTimeMillis: 'number',
    sysTime: 'number',
    reachTime: 'function'
}

export default class CountDown extends PureComponent {

    state = {
        day: 0,
        hours: 0,
        minutes: 0,
        second: 0,
    }

    componentDidMount() {
        const { sysTime, startTime } = this.props;

        let second = parseInt((startTime - sysTime) / 1000);

        let day = ~~(second / (3600 * 24));
        let hours = ~~(second % (3600 * 24) / 3600);
        let minutes = ~~(second % 3600 / 60);

        this.setState({
            day: day,
            hours: hours,
            minutes: minutes,
            second: second % 60,
        });

        this.doTimer();
    }

    doTimer() {
        this.timer = setInterval(() => {
            let {day, hours, minutes, second } = this.state;
            if (second === 0 && minutes === 0 && hours === 0 && day === 0) {
                clearInterval(this.timer);
                this.props.onFinish && this.props.onFinish();
            } else if (second === 0 && minutes === 0 && hours === 0) {
                day -= 1;
                hours = 23;
                minutes = 59;
                second = 59;
            } else if (second === 0 && minutes === 0) {
                hours -= 1;
                minutes = 59;
                second = 59;
            } else if (second === 0) {
                minutes -= 1;
                second = 59;
            } else {
                second -= 1;
            }

            this.setState({
                day: day,
                hours: hours,
                minutes: minutes,
                second: second,
            });
        }, 1000);
    }

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }

    render () {
        let {day, hours, minutes, second} = this.state;
        return (
            <div className="live-name live-count-down">
                <span className="time-number">倒计时:</span>
                <span className="time-number">{day}</span><span className="time-unit">天&nbsp;</span>
                <span className="time-number">{hours}</span><span className="time-unit">时&nbsp;</span>
                <span className="time-number">{minutes}</span><span className="time-unit">分&nbsp;</span>
                <span className="time-number">{second}</span><span className="time-unit">秒&nbsp;</span>
            </div>
        )
    }
}

