import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom';
import { MiddleDialog } from 'components/dialog';
import PressHoc from 'components/press-hoc'
import {   fetchIsSubscribeAndQr } from "../../actions/common";
import { isQlchat } from 'components/envi'

function ShowQrcode({pubBusinessId,channel="communityFocus",close}) {
    // Declare a new state variable, which we'll call "count"
    const [qrUrl, setQrUrl] = useState(false);
    
    const handleClick = useCallback(async (index) => { 
         
    })
    
    useEffect(() => {
        showTip()
    }, [ ])
    
    async function showTip(){ 
        fetchIsSubscribeAndQr({
            channel,
            pubBusinessId,
            isFocusThree:()=>{
                close()
            },
            unFocusThree:(qrUrl)=>{
                setQrUrl(qrUrl) 
            }, 
        }) 
    }  
    return (
        <div> 
            {
                qrUrl&&createPortal(
                    <MiddleDialog 
                        show={true  }
                        onClose={close}
                        className={"show-qrcode-dialog"}>
                            <div className="ln-course-dialog-close" onClick={close}><i className="iconfont iconxiaoshanchu"></i></div>
                            {
                                isQlchat()?
                                <div className="ln-course-dialog-title">长按保存图片，用微信扫描二维码关注公众号，可以第一时间<span>接收TA的新动态提醒</span>哦~</div>
                                :
                                <div className="ln-course-dialog-title">关注女子大学公众号，可以第一时间<span>接收TA的新动态提醒</span>哦~</div>
                            }
                            
                           
                            <div className="ln-course-dialog-qrcode">
                                <PressHoc region="un-course-dialog-qrcode">
                                    {
                                        qrUrl&&<img src={qrUrl}/>
                                    }
                                </PressHoc>
                            </div>
                    </MiddleDialog> 
                ,document.getElementById('app'))
            }
        </div>
    );
  }

export default ShowQrcode