import React, { Component } from 'react'
import { autobind } from 'core-decorators'
import Picture from 'ql-react-picture';
import { locationTo } from 'components/util';
import PublicTitleImprove from '../public-title-improve'
import TopicItem from '../community-topic-item/hot' 
 

@autobind
export default class extends Component {
    handleMoreLink(){
        if(this.props.childHandleAppSecondary){
            this.props.childHandleAppSecondary(`/wechat/page/university/community-list-topic`)
            return
        }
        this.props.isToMore?
        locationTo(`/wechat/page/university/community-list-topic`) 
        :locationTo(`/wechat/page/university/community-center`) 
    }
    render() {
        const { title, decs, listTopicData=[], isTitle,isToMore, btm } = this.props;
        return (
            <div className="un-home-topic-box" style={{marginBottom: `${ Number(btm || 48) / 78 }rem`  }}>
                { isTitle && <PublicTitleImprove
                    className='un-topic-title'
                    title={ title }
                    moreTxt="话题广场"
                    decs={ decs }
                    region="un-community-topic-more"
                    handleMoreLink={ this.handleMoreLink } /> }
                
                <div className="un-topic-list">
                    { listTopicData.map((item, index) => (
                        <TopicItem  
                            region="un-home-topic-item"
                            handleSelectTopic={()=>{
                                this.props.childHandleAppSecondary?
                                this.props.childHandleAppSecondary(`/wechat/page/university/community-topic?topicId=${item.id}`)
                                :
                                locationTo(`/wechat/page/university/community-topic?topicId=${item.id}`)}
                            }
                            key={ index } 
                            idx={index}  
                            { ...item }/>
                    )) }
                </div>
            </div>
        )   
    }
}