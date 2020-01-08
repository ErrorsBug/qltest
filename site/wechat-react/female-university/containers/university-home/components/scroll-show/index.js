import React from 'react'
import { locationTo } from 'components/util';
import PortalCom from '../../../../components/portal-com'
import Search from '../../../../components/search'

const ScrollShowInfo = ({ userName, url, className, isShow, isAnimite, onAnimationEnd }) => {
    return (
        <PortalCom className={ `scroll-box ${ className }` }>
            <div className="nu-user-portal">
                <div className="nu-user-info on-log" 
                    data-log-name="个人主页"
                    data-log-region="un-community-home"
                    data-log-pos="1"
                    onClick={ () => {
                        locationTo('/wechat/page/university/community-home')
                    } }>
                    <img src={ url } />
                    <p><span>个人主页</span></p>
                </div>
                <div className="nu-user-btn">
                    <Search />
                    <div onAnimationEnd={ onAnimationEnd } className={ `icon-join on-log ${ isAnimite ? 'must-animate' : '' }` } 
                        data-log-name="我的课表"
                        data-log-region="un-myCourse-btn"
                        data-log-pos="0"
                        onClick={ () => locationTo(`/wechat/page/university/my-course-list`) }>我的课表</div>
                </div>
            </div>
        </PortalCom>
    )
}

export default ScrollShowInfo;