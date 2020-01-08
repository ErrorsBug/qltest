import React, { PureComponent, Fragment } from 'react' 
import { autobind } from 'core-decorators';  
import RightBottomIcon from '../right-bottom-icon';
import Picture from 'ql-react-picture';
import EditIdea from '../edit-idea'
 
 
 

@autobind
export default class extends PureComponent{
    state={
        isShowEdit:false
    }
     
    componentDidMount = () => {  
    };
    showEdit(){ 
        this.setState({
            isShowEdit:true
        })
    }    
    closeEdit(){ 
        this.setState({
            isShowEdit:false
        })
    }    
    render() {  
        const { isShowEdit } = this.state
        const {text,...otherProps} = this.props
        return (
            <Fragment>
                
                <div className="ch-idea-empty">
                    <div className="ch-idea-to-share">{text||`把好想法写下来和大家分享一下吧~`}</div> 
                    <div className="ch-idea-to-edit on-visible on-log" 
                        data-log-name="去写想法"
                        data-log-region="un-community-to-edit-idea"
                        data-log-pos="0" 
                        onClick={this.showEdit}>去写想法 <i className="iconfont iconxiaojiantou"></i></div> 
                </div> 
                {
                    isShowEdit&&<EditIdea handleShowEdit={this.closeEdit} {...otherProps} />
                }
                
               
            </Fragment>
        )
    }
}
