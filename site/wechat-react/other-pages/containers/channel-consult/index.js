import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Page from 'components/page';
import { locationTo } from 'components/util';

// actions
import { sendConsult, getIsLiveAdmin } from '../../actions/consult';

class channelConsult extends Component {

    state = {
        type: '',
        title: '',
        channelId: '',
        topicId: '',
        consultInfo: "",
        isLiveAdmin: false,
    }

    componentWillMount = async () => {
        const channelId = this.props.location.query.channelId;
        const topicId = this.props.location.query.topicId;

        if (!channelId && !topicId) return setTimeout(() => window.toast('无效系列课id或课程id'));

        this.setState({
            type: channelId ? 'channel' : 'topic',
            title: channelId ? '系列课咨询' : '课程咨询',
            channelId,
            topicId,
        })

        const result = await this.props.getIsLiveAdmin(channelId, topicId);
        if (result.state.code === 0 && result.data.isLiveAdmin) {
            this.setState({
                isLiveAdmin: true
            })
        }
    }
    
    /* 点击提交咨询按钮事件*/
    onConfirmConsultClick = async () => {
        // 无内容过滤
        if (this.state.consultInfo.length == 0) {
            window.toast('咨询留言不能为空');
            return false;
        }

        const result = await this.props.sendConsult(this.state.consultInfo, this.state.type === 'channel' ? this.state.channelId : this.state.topicId, this.state.type)
        if (result.state.code === 0) {
            this.setState({
                consultInfo: '',
            })
            window.toast('提交咨询成功')
            window.history.back()
        } else {
            window.toast(result.state.msg)
        }
    }

    onConsultInputChange = (e) => {
        e = e || window.event;
        this.setState({
            consultInfo: e.target.value,
        })
    }

    render() {
        if (!this.state.channelId && !this.state.topicId) return false;
        return (
            <Page title={this.state.title} className='channel-consult'>

                <textarea
                    className="textarea"
                    placeholder="输入想咨询的课程问题，我们将尽快给你答复"
                    ref="area"
                    onChange={this.onConsultInputChange}
                ></textarea>

                <div className="btn-submit on-log" onClick={this.onConfirmConsultClick}
                    data-log-name="提交按钮"
                    data-log-region={`${this.state.type}-consult-submit`}
                >提交</div>

                <h1 className="consult-question">Q：购买后如何听课？</h1>
                <p className="consult-des">
                {
                    this.state.isLiveAdmin ? 'A：购买课程后关注我们的服务号，可在菜单里进入听课，我们会按时推送购买课程的开课更新通知。' : 'A：购买课程后关注千聊公众号，可在菜单「已购买课程」里进入听课，千聊公众号会按时推送购买课程的开课更新通知。'
                }
                </p>
                <h1 className="consult-question">Q：课程是否可以反复回听？</h1>
                <p className="consult-des">A：课程购买后是可以随时反复回听，重温学习的。</p>


            </Page>
        );

    }
}

function mapStateToProps (state) {
    return {

    }
}

const mapActionToProps = {
    sendConsult,
    getIsLiveAdmin,
}

module.exports = connect(mapStateToProps, mapActionToProps)(channelConsult);
