import React from 'react'
import {digitFormat} from 'components/util';

const ApplyUserList = ({ userCount, userList = [], className="",isHideUserCount }) => {
    if(!userList.length) return null;
    return (
        <div className={ `apply-user-list ${ className }` }>
            {  userList.slice(0,3).map((item, index) => (
                <i key={ index } style={{ zIndex: (4 - index) }}><img src={ item.headImgUrl || item } /></i>
            )) }
            { userList.length >= 3 && <i className="apply-user-more"></i> }
            {
                !isHideUserCount&&<span>{ digitFormat(userCount) }人已报名</span>
            }
            
        </div>
    )
}

export default ApplyUserList