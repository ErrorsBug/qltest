import React, { Component } from 'react'
import { autobind } from 'core-decorators' 
import classnames from 'classnames' 
import { formatRichText, imgUrlFormat} from 'components/util'; 
import ToggleContent from '../toggle-content'

 
 

@autobind
export default class extends Component {
    state = {
        
    }
   
    componentDidMount() {
        
    }
    componentWillUnmount(){
         
    }
     
    onClickViewPic(index, source){
        let sourceArray = source.map((item,i)=>{
            return item.url;
        });
        window.showImageViewer(sourceArray[index],sourceArray);
    }  
    
    render() {
        const { text,maxLine=6,  resourceList,cardDate, shareDay, key,className,logName,logRegion,logPos} = this.props
        return (
            <div className={classnames("idea-item-content",className)}>
                {
                    text&&<ToggleContent  
                        maxLine={maxLine} 
                        logName={logName}
                        logRegion={logRegion}
                        logPos={logPos}
                        children={
                            <span className="fhl-d-desc" 
                                onClick={(e)=>{if(e.target.nodeName=='A'){e.stopPropagation();}}}
                                dangerouslySetInnerHTML={{ __html: formatRichText(text) }}
                            ></span>
                        }
                    /> 
                }
                
                
                
                {
                    resourceList?.length>0&&
                    <div className="fhl-d-img">
                        {
                            resourceList.map((item_sub,index_sub)=>{
                                return <img className={`${resourceList?.length==1?'iic-one':resourceList?.length==2?'iic-two':''}`} src={imgUrlFormat(item_sub.url, '?x-oss-process=image/resize,m_fill,limit_0,h_200,w_200','/0')} key={index_sub} onClick={(e)=>{e.stopPropagation();this.onClickViewPic(index_sub,resourceList)}}/>
                            })
                        }
                    </div>   
                } 
            </div>
            
        )
    }
}

