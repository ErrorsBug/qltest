import React from 'react'
import FamilyCardDialog from '../../../../components/family-card-dialog'

const RuleDialog = ({ onClose, cardNum, UFW_CARD_INVITER_ADD_MONTH, UFW_CARD_INVITEE_ADD_MONTH, UFW_CARD_COUPON_AMOUNT }) => {
    return (
        <FamilyCardDialog 
            onClose={ onClose }
            className="uni-rule-box">
            <div className="rl-rule-info">
                <ul>
                    <li>1、亲友卡是大学学员的专享福利，可以送给你身边有需要的女性好友免费体验大学(您有{ cardNum || 0 }张，可送给{ cardNum || 0 }位亲友);</li>
                    <li>2、好友领取后，可免费参加任意一个大学体验营（价值299元）;</li>
                    <li>3、领取后，好友还可获得<strong>{ UFW_CARD_COUPON_AMOUNT || 0 }元</strong>入学基金，购买大学时可以直接抵扣;</li>
                    <li>4、好友入学后，你可额外获得<strong>{ UFW_CARD_INVITER_ADD_MONTH || 0 }个月</strong>的大学时长，ta也可获得<strong>{ UFW_CARD_INVITEE_ADD_MONTH || 0 }个月</strong>时长。</li>
                </ul>
                <div className="rl-rule-flow">
                    <img src={ require('../../img/icon-flow.png') } />
                </div>
            </div>
        </FamilyCardDialog>
    )
}
export default RuleDialog