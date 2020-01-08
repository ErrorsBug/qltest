import React, { PureComponent, Fragment } from 'react' 
import { autobind } from 'core-decorators';  
import RightBottomIcon from '../right-bottom-icon';
import Picture from 'ql-react-picture';
import EditIdea from '../edit-idea'
import {isStudent } from "../../actions/community";  
 
 
 

@autobind
export default class extends PureComponent{
    state={
        isShowEdit:false
    }
     
    componentDidMount = () => {  
    };
    showEdit(){ 
        isStudent(()=>{
            this.setState({
                isShowEdit:true
            })
        })
    }    
    closeEdit(){ 
        this.setState({
            isShowEdit:false
        })
    }    
    render() {  
        const { isShowEdit } = this.state
        const {region,...otherProps} = this.props
        return (
            <Fragment>
                <div className="ch-to-edit">
                    <RightBottomIcon initClick={this.showEdit} className="cl-teacher-dialog">
                        <div className="cl-td-icon on-visible on-log" 
                            data-log-name="开始编辑想法"
                            data-log-region={region||"un-to-edit-icon"}
                            data-log-pos={0}>
                            <Picture src={`https://img.qlchat.com/qlLive/business/VSDGHVIU-MQP3-M12I-1567650106683-X1WMC52LGVZ1.png`} /> 
                        </div> 
                    </RightBottomIcon> 
                 
                </div>
                {
                    isShowEdit&&<EditIdea handleShowEdit={this.closeEdit} {...otherProps} />
                }
                
               
            </Fragment>
        )
    }
}
