import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import { fixScroll } from 'components/fix-scroll';
import ScrollToLoad from 'components/scrollToLoad';

import BottomDialog from 'components/dialog/bottom-dialog'
import errorCatch from 'components/error-boundary/index';

// 作业列表 （训练营作业选择框）
@errorCatch
@autobind
class JobListDialog extends Component {

    state = {
        selectIndex: -1
    }
    componentDidMount(){
        if (this.props.isFixScroll) {
            fixScroll(".job-scroll-box");
        }
    }

    componentWillReceiveProps (nextProps) {

        // 产品新加交互，跳过弹窗，直接为用户选择未完成作业跳转 （新训练营使用）
        if (nextProps.isShow && this.props.newInteraction) {
            const notFinishList = nextProps.data.filter(item => item.finishStatus === 'N')
            if (notFinishList.length > 0) {
                this.goWork(notFinishList[0])
            }
            return
        }

        if (nextProps.isShow && nextProps.data.length === 1) {
            this.goWork(nextProps.data[0])
        }
    }

    goWork (item, index) {
        if (typeof(index) !== undefined) {
            this.setState({
                selectIndex: index
            })
        }
        // if (item.finishStatus === 'Y') {
		// 	location.href = `/wechat/page/homework/details?id=${item.id}&topicId=${item.topicId}&liveId=`;
        // } else {
        //     location.href = `/wechat/page/homework/hand-in?id=${item.id}&topicId=${item.topicId}&liveId=`
        // }
        location.href = `/wechat/page/homework/details?id=${item.id}&topicId=${item.topicId}${this.props.liveId ? `&liveId=${this.props.liveId}` : ''}`;
    }

    render() {
        const { data } = this.props
        // 新交互 或 作业数小于1
        if (this.props.newInteraction || data.length <= 1) return null

        return data && data.length > 1 ? (
            <BottomDialog
                show={ this.props.isShow }
                theme='empty'
                onClose={ this.props.onClose }
                className="job-list-dialog-box"
            >
                <main className='job-list-dialog'>
                    <header>作业选择<i className="icon_delete close" onClick={ this.props.onClose }></i></header>
                    <main className="job-scroll-box">
                        {
                            data.map((item, index) => (
                                <p key={`job-item-${index}`} className={`job-item ${item.finishStatus === 'Y' ? 'complete' : ''} ${this.state.selectIndex === index ? 'select' : ''}`} onClick={ () => { this.goWork(item, index) }}>
                                    <span className="title">{item.title}</span>
                                    <span className="status">{item.finishStatus === 'Y' ? '已完成' : '未完成'}</span>
                                </p>
                            ))
                        }
                    </main>
                </main>
            </BottomDialog>
        ) : null
    }
}

export default JobListDialog;