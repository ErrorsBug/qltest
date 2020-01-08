import React, { PureComponent, Fragment } from 'react' 
import { autobind } from 'core-decorators';  
import EditTag from '../../../../components/edit-tag'
 
 
 

@autobind
export default class extends PureComponent{
    state = { 
        isShowEdit:false
    }
     
    componentDidMount = () => { 
    };
    showEdit(){
        this.setState({isShowEdit:true})
    }  
    showSelectTopic(){
        this.setState({isShowEdit:false})
    }  
    render() { 
        const {isShowEdit} = this.state
        const {  isGuest,userTagList=[]  } = this.props;  
        return (
            <Fragment>
                <div className="ch-personal-image-box">
                    {
                        userTagList!=null&&userTagList?.length>0?
                        <div className="ch-personal-image">
                            {
                                !isGuest&&
                                <div className="ch-personal-add on-visible on-log" 
                                    data-log-name="添加形象关键词"
                                    data-log-region="ch-personal-add"
                                    data-log-pos="0" 
                                    onClick={this.showEdit}><i className="iconfont icontianjia"></i> 添加</div>
                            } 
                            {
                                userTagList.map((item,index)=>{
                                    return <div className="ch-personal-item" key={index}>{item.name}</div>
                                })
                            } 
                        </div> 
                        :!isGuest?
                        <div className="ch-personal-empty">
                            <div className="ch-personal-left">完善个人形象，获取更多关注</div>
                            <div className="ch-personal-add on-visible on-log" 
                                data-log-name="添加形象关键词"
                                data-log-region="ch-personal-add"
                                data-log-pos="0" 
                                onClick={this.showEdit}><i className="iconfont icontianjia"></i> 添加形象关键词</div>
                        </div>  
                        :''
                    }
                </div> 
                {
                    isShowEdit&&<EditTag showSelectTopic={this.showSelectTopic}/> 
                }
                
            </Fragment>
        )
    }
}
