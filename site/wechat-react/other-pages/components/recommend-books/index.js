import React, {  } from 'react'
import Picture from 'ql-react-picture'
import { digitFormat, locationTo } from 'components/util';
import {authFreeCourse } from "common_actions/common";

function RecommendItem ({ keyA, keyB, keyC, keyD, index, keyK, keyL, nodeCode, title }) {
    return (
        <div className="ls-recommend-item on-log on-visible"
            data-log-region="recommend-item"
            data-log-pos={index}
            data-log-name={keyA}
            data-index={index}
            onClick={()=>{
                locationTo(`/wechat/page/book-details?nodeCode=${nodeCode}&sourceType=bookSet`)
            }}
        >
            <div className="ls-recommend-img">
                <Picture 
                    src={keyC} 
                    placeholder={true}
                    resize={{w: 158,h: 158}}/>
            </div>
            <div className="ls-recommend-1">
                <div>
                    <div className="ls-recommend-info">
                        <h4>{ title }</h4>
                        <p>{ keyD }</p>
                    </div>
                    <div className="ls-recommend-data">共{ keyK }本 | { digitFormat(keyL) }次学习</div>
                </div>
            </div>
        </div>
    )
}
export default RecommendItem