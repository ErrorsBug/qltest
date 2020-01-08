import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { autobind } from 'core-decorators';
import {createPortal} from 'react-dom'
import { locationTo } from 'components/util';
@autobind
class ChargeTag extends Component {

    state = {
        show: false,
        // 分类Id
        tagId: '',
        // 分类名
        tagName: ''
    }

    constructor(props) {
        super(props);
    }

    show (){
        this.setState({
            show: true
        })
    }

    componentWillReceiveProps(nextProps){
        this.setState({tagId: nextProps.tagId})
    }

    componentDidMount() {
        
    }

    // 点击完成按钮
    complete(){
        this.setState({show: false})
        this.props.selectChannelTag(this.state.tagId, this.state.tagName)
    }

    // 标签选择选择
    selectTag(tagId, tagName){
        this.setState({tagId, tagName})
    }

    render() {
        const {
            show,
            tagId
        } = this.state
        return (
                <div className="charge-tag-container">
                    <ReactCSSTransitionGroup
                        transitionName="black"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={300}>
                    {
                        show && 
                        <div className="black" onClick={()=>{this.setState({show: false})}}></div>
                    }
                    </ReactCSSTransitionGroup>
                    <ReactCSSTransitionGroup
                        transitionName="charge-tag-tst"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={300}>
                    {
                        show && 
                        <div className="charge-tag">
                            <div className="header">系列课分类
                                <div className="btn-create-tag" onClick={this.props.showCreateType.bind(this)}>新建分类</div>
                                <div className="btn-manage-tag" onClick={()=>{locationTo(`/live/channel/channelTags.htm?liveId=${this.props.liveId}`)}}>管理分类</div>
                            </div>
                            <div className="all-charge-tag">
                                <div className="list" onClick={this.selectTag.bind(this,'','')}>
                                    <span className="content">暂不分类</span>
                                    <div className={`img ${tagId === '' ? 'checked' : 'unchecked'}`}></div>
                                </div>
                                {
                                    this.props.channelTagList.length > 0 && this.props.channelTagList.map((item, index) => (
                                        <div className="list" onClick={this.selectTag.bind(this,item.id,item.name)} key={`tag-${index}`}>
                                            <span className="content">{item.name}</span>
                                            <div className={`img ${tagId === item.id ? 'checked' : 'unchecked'}`}></div>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className="complete" onClick={this.complete}>确定</div>
                        </div>
                    }
                    </ReactCSSTransitionGroup>
                </div>
        )
    }
}

ChargeTag.propTypes = {

};

export default ChargeTag;