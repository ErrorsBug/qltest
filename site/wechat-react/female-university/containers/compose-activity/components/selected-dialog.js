import React from 'react' 
import PortalCom from '../../../components/portal-com';
import { formatNumber, fomatFloat } from 'components/util';

function SelectedDialog({  hideSelect, removeSelect, courseList, curDisCount }) {
    return (
        <PortalCom className="cp-selected-box">
            <div className="cp-selected-cont">
                <div className="cp-selected-close" onClick={ hideSelect }><i className="iconfont iconxiaoshanchu"></i></div>
                <h4>已选课程</h4>
                <div className="cp-selected-lists">
                    <div>
                        { courseList.map((item, index) => (
                            <div key={ index } className="cp-course-item">
                                <p>{ index + 1 }. { item.title }</p>
                                <div className="cp-course-controll">
                                    <p>￥{ formatNumber(fomatFloat(Number(item.price).mul(Number(curDisCount)))) }</p>
                                    <div className="remove" onClick={ () => {
                                        removeSelect(item.id, item.price)
                                    } }><i className="iconfont iconxiaoshanchu"></i></div>
                                </div>
                            </div>
                        )) }
                        { !courseList.length && <div className="cp-no-data">快去选择课程吧！</div> }
                    </div>
                </div>
            </div>
        </PortalCom>
    )
}

export default SelectedDialog