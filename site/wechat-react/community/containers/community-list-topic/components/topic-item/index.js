import React from 'react'
import Picture from 'ql-react-picture'
import { formatDate, locationTo } from 'components/util';

function TopicItem({ideaDto,topicDto}) {  
    const {id, name, viewNum, imgUrl,introduction,createTime } = topicDto 
    return (
        <div className="ct-topic-item" onClick={()=>{locationTo(`/wechat/page/university/community-topic?topicId=${id}`)}}>
            <h4><p>#{name}#</p><span>{viewNum}人围观<i className="iconfont iconxiaojiantou-copy"></i></span></h4>
            <div className="ct-topic-content">
                <div className="ct-topic-info">
                    {
                        ideaDto?.userName&&ideaDto?.text&&ideaDto?.createTime?
                        <div>
                            <p>{ideaDto?.text}</p>
                            <span>@{ideaDto?.userName} <i>{formatDate(ideaDto?.createTime,'MM/dd hh:mm')}</i></span>
                        </div>
                        :
                        <div>
                            <p>{introduction}</p>
                            <span>@千聊女子大学 <i>{formatDate(createTime,'MM/dd hh:mm')}</i></span>
                        </div>
                    }
                </div>
                <div className="ct-topic-pic">
                    {
                        imgUrl&&<Picture className="img" src={imgUrl} resize={{ w: 140, h: 140 }} />
                    }
                </div>
            </div>
        </div>
    )
}

export default TopicItem