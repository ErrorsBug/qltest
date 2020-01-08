import React, { useState, useEffect } from 'react' 
import DialogCourseDetails from '../../../components/dialog-course-details'
import { digitFormat, formatNumber } from 'components/util';

function CourseItem({ ti, keyA, title, keyB, keyC, keyD, keyE, liveChannelPo, liveEntityPo, channelId, onSelect, courseIds, maxDisCount, nodeCode }) {
    const [ loading, setLoading ] = useState(false)
    const courseObj = liveChannelPo || liveEntityPo || {}
    const isSelect = courseIds.includes(channelId)
    const price = keyB && Number(keyB) || 0;
    const offerPrice = (price * Number(maxDisCount.discount || 1)).toFixed(2)
    const numb = keyD  || 3689;
    return (
        <div className="cp-course-item">
            <DialogCourseDetails 
                businessId={channelId}  
                className="on-log on-visible" 
                data-log-name={'试听'}
                data-log-region="compose-activity-try-listen"
                data-log-pos={"0"}>  
                <div className="cp-course-info">
                    <div className="cp-course-pic">
                        <img src={ keyA } />
                        <p>{ digitFormat((Number(numb) + (Number(courseObj.authNum) || 0)))}人已抢购</p>
                    </div>
                    <div className="cp-course-decs">
                        <div>
                            <div className="cp-course-title">
                                <h4><i>{ ti }</i>{ title }</h4>
                                <p>最高立减{ formatNumber(price - offerPrice) }元<span>￥{ formatNumber(price) }</span></p>
                            </div>
                            <div className="cp-course-price">
                            <div className="price-desc">低至￥<b>{ formatNumber(offerPrice) }</b></div>
                            <div className={ `cp-course-btn on-log on-visible ${ !loading && isSelect ? 'select' : '' } ${!loading && !isSelect ? 'right-btn-animate' : ''}` } 
                                data-log-name="加入按钮"
                                data-log-region={ `compose-activity-btn-${ isSelect ? 'select' : 'unselect' }` }
                                data-log-pos={"0"}
                                onClick={ (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    !isSelect && setLoading(true)
                                    onSelect(channelId, keyB, title, nodeCode, true, () => {
                                        setTimeout(() => {
                                            setLoading(false)
                                        }, 1000);
                                    })
                                } }>
                                { loading ? <span className="loading iconfont iconloading"></span> : isSelect ? <span>取消</span> :  <span className="right">马上抢</span> }
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </DialogCourseDetails>

        </div>
    )
}

export default CourseItem