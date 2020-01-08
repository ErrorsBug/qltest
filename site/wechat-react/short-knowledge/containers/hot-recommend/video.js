import React, { Fragment } from 'react';
import throttle from 'lodash/throttle';



export default class Video extends React.PureComponent {
    state = {
        duration: undefined,
    }

    componentDidMount() {
        this.addEventListeners(this.ref);

        if (this.props.autoPlay) {
            if (window.WeixinJSBridge) {
                WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                    const video = document.querySelector('video');
                    video && video.play();
                }, false);
            } else {
                document.addEventListener("WeixinJSBridgeReady", function () {
                    WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                        const video = document.querySelector('video');
                        video && video.play();
                    });
                }, false);
                try {
                    const video = document.querySelector('video');
                    video && video.play().catch(e => {});
                } catch (e) {}
            }
        }
    }

    render() {
        const { listeners, src, ...props } = this.props;
        return <Fragment>
            <video
                webkit-playsinline="true"
                x5-playsinline="true"
                playsInline="true"
                {...props}
                src={src}
                ref={r => this.ref = r}
            ></video>
            <ProgressBar
                ref={r => this.refProgressBar = r}
                duration={this.state.duration}
            />
        </Fragment>
    }

    addEventListeners = video => {
        if (!video) return;
        const listeners = { ...this.props.listeners, ...this.listeners };

        for (let key in listeners) {
            video.addEventListener(key, listeners[key]);
        }
    }

    listeners = {
        durationchange: e => {
            if (this._willUnmount) return;
            this.setState({
                duration: e.target.duration,
            })

            this.props.listeners.durationchange && this.props.listeners.durationchange(e);
        },
        timeupdate: e => {
            this.refProgressBar && this.refProgressBar.updateCurrentTime(e.target.currentTime);
            this.props.listeners.timeupdate && this.props.listeners.timeupdate(e);
        },
        playing: e => {
            this.props.listeners.playing && this.props.listeners.playing(e);
            if (!this._hasFirstPlaying) {
                this._hasFirstPlaying = true;
                this.props.listeners.firstPlaying && this.props.listeners.firstPlaying(e);
            }
        },
    }

    componentWillUnmount() {
        this._willUnmount = true;
    }
}



class ProgressBar extends React.PureComponent {
    state = {
        currentTime: undefined,
    }

    render() {
        let progress = 0;
        if (this.state.currentTime && this.props.duration) {
            progress = this.state.currentTime / this.props.duration * 100
        }

        return <div className="progress-bar">
            <div>{convertTime(this.state.currentTime)}</div>
            <div className="progress-line">
                <span style={{ width: `${progress}%` }}></span>
            </div>
            <div>{convertTime(this.props.duration)}</div>
        </div>
    }

    componentWillUnmount() {
        this._willUnmount = true;
    }

    updateCurrentTime = throttle((currentTime) => {
        this._willUnmount || this.setState({
            currentTime
        })
    }, 500)
}

function convertTime(sec) {
    if (!(sec >= 0)) return '--:--';
    sec = Math.round(sec);
    let m = Math.floor(sec / 60);
    let s = Math.floor(sec % 60);
    m < 10 && (m = '0' + m);
    s < 10 && (s = '0' + s);
    return `${m}:${s}`;
}