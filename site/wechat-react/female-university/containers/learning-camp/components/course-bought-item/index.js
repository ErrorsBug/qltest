import React from 'react'
import Picture from 'ql-react-picture'
import { locationTo, formatDate } from 'components/util'

const CourserBoughtItem = ({periodName,type,title,createTime,startTime,endTime, imgUrl,periodId,idx,groupUrl,toGroup, campId }) => {
    const time = new Date().getTime()
    
    return (
        <div className="ln-course-bought-item">
            <div className="ln-course-bought-time">{formatDate(createTime)} {type=='direct'?'成功':'预约'}报名</div>
            <div onClick={ () => locationTo(`/wechat/page/university/camp-intro?campId=${ campId }`) }>
                <div className="ln-course-bought-main">
                    <div className="ln-course-bought-content">
                        <div>
                            <Picture src={ imgUrl||'' } placeholder={true} resize={{w:198, h: 124 }}/>
                        </div>
                        <div className="ln-course-bought-content-right">
                            <div className="ln-course-bought-content-title">
                                <span>第{periodName}期</span>{title}
                            </div>
                            <div className="ln-course-bought-content-time">
                            学习时间：{formatDate(startTime, 'MM/dd')} - {formatDate(endTime, 'MM/dd')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                time>startTime&&time<endTime&&groupUrl&&
                <div className="ln-course-bought-btn on-log on-visible"
                    data-log-name={ title }
                    data-log-region="un-course-bought-btn"
                    data-log-pos={ periodId }
                    data-log-index={ idx }
                    onClick={()=>{toGroup(groupUrl,periodId)}}>
                    <img src="https://img.qlchat.com/qlLive/business/ECO4NZZH-X1ND-T979-1572856793264-GD4X3PUDJQI6.png"/> <span>加入学习群 </span> <i className="iconfont iconxiaojiantou"></i>
                </div>
            }
        </div>
    )
}

export default CourserBoughtItem