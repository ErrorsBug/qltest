import React, { Component } from 'react'
import { autobind } from 'core-decorators' 
import classnames from 'classnames' 
import { formatMoney, locationTo ,formatDate, imgUrlFormat} from 'components/util'; 
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
        const { desc,maxLine=6,  resource,cardDate, shareDay, key,className,logName,logRegion,logPos} = this.props
        return (
            <div className={classnames("card-item-content",className)}>
                {
                    desc&&<ToggleContent  
                        maxLine={maxLine} 
                        logName={logName}
                        logRegion={logRegion}
                        logPos={logPos}
                        children={
                            <div className="fhl-d-desc"
                                dangerouslySetInnerHTML={{ __html: desc?.replace(/\n/g,'<br/>') }}
                            ></div>
                        }
                    /> 
                }
                
                
                
                {
                    resource?.length>0&&
                    <div className="fhl-d-img">
                        {
                            resource.map((item_sub,index_sub)=>{
                                return <img className={`${resource?.length==1?'cic-one':resource?.length==2?'cic-two':''}`} src={imgUrlFormat(item_sub.url, '?x-oss-process=image/resize,m_fill,limit_0,h_200,w_200','/0')} key={index_sub} onClick={()=>this.onClickViewPic(index_sub,resource)}/>
                            })
                        }
                    </div>   
                } 
            </div>
            
        )
    }
}

