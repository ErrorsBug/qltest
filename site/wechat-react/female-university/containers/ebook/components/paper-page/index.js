import React from 'react'
import Picture from 'ql-react-picture'
import { formatDate } from 'components/util'

export default function PaperPage({  studyCampCheckInIdeaRsp }) {
    return (
        <div className="eb-paper-page">
            <div className="eb-paper-tilte">我的毕业论文</div>
            <div className="eb-paper-cont">
                <div className="eb-paper-txt" dangerouslySetInnerHTML={{
                        __html: studyCampCheckInIdeaRsp?.text?.replace(/\n/g,'<br/>')
                }}></div>
                { studyCampCheckInIdeaRsp?.resourceList?.map((item, index) => (
                    <Picture key={ index } src={ item.url } />
                )) }
                <div className="eb-notes-end">—— END ——</div>
            </div>  
        </div>
    )
}