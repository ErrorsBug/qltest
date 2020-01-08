import React, { Component } from "react";
import { locationTo } from "components/util";
import "./style.scss";

const MyStudentBottomTab = ({ liveId, newMessageCount }) => {
    return (
        <div>
            <div className="live-footer">
                <div className="footer-block-wrap">
                    <a
                        className="footer-block on-log"
                        data-log-region="live-footer-admin"
                        onClick={e => {
                            e.preventDefault();
                            locationTo(`/wechat/page/live/${liveId}`);
                        }}
                    >
                        首页
                    </a>
                </div>
                <>
                    <div className="footer-block-wrap">
                        <a
                            className="footer-block on-log"
                            data-log-region="live-footer-admin"
                            onClick={e => {
                                e.preventDefault();
                                locationTo(
                                    `/wechat/page/backstage?liveId=${liveId}&qlfrom=qledu`
                                );
                            }}
                        >
                            工作台
                        </a>
                    </div>

                    <div id="newCourseBtn"></div>

                    <div className="footer-block-wrap">
                        <a
                            className="footer-block active on-log"
                            // data-log-region="live-footer-student"
                            onClick={e => {
                                e.preventDe / fault();
                                locationTo(
                                    `/wechat/page/my-student?liveId=${liveId}`
                                );
                            }}
                        >
                            学员
                        </a>
                    </div>
                    <div className="footer-block-wrap">
                        <a
                            className="footer-block on-log"
                            // data-log-region="live-footer-student"
                            onClick={e => {
                                e.preventDefault();
                                locationTo(
                                    `/wechat/page/notice-center?liveId=${liveId}`
                                );
                            }}
                        >
                            {
                                (newMessageCount !== undefined && newMessageCount !== null && newMessageCount > 0) ? 
                                (<span className="redspot">
                                    {newMessageCount > 99 ? '99+' : newMessageCount}
                                </span>)
                                : 
                                null
                            }
                            消息
                        </a>
                    </div>
                </>
                ) )}
            </div>
        </div>
    );
};

export default MyStudentBottomTab;
