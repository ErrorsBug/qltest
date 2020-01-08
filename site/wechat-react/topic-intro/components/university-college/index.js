import React from 'react'
import { locationTo } from 'components/util';

const UniversityCollege = ({ collegeName, collegeIcon, subjectNum, courseNum, collegeCode, collegeColor = '', pos="topic" }) => {
    return(
        <div className="uni-college-box on-log on-visible" 
            data-log-name={ collegeName }
            data-log-region={ `collegeCode` }
            data-log-pos={ pos }
            onClick={ () => {
                locationTo(`/wechat/page/university/college-detail?nodeCode=${ collegeCode }`)
            } }>
            <div className="uni-college-bg" style={{ background: collegeColor}}></div>
            <div className="uni-college-info">
                <div className="uni-college-img">
                    <img src={ collegeIcon } />
                </div>
                <div className="uni-college-cont">
                    <h4 style={{ color: collegeColor }}>女子大学·{ collegeName }</h4>
                    <p style={{ color: collegeColor }}>{ subjectNum }个学科 | { courseNum }门课程</p>
                </div>
            </div>
            <div className="uni-college-btn"
                style={{ color: collegeColor, borderColor: collegeColor }}
            >进入学院</div>
        </div>
    )
}
 
export default UniversityCollege