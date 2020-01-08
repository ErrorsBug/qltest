import React, { PureComponent,Fragment } from 'react'
import { MiddleDialog } from 'components/dialog';
import { createPortal } from 'react-dom'
import { limitScrollBoundary } from 'components/scroll-boundary-unlimit';

  

export default class extends PureComponent{
    state={
        on:0
    }
    
    componentDidMount = () => { 
        this.setValue(this.props.value)
    };
    componentDidUpdate(){
        document.querySelector('.co-dialog-container')&&limitScrollBoundary(document.querySelector('.co-dialog-container')) 
    }
    onChange=(i)=>{
        this.setState({
            on:i
        })
    }
    
    onTextareaChange= (e) => { 
        const value = e.target.value.trim(); 
        if(value.length > 150){
            window.toast("评论字数不能超过150个字~");
            return false
        }
        this.setValue(value)
    }
    setValue =(val) =>{ 
        this.setState({
            value:val
        },()=>{ 
            this.textarea.style.height = 'auto';
            this.textarea.style.height =  this.textarea.scrollHeight + 'px';
            this.textFocus()
        }) 
    }
    confirm =()=>{
        this.props.confirm(this.state.value)
    }
    textFocus=(e)=>{  
        this.textarea.focus()
    }
    textBlue=()=>{
        setTimeout(() => {
			this.textarea && this.textarea.scrollIntoView(true); 
        },100)
    }
    textClick(e){
        e.stopPropagation();
    }
    render() {
        const { isShow, close   ,title="修改目标" } = this.props;
        const { on,value } = this.state
        return (
            <Fragment> 
                <MiddleDialog 
                    show={isShow  }
                    onClose={close}
                    className="un-flag-edit-dialog">
                        <span className="fed-close" onClick={close}></span>
                        <div className="fed-title">{title}</div>
                        <div className="fed-content" onClick={(e)=>this.textFocus(e)}>
                            <textarea 
                                onClick={(e)=>this.textClick(e)}
                                maxLength="150"
                                onBlur={this.textBlue}
                                ref={ ref => this.textarea = ref }
                                onChange={ this.onTextareaChange }
                             placeholder="请输入内容" value={value}></textarea>
                             <div  className={`fed-tip${value?.length>=150?' on':''}`}>{value?.length}/150</div>
                        </div>
                        <div className="fed-btn" onClick={this.confirm}>确定</div>
                </MiddleDialog>
            </Fragment>
        )
    }
}