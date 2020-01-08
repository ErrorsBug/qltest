import React, { Component } from 'react'
import { createPortal } from 'react-dom'
import classnames from 'classnames'
import { autobind } from 'core-decorators' 
import { addComment } from '../../actions/community'

@autobind
export default class extends Component {
    textarea = null;
    state = { 
        isLoading: false,
        content:''
    }
    componentDidMount(){
        this.onFocus()
    }
    componentWillReceiveProps(){ 
    }
    onTextareaChange(e){
        const value = e.target.value.trim();
        if(value.length >= 2000){
            window.toast("评论字数不能超过2000个字~");
            return false
        }
        this.textarea.style.height = 'auto';
        this.textarea.style.height =  this.textarea.scrollHeight + 'px'; 
        this.setState({
            content:value
        })
        // this.props.changeTextarea(value);
    }
    onBlur(){ 
        setTimeout(() => {
            this.textarea && this.textarea.scrollIntoView(true);
            if(!this.state.content&&this.props.onBlur){
                this.props.onBlur()
            }
        },100)
    }
     onRelease(){
        if(this.state.isLoading) return false;
        this.state.isLoading=true
        const { ideaId,parentId,sourceId } = this.props;
        const { content } = this.state;
        window.loading&&window.loading(true)  
        setTimeout(async () => {
            this.textarea && this.textarea.scrollIntoView(true);
            const res= await addComment({
                content,
                ideaId,
                parentId,
                sourceId
            });
            if(res?.state?.code==0){
                window.toast('评论成功')
                this.setState({
                    content:''
                })
                this.props.commentSuccess&&this.props.commentSuccess(res.data);
                this.props.onBlur&&this.props.onBlur();
                window.loading&&window.loading(false)
            }
            this.state.isLoading=false
        },100)
    }
    onFocus(){
        this.textarea&&this.textarea.focus();
        setTimeout(()=>{
            this.textarea && this.textarea.scrollIntoView(true);
        },400)
    }
    render() {
        const { replyName } = this.props;
        const {   content } = this.state;
        const cls = classnames("reply-release flex flex-center",{
            "reply-show": !!content
        })
        return createPortal(
            <div className="reply-input" ref={ r => this.replyBox = r }>
                <div>
                    <from className="reply-text flex-vcenter" 
                        id="usrform"
                        onClick={this.onFocus}
                        onSubmit={ this.onRelease }>
                        <textarea  
                            className="textarea"
                            ref={ ref => this.textarea = ref }
                            rows="1"
                            onChange={ this.onTextareaChange }
                            onBlur={ this.onBlur } 
                            autoComplete="off"
                            value={ content }
                            onFocus={ this.onFocus } />
                        {  !content && <span className="reply flex flex-vcenter">{ replyName ? `回复${replyName}` : '来说点什么吧~' }</span> }
                    </from>
                    <div className={ cls } onClick={ this.onRelease }>发送</div>
                </div>
            </div>,
            document.getElementById('app')
        );
    }
}