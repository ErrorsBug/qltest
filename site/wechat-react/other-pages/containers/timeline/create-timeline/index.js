import React, { Component } from 'react';
import { connect } from 'react-redux'
import Page from 'components/page';
import { locationTo, imgUrlFormat } from 'components/util'
import { isPc } from 'components/envi'
import homeworkLayer from '../img/homework-layer.png'
import createTipImg from '../img/create-reminder.png'

import {
    pushTimeline,
    restPushTimes,
    getDataForCreateTimeline,
    cleanTimelineList,
} from '../../../actions/timeline'

import {
    cleanLiveTimeline
} from '../../../actions/live'

class createTimeline extends Component {
    state = {
        content: "",
        restPushTimes: 0,
        logoUrl: "",
        title: "",
        maxFeedPushNum: 0,
        leftFeedPushNum: 0,
        focused: "unfocused",
        showTip: false,
    }

    handleChange = (event) => {
        this.setState({ content: event.target.value });
    }

    locationToHandle = (url) => {
        locationTo(url)
    }

    async componentDidMount() {

        var restPush = await this.props.restPushTimes(
            this.props.location.query.id,
            this.props.location.query.type
        )
        const result = await this.props.getDataForCreateTimeline(
            this.props.location.query.id,
            this.props.location.query.type
        )
        if(restPush && restPush.data) {
            restPush = restPush.data
        }

        if (localStorage && !localStorage.getItem("createTimelineTip")) {
            this.setState({
                showTip: true,
                logoUrl: result.logoUrl,
                title: result.title,
                maxFeedPushNum: restPush.maxFeedPushNum,
                leftFeedPushNum: restPush.leftFeedPushNum,
            })
        } else {
            this.setState({
                logoUrl: result.logoUrl,
                title: result.title,
                maxFeedPushNum: restPush.maxFeedPushNum,
                leftFeedPushNum: restPush.leftFeedPushNum,
            })
        }

    }

    closeTipHandle = () => {
        if (localStorage) {
            localStorage.setItem("createTimelineTip", true)
        }
        this.setState({
            showTip: false,
        })
    }

    createHandle = async () => {
        if(this.state.content.length > 500) {
            window.toast("动态内容最多为500字")
        } else {
            const result = await this.props.pushTimeline(
                this.state.content,
                this.props.liveId || this.props.location.query.liveId || 0,
                this.props.location.query.id,
                this.props.location.query.type
            )
            this.props.cleanTimelineList()
            this.props.cleanLiveTimeline()

            if(result && result.data && result.data.code == 200) {
                window.toast(result.data.msg)
                setTimeout(function () {
                    history.go(-2);
                }, 1000);
            } else if (result && result.data && result.data.msg) {
                window.toast(result.data.msg)
            } else if (result && result.state && result.state.msg) {
                window.toast(result.state.msg)
            }

        }


    }

    typeText = () => {
        switch(this.props.location.query.type) {
            case "topic":
                return <div className="reminder">今天<span className="red">还剩{this.state.leftFeedPushNum}次</span>发布动态机会。</div>
            case "channel":
                return <div className="reminder">今天<span className="red">还剩{this.state.leftFeedPushNum}次</span>发布动态机会。</div>
            case "homework":
                return <div className="reminder">今天<span className="red">还剩{this.state.leftFeedPushNum}次</span>发布动态机会。</div>
        }
    }

    focusHandle = () => {
        if (!isPc()) {
            this.setState({
                focused: "focused",
            })
        }
    }
    onBlurHandle = () => {
        if (!isPc()) {
            this.setState({
                focused: "unfocused",
            })
        }
    }

    render() {
        return (
            <Page title={'发布动态'} className='create-timeline'>
                {
                    this.state.showTip ?
                        <div className="createTip" onClick={this.closeTipHandle}>
                            <img src={createTipImg} />
                        </div>
                        : ""
                }

                <div className="text-con">
                    <textarea
                        className="textarea"
                        value={this.state.content}
                        onChange={this.handleChange}
                        placeholder={"输入你想发表的推荐语，将显示在动态里"}
                        onFocus={this.focusHandle}
                        onBlur={this.onBlurHandle}
                    />
                    <div className="counter">
                        <span className="num">{this.state.content.length}</span>/500
                    </div>
                    <div className="block-con">
                        <div className="block-img">
                            {
                                this.props.location.query.type == "homework" ?
                                <img src={homeworkLayer} className="front-layer"/> : ""
                            }
                            {
                                this.state.logoUrl?
                                    <img src={imgUrlFormat(this.state.logoUrl, "@140h_140w_1e_1c_2o", "/140")} />
                                :null    
                            }
                        </div>
                        <div className="block-text">{this.state.title}</div>
                    </div>
                </div>
                {this.typeText()}
                <div className="push-btn" onClick={this.createHandle}>
                    <div className="text">发布</div>
                </div>

                {/* focused 状态是为了解决部分手机的输入框会把这个动态顶上来的问题 */}
                <div
                    className={`help ${this.state.focused} ${this.state.showTip ? "tip" : ""}`}
                    onClick={ this.locationToHandle.bind(this, "https://mp.weixin.qq.com/s?biz=MzA4MTk0OTY1MQ==&mid=100014218&idx=1&sn=9279bb191737c5b6c66e17cf4a835c42&scene=19#wechat_redirect")}
                    >
                        <span className={this.state.showTip ? "showTip" : ""}>如何玩转直播间动态</span>
                </div>
            </Page>
        );
    }
}

function mapStateToProps(state){
    return{
        liveId: state.timeline.myCurrentLiveId
    }
}

const mapDispatchToProps ={
    pushTimeline,
    restPushTimes,
    getDataForCreateTimeline,
    cleanTimelineList,
    cleanLiveTimeline
}
export default connect(mapStateToProps, mapDispatchToProps)(createTimeline)
