import React, { Component, Fragment } from 'react'
import { autobind } from 'core-decorators' 
import classnames from 'classnames'  
import { getIdeaLike } from "../../actions/community";
import Lottie from 'lottie-react-web' 
import { digitFormat } from '../../../components/util'; 
import {randomText} from '../../actions/community' 

@autobind
export default class extends Component {
    state = { 
        id:'',
        likedUserNameList:[],
        isLike:'',
        isShowClick:false,
        clickText:'',
        processUrl:'', 
        isShowProcess: false, 
        isShowType:'',
        likedNum:0,
        isRequest:false
    } 
    isload=false
     

    componentDidMount() { 
        this.randomTextCopy=[...randomText]
    }
    componentWillUpdate(nextProps){ 
        if((nextProps.isLike!=this.state.isLike||nextProps.id!=this.state.id)&&!this.state.isRequest){
            const {id, isLike,likedNum } = nextProps 
            this.setState({ 
                id,
                isLike,
                likedNum
            }) 
        }
    }
    
    /**
     * 点赞
     */
    async addClick(ideaId){ 
        if(this.isload){return false}
        this.getRandomText()
        this.isload=true
        if(this.state.isLike!=='Y'){  
            let addResult = await getIdeaLike({
                ideaId 
            });   
            if(addResult?.state?.code!=0){  
                this.isload=false
                return
            }  
            if(this.props.initLike){
                await this.props.initLike(ideaId)
            } 
            await this.setState({ 
                isRequest:true,
                isLike:'Y', 
                likedNum:parseFloat(this.state.likedNum||0)+1
            })  
        }
        this.props.handleLikeShare && this.props.handleLikeShare()
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
        const { isLike,likedNum,  isShowClick,clickText  } = this.state 
        const {id,userId,hideNum,  logName,logRegion,logPos} = this.props  
        return (
            <Fragment>
                
                <div 
                    data-log-name={ "想法点赞" }
                    data-log-region={"un-community-idea-idea-like"}
                    data-log-pos={ id } 
                    onClick={(e)=>{e.stopPropagation();this.addClick(id,userId)}}
                    className={`iic-item iic-item-click  on-log on-visible ${isLike=='Y'?'on':''}`}>
                        <div className="cic-icon "  > 
                            {
                                isShowClick&&
                                <div className="cic-a-text"><img src={clickText||'https://img.qlchat.com/qlLive/business/OCVYND3M-9ZED-7C2R-1563950168916-6NUO2QKZ1WQ2.png'}/></div>
                            }
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
                        {!hideNum&&digitFormat(likedNum || 0)} 
                </div> 
            </Fragment>
        )
    }
}

