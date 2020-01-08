import React from 'react'
import InviterLists from '../../../../components/inviter-lists'
import FamilyCardDialog from '../../../../components/family-card-dialog'

const DiaLog = ({ title, btnTxt, onBtn, region }) => (
    <div className="uni-toast-box">
        <p>{ title }</p>
        <div className="btn on-log on-visible" 
            data-log-name={ title }
            data-log-region={ region }
            data-log-pos="0" onClick={ () => { !!onBtn && onBtn() } }>{ btnTxt }</div>
    </div>
)

const renderDialog = (cardStatus, onBtn) => {
    if(Object.is(cardStatus, 7)) {
        return (<DiaLog title="您已购买了大学体验营，无需领取，把机会让给其他新同学吧~！" btnTxt="好的" onBtn={ onBtn } />)
    } else
    if(Object.is(cardStatus, 1)) {
        return <DiaLog title="你来晚了，体验卡已经被其他小伙伴抢光了！" region="uni-go-camp" btnTxt="去看看大学体验营" onBtn={ onBtn } />
    } else if(Object.is(cardStatus, 3)) {
        return <DiaLog title="你已经是大学学员，享受所有大学权益，不需要体验卡。而且，还能免费赠送体验卡给好友哦！" region="uni-family-card-share" btnTxt="我也去送礼" onBtn={ onBtn } /> 
    }
}

const ReceiveDialog = ({ onBtn, cardStatus, isReceive, lists, onClose }) => {
    return (
        <FamilyCardDialog className="uni-rule-box" onClose={ onClose }>
            { isReceive && <>
                <h4 className="uni-inviter-title">他们抢到了</h4>
                <InviterLists lists={ lists } className="uni-inviter-min" />
            </> }
            { !isReceive && !!cardStatus && renderDialog(cardStatus, onBtn) }
        </FamilyCardDialog>
    )
}
export default ReceiveDialog