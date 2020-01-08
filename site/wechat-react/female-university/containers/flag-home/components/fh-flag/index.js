import React, { PureComponent, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { autobind } from 'core-decorators'; 
import FlagEdit from '../../../../components/flag-edit'; 

import {   universityFlagUpdate } from '../../../../actions/flag';
 
@autobind
export default class extends PureComponent{
    state = { 
        isShow:false
    }
    componentDidMount = () => {
        
    }; 
    
    show(){
        this.setState({
            isShow: true,
        })
    }
    colse(){ 
        this.setState({
            isShow: false,
        })
    }
    async confirm(data){
        
        if(data==''){
            window.toast("请输入目标", 1000);
            return
        }
        if(data==this.props.desc){
            // window.toast("未做任何修改", 1000);
            // return
        }
        await universityFlagUpdate({
            desc:data,
            id:this.props.id
        })
        window.toast("修改成功", 2000); 
        setTimeout(()=>{
            window.location.reload()
        },2000)  
    }
    render() { 
        const {  desc ,isOther} = this.props
        const {   isShow } = this.state; 
        return (
            <Fragment>
               <div className="fh-flag">
                    <div className="fhf-content">
                            <div className="fhf-head"> 
                                    <div className="fhf-name">{isOther?'TA':'我'}的小目标
                                    </div>
                                    <div className="fhf-change on-log on-visible"
                                        data-log-name='修改目标'
                                        data-log-region="un-flag-mine-change"
                                        data-log-pos="0"
                                        onClick={this.show}>修改</div>
                                
                            </div>
                            <div className="fhf-desc">{desc}</div>
                        </div>
                </div> 
                {
                    isShow&&createPortal(
                        <FlagEdit 
                        isShow={ isShow } 
                        confirm={ this.confirm } 
                        imgUrl={"https://img.qlchat.com/qlLive/business/R67756Y9-L51V-ZRBO-1558964055500-PCIVPXKP3BSW.png"}
                        on={0}
                        value={ desc}
                        close={ this.colse }  
                        />,document.getElementById('app')
                    )
                }
                
            </Fragment>
        )
    }
}
