import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Detect from 'components/detect';
import CommonTextarea from 'components/common-textarea';
import { htmlTransferGlobal, normalFilter, getVal, validLegal } from 'components/util';
import { fixScroll } from 'components/fix-scroll';

import {
    addOrUpdateOutLine,
    delOutLine,
    updateOutline,
} from 'thousand_live_actions/thousand-live-normal';

@autobind
class OutlineList extends Component {
    state = {
        inputContent:'',
        outlineList: [],
        editingId: '',
        showMenuId:'',
    }

    componentDidMount() {
        this.initOutline();
        // 修正滚动露底
        setTimeout(() => {
            fixScroll('#outline-list-ul');
        },0)
    }

    initOutline() {
        this.setState({
            outlineList: this.props.outlineList || [],
            editingId:'',
            inputContent:'',
        })
    }

    changeData(e){
        this.setState({
            inputContent:e.target.value,
        })
    }

    addOutlineItem() {
        let item = {
            id: 0,
            conten: '',
            status: 'Y',
            sendStatus:'N'
        }
        if (this.state.outlineList.length > 0 && this.state.outlineList[this.state.outlineList.length - 1].id == '0') {
            return false;
        }
        this.setState({
            outlineList: [...this.state.outlineList, item],
            editingId: 0,
            inputContent:'',
        })

    }


    /**
     * 取消编辑
     * 
     * @memberof OutlineList
     */
    cancelEdit() {
        window.confirmDialog(
            '确定取消编辑吗？',
            () => {
                this.initOutline();
            },
            () => { }
        )
    }

    /**
     * 确定保存
     * 
     * @memberof OutlineList
     */
    confirmEdit() {
        if (!validLegal('text', '提纲内容', this.state.inputContent, 1000, 0)) {
            return false;
        }

        window.confirmDialog(
            '确定保存提纲吗？',
            () => {
                this.addOrUpdateOutLine();
            },
            () => { }
        )
    }
    
    async addOrUpdateOutLine() {
        let item = this.state.outlineList.filter(item => item.id == this.state.editingId);
        
        
        let result = await this.props.addOrUpdateOutLine({
            topicId:this.props.topicId,
            outlineId: this.state.editingId ? this.state.editingId : '',
            content: normalFilter(this.state.inputContent),
        })
        if (result) {
            this.initOutline();
        }
    }
    
    /**
     * 显示菜单
     * 
     * @param {any} id 
     * @memberof OutlineList
     */
    showEditMenu(id) {
        
        this.setState({
            showMenuId:id
        })
    }
    hideEditMenu() {
        this.setState({
            showMenuId:''
        })
    }
    
    /**
     * 编辑当前提纲
     * 
     * @memberof OutlineList
     */
    editOutlineItem(item) {
        if (item.sendStatus == 'Y') {
            window.toast('已发送的提纲不能编辑');
            return false;
        }
        this.setState({
            editingId:item.id,
            inputContent:item.content
        })
    }
    

    /**
     * 确定删除
     * 
     * @memberof OutlineList
     */
    delOutlineItem(item) {
        if (item.sendStatus == 'Y') {
            window.toast('已发送的提纲不能删除');
            return false;
        }
        window.confirmDialog(
            '确定要删除此条提纲吗？',
            async () => {
                let result = await this.props.delOutLine({
                    topicId:this.props.topicId,
                    outlineId: item.id,
                })
                if (result) {
                    this.initOutline();
                }
            },
            () => { }
        )
    }

    async pushOutline(item) {
        if (item.sendStatus == 'Y') {
            return false;
        }
        let result = await this.props.addTopicSpeak('outline', item.id);
        if (getVal(result, 'state.code', '-1') == '0') {
            this.props.close();
            this.props.updateOutline('send', {
                ...item,
                updateTime: getVal(result, 'data.liveSpeakView.createTime', '0')
            })
        }
    }


    // 提纲模块
    liItem(item){
        return (<li className='outline-li' key={`outline-li-${item.id}`}>
            {
                this.state.editingId == item.id?
                <div className="edit">
                    <div className="text-body">
                        <CommonTextarea
                            className = "outline-li-input"
                            placeholder = '请输入提纲内容'
                            onChange={this.changeData}
                            noIntoView={!Detect.os.phone}
                            autoFocus={true}    
                            value={htmlTransferGlobal(this.state.inputContent) || ''}
                        />
                        <pre className="main-content"><code>{htmlTransferGlobal(this.state.inputContent)}</code></pre>
                    </div>    
                        <span className="btn-cancel" onClick={this.cancelEdit}>取消</span>
                        <span className="btn-submit" onClick={this.confirmEdit}>确认</span>
                </div> 
                :    
                <div className="display">
                    <pre className="content"><code>{htmlTransferGlobal(item.content)}</code></pre>
                        {
                            item.sendStatus=='Y'?
                            <span className={`btn-send disable`}>已发送</span>
                            :<span className={`btn-send`} onClick={()=>{this.pushOutline(item)}}>发送</span>

                        }    
                        <span className="menu-body">
                            <span className="btn-menu"
                                onClick={(e) => { e.stopPropagation(); this.showEditMenu(item.id)}}
                            ></span>
                            {
                                this.state.showMenuId == item.id?
                                <ul className="menu-ul">
                                    <li onClick={(e) => { this.editOutlineItem(item)}} >编辑</li>    
                                    <li onClick={(e) => { this.delOutlineItem(item)}}>删除</li>    
                                </ul>
                                :null    
                            }
                        </span>    
                </div>
            }    
        </li>)
    }

    render() {

        return (
            <div className='outline-list-module'>
                <div className="operation-tip">
                    <p>
                    添加并发送到主屏的提纲，可方便学员在上课时，快速检索定位对应内容，提升听课效率，提高学员满意度。
                    </p>
				</div>
                <ul id='outline-list-ul' className="outline-list-ul"  onClick={this.hideEditMenu} >
                    {   
                        this.state.outlineList.map((item) => {
                            return this.liItem(item);
                        })
                    }
                </ul>
                <div className="footer-panel">
                    {/* <span className="btn-clear">清空</span> */}
                    <span className="btn-add-outline on-log" 
                        data-log-region="tab-menu"
                        data-log-pos="material-btn-abstract-title"
                    onClick={this.addOutlineItem}>添加一个提纲标题</span>
                </div>

            </div>
        );
    }
}


function mapStateToProps (state) {
    return {
        outlineList: state.thousandLive.outlineList,
        topicId: state.thousandLive.topicInfo.id,
	}
}

const mapActionToProps = {
    addOrUpdateOutLine,
    delOutLine,
    updateOutline,
};

export default connect(mapStateToProps, mapActionToProps)(OutlineList);