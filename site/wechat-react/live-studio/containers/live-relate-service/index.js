import React, { useState, useEffect, useCallback } from "react";
import Page from "components/page";
import { connect } from "react-redux";

import "./style.scss";

const LiveRelateService = ({}) => {
    const [qrCode, setQrCode] = useState("initialState");

    const [articleUrl, setArticleUrl] = useState("");

    return (
        <Page title={"关联公众号"} className="live-relate-service">
            <div className="container">
                <div className="op-box">
                    {false && (
                        <>
                            <p className="name">千聊</p>
                            <div className="qrcode"></div>
                            <div className="btn-wrap">
                                <div className="btn">删除</div>
                                <div className="btn">重新获取</div>
                            </div>
                        </>
                    )}
                    {
                        <div className="article-link">
                            <textarea
                                placeholder="在此处粘贴自己公众号的任意一篇文章的链接"
                                value={articleUrl}
                                onChange={e => {
                                    setArticleUrl(e.target.value);
                                }}
                            />
                        </div>
                    }
                </div>
                <div className="btn-wrap">
                    <div className="btn">获取</div>
                </div>
                <div className="tip">
                    <p className="title">操作指南</p>
                    <p className="desc">
                        1、打开自己公众号的任何一篇文章
                        <br />
                        2、等文章加载完后，点击右上角菜单栏
                        <br />
                        3、在菜单中点击<span>【复制链接】</span>
                        <br />
                        4、将复制的链接粘贴到上方的框中，点击确定即可完成
                    </p>
                </div>
                <div className="btn-wrap bottom">
                    <div className="btn">确定</div>
                </div>
            </div>
        </Page>
    );
};

function mapStateToProps(state) {
    return {
        // userInfo: state.common.userInfo.user || {}
    };
}

const mapActionToProps = {
    // uploadImage,
    // updateUserInfo,
    // getUserInfoP
};

module.exports = connect(
    mapStateToProps,
    mapActionToProps
)(LiveRelateService);
