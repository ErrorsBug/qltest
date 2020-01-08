import React, { PureComponent, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { autobind } from 'core-decorators';  
import { getCookie, locationTo} from 'components/util'; 
import { getUrlParams } from 'components/url-utils'; 
import TopicItem from '../../../../components/community-topic-item'
import EmptyStatus from '../../../../components/empty-status';  

@autobind
export default class extends PureComponent{
    state = {  
    }
    
    get ideaUserId(){ 
        return getUrlParams('studentId','')||getCookie('userId')
    }

    componentDidMount = () => {
    };  
      
    render() {   
        const {lists=[]} = this.props  
        const eleCon =  document.getElementById('community-home-container')
        return (
            <Fragment> 
                {    
                    lists&&lists.length>0?
                    <div className="ch-i-details"> 
                        { lists.map((item, index) => (
                            <TopicItem key={index} {...item} handleSelectTopic={()=>{locationTo(`/wechat/page/university/community-topic?topicId=${item.id}`)}}/>  
                        )) }
                    </div> 
                    :
                    eleCon&&createPortal(<EmptyStatus text="暂无收藏话题"/>,eleCon) 
                } 
                
            </Fragment>
        )
    }
}
