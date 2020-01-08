import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import DirectoryPage from '../directory-page'
import CampPage from '../camp-page'
import AimsPage from '../aims-page'
import NotesPage from '../notes-page'
import PaperPage from '../paper-page'
import classnames from 'classnames'

// 翻书配置
const options =  {
    autoCenter: true,
    display: "single",
    acceleration: true,
    elevation: 100,
    duration: 800,
    gradients: true,
    when: {
        turned: function(e, page) {
            console.log("Current view: ", $(this).turn("view"));
        }
    }
}

// 翻书
function Turn({ options, className = '', children }) {
    useEffect(() => {
        setTimeout(() => {
            $('#turn').turn(options)
        }, 10)
    }, [])
   
    return (
        <div className={ `turn-box ${className}` } id="turn">{children}</div>
    );
}

// 笔记内页
function PageTurn({ className, children, nextPage, isShow, campName, isCamp, isHide, shareInfo, onShareImg, isSelf }) {
    const targetRef = useRef(null)
    const cls = useMemo(() => {
        return classnames('page-ture-box', className, {
            'dir': !isShow
        })
    }, [className])
    // 处理
    const handlePage = useCallback((e) => {
        e.stopPropagation();
        e.preventDefault();
        if(targetRef.current.contains(e.target)) {
            const totlePage = $('#turn').turn('pages')
            const curPage = $('#turn').turn('page')
            const w = $('#turn')[0].offsetWidth / 2
            const wW = document.body.clientWidth;
            const appW = document.querySelector("#app").clientWidth
            const cW = (wW - appW) / 2
            if(w <= (e.clientX - 100 - cW)) {
                if(curPage + 1 <= totlePage) {
                    $('#turn').turn('page', curPage + 1)
                } else {
                    
                    window.toast('已经是最后一页')
                }
            } else {
                if(curPage >=2 ) {
                    $('#turn').turn('page', curPage - 1)
                }
            }
        }
    },[])
    return (
        <div className={ cls }>
            <div className="page-ture-cont" ref={ targetRef } onClick={ handlePage }>
                { isSelf && isShow && (<div className="turn-share" onClick={ (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onShareImg(shareInfo)
                } }></div>) }
                { children }
                { !isHide && (
                    <div className={ `page-ture-footer ${ isCamp ? '' : 'flex-end' }` }>
                        { isCamp && (<p>{campName }</p>) }
                        {/* <span onClick={ (e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            nextPage()
                        } }><i className="iconfont iconyoujiantou"></i></span> */}
                    </div>
                ) }
            </div>
        </div>
    )    
}

/**
 * 渲染页面
 * @param {*} 
 * @returns
 */
function renderPage(type, otherPage, userInfo, nextPage, isSelf, isQlchat){
    if(Object.is(type, "direct") || Object.is(type, "reservation")) {
        return <CampPage userInfo={ userInfo } nextPage={ nextPage } { ...otherPage } />
    }
    if(Object.is(type, 'target')) {
        return <AimsPage isSelf={ isSelf && !isQlchat } userInfo={ userInfo } {...otherPage} />
    }
    if(Object.is(type, 'paper')) {
        return <PaperPage userInfo={ userInfo } {...otherPage} />
    }
    return <NotesPage isSelf={ isSelf } userInfo={ userInfo } {...otherPage} />
}

/**
 * 书本
 * @export
 * @param {*} { dirList, turnList }
 * @returns
 */
export default function Book ({ dirList, turnList, userInfo, onShareImg, isSelf, isQlchat }) {
    const [opt, setOpt] = useState(null);
    const bookRef = useRef(null);
    useEffect(() => {
       setTimeout(() => {
            if(bookRef.current) {
                const { width, height } = bookRef.current.getBoundingClientRect();
                setOpt({
                    width, height
                })
            }
       }, 10);
    }, [])
    // 点击进入下一页
    const nextPage = (e) => {
        if(e){
            e.stopPropagation();
            e.preventDefault();
        }
        const totlePage = $('#turn').turn('pages')
        const curPage = $('#turn').turn('page')
        if(curPage + 1 <=  totlePage) {
            $('#turn').turn('page', curPage + 1)
        } else {
            window.toast('已经是最后一页')
        }
    }
    // 进入指定页面
    const specifyPage = (index) => {
        $('#turn').turn('page', index)
    }
    const list = useMemo(() => dirList, [dirList])
    const pages = useMemo(() => turnList, [turnList])
    return (
        <div className="eb-book-box">
            <div className="eb-book-cont" ref={ bookRef }>
                <div className="eb-book-bg"></div>
                { opt && !!pages.length && (
                    <Turn options={{ ...options, ...opt }}>
                        <PageTurn key={ 1000 } className="dir" nextPage={ nextPage } isSelf={ isSelf && !isQlchat }>
                            <DirectoryPage 
                                isSelf={ isSelf }
                                specifyPage={ specifyPage } 
                                list={ list } />
                        </PageTurn>
                        {pages.map((item, index) => (
                            <PageTurn 
                                isSelf={ isSelf && !isQlchat }
                                isCamp
                                isHide={ Object.is(item.type, "direct") || Object.is(item.type, "reservation")}
                                isShow={ (!!item.studyCampCheckInDto && !item.type) || Object.is(item.type, "paper")  } 
                                campName={ item.campName } 
                                key={index} 
                                shareInfo={ item }
                                onShareImg={ onShareImg }
                                nextPage={ nextPage }>
                                { renderPage(item.type, item, userInfo, nextPage, isSelf, isQlchat) }
                            </PageTurn>
                        ))}
                    </Turn>
                )}
                { !pages.length && <div className="eb-no-data">暂无笔记</div> }
            </div>
        </div>
    )
}