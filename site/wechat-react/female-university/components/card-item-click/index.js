import React, { Component } from 'react'
import { autobind } from 'core-decorators' 
import classnames from 'classnames' 
import ToggleContent from '../toggle-content'
import { formatDate } from 'components/util';
import {universityflagCardLike,randomText} from '../../actions/flag' 
import { getBaseUserInfo } from "../../actions/common";
import Lottie from 'lottie-react-web' 
import { digitFormat } from '../../../components/util';

@autobind
export default class extends Component {
    state = { 
        likedUserNameList:[],
        likeStatus:'',
        isShowClick:false,
        clickText:''
    } 
    isload=false
     

    componentDidMount() { 
        const { likedUserNameList=[],likeStatus } = this.props 
        this.randomTextCopy=[...randomText]
        this.setState({
            likedUserNameList,
            likeStatus
        }) 
    }
    componentWillUnmount(){
         
    }
    togglePush(){
        const isPush = !this.state.isPush
        this.setState({
            isPush
        })
    }  
    
    /**
     * 点赞
     */
    async addClick(cardId){ 
        if(this.isload){return false}
        this.isload=true
        if(this.state.likeStatus!=='Y'){  
            let addResult = await universityflagCardLike({
                cardId 
            });  
            if(addResult?.state?.code!=0){  
                this.isload=false
                return
            }
            let res = await getBaseUserInfo();   
            await this.setState({
                likedUserNameList:[res?.user?.name,...this.state.likedUserNameList],
                likeStatus:'Y', 
            })  
        }

        this.getRandomText()
        this.isload=false
    }
    async getRandomText(){
        if(this.state.isShowClick)return false
        if(this.randomTextCopy.length<=0){
            this.randomTextCopy=[...randomText]
        } 
        
        let i = Math.floor(Math.random()*this.randomTextCopy.length)
        let clickText=this.randomTextCopy[i]
        this.randomTextCopy.splice(i,1) 

        await this.setState({ 
            isShowClick:true,
            clickText
        }) 
        this.timer&&clearTimeout(this.timer)
        this.timer=setTimeout(()=>{
            this.setState({
                isShowClick:false
            })
        },1500)
    }
     

    render() {
        const { likedUserNameList,likeStatus,isShowClick,clickText } = this.state
        const {id,userId, desc, resource,cardDate,  key,className, addClick ,isHideTime,isHideClick,logName,logRegion,logPos} = this.props 
        return (
            <div className={classnames("card-item-click",className)}> 
                <div className="cic-top">
                    {
                        !isHideClick&&
                            <div 
                            data-log-name={logName|| "点赞" }
                            data-log-region={logRegion||"card-click"}
                            data-log-pos={ logPos||1 } 
                            onClick={()=>{this.addClick(id,userId)}}
                            className={`cic-num on-log on-visible ${likeStatus=='Y'?'on':''}`}>
                                {digitFormat(likedUserNameList?.length || 0)  ||''} 
                                <div className="cic-icon "  > 
                                    {
                                        isShowClick&&
                                        <div className="cic-a-text"><img src={clickText||'https://img.qlchat.com/qlLive/business/OCVYND3M-9ZED-7C2R-1563950168916-6NUO2QKZ1WQ2.png'}/></div>
                                    }
                                 </div>
                                {
                                    isShowClick&&
                                    <div className="cic-animation">
                                        <Lottie
                                            options={{
                                                path: 'https://static.qianliaowang.com/frontend/rs/lottie-json/click-active.json'
                                            }}  
                                            speed={0.8}
                                        />
                                        
                                    </div>
                                }
                                
                            </div>
                    }
                    {
                        !isHideTime&&<div className="cic-time">{formatDate(cardDate,'yyyy-MM-dd')}</div>
                    }
                    
                </div>
                {
                    likedUserNameList&&likedUserNameList.length>0&&<ToggleContent  
                        children={ likedUserNameList.join('，')}
                        logName={logName}
                        logRegion={logRegion}
                        logPos={logPos}
                    /> 
                    
                }
            </div>
            
        )
    }
}

