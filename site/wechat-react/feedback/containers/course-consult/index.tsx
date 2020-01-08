import * as React from "react";
import { connect } from "react-redux";

import { Tab } from "./components/tab";
import { Card } from "../../components/card";
import { apiService } from "components/api-service";
import ScrollView from "components/scroll-view";

import Page from "components/page";

type TypeTab = "channel" | "topic";

class CourseConsult extends React.Component<
    {
        params: any;
    },
    {
        currentTab: TypeTab;
        consultList: Array<any>;
        topicCount: number;
        channelCount: number;
        currentPage: number;
        loadingStatus: string;
    }
> {
    constructor(props) {
        super(props);
    }

    get liveId() {
        return this.props.params.liveId;
    }

    componentDidMount() {
        this.getCourseList(undefined, undefined);
        this.getIndicatorCount();

    }

    state = {
        currentTab: "channel" as TypeTab,
        consultList: [],
        topicCount: undefined,
        channelCount: undefined,
        currentPage: 1,
        loadingStatus: ''
    };

    switchTab = (key: TypeTab) => {
        const k = this.state.currentTab;
        if (k != key) {
            this.getCourseList(1, key);
        }
    };

    getIndicatorCount = async () => {
        let result = await apiService.post({
            url: "/h5/consult/topicListCount",
            body: {
                liveId: this.liveId
            }
        });
        if (result.state.code == 0) {
            this.setState({
                topicCount: result.data.topicCount,
                channelCount: result.data.channelCount
            });
        }
    };

    getCourseList = async (page: number = 1, type) => {
        const result = await apiService.post({
            url: "/h5/consult/topicList",
            body: {
                liveId: this.liveId,
                clientType: "wechat",
                type: type ? type : this.state.currentTab,
                page: {
                    page: page,
                    size: 20
                }
            }
        });
        if (result.state.code == 0) {
            let resultList = result.data.topicList;
            this.setState({
                consultList: page == 1 ? resultList :[...this.state.consultList, ...resultList],
                currentTab: type ? type : this.state.currentTab,
                currentPage: page,
                loadingStatus: resultList.length < 20 ? 'end' : ''
            });
        } else {
        }
    };

    render() {
        return (
            <Page
                title={
                    (this.state.currentTab == "channel" ? "系列课" : "单课") +
                    `留言表`
                }
                className="course-consult-container"
            >
                <Tab
                    current={this.state.currentTab}
                    onSwitch={this.switchTab}
                    topicCount={this.state.topicCount}
                    channelCount={this.state.channelCount}
                />
                <div className="consult-list">
                    <ScrollView
                        onScrollBottom={() => {
                            if (this.state.loadingStatus != '') return ;
                            this.setState({
                                loadingStatus: 'pending'
                            })
                            this.getCourseList(this.state.currentPage + 1, undefined);
                        }}
                        status={this.state.loadingStatus}
                    >
                        {this.state.consultList.map((item, idx) => {
                            return (
                                <div key={idx} className="card-container">
                                    <Card
                                        className="on-log on-visible"
                                        dataLogRegion="channel-item"
                                        dataLogPos={idx}
                                        dataLogVisible="1"
                                        {...item}
                                        onClick={() => {
                                            location.href = `/wechat/page/live/messageManage/${
                                                item.topicId
                                            }?type=${item.type}`;
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </ScrollView>
                </div>
            </Page>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

const mapActionToProps = {};

export default connect(
    mapStateToProps,
    mapActionToProps
)(CourseConsult);
