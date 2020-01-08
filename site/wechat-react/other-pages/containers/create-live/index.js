import React, { Component } from "react";
import Page from "components/page";
import { connect } from "react-redux";
import { locationTo } from "components/util";
import { share } from "components/wx-utils";

class CreateLive extends Component {
    constructor(props) {
        super(props);
    }
    data = {
        createArr: [
            {
                img: "item-1",
                tip: "音视频互动授课"
            },
            {
                img: "item-2",
                tip: "营销工具丰富"
            },
            {
                img: "item-3",
                tip: "课程听众无上限"
            },
            {
                img: "item-4",
                tip: "内容永久保存"
            },
            {
                img: "item-5",
                tip: "平台安全稳定"
            },
            {
                img: "item-6",
                tip: "多端灵活使用"
            }
        ]
    };
    state = {};

    componentDidMount() {
        this.initShare();
    }
    initShare() {
        share({
            title: "快来创建属于你的千聊专属直播间吧",
            desc: `再小的个体，也有自己的讲台`,
            imgUrl: "https://img.qlchat.com/qlLive/activity/image/7JEKE2L2-44H5-3JHN-1562313091323-E8GJA3C8BYXE.png",
            shareUrl: location.origin + location.pathname
        });
    }
    handleGotoLiving() {
        console.log(location.search);
        locationTo(`/wechat/page/live-auth${location.search}`);
    }
    render() {
        return (
            <Page title={`创建直播间`} className="create-live-wrap">
                <div className="create-live-box">
                    {/* <div className="create-live-header">
										<div className="create-desc"></div>
										<div className="create-header-name">
												千聊  和知识做朋友
										</div>
									</div> */}

                    <div className="create-live-main">
                        {this.data.createArr.map((item, index) => {
                            return (
                                <div
                                    className="create-main-item"
                                    key={`create_${index}`}
                                >
                                    <img
                                        src={require(`./img/${item.img}.png`)}
                                    />
                                    <div className="main-tip">{item.tip}</div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="create-live-control">
                        <div className="control-tip">产品介绍</div>
                        <div className="create-content">
                            <div>
                                微信知识变现第一工具，超过130万知识服务者使用，500强公众号首选变现工具，海量大V正在使用
                            </div>
                            <div className="mgt-20">
                                团队成员来自腾讯、阿里等全球一流互联网公司，更获腾讯战略投资，系腾讯双百计划成员之一
                            </div>
                        </div>
                    </div>
                </div>
                <div className="create-live-footer">
                    <div
                        className="create-live-btn"
                        data-log-name="创建直播间"
                        data-log-region="button"
                        data-log-pos="create"
                        onClick={this.handleGotoLiving}
                    >
                        一键创建直播间
                    </div>
                </div>
            </Page>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

const mapActionToProps = {};

module.exports = connect(
    mapStateToProps,
    mapActionToProps
)(CreateLive);
