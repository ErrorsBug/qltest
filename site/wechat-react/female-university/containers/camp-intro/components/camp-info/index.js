import React, { Fragment } from 'react'
import LnCourseLimit from '../../../../components/ln-course-info/limit'
import ApplyUserList from '../../../../components/apply-user-list'
import XiumiEditorH5 from "components/xiumi-editor-h5";
import Picture from 'ql-react-picture';
import StudyPlanBtn from '../../../../components/study-plan-btn'
import { formatDate, digitFormat, htmlTransferGlobal } from 'components/util';
import classnames from 'classnames'

/**
 * 学习营简介
 * @param {*} {}
 * @returns
 */
function CampInfo({ signupStartTime, signupEndTime, status, showTip, courseDescr, universityCourseDtos, isQlchat, handleLink,
        startTime, endTime,studentLimit=0,signUpNum=0, introduction, name, typeSts, signUpUserList, ...otherProps }) {
    const cls = classnames('cf-info-qi', {
        "hot":  Object.is(typeSts, 'B'),
        "gray": signUpNum >= studentLimit,
    })
    return (
        <Fragment>
             <div className="cf-info-box">
                <div className="cf-info-camp">
                    <div className={ cls }>第{name}期 { signUpNum >= studentLimit ? '名额已抢光' : Object.is(typeSts, 'B') ? '火热报名中' : '即将招生' }</div>
                    <div className="ln-course-play">报名时间：{formatDate(signupStartTime, 'MM/dd hh:mm')} - {formatDate(signupEndTime, 'MM/dd hh:mm')} (北京时间)</div>
                    <div className="ln-course-start-time"> 
                        <span className="ln-course-dx">带学时间: {formatDate(startTime, 'MM/dd')} - {formatDate(endTime, 'MM/dd')} </span>
                        <div  className="ln-course-start-num">
                            {
                                (signUpNum)>=studentLimit?
                                <LnCourseLimit text={`限${studentLimit}人，`} point="">已抢完</LnCourseLimit>
                                :(signUpNum)>0?
                                <Fragment>
                                    <div className="ln-course-flex">
                                        <ApplyUserList className={`ln-course-user`} userList={ signUpUserList } userCount={ signUpNum } isHideUserCount/>
                                        <LnCourseLimit text={`限${studentLimit}人，仅剩 `}>{studentLimit-(signUpNum)}</LnCourseLimit>
                                    </div>
                                </Fragment>
                                :
                                <LnCourseLimit>{studentLimit}</LnCourseLimit>
                            }
                            {
                                !isQlchat && typeSts=='A'&& (
                                    <div className="ln-course-experi-time on-visible on-log"
                                        data-log-name="报名提醒"
                                        data-log-region="un-course-experi-time"
                                        data-log-pos="0"
                                        onClick={showTip}>报名提醒</div>
                                )
                            }
                        </div>
                    </div>
                </div> 
                <div className="camp-intro-detail">
                    <div className="camp-intro-line">
                        <XiumiEditorH5 content={ htmlTransferGlobal(introduction) } />
                    </div>
                    <h4>{ courseDescr || '带学内容' }</h4>
                    { universityCourseDtos?.map((item, index) => (
                        <div className="camp-intro-relation" key={ index } onClick={ () => handleLink(item) }>
                            <div className="camp-intro-img">
                                <Picture src={ item.headImgUrl || '' } placeholder={true} resize={{ w: 120,h: 150 }} />
                            </div>
                            <div className="camp-intro-g">
                                <div>
                                    <h5>{ item.title }</h5>
                                    <p>{ item.teacher }</p>
                                    <div className="camp-join-btn">
                                        <span>{ digitFormat(item.browseNum || 0) }次学习 | { Object.is(item.courseType, 'channel') ? (item.topicCount || 0) : '单' }课</span>
                                        <StudyPlanBtn className="block" { ...item } { ...otherProps } isJoin={ Object.is(item.isJoin, 'Y') } />
                                    </div>
                                </div>
                            </div> 
                        </div>
                    )) }
                </div>
            </div>
        </Fragment>
    )
}

export default CampInfo;