import React, { useState, useCallback, useEffect, useRef, Fragment } from 'react';
import RollingDownNav from 'components/rolling-down-nav';
import {getInviteList,getRankList} from '../../../../actions/experience'
import { formatDate, formatMoney, digitFormat } from 'components/util';
import BarrageActivity from '../barrage-activity';
import { createPortal } from 'react-dom'; 
import { getUrlParams } from 'components/url-utils';

/**
 * @description: 邀请排行榜item
 * @param {headImgUrl,userName,money,count,rank} 
 * @return: 
 */
export function RankItem({headImgUrl,userName,money,count,rank,className='',isUser}){
    return (
        <div className={`section5-item ${className}`}>
            {
                isUser?
                <div className={`section5-num`}>{rank==0?'未上榜':rank}</div>
                :<div className={`section5-num section5-num-${rank}`}>{rank>3?rank:''}</div>
            }
            <div className="section5-avator"><img src={headImgUrl||'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png'}/></div>
            <div className="section5-name">{userName||''}</div>
            <div className="section5-right">
                <div className="section5-right-num">邀请{digitFormat(count) }名好友</div>
                <div className="section5-right-btn">已赚{formatMoney(money) }元</div>
            </div>
        </div>
    )
}

export function InviteItem({headImgUrl,userName,money,createTime}){
    return (
        <div className="experience-camp-invite-item">
            <div className="section5-avator"><img src={headImgUrl||'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png'}/></div>
            <div className="section5-center">
                <div className="section5-name">{userName||''}</div>
                <div className="section5-time">已于{formatDate(createTime,'yyyy/MM/dd，hh:mm')}购买</div>
            </div>
            <div className="section5-money">￥{formatMoney( money )}</div>
        </div>
    )
}
/**
 * @description: 空状态
 * @param {type} 
 * @return: 
 */

export function ListEmpty({text,tip}){
    return (
        <div className="section5-empty">
            <img src="https://img.qlchat.com/qlLive/business/QAA369UA-L6L8-F156-1575949566087-FHCABM9W963G.png"/>
            <div className="empty-text">{text||'暂无数据'}</div>
            <div className="empty-tip">{tip||'邀请好友即可登顶成为最富的崽崽，还不快去?'}</div>
        </div>
    )
}

/**
 * @description: 列表
 * @param {type} 
 * @return: 
 */
function InviteRank({boardItem,campId}){
    const [currentIndex,setCurrentIndex] = useState(0)
    const [noMore,setNoMore] = useState(false)
    const [list,setList] = useState([]) 
    const [page,setPage] = useState({page:1,size:10}) 
    const [noMoreInvite,setNoMoreInvite] = useState(false)
    const [listInvite,setListInvite] = useState([]) 
    const [pageInvite,setPageInvite] = useState({page:1,size:10}) 
    const inviteRank = useRef(null);
    //切换tab
    const changeIndex = useCallback(
        (i) => {
            setCurrentIndex(i)
            if(inviteRank.current.getBoundingClientRect().top<0){
                inviteRank.current.scrollIntoView()
            }
        },
        [currentIndex,list,page],
    )
    const getList = useCallback(
        async () => {   
            currentIndex==0?getListRank():getListInvite() 
        },
        [currentIndex,page,pageInvite],
    )
    //获取排行榜
    const getListRank = useCallback(
        async () => {  
            const params={campId,...page}
            let {dataList} =await getRankList(params)
            if(!dataList){dataList=[]}
            if(dataList.length >= 0 && dataList.length < page.size){ 
                setNoMore(true)
            } 
            setList(page.page == 1?dataList:[...list,...dataList]) 
            window.loading(false)
        },
        [list,page],
    )
    //获取邀请列表
    const getListInvite = useCallback(
        async () => {  
            const params={campId,rank:'FIRST',...pageInvite}
            let {dataList} =await getInviteList(params)
            if(!dataList){dataList=[]}
            if(dataList.length >= 0 && dataList.length < pageInvite.size){ 
                setNoMoreInvite(true)
            } 
            setListInvite(pageInvite.page == 1?dataList:[...listInvite,...dataList]) 
            window.loading(false)
        },
        [listInvite,pageInvite],
    )
    //加载更多
    const getNext = useCallback(
        async (i) => { 
            window.loading(true)
            currentIndex==0?setPage({...page,page:page.page + 1}):setPageInvite({...pageInvite,page:pageInvite.page + 1})
        },
        [currentIndex,page,pageInvite],
    )
    useEffect(() => {
        getList()
    }, [currentIndex,page,pageInvite])
    return (
        <div className="invite-rank" ref={inviteRank}>
            <div className="experience-camp-invite-container">
                <RollingDownNav
                    scrollNode="experience-camp-invite-scroll-box"
                    innerClass="ch-section5-inner"
                    outerClass={ `ch-section5-outer` }>
                        <div className="section5-top">
                            <div onClick={()=>changeIndex(0)} className={currentIndex==0?'active':''}>邀请排行榜</div>
                            <div onClick={()=>changeIndex(1)} className={currentIndex==1?'active':''}>我的邀请</div>
                        </div>
                </RollingDownNav>
                    
                {
                    currentIndex==0&&
                    (list.length>0?
                    <Fragment>
                        {
                            boardItem&&<RankItem {...boardItem} isUser className="invite-rank-my"/>
                        }
                        {
                            list.map((item,index)=>{
                                return (
                                    <RankItem {...item} key={index}/>
                                )
                            })
                        }
                        <div className="section5-more" onClick={getNext}>
                            {
                                !noMore&&list.length<100?
                                <Fragment>
                                    展开更多<i className="iconfont iconxiaojiantou"></i>
                                </Fragment>
                                :'没有更多了'
                            }
                        </div>
                    </Fragment>
                    :
                    <ListEmpty/>)
                }
                {
                    currentIndex==1&&
                    (listInvite.length>0?
                    <Fragment>
                        {
                            listInvite.map((item,index)=>{
                                return (
                                    <InviteItem {...item} key={index}/>
                                )
                            })
                        }
                        <div className="section5-more" onClick={getNext}>
                            {
                                !noMoreInvite?
                                <Fragment>
                                    展开更多<i className="iconfont iconxiaojiantou"></i>
                                </Fragment>
                                :'没有更多了'
                            }
                        </div>
                    </Fragment>
                    :
                    <ListEmpty text='暂无邀请记录' tip='邀请好友奖金拿不停，还有礼品奖励哟，快去邀请'/>)
                } 
            </div>
            {
                list.length>0&&createPortal(
                    <BarrageActivity  
                        className={'jion-experience-page-status-center'} 
                        list={list}
                    />
                    ,document.getElementById('app'))
            }   
        </div>
    )
}
export default InviteRank;