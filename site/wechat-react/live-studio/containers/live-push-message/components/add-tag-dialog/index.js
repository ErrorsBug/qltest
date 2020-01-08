import React from 'react';
import { autobind } from 'core-decorators'

@autobind
class AddTagDialog extends React.Component {

    state = {
        show: false,
        value: '',
        count: 0,
        _id: 1,
        type: ''
    }

    show(type){
        this.setState({show: true,type})
        setTimeout(_=>{
            this.inputEle.focus()
        }, 100)
    }

    hide(){
        this.setState({show: false})
    }

    input(e){
        let value = e.target.value.trim()
        let count = 0
        if(value.length > 10){
            value = value.substring(0, 10)
            count = 10
        }else {
            count = value.length
        }
        this.setState({value, count})
    }   

    confirm(){
        if(!this.state.value){
            window.toast('请输入自定义标签名称！')
            return
        }
        let tag = [{
            id: '',
            _id: this.state._id,
            type: this.state.type,
            name: this.state.value,
            isSystem: 'N',
            isSelect: 'N'
        }]
        this.props.addTag && this.props.addTag(tag)
        this.setState({value: '', count: 0, show: false, _id: ++this.state._id})
    }

    render() {
        if(!this.state.show){
            return ''
        }
        return (
            <div className="add-tag-dialog">
                <div className="bg" onClick={this.hide}></div>
                <div className="add-tag-container">
                    <div className="title">自定义标签</div>
                    <div className="write-container">
                        <input type="text" value={this.state.value} onChange={this.input} ref={el => this.inputEle = el}/>
                        <div className="tip">{this.state.count}/10</div>
                    </div>
                    <div className="confirm" onClick={this.confirm}>确认</div>
                </div>
            </div>
        );
    }
}


export default AddTagDialog;