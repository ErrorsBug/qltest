import React, { useCallback, useMemo, useState, Fragment } from 'react'
import ReactSwiper from 'react-id-swiper'
import { locationTo } from 'components/util';
import PublicTitleImprove from '../../../../components/public-title-improve'
import Picture from 'ql-react-picture'
import { excellentAlumniFocus, excellentAlumniUnfocus} from '../../../../actions/community'
import { getCookie } from 'components/util';
import { getUrlParams } from 'components/url-utils';
import { MiddleDialog } from 'components/dialog';
import { createPortal } from 'react-dom'
import ShowQrcode from '../../../../components/show-qrcode'

const handleMoreLink = (childHandleAppSecondary) => {
    childHandleAppSecondary(`/wechat/page/community/excellent-person`);
}
const handlePersonLink = (e,userId,childHandleAppSecondary) => {
    e.preventDefault()
    e.stopPropagation()
    // 跳转到个人主页
    childHandleAppSecondary(`/wechat/page/university/community-home?studentId=${userId}`);
}

function AliumniItem(props) {
    const isMine = props.currentUserId == props.userId ? true : false;
    const [isShowQrcode, setIsShowQrcode] = useState(false);
    const [pubBusinessId, setPubBusinessId] = useState(null);
    let { handlerSingleStudentInfo, trigleShowTip, zIndex} = props
    /**
     * handleFocus:处理点击取消关注/已关注/相互关注逻辑处理
     * params:e：事件；currentType（当前状态）:true已经关注，false未关注；targetId：关注/取关用户的id；index：数组在数组中的下标
     * desc:当前未关注调用关注，当前关注就调用取消关注，处理完成后重新渲染列表
     */
    let handleFocus = useCallback((e, currentType, targetId,index) => {
        e.preventDefault()
        e.stopPropagation()
        const userId = getUrlParams('studentId','')|| getCookie('userId')
        let requestParams = {
            source:'ufw',
            followId:targetId,
            userId:userId,
        }
        if(currentType){
            excellentAlumniUnfocus(requestParams).then(() => {
                window.toast("取消成功")
                handlerSingleStudentInfo(targetId,index)
            })
        }else{
            excellentAlumniFocus(Object.assign(requestParams,{ notifyStatus:'Y'})).then(res => {
                window.toast("关注成功")
                handlerSingleStudentInfo(targetId,index)
                setIsShowQrcode(true)
                setPubBusinessId(targetId)
            })
        }
    }, [pubBusinessId])
    let closeQrcode = useCallback(() => {
        setIsShowQrcode(false)
    }, [isShowQrcode])
    return (
        <Fragment>
            <div className="el-aliumni-item on-visible on-log" 
                data-log-name="进入个人主页"
                data-log-region="community-center-user-home"
                data-log-pos="0"   
                onClick={(e) => {handlePersonLink(e,props.userId,props.childHandleAppSecondary)}}>
                <div className="el-aliumni-pic">
                    <div className="el-aliumni-pic-center">
                        <Picture src={props.userHeadImg} resize={{ w: 92,h: 92 }}/>
                        {
                            props.verified&&<i className="iconfont iconguanfang"></i>
                        }
                    </div>
                </div>
                <h4>{props.userName}</h4>
                <div className="el-aliumni-mark">
                    {props.userTagList && props.userTagList.filter((item,i) => i < 2 ).map(ele => <p key={ele.id}>{ele.name}</p>)}
                </div>
                {
                    isMine ?  '' : (props.mutualFocus === 'Y' ?
                    <div className="el-aliumni-btn att" onClick={(e) => {handleFocus(e,true,props.userId,zIndex)}}>互相关注</div> : 
                    props.isFocus === 'Y' ?
                    <div className="el-aliumni-btn att" onClick={(e) => {handleFocus(e,true,props.userId,zIndex)}}>已关注</div> : 
                    <div className="el-aliumni-btn on-visible on-log" 
                        data-log-name="关注"
                        data-log-region="community-center-attention"
                        data-log-pos={props.userId}    
                        onClick={(e) => {handleFocus(e,false,props.userId,zIndex)}}><i className="iconfont icontianjia"></i> <span>关注</span></div>)
                }
            </div>
            {
                isShowQrcode&&<ShowQrcode close={closeQrcode} pubBusinessId={props.userId}/>
            }
            
        </Fragment>
    )
}

const opts = {
    slidesPerView: 'auto',
    // spaceBetween: 16,
}

function ExcellentAlumni({ studentTopList, handlerSingleStudentInfo, excellentNodeMsg ,currentUserId ,childHandleAppSecondary}) {
    const [isShowTip, setIsShowTip] = useState(false);
    let close = useCallback(() => {
        setIsShowTip(false)
    },[isShowTip])
    let trigleShowTip = useCallback(() =>{
        setIsShowTip(true)
    },[isShowTip])
    return (
        <div className="el-aliumni-box">
            <PublicTitleImprove
                className='el-aliumni-title'
                title={ excellentNodeMsg?.title }
                moreTxt="更多"
                region="community-center-aliumni-more"
                decs={excellentNodeMsg?.keyA}
                handleMoreLink={ ()=> handleMoreLink(childHandleAppSecondary) }/>
            <ReactSwiper {...opts}>
                { studentTopList.map((item, index) => (
                    <div key={ index }>
                        <AliumniItem {...item} zIndex={ index } trigleShowTip={trigleShowTip} handlerSingleStudentInfo={handlerSingleStudentInfo} currentUserId={currentUserId} childHandleAppSecondary={childHandleAppSecondary}/>
                    </div>
                )) }
                <div>
                    <div className="el-aliumni-item el-more on-visible on-log" 
                        data-log-name="去发现"
                        data-log-region="community-center-container-find"
                        data-log-pos="0"  
                        onClick={ ()=> handleMoreLink(childHandleAppSecondary) }>
                        <div className="el-aliumni-pic">
                            <div className="el-aliumni-pic-center">
                                <Picture src="https://img.qlchat.com/qlLive/business/XV84L2PP-J9JB-JIKS-1575274411429-FHI95HFJ8ONE.png" resize={{ w: 92,h: 92 }}/>
                            </div>
                        </div>
                        <div className="el-aliumni-content">
                            <p>发现更多</p>
                            <p>优秀校友</p>
                        </div>
                        <div className="el-aliumni-btn el-aliumni-find">去发现</div>
                    </div>
                </div>
            </ReactSwiper> 
        </div>
    )
}

export default ExcellentAlumni