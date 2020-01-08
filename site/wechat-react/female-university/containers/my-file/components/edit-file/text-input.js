import React, { Component } from 'react'
import { autobind } from 'core-decorators'
import classnames from 'classnames'

@autobind
export default class extends Component{
    changeTxt(e) {
        e.preventDefault();
        e.stopPropagation()
        const value = e.target.value;
        const { totalLen,onChangeTxt, idx } = this.props;
        if(value.length > totalLen) {
            return false
        };  
        onChangeTxt(value,idx);
        this.textInput.style.height = 'auto';
        this.preNode.style.height = 'auto';
        this.textInput.style.height = this.textInput.scrollHeight + 'px';  
        this.preNode.style.height = this.textInput.scrollHeight + 'px';  
    }
    componentDidMount() {
        if(this.props.autoFocus) {
            this.onFocus();
        }
    }
    onFocus(e){
        e && e.preventDefault();
        e && e.stopPropagation();
        setTimeout(() => {
            this.textInput && this.textInput.focus();    
        }, 10);
        
    }
    render() {
        const { placeholder, className = '', totalLen = 200, curLen, value, onBlur, autoFocus = false } = this.props;
        const cls = classnames('edit-file-txt', className)
        return (
            <div className={ cls }>
                <pre ref={ r => this.preNode = r }>{ value }</pre>
                <form>
                    <textarea  
                        id={ autoFocus ? 'input' : '' }
                        ref={ (r) => this.textInput = r }
                        value={ value }
                        onFocus={ this.onFocus }
                        onBlur={ (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onBlur()
                        } }
                        autoFocus={ autoFocus }
                        onChange={ this.changeTxt }
                        placeholder={ placeholder }>
                    </textarea>
                </form>
                
                <p className={ curLen>=totalLen ? 'red' : '' }>{ curLen }/{ totalLen }</p>
            </div>
        )
    }
}