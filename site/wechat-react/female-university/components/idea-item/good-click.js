import React, { Component, Fragment } from 'react'
import { autobind } from 'core-decorators' 
import classnames from 'classnames'  
import { getIdeaLike } from "../../actions/community";
 
import { digitFormat } from '../../../components/util'; 

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
        likedNum:0
    } 
    isload=false
     

    componentDidMount() { 
        
    }
    componentWillUpdate(nextProps){ 
        if(nextProps.isLike!=this.state.isLike||nextProps.id!=this.state.id){
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
        this.isload=true
        if(this.state.isLike!=='Y'){  
            let addResult = await getIdeaLike({
                ideaId 
            });   
            if(addResult?.state?.code!=0){  
                this.isload=false
                return
            } 
            window.toast(`点赞成功`)
            if(this.props.initLike){
                await this.props.initLike(ideaId)
            } 
            await this.setState({ 
                isLike:'Y', 
                likedNum:parseFloat(this.state.likedNum)+1
            })  
        }
 
        this.isload=false
    } 
       
    render() {
        const { isLike,likedNum,   } = this.state 
        const {id,userId,hideNum,  logName,logRegion,logPos} = this.props  
        return (
            <Fragment>
                
                <div 
                    data-log-name={ "想法点赞" }
                    data-log-region={"un-community-idea-idea-like"}
                    data-log-pos={ id } 
                    onClick={()=>{this.addClick(id,userId)}}
                    className={`iic-item on-log on-visible ${isLike=='Y'?'on':''}`}>
                        <i className="iconfont iconweidianzan"></i> 
                        {!hideNum&&digitFormat(likedNum || 0)} 
                </div> 
            </Fragment>
        )
    }
}

