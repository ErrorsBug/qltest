import React from 'react';
import { locationTo } from 'components/util';

const RecentlyStudied = ({ title, recentList, isExamJoin, btm }) => {
    return (
        <div className="recently-studied-box" 
            style={{marginBottom: `${ Number(btm || 48) / 78 }rem`  }}>
            <div className="recently-studied-header">
                <h4>{ title || '最近学习' }</h4>
                <p className="on-visible on-log"
                    data-log-name="我的课表"
                    data-log-region="un-course-list"
                    data-log-pos="0" 
                    onClick={ () => locationTo('/wechat/page/university/my-course-list') }>我的课表</p>
            </div>
            { !!recentList.length && (
                <ul className="recently-studied-lists">
                    { recentList.map((item, index) => (
                        <li className="on-visible on-log"
                            data-log-name={ item.title }
                            data-log-region="un-recently-studied"
                            data-log-pos={ index } 
                            key={ index } 
                            onClick={ () => locationTo(`/topic/details?topicId=${ item.courseId }&isUnHome=Y`) }>{ item.title }<span>{ item.progress || "学习中" }</span></li>
                    )) }
                </ul>
            )}
            { !recentList.length && (
                <>
                    { isExamJoin ? (
                        <p className="recently-no-data">暂无学习记录。同学们都开始了，就差你啦~</p>
                    ) : (
                        <div className="recently-no-data no-data">
                            暂无学习记录。不知道学什么？
                            <span onClick={ () => locationTo('/wechat/page/university/course-exam-list') }>点击测一下<i className="iconfont iconjiantou"></i></span>
                        </div>
                    ) }
                </>
            ) }
        </div>
    )
}

export default RecentlyStudied