import React, { PureComponent, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { autobind } from 'core-decorators';  
import IdeaItem from '../../../../components/idea-item';
import { getCookie} from 'components/util'; 
import { getUrlParams } from 'components/url-utils';
import EmptyStatus from '../../../../components/empty-status';  
import ChIdeaEmpty from '../../../../components/ch-idea-empty'

@autobind
export default class extends PureComponent{
    state = {  
    }
     

    componentDidMount = () => {
    };  
      
    render() {   
        const {isGuest,lists=[]} = this.props  
        const eleCon =  document.getElementById('community-home-container')
        return (
            <Fragment> 
                {    
                    lists&&lists.length>0?
                    <div className="ch-i-details">
                        {
                            lists.map((item,index)=>{ 
                                return <IdeaItem
                                    key={index}
                                    isHideTime={true}
                                    logName={item.text}
                                    logRegion={`un-community-idea`}
                                    logPos={item.id}
                                    logIndex={index}
                                    ideaInfo={ item }
                                    {...this.props} 
                                    {...item} 
                                />  
                            })
                        } 
                    </div>   
                    :isGuest?
                    eleCon&&createPortal(<EmptyStatus text="暂无想法"/>,eleCon)
                    :
                    eleCon&&createPortal(<ChIdeaEmpty />,eleCon)
                } 
            </Fragment>
        )
    }
}
