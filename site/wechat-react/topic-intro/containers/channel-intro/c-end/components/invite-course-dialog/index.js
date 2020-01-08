import React, { Component } from 'react';
import { autobind, throttle } from 'core-decorators';
import ScrollToLoad from 'components/scrollToLoad';
@autobind
class InviteCourseDialog extends Component {

    constructor(props){
        super(props)
        this.state = {
            show: false,
            topicList: []
        }
    }

    componentDidMount(){

    }

    componentWillReceiveProps(newProps){
        if(newProps.topicList.length !== this.props.topicList.length
            || (newProps.topicList.length && newProps.topicList !== this.props.topicList)
        ){
            let topicList = newProps.topicList.map((item)=>{
                if(this.currentSelecetTopic && this.currentSelecetTopic.id === item.id){
                    return {
                        ...item,
                        select: true,
                    }
                }else {
                    return {
                        ...item,
                        select: false,
                    }
                }
            })
            this.setState({topicList})
        }
    }

    show(){
        this.setState({show: true})
        // 手动触发打曝光日志
        setTimeout(() => {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }, 50);
    }

    hide(){
        this.setState({show: false})
    }

    check(currentTopic){
        // 试听课程，单节付费课程不允许选中
        if(currentTopic.isAuditionOpen === 'Y' || currentTopic.isSingleBuy === 'Y' ||this.currentSelecetTopic && this.currentSelecetTopic.id == currentTopic.id){
            return
        }
        this.currentSelecetTopic = currentTopic
        let topicList = this.state.topicList.map((item)=>{
            if(currentTopic.id == item.id){
                return {
                    ...item,
                    select: true,
                }
            }else {
                return {
                    ...item,
                    select: false,
                }
            }
        })
        this.setState({topicList})
    }

    // 分享给好友
    share(){
        if(!this.currentSelecetTopic){
            window.toast('未选择分享的课程')
            return
        }
        this.setState({show: false});
        this.props.openInviteFriendsToListenDialog && this.props.openInviteFriendsToListenDialog(this.currentSelecetTopic)
    }

	render(){
        if(!this.state.show){
            return ''
        }
	    return (
		    <div className="invite-course-dialog-container">
			    <div className="bg" onClick = {this.hide}></div>
                <div className="invite-course-dialog-content">
                    <div className="header">
                        <div className="title">选择你要分享的课程</div>
                        <span onClick = {this.hide}>取消</span>
                    </div>
                    <ScrollToLoad
                        className="scroll-container scroll-content"
                        toBottomHeight={100}
                        loadNext={this.props.loadMore}
                        noMore = {this.props.noMore}
                    >
                        {
                            this.state.topicList.map((item, index) => (
                                <div className={`topic-list${item.isAuditionOpen === 'Y' || item.isSingleBuy === 'Y' ? ' disabled' : ''}${item.select ? ' check' : ''}`} 
                                    key={`list-${index}`} 
                                    onClick={()=>{this.check(item)}}
                                >
                                    <div className="topic-title">{item.topic}</div>
                                    {
                                        item.isAuditionOpen === 'Y' ?
                                        <div className="label">试听</div> : 
                                        null
                                    }
                                    {
                                        item.isSingleBuy === 'Y' ?
                                        <div className="label">单节付费</div> : 
                                        null
                                    }
                                </div>
                            ))
                        }
                    </ScrollToLoad>
                    <div className="footer">
                        <div className="share-btn on-log on-visible" data-log-region="series-bottom" data-log-pos="choose-subtopic" onClick={this.share}>发送给好友</div>
                    </div>
                </div>
		    </div>
        )
    }
}

export default InviteCourseDialog;