import React from 'react'
import FamilyCardDialog from '../../../../components/family-card-dialog'
import { formatDate } from 'components/util'; 

const FamilyDialog = ({ onFamilyClose, userList, expireTime, month }) => {
    return (
        <FamilyCardDialog className="uni-family-home" region="uni-family-card-dialog" onClose={ onFamilyClose }>
            <div className="uni-family-title"></div>
            <p><span>{ userList.map((item, index) => { return `“${ item.name }” ${ (userList.length -1) == index ? '' : '，' }` }) }</span> 通过你的亲友卡加入了女子大学啦！</p>
            <p>感恩你对知识和美好的传播，赠送你
                <p><strong>{ month }个月大学时长</strong>！</p>
            </p>
            <p className="last">大学有效期至{ formatDate(expireTime, 'yyyy-MM-dd') }</p>
            <div className="uni-family-decs">来自: 女子大学团队</div>
        </FamilyCardDialog>
    )
}

export default FamilyDialog;