import React, { PureComponent,Fragment } from 'react'
import { MiddleDialog } from 'components/dialog';
import { createPortal } from 'react-dom'
import {ShowLink,ShowImg}   from '../tip-share-dialog'
import classNames from 'classnames';
import LongTouch from '../long-touch'
import AppEventHoc from '../../components/app-event' 
import PressHoc from 'components/press-hoc';

@AppEventHoc  
export default class extends PureComponent{
    state={
        on:0
    }
    
    componentDidMount = () => {
        this.props.on&&this.setState({
            on:this.props.on
        })
    };
    componentDidUpdate(prevProps, prevState) { 
        const {isShow, isQlchat , onPress , getCardUrl , imgUrl} = this.props
        if( isShow&&isQlchat){
            getCardUrl && getCardUrl(imgUrl)
            onPress&&onPress()
        }  
    }
    
    componentWillReceiveProps(nextProps) {
        
    }
    onChange=(i)=>{
        this.setState({
            on:i
        })
    } 
    longTouch= () => {
        // 手动触发打点日志 
        typeof _qla != 'undefined' && _qla('click', {
                region:`un-community-poster-lp-${this.props.className}`,
        });

    }
    close=( )=>{
        this.props.onPress(false)
         this.props.close()
    } 
    render() {
        const { isShow, close ,imgUrl,hideBtn,className ,isQlchat} = this.props;
        const { on } = this.state
        return (
            <Fragment>
                {
                    isShow&&<div className="fl-rotate-bg" ></div>
                }
                {
                    isShow&&    
                    <div className="un-community-tip">   
                        {
                            (on==0? <ShowLink text="发送给朋友"/> :on==1 ? <ShowImg /> : '' )
                        } 
                    </div>
                }
               
                <MiddleDialog 
                    show={isShow  }
                    onClose={this.close}
                    className={classNames("un-community-poster-dialog",className,isQlchat?'app':'',this.props.childHandleAppSecondary?'app-tab':'')}>
                        <PressHoc  className="fpd-img on-log on-visible" region={`un-community-poster-lp-${className}`}>
                            {
                                this.props.children
                            }
                        </PressHoc> 
                        {
                            !hideBtn&&!isQlchat&&
                            <div className="fl-btn-container">
                                <div className={` on-log on-visible fl-poster-btn${on==1?" on":""}`} 
                                    data-log-name='发送海报'
                                    data-log-region={`un-community-poster-${className}`}
                                    data-log-pos="0"
                                    onClick={()=>{this.onChange(1)}}>发送海报</div>
                                <div className={` on-log on-visible fl-poster-btn${on==0?" on":""}`} 
                                    data-log-name='发送链接'
                                    data-log-region={`un-community-link-${className}`}
                                    data-log-pos="0"
                                    onClick={()=>{this.onChange(0)}}>发送链接</div>
                            </div>
                        }
                </MiddleDialog>
            </Fragment>
        )
    }
}