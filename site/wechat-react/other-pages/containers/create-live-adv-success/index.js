import React, { Component } from "react";
import Page from "components/page";
import { connect } from "react-redux";

import { getQr } from '../../actions/common';
import { getTopicInfo } from '../../actions/topic';

import { autobind } from "core-decorators";

@autobind
class CreateLiveAdvSuccess extends Component {
    constructor(props) {
        super(props);
    }
    
    state = {
        qrUrl: undefined
    }

    async componentDidMount() {
        this.getQr();
        this.props.getTopicInfo(this.props.location.query.topicId);
    }
    
    async getQr() {
        const res = await  this.props.getQr({
            channel: 'pushTopicNewCreate',
            topicId: this.props.location.query.topicId,
            liveId: this.props.location.query.liveId,
            appId: 'wxd01870839c0996c8'
        });
        if(res.state.code === 0) {
            this.setState({
                qrUrl: res.data.qrUrl
            });
        }
    }

    render() {
        return (
            <Page title="创建课程" className="create-live-adv-success">
                <div className="done-icon-wrap">
                    <img src={require('./img/done.png')} alt=""/>
                </div>
                <p className="title">
                    太棒了！创课成功啦！
                </p>
                <div className="course-detail">
                    <span className="course">课程：</span>
                    <span>
                        {this.props.topicInfo.topic}
                    </span>
                </div>
                <div className="bg-wrap">
                    <div className="title">
                        加入社群马上领取新手福利
                    </div>
                    <div className="desc-list">
                        <p>
                            手把手教你5天玩转千聊
                        </p>
                        <p>
                            结识更多的业内讲师，共同进步
                        </p>
                        <p>
                            入群即可获得价值<span>699元</span>的资料礼包
                        </p>
                        <p>
                            可享受最新平台<span>扶持计划</span>
                        </p>
                    </div>
                    <div className="qrcode-box">
                        {
                            this.state.qrUrl &&
                            <img src={this.state.qrUrl} />
                        }
                    </div>
                    <p className="bottom">
                        扫码关注后，加入新手社群
                    </p>
                </div>
            </Page>
        );
    }
}

function mapStateToProps(state) {
    return {
        topicInfo: state.topic && state.topic.topicInfo
    };
}

const mapActionToProps = {
    getQr,
    getTopicInfo
};

module.exports = connect(
    mapStateToProps,
    mapActionToProps
)(CreateLiveAdvSuccess);
