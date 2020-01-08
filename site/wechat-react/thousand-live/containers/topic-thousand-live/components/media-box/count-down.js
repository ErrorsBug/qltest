import React, { Component } from 'react';
import PropTypes from 'prop-types';


class CountDown extends Component {
    state = {
        day: 0,
        hours: 0,
        minutes: 0,
        second: 0,
    }

    componentDidMount() {
        const { second } = this.props;

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

    render() {
        return (
            <div className="count-down-box">
                <div className="count-tip">距课程开始还有</div>
                <div className="time-show">
                    <div className="time-block">
                        <div className="time-wrap">
                            <div className="num">{this.state.day}</div>
                            <div className="name">天</div>
                        </div>
                    </div>
                    <div className="flag">:</div>
                    <div className="time-block">
                        <div className="time-wrap">
                            <div className="num">{this.state.hours}</div>
                            <div className="name">时</div>
                        </div>
                    </div>
                    <div className="flag">:</div>
                    <div className="time-block">
                        <div className="time-wrap">
                            <div className="num">{this.state.minutes}</div>
                            <div className="name">分</div>
                        </div>
                    </div>
                    <div className="flag">:</div>
                    <div className="time-block">
                        <div className="time-wrap">
                            <div className="num">{this.state.second}</div>
                            <div className="name">秒</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }
}

CountDown.propTypes = {
    // 倒计时的秒数
    second: PropTypes.number.isRequired,

    // 当倒计时结束回调
    onFinish: PropTypes.func.isRequired,
};

export default CountDown;
