import React, { Component, Fragment } from 'react'
import { autobind } from 'core-decorators' 
import classnames from 'classnames' 
import ToggleContent from '../toggle-content'
import { formatDate, locationTo } from 'components/util';
import {universityflagCardLike,randomText} from '../../actions/flag' 
import { getBaseUserInfo } from "../../actions/common";
import { getIdeaLike } from "../../actions/community";  
import { digitFormat } from '../../../components/util';
import {getFlagCardBg} from '../../actions/flag';
import { ideaCards} from '../../components/idea-card'  
import PosterDialog from '../../components/poster-dialog';   
import { createPortal } from 'react-dom';
import GoodClick from './good-click'
import CommentClick from './comment-click'
import CollectClick from './collect-click'

@autobind
export default class extends Component {
    state = { 
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
        const { isLike,likedNum } = this.props  
        this.setState({ 
            isLike,
            likedNum
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
            await this.setState({ 
                isLike:'Y', 
                likedNum:parseFloat(this.state.likedNum)+1
            })  
            this.props.initDate&&this.props.initDate()
        }
 
        this.isload=false
    } 
     
    
    async shareDay(date){ 
        
        const topBg=await getFlagCardBg()   
        const  {...otherProps} =this.props  
        ideaCards({
            ...otherProps,topBg
        },(url)=>{ 
            this.setState({
                processUrl:url,
                isShowType:'pd-day'
            },()=>{
                this.showProcess() 
            })
        }) 
    }
    showProcess(){ 
        this.setState({
            isShowProcess: true,
        })
        setTimeout(function(){
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 0);
    } 
    colseProcess(){ 
        this.setState({ 
            isShowProcess: false, 
            isShowType:''
        }) 
    }   
    toComment(id){
        locationTo(`/wechat/page/university/community-detail?ideaId=${id}&tabIdx=0`)
    }
    render() { 
        const {className,...otherProps} = this.props  
        return (
            <Fragment>
                
                <div className={classnames("card-item-click",className)}> 
                    <div className="iic-top">
                        <CollectClick {...this.props}/> 
                        <CommentClick {...this.props}/> 
                        <GoodClick {...this.props}/> 
                    </div> 
                </div> 
            </Fragment>
        )
    }
}

