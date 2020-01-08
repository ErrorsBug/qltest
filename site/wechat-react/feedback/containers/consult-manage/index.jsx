import * as React from "react";
import { Card } from "../../components/card";
import Page from "components/page";
import { connect } from "react-redux";
import { apiService } from "components/api-service";
import { MiddleDialog } from "components/dialog";
import InputBox from "../../components/input-box";
import ScrollView from "components/scroll-view";
import { Message } from "./components/message";
class ConsultManage extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            bannerInfo: {
                beginTime: undefined,
                name: undefined,
                headImage: undefined
            },
            consultList: [],
            setSelectionDialog: undefined,
            inputBox: undefined,
            consultCount: undefined,
            currentPage: 1,
            loadingStatus: ""
        };
        this.getBusinessInfo = async () => {
            let result;
            if (this.businessType == "channel") {
                result = await this.getChannelInfo();
            }
            else {
                result = await this.getTopicInfo();
            }
            this.setState({
                bannerInfo: result
            });
        };
        this.getChannelInfo = async () => {
            let result = await apiService.post({
                url: "/h5/channel/info",
                body: {
                    channelId: this.businessId
                }
            });
            if (result.state.code == 0) {
                let channel = result.data.channel;
                let newRes = {
                    headImage: channel.headImage,
                    beginTime: channel.createTime,
                    name: channel.name
                };
                return newRes;
            }
            else {
                return {};
            }
        };
        this.getTopicInfo = async () => {
            let result = await apiService.post({
                url: "/h5/topic/get",
                body: {
                    topicId: this.businessId
                }
            });
            if (result.state.code == 0) {
                let topic = result.data.topicPo;
                let newRes = {
                    name: topic.topic,
                    headImage: topic.backgroundUrl,
                    beginTime: topic.startTime
                };
                return newRes;
            }
            else {
                return {};
            }
        };
        this.getConsultList = async (page = 1) => {
            let result = await apiService.post({
                url: "/h5/consult/consultList",
                body: {
                    topicId: this.businessId,
                    type: this.businessType,
                    page: {
                        page: page,
                        size: 20
                    }
                }
            });
            if (result.state.code == 0) {
                this.setState({
                    consultList: [
                        ...this.state.consultList,
                        ...result.data.consultList
                    ],
                    consultCount: result.data.consultCount,
                    loadingStatus: result.data.consultList.length < 20 ? "end" : "",
	                currentPage: page
                });
            }
        };
        this.setSelection = (id, status) => {
            this.setState({
                setSelectionDialog: {
                    id,
                    status
                }
            });
        };
        this.ajaxSetSelection = async () => {
            let { setSelectionDialog } = this.state;
            this.setState({
                setSelectionDialog: false
            });
            let result = await apiService.post({
                url: "/h5/consult/perfect",
                body: Object.assign({}, setSelectionDialog)
            });
            if (result.state.code == 0) {
                let { consultList } = this.state;
                let newConsultList = consultList.map((item, key) => {
                    if (item.id == setSelectionDialog.id) {
                        item.status = setSelectionDialog.status;
                    }
                    return item;
                });
                this.setState({
                    consultList: newConsultList
                });
            }
            else {
                window.toast(result.state.msg);
            }
        };
        this.onClickReply = (replyPeople, replyType, initialValue, id, replyId) => {
            this.setState({
                inputBox: {
                    replyPeople,
                    replyType,
                    initialValue,
                    id,
                    replyId
                }
            });
        };
        this.addReply = async (id, value) => {
            let result = await apiService.post({
                url: "/h5/consult/reply",
                body: {
                    id,
                    content: value
                }
            });
            if (result.state.code == 0) {
                let { consultList } = this.state;
                let reply = result.data;
                let newConsultList = consultList.map(item => {
                    if (item.id == id) {
                        Object.assign(item, reply);
                        item.isReply = "Y";
                    }
                    return item;
                });
                this.setState({
                    consultList: newConsultList,
                    inputBox: false
                });
            }
            else {
                window.toast(result.state.msg);
            }
        };
        this.modifyReply = async (replyId, value) => {
            let result = await apiService.post({
                url: "/h5/consult/modifyReply",
                body: {
                    replyId,
                    content: value
                }
            });
            if (result.state.code == 0) {
                let { consultList } = this.state;
                let reply = result.data;
                let newConsultList = consultList.map(item => {
                    if (item.replyId == replyId) {
                        Object.assign(item, reply);
                    }
                    return item;
                });
                this.setState({
                    consultList: newConsultList,
                    inputBox: false
                });
            }
            else {
                window.toast(result.state.msg);
            }
        };
        this.ajaxReply = async (value) => {
            let { inputBox } = this.state;
            if (inputBox.replyType == "first") {
                this.addReply(inputBox.id, value);
            }
            else {
                this.modifyReply(inputBox.replyId, value);
            }
        };
    }
    componentDidMount() {
        this.getBusinessInfo();
        this.getConsultList();
    }
    get businessType() {
        return this.props.location.query.type;
    }
    get businessId() {
        return this.props.params.topicId;
    }
    render() {
        return (<Page title={`留言管理`} className="consult-manage-container">
                <ScrollView status={this.state.loadingStatus} onScrollBottom={() => {
            if (this.state.loadingStatus != "")
                return;
            this.setState({
                loadingStatus: "pending"
            });
            this.getConsultList(this.state.currentPage + 1);
        }}>
                    <div className="header">
                        <div className="header-banner">
                            <Card {...this.state.bannerInfo} onClick={() => {
            if (this.businessType == "channel") {
                location.href = `/wechat/page/channel-intro?channelId=${this.businessId}`;
            }
            else {
                location.href = `/wechat/page/topic-intro?topicId=${this.businessId}`;
            }
        }}/>
                        </div>
                    </div>
                    <div className="message-container">
                        <div className="message-title">
                            <span className="all-msg">全部留言</span>
                            <span className="msg-num">
                                {this.state.consultCount}
                            </span>
                        </div>
                        <div className="message-list">
                            {this.state.consultList.map((item, key) => {
            return (<Message key={key} {...item} setSelection={this.setSelection} onClickReply={this.onClickReply}/>);
        })}
                        </div>
                    </div>
                    <MiddleDialog show={!!this.state.setSelectionDialog} bghide={true} className="selection-dialog" onClose={() => {
            this.setState({
                setSelectionDialog: false
            });
        }}>
                        <div className="title">
                            {this.state.setSelectionDialog &&
            this.state.setSelectionDialog.status == "publish"
            ? "是否设为精选?"
            : "是否取消精选？"}
                        </div>
                        <div className="body">
                            {this.state.setSelectionDialog &&
            this.state.setSelectionDialog.status == "publish"
            ? "设为精选将会在介绍页显示"
            : "取消精选将不会在介绍页显示"}
                        </div>
                        <div className="footer">
                            <div className="btn btn-cancel" onClick={() => {
            this.setState({
                setSelectionDialog: false
            });
        }}>
                                取消
                            </div>
                            <div className="btn btn-confirm" onClick={this.ajaxSetSelection}>
                                确定
                            </div>
                        </div>
                    </MiddleDialog>
                </ScrollView>
                {this.state.inputBox ? (<InputBox initialValue={this.state.inputBox.initialValue} onBlur={() => {
            this.setState({
                inputBox: false
            });
        }} placeholder={`回复：${this.state.inputBox.replyPeople}`} onSend={this.ajaxReply}/>) : null}
            </Page>);
    }
}
function mapStateToProps(state) {
    return {};
}
const mapActionToProps = {};
export default connect(mapStateToProps, mapActionToProps)(ConsultManage);
