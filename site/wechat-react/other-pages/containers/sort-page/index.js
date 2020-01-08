const isNode = typeof window == "undefined";

import React, { Component, useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router";
import ScrollToLoad from "components/scrollToLoad";
import Page from "components/page";
import CourseList from "./components/course-list";
import { locationTo, updatePageData, isNumberValid } from "components/util";
import { request } from "common_actions/common";

// actions
// import {
//     getChannelSort,
//     saveChannelSort,
//     changeChannelSort
// } from "../../actions/channel-list-sort";

const KEY_MAP = {
    camp: {
        getUrl: "/h5/camp/new/listCamp",
        saveUrl: "/h5/camp/new/saveCampSort",
        saveParam: "campList",
        data: "dataList",
        weight: "weight"
    },
    liveCamp: {
        getUrl: "/h5/live/camp/getLiveCampForSort",
        saveUrl: "/h5/live/camp/saveLiveCampSort",
        saveParam: "liveCampList",
        data: "liveCampList",
        weight: "sortWeight"
    }
};

const PAGE_SIZE = 20;

const CourseSort = ({ channelList, location }) => {
    const [isNoMoreChannelData, setIsNoMoreChannelData] = useState(false);

    const [list, setList] = useState([]);

    const [curPage, setCurPage] = useState(1);

    const getCourseList = useCallback(async page => {
        let url = `/api/wechat/transfer${
            KEY_MAP[location.query.type]["getUrl"]
        }`;
        const res = await request({
            url,
            method: "POST",
            body: {
                liveId: location.query.liveId,
                page: {
                    page,
                    size: PAGE_SIZE
                }
            }
        });
        if (res.state.code === 0) {
            const newList = res.data[KEY_MAP[location.query.type]["data"]];
            setList([...list, ...newList]);
            setCurPage(page);
            if (newList.length < PAGE_SIZE) {
                setIsNoMoreChannelData(true);
            }
        }
    });

    const saveCourseSort = useCallback(async () => {
        let url = `/api/wechat/transfer${
            KEY_MAP[location.query.type]["saveUrl"]
        }`;
        const res = await request({
            url,
            method: "POST",
            body: {
                liveId: location.query.liveId,
                [KEY_MAP[location.query.type]["saveParam"]]: list.map(item => ({
                    id: item.id,
                    [KEY_MAP[location.query.type]["weight"]]: Number(
                        item[KEY_MAP[location.query.type]["weight"]]
                    )
                }))
            }
        });
        if (res.state.code === 0) {
            locationTo(`/wechat/page/live/${location.query.liveId}`);
        }
        window.toast(res.state.msg);
    });

    const ge = useCallback((courseId, weight) => {
        var cList = list;

        var result = cList.map(course => {
            if (course.id == courseId) {
                course[KEY_MAP[location.query.type]["weight"]] = weight;
            }
            return course;
        });
        return result;
    });

    const changeCourseSort = useCallback((courseId, weight) => {
        var result = ge(courseId, weight);
        setList(result);
    });

    useEffect(() => {
        getCourseList(curPage);
    }, []);

    return (
        <Page title={`系列课排序`} className="channel-sort">
            <ScrollToLoad
                className="sort-box"
                toBottomHeight={100}
                loadNext={async done => {
                    await getCourseList(curPage + 1);
                    done();
                }}
                noMore={isNoMoreChannelData}
            >
                <span className="top-tips">
                    在框内输入整数，数字越大排序越靠前，不填时则按默认排序，最早开课排前面。
                </span>
                <CourseList items={list} changeSort={changeCourseSort} sortKey={KEY_MAP[location.query.type]["weight"]} />
            </ScrollToLoad>
            <div className="btn-box">
                <a
                    className="btn-save"
                    href="javascript:;"
                    onClick={saveCourseSort}
                >
                    保存
                </a>
            </div>
        </Page>
    );
};
function mapStateToProps(state) {
    return {
    };
}

const mapActionToProps = {
};

module.exports = connect(mapStateToProps, mapActionToProps)(CourseSort);
