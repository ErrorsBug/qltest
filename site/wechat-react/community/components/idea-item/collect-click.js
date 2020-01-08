import React, { Component, Fragment } from 'react'
import { autobind } from 'core-decorators' 
import classnames from 'classnames'  
import { collAdd,collCancel } from "../../actions/community";
import { digitFormat } from '../../../components/util'; 

@autobind
export default class extends Component {
    state = { 
        id:'',
        likedUserNameList:[],
        isCollected:'',
        isShowClick:false,
        clickText:'',
        processUrl:'', 
        isShowProcess: false, 
        isShowType:'',
        collectNum:0
    } 
    isload=false
     

    componentDidMount() { 
        
    }
    componentWillUpdate(nextProps){ 
        if(nextProps.isCollected!=this.state.isCollected||nextProps.id!=this.state.id){
            const {id, isCollected,collectNum } = nextProps 
            this.setState({ 
                id,
                isCollected,
                collectNum
            }) 
        }
    }
    
    /**
     * 收藏
     */
    async addClick(ideaId){ 
        if(this.isload){return false}
        this.isload=true
        if(this.state.isCollected!=='Y'){  
            let addResult = await collAdd({
                businessId:ideaId ,
                type:'UNIVERSITY_COMMUNITY_IDEA'
            });   
            if(addResult?.state?.code!=0){  
                this.isload=false
                return
            } 
            window.toast(`收藏成功`)
            await this.setState({ 
                isCollected:'Y', 
                collectNum:parseFloat(this.state.collectNum||0)+1
            })  
            if(this.props.initCollect){
                this.props.initCollect(ideaId,true)
            } 
        }else{
            let addResult = await collCancel({
                businessId:ideaId ,
                type:'UNIVERSITY_COMMUNITY_IDEA'
            });   
            if(addResult?.state?.code!=0){  
                this.isload=false
                return
            } 
            window.toast(`取消成功`)
            await this.setState({ 
                isCollected:'N', 
                collectNum:parseFloat(this.state.collectNum)-1
            })  
            if(this.props.initCollect){
                this.props.initCollect(ideaId,false)
            } 
            
        }
 
        this.isload=false
    } 
       
    render() {
        const { isCollected,collectNum,   } = this.state 
        const {id,userId,hideNum,  logName,logRegion,logPos} = this.props  
        return (
            <Fragment>
                <div 
                    data-log-name={ "想法收藏" }
                    data-log-region={"un-community-idea-collect"}
                    data-log-pos={ id } 
                    onClick={(e)=>{e.stopPropagation();this.addClick(id,userId)}}
                    className={`iic-item on-log on-visible ${isCollected=='Y'?'on':''}`}>
                        <i className={`iconfont ${isCollected=='Y'?'iconyishoucang':'iconshoucang'}`}></i> 
                        {!hideNum&&digitFormat(collectNum || 0)} 
                </div> 
            </Fragment>
        )
    }
}

