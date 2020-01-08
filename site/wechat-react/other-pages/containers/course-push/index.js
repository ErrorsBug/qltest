import React, { Component } from 'react';
import { connect } from 'react-redux'
import Page from 'components/page';
import { locationTo, updatePageData, imgUrlFormat } from 'components/util'

import {
    pushTimeline,
    restPushTimes,
    getDataForCreateTimeline,
} from '../../actions/timeline'

/* 推送方法 */
import { pushTopic } from 'thousand_live_actions/thousand-live-common'
import { pushChannel } from '../../actions/channel'
import { pushHomework } from '../../actions/homework'
import { pushVip } from '../../actions/vip'
import { pushCamp } from '../../../check-in-camp/actions/mine'

class CoursePush extends Component {

    state = {
        content: "",

        logoUrl: "",
        title: "",


        liveId: 0,
    }

    constructor(props) {
        super(props)

        const { id, type } = this.props.routeParams
        const sync = this.props.location.query.sync === 'Y'
        const pushQl = this.props.location.query.pushQl === 'Y'
        const pushSelf = this.props.location.query.pushSelf === 'Y'
        const liveId = this.props.location.query.liveId
        this.constant = { id, type, sync, liveId, pushQl, pushSelf }
    }

    componentDidMount() {
        this.fetchInitData()
        updatePageData()

    }

    async fetchInitData() {
        try {
            /*
             * 获取获取初始信息
             * 
             * restTimes - 剩余次数信息
             * entityData - 当前实体（话题|系列课|作业）信息
             */
            const [entityData] = await Promise.all([
                this.props.getDataForCreateTimeline(
                    this.constant.id,
                    this.constant.type
                ),
            ])

            const { logoUrl, title } = entityData
            this.setState({
                logoUrl, title,
            })
        } catch (error) {
            console.error(error)
        }
    }

    handleChange = (event) => {
        /* 超过500字限制则不允许输入 */
        this.setState({ content: event.target.value });
    }

    /* 
     * 根据类型返回action和参数 
     * 
     * 做这个的主要原因是因为之前的action传参没有统一，改变可能导致其他地方
     * 请求问题，因此暂时判断各种类型然后写参数，待改善
     */
    get pushFn() {
        let pushType = '';
        if (this.constant.pushQl && this.constant.pushSelf) {
            pushType = 'both';
        } else if (this.constant.pushQl){
            pushType = 'qlchat';
        } else if (this.constant.pushSelf){
            pushType = 'kaifang';
        }
        switch (this.constant.type) {
            case 'topic':
                return this.props.pushTopic({ topicId: this.constant.id, recommend: this.state.content, pushType:pushType})
                break;
            case 'channel':
                return this.props.pushChannel({channelId:this.constant.id, recommend: this.state.content, pushType:pushType})
                break;
            case 'homework':
                return this.props.pushHomework({ homeworkId: this.constant.id, recommend: this.state.content })
                break;
            case 'camp':
                return this.props.pushCamp({campId:this.constant.id, recommend: this.state.content, pushType:pushType})
            case 'vip':
                let params = {
                    cVipId:this.constant.id,
                    pushType: pushType,
                    recommend: this.state.content,
                    liveId:this.constant.liveId,
                };
                // if (this.constant.id == this.constant.liveId) {
                //     params.liveId = this.constant.liveId;
                // } else {
                //     params.cVipId = this.constant.id;
                // }
                return this.props.pushVip(params)
            default:
                break;
        }
    }

    /* 成功后的提示信息 */
    get successTips(){
        return this.constant.sync ? '成功推送并发布动态' : '推送成功'
    }

    handlePush = async () => {
        if(this.state.content.length>26){
            window.toast('推送信息字数不能超过26')
            return false
        }
        if(this.state.leftPushNun <= 0){
            window.toast('推送次数已经用完')
            return false
        }

        if (!this.constant.pushQl && !this.constant.pushSelf && /^(topic|channel|camp)$/.test(this.constant.type)) {
            this.syncToTimeline();
            return false;
        }

        try {
            const result = await this.pushFn
            if(result.state.code === 0){
                if(this.constant.sync){
                    this.syncToTimeline()
                }else{
                    window.toast(this.successTips)
                    if (document.referrer){
                        locationTo(document.referrer);
                    } else {
                        this.goBack()
                    }
                }
            } else {
                window.toast(result.state.msg || '推送失败')
            }
        } catch (error) {
            console.error(error)
        }
    }

    syncToTimeline = async () => {
        try{
            if(this.constant.liveId) {
                var result = await this.props.pushTimeline(
                    this.state.content,
                    this.constant.liveId,
                    this.constant.id,
                    this.constant.type
                )
            } else {
                var result = await this.props.pushTimeline(
                    this.state.content,
                    this.props.liveId,
                    this.constant.id,
                    this.constant.type
                )
            }
            if(result.state.code === 0 && result.data.code === 0){
                window.toast(this.successTips)
                if (document.referrer){
                    locationTo(document.referrer);
                } else {
                    this.goBack()
                }
            } else {
                const failMsg = result.data ? result.data.msg : result.state.msg
                window.toast(failMsg || '推送成功，动态发布失败')
                setTimeout(()=> {
                    if (document.referrer){
                        locationTo(document.referrer);
                    } else {
                        this.goBack()
                    }
                }, 1200);
            }

        } catch(err){
            console.error(err)
        }
    }

    goBack = ()=>{
        setTimeout(()=>{
            history.go(-1)
        }, 1000)
    }

    render() {
        return (
            <Page title={'推送通知'} className='page-course-push'>
                <div className="text-con">
                    <textarea
                        className="textarea"
                        value={this.state.content}
                        onChange={this.handleChange}
                        placeholder={`输入你想发表的推荐语，将显示在${this.constant.sync ? '推送通知和动态' : '推送通知'}里`}
                    />
                    <div className="counter">
                        <span className={this.state.content.length>26?"num overflow":"num"}>{this.state.content.length}</span>/26
                    </div>
                    <div className="block-con">
                        <div className={this.constant.type === "homework" ? "block-img homework" : "block-img"} >
                            <img src={imgUrlFormat(this.state.logoUrl, "@140h_140w_1e_1c_2o", "/140")} />
                        </div>
                        <div className="block-text">{this.state.title}</div>
                    </div>
                    <div className="push-select">
                        即将推送到:
                        <ul>
                            {
                                this.constant.pushQl?
                                <li>千聊服务号</li>
                                :null    
                            }
                            {
                                this.constant.pushSelf?
                                <li>直播间服务号</li>
                                :null    
                            }
                            {
                                this.constant.sync?
                                <li>直播间动态</li>
                                :null    
                            }
                        </ul>
                    </div>
                </div>
                <div className="push-btn" onClick={this.handlePush}>
                    <div className="text">发布</div>
                </div>
            </Page>
        );
    }
}

function mapStateToProps(state) {
    return {
        liveId: state.timeline.myCurrentLiveId
    }
}

const mapDispatchToProps = {
    pushTimeline,
    restPushTimes,
    getDataForCreateTimeline,
    pushChannel,
    pushTopic,
    pushVip,
    pushHomework,
    pushCamp,
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(CoursePush)