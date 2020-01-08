import React, { useRef, useEffect, useState, useCallback } from 'react'

/**
 * 子目录
 * @param {*} { boxObj, changeChild, nextPage, idx, childList, len, title }
 * @returns
 */
function DirItem({ boxObj, changeChild, specifyPage, idx, childList, len, title, month, isFirstShow }) {
    const [h, setH] = useState(0)
    const [isShow, setIsShow] = useState(false)
    const childRef = useRef(null)
    const dayRef = useRef(null)
    // 显示子目录
    const showDir = useCallback((e) => {
        if(e){
            e.stopPropagation();
            e.preventDefault();
        }
        let flag = false
        if(childRef.current && !isShow){
            const { bottom } = childRef.current.getBoundingClientRect();
            const hei = dayRef.current.clientHeight;
            const { height, bottom: btm } = boxObj;
            flag = true
            const h1 = height - (bottom - (btm - height))
            const newHei = hei > h1 ? h1 : hei;
            setH(newHei)
        }
        setIsShow(flag)
        changeChild(flag)
    }, [boxObj, isShow, h])
    useEffect(() => {
        if(isFirstShow && boxObj) {
            showDir()
        }
    }, [isFirstShow, boxObj])
    return (
        <div className="eb-dir-item">
            <h5>{ month }月</h5>
            <div className="eb-dir-title">
                <p 
                    className={ isShow ? 'action' : '' } 
                    ref={ childRef } 
                    onClick={ (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        specifyPage(( len + idx + 2 ))
                    } }>
                    <i className="iconfont iconxiaojiantou-copy" onClick={ showDir }></i><span>{ title }</span>
                </p>
                <div className="eb-dir-child"  style={{ height: `${ isShow ? h : '0' }px` }}>
                    <div ref={ dayRef }>
                        { childList.map((item, index) => (
                            <p key={ index } onClick={ (e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                specifyPage(( len + index + 3 ))
                            } }>
                                <span className={ !item.type && !item.studyCampCheckInDto ? 'unstart' : '' }>{ Object.is(item.type, 'target') ? item.title : `Day ${ index } ${ item.title }` }</span>
                            </p>
                        )) }
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * 电子书目录
 * @export
 * @returns
 */
export default function DirectoryPage({ specifyPage, list, isSelf }) {
    const boxRef = useRef(null)
    const [nodeObj, setNodeObj] = useState()
    const [hide, setHide] = useState(false)
    useEffect(() => {
        if(boxRef.current){
            setTimeout(() => {
                const obj = boxRef.current.getBoundingClientRect();
                setNodeObj(obj)
            },10)
        }
    }, [])
    // 禁止滚动
    const changeChild = useCallback((flag) => {
        setHide(flag)
    }, [hide])
    return (
        <div className="eb-dir-box" ref={ boxRef }>
            <h4>{ isSelf ? '我' : 'TA' }的蜕变成长路径</h4>
            <div className="eb-dir-cont" style={{ overflowY : `${hide ? 'hidden' : 'auto'}` }}>
                { list.map((item, index) => (
                    <DirItem 
                        key={index} 
                        boxObj={ nodeObj } 
                        len={ item.len } 
                        idx={ index } 
                        isFirstShow={ !index && list.length == 1 }
                        changeChild={ changeChild } 
                        childList={ item.subjects || [] } 
                        title={ item.title }
                        month={ new Date(item.createTime).getMonth() + 1 }
                        specifyPage={ specifyPage } />
                ))}
            </div>
        </div>
    )
}