
import React, { PureComponent, Fragment } from 'react'
import { autobind } from 'core-decorators' 
import XiumiEditorH5 from 'components/xiumi-editor-h5/index';
import { htmlTransferGlobal  } from 'components/util'; 

 
@autobind
export default class extends PureComponent{
    state = { 
        isAuto:false
    } 
    componentDidMount() {
         
    }
    
    render() {
        const { contextList } = this.props;
        const { isAuto  } = this.state; 
        return (
            <Fragment> 
            <div className="sat-text-container">
                <div className={`sat-text-item ${isAuto?'auto-height':''}`}> 
                    {
                        contextList?.map((item,index)=>{ 
                            return <XiumiEditorH5 key={index} content={ htmlTransferGlobal(item) } /> 
                        }) 
                    }
                </div>
            </div>
            <div className="sat-more"> 
                {
                    isAuto?
                    <span onClick={()=>{this.setState({isAuto:false})}}> 收起 </span> 
                    :
                    <span onClick={()=>{this.setState({isAuto:true})}}> 展开全部 </span> 
                }
                
            </div>
        </Fragment>
            
        )
    }
}