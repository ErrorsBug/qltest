import React, { Fragment, useState, useCallback } from 'react'
import PortalCom from '../../../../components/portal-com';

export default function Cover({ knowledgeNum, noteNum, goTurn, isSelf, userName }) {
    const [isShow, setIsShow] = useState(false)
    const onShare = useCallback((e) => {
        setIsShow(!isShow)
    }, [isShow])
    return (
        <Fragment>
            <PortalCom className="eb-cover-box">
                <div className="eb-cover-cont" >
                    <div className="eb-cover-bg" onTouchStart={ goTurn } onClick={ goTurn }>
                        <i></i>
                        <p>
                            <span>{ isSelf ? '我' : userName?.length > 4 ? `${ userName?.slice(0,4) }...` : userName }的</span>
                            <span>蜕变笔记本</span>
                        </p>
                        <img src={ require('../../img/cover-bg.png') } alt=""/>
                        <div className="eb-cover-hua">
                            {/* <span className="iconfont iconshuangjiantou">点击翻页</span> */}
                            <span>点击翻页</span>
                        </div>
                    </div>
                    <p>— 已写{ noteNum }篇笔记，{ knowledgeNum }个知识点 —</p>
                    <div className="eb-cover-btn" onClick={ onShare }>分享笔记本</div>
                </div>
            </PortalCom>
            { isShow && (
                <PortalCom className="eb-cover-share" onClick={ onShare }>
                    <div>
                        <p>最美的盛开，让更多人看见</p>
                        <p>点击右上角，发到朋友圈吧！</p>
                    </div>
                </PortalCom>
            ) }
        </Fragment>
    )
}