import React, { PureComponent, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { autobind } from 'core-decorators';
import FlagItem from '../../../../components/flag-item';
import Dialog from '../dialog';
import FlagEdit from '../../../../components/flag-edit'; 
import {   universityFlagUpdate } from '../../../../actions/flag';
import { caseList } from  "../../../../actions/flag" 
import { imgUrlFormat } from 'components/util';
 
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
        this.setState({isShow:false});
        this.props.updateDesc(data);
    }
    render() { 
        const { flagHelpList=[] ,desc ,userName,userHeadImg } = this.props  
        const {   isShow } = this.state; 
        return (
            <Fragment>
                
                    <div className="fw-flag">
                        <div className="fwf-title">
                            我的小目标
                        </div>
                        <div className="fwf-content">
                            <div className="fwf-head">
                                <div className="fwf-avator">
                                    <img src={userHeadImg}/>
                                </div>
                                <div className="fwf-right-path"> 
                                    <div className="fwf-name">{userName}</div>
                                </div>
                                <div className="fwf-change on-log on-visible"
                                    data-log-name='修改目标'
                                    data-log-region="un-flag-mine-change"
                                    data-log-pos="0"
                                    onClick={this.show}>修改</div>
                            </div>
                            <div className="fwf-desc">{desc}</div>
                        </div>
                        <div className="fhl-invite">
                                        <div className="fhli-head">
                                            <div className="fhli-title">我的见证人</div>
                                            <div className="fhli-num">3个见证人，即可激活契约 </div>
                                        </div>
                        {
                             flagHelpList&&
                                (
                                    flagHelpList.length>0?
                                    
                                        <div className="fhli-list">
                                            {
                                                flagHelpList.map((item,index)=>{
                                                    return <div className="fhli-item" key={index}>
                                                        <div className="fhli-avator">
                                                            <img src={imgUrlFormat(item.userHeadImg||'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png','?x-oss-process=image/resize,m_fill,limit_0,h_200,w_200','/0')} />
                                                        </div>
                                                        <div className="fhli-right-path">
                                                            <div className="fhli-top">
                                                                <div className="fhli-name">{item.userName}</div> 
                                                            </div>
                                                                <div className="fhli-intro">{ caseList[parseFloat(item.desc)-1]}</div>
                                                        </div>
                                                    </div>
                                                })
                                            }
                                        
                                            
                                        </div>
                                    :
                                    <div className="fhl-none" onClick={this.props.initMinCards}>暂无见证人，立即寻找 <span></span> </div> 
                                )
                        }
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
