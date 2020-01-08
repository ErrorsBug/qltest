import React, {  } from 'react'
import Picture from 'ql-react-picture'
import { formatDate } from 'components/util'

export default function NotesPage({ checkInTime, keyContent, studyCampCheckInDto, isSelf }) {
    return (
        <div className="eb-notes-page">
            { !!studyCampCheckInDto ? (
                <>
                    <div className="eb-notes-tilte">{ formatDate(checkInTime, 'MM/dd') } 今日学习重点</div>
                    <div className="eb-notes-cont">
                        <div className="eb-notes-fouce">
                            {keyContent &&  keyContent.split('\n').map((item, index) => (
                                <p key={ index }>{ item }</p>
                            )) }
                        </div>
                        <div className="eb-notes-content" >
                            <h4>我的学习心得</h4>
                            <div className="eb-notes-txt" dangerouslySetInnerHTML={{
                                __html: studyCampCheckInDto?.text?.replace(/\n/g,'<br/>')
                            }}></div>
                            { studyCampCheckInDto?.resourceList?.map((item, index) => (
                                <Picture key={ index } src={ item.url } />
                            )) }
                        </div>
                    </div>  
                </>
            ) : (
                <div className="eb-notes-emt">
                    <h4>{ isSelf ? '暂无学习笔记哦~' : '她暂时还没有发布笔记' }</h4>
                    <p>{ isSelf ? '每天打卡学习，你将收获专属于你的蜕变笔记本，记录下破蛹成蝶过程的点滴~' : '还在酝酿中...' }</p>
                </div>
            ) }
        </div>
    )
}