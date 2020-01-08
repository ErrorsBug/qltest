import React, { Component } from 'react'

/**
 * 倒计时
 * @param {*} WrappedComponent
 * @returns
 */
const countdownHoc = (WrappedComponent) => {
    return class extends Component {
        state = {
            h: "00",
            m: '00',
            s: '00',
            sm: '0'
        }
        timer = null
        endTime = 0
        componentDidMount(){
            this.endTime = this.props.endTime
            this.countTime()
        }
        componentWillReceiveProps({ endTime }) {
            if(endTime != this.props.endTime) {
                this.endTime = endTime;
                this.countTime();
            }
        }
        countTime = (ms) => {
            ms = new Date(this.endTime).getTime() - Date.now();
            if(ms <= 0){
                window.cancelAnimationFrame(this.timer);
                if(this.props.changeEnd) this.props.changeEnd();
                return false;
            }
            let h,m,s,sm;
            h = Math.floor((ms / 1000 / 60 / 60 % 24));
            m = Math.floor((ms / 1000 / 60 % 60));
            s = Math.floor((ms / 1000 % 60))
            sm = Math.floor(ms % 1000);
            h = h<10 ? "0"+ h : h;
            m = m<10 ? "0"+ m : m;
            s = s<10 ? "0"+ s : s;
            sm = parseInt(sm / 100);
            this.setState({
                h,m,s,sm
            })
            this.timer = window.requestAnimationFrame(this.countTime);
        }
        componentWillUnmount(){
            if(this.timer) {
                window.cancelAnimationFrame(this.timer);
            }
        }
        render() {
            return (
                <WrappedComponent { ...this.props } { ...this.state } />
            )
        }
    }
}
export default countdownHoc