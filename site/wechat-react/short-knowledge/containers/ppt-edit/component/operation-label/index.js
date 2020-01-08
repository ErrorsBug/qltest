import React from 'react';
import { connect } from 'react-redux';
import { saveActiveImage, updateImageList } from '../../../../actions/short-knowledge';

const reducer = state => {
    return {
        resourceList: state.shortKnowledge.resourceList,
        activeImage: state.shortKnowledge.activeImage,
    }
}

const actions = {
    saveActiveImage,
    updateImageList
}

class OperationLabel extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            canSpeak: false,
        }
    }

    // 上移
    shiftUp = () => {
        let currentActiveIndex = this.currentActiveIndex
        if(currentActiveIndex === -1){
            window.toast('当前ppt不存在内容！')
            return
        }
        // 当前选中的是第一个
        if(currentActiveIndex === 0){
            window.toast('当前图片是第一个，不能上移！')
            return
        }
        this.props.updateImageList('up', currentActiveIndex)
        this.showCurrentImage()
    }

    // 下移
    shiftDown = () => {
        let currentActiveIndex = this.currentActiveIndex
        if(currentActiveIndex === -1){
            window.toast('当前ppt不存在内容！')
            return
        }
        // 当前选中的是最后一个
        if(currentActiveIndex === this.props.resourceList.length - 1){
            window.toast('当前图片是最后一个，不能下移！')
            return
        }
        this.props.updateImageList('down', currentActiveIndex)
        this.showCurrentImage()
    }

    // 删除操作
    delete = () => {
        let currentActiveIndex = this.currentActiveIndex
        if(currentActiveIndex === -1){
            window.toast('当前ppt不存在内容！')
            return
        }
        if(!(this.props.activeImage && this.props.activeImage.id)){
            window.toast('当前未选中图片！')
            return
        }
        let length = this.props.resourceList.length
        if(length > 0){
            this.props.deleteImage(()=>{
                this.props.updateImageList('delete', currentActiveIndex)
            })
        }
    }

    // 获取当前选中的图片的下标
    get currentActiveIndex(){
        return this.props.resourceList.findIndex(i => i.id === this.props.activeImage.id)
    }

    // 将选中的图片显示在页面上
    showCurrentImage = () => {
        let timeout = setTimeout(_=>{
            document.querySelector('.img-container.active').scrollIntoView()
            clearTimeout(timeout)
        }, 0)
    }

    render(){
        return (
            <div className="operation-label-container">
                <div className="operation-group">
                    <div className="btn shift-up on-log" onClick={this.shiftUp}
                        data-log-region="ppt-edit"
                        data-log-pos="up"
                        data-log-name="上移">
                        <img src={require('./img/icon-shift-up.png')} alt=""/>
                        <span className="label">上移</span>
                    </div>
                    <div className="btn shift-down on-log" 
                        data-log-region="ppt-edit"
                        data-log-pos="down"
                        data-log-name="下移"
                        onClick={this.shiftDown}>
                        <img src={require('./img/icon-shift-down.png')} alt=""/>
                        <span className="label">下移</span>
                    </div>
                    <div className="btn delete on-log" 
                        data-log-region="ppt-edit"
                        data-log-pos="delete"
                        data-log-name="删除" 
                        onClick={this.delete}>
                        <img src={require('./img/icon-delete.png')} alt=""/>
                        <span className="label">删除</span>
                    </div>
                </div>
                <div className="next on-log" 
                    data-log-region="ppt-edit"
                    data-log-pos="next"
                    data-log-name="下一步"  
                    onClick={()=>{this.props.nextStep()}}>下一步</div>
            </div>
        )
    }
}

export default connect(reducer, actions)(OperationLabel)

