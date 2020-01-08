import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import Lottie from 'lottie-react-web'  
import {randomText,getIdeaLike } from '../../actions/community'

function ClickJson({likedNum,isLike,id,initLike, handleclickJsonShare ,...otherProps}) {
    const [isShow, setShow] = useState(false);
    const [clickText, setClickText] = useState(null);
    const [likedNumed, setLikedNum] = useState(0);
    const [randomTextCopy, setRandomTextCopy] = useState([]);
    const handleClick = useCallback(async () => { 
        if(isShow)return false
        handleclickJsonShare && typeof(handleclickJsonShare) == "function" && handleclickJsonShare()
        if(isLike!=='Y'){  
            let addResult = await getIdeaLike({
                ideaId:id 
            });   
            if(addResult?.state?.code==0){  
                initLike && initLike(id)
            }  
        }
        if(randomTextCopy.length<=0){
            setRandomTextCopy(randomText )
        }  
        let i = Math.floor(Math.random()*randomTextCopy.length)
        setClickText(randomTextCopy[i])
        setShow(true)
        randomTextCopy.splice(i,1)  
        setTimeout(()=>{
            setShow(false) 
        },2000)
    },[isShow,clickText,randomTextCopy,id])
    useEffect(() => {
        setLikedNum(likedNum)
    }, [likedNum]) 
    return (
        <div className="click-json-item" style={{zIndex:isShow?10:-1}}>
            {
                <div className="cmc-animation">
                    <Lottie
                        options={{
                            path: 'https://static.qianliaowang.com/frontend/rs/lottie-json/animation.json',
                            autoplay: false
                        }}
                        isPaused={!isShow}
                    />
                    {
                        isShow && <div className="cmc-a-text"><img src={clickText || 'https://img.qlchat.com/qlLive/business/OCVYND3M-9ZED-7C2R-1563950168916-6NUO2QKZ1WQ2.png'} /></div>
                    } 
                </div>
            }
            <div className="cmc-icon on-log on-visible"
                data-log-name={'点赞鼓励一下'}
                data-log-region={'community-detail-click-big'}
                data-log-pos={0} 
                onClick={handleClick}>
                <div className="click-json-num">
                    {likedNumed||0}
                </div>
            </div>
            <div className="cmc-text">点赞鼓励一下</div>
        </div>
    );
  }

export default ClickJson