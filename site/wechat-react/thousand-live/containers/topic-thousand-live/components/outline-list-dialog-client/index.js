import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createPortal } from 'react-dom';
import { autobind } from 'core-decorators';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import BottomDialog from 'components/dialog/bottom-dialog';
import { htmlTransferGlobal, sortBy } from 'components/util';
import { fixScroll } from 'components/fix-scroll';

@autobind
class OutlineListDialogClient extends Component {
    state = {
        markId:0,
    }

    componentDidMount() {
    }
    componentDidUpdate(prevProps, prevState) {
        if ( this.props.show && prevProps.show != this.props.show) {
            // 修正滚动露底
            fixScroll('#outline-list-client');
            this.initMark();
        }
    }
    
    // 跳到提纲的位置
    async gotoOutline(item) {
        let time = item.speakTime;
        if(!item.speakTime){
            return false;
        }
        let speakItem = this.props.totalSpeakList.filter(item => {
            return item.createTime == String(time);
        })

        if (speakItem.length) {
            this.props.scrollToSpeak(speakItem[0].id,'top')
            this.props.close();
        } else {
            // 如果已加载的消息流没有提纲，则加载消息流
            await this.props.getTopicSpeakList({ time, clearList: true });
            this.props.scrollToSpeak(this.props.totalSpeakList[0].id,'top');
            this.props.close();
        }
    }

    // 初始化高亮
    initMark() {
        let msgItem = this.props.getOutlistMark();
        let outlineList = this.props.outlineList.sort(sortBy('speakTime', false));
        let outlineMarkItem = outlineList.find(item => {
            return item.speakTime <= msgItem.createTime;
        })
        this.setState({
            markId:outlineMarkItem ? outlineMarkItem.id : 0,
        })
    }


    render() {
        if (typeof (document) == 'undefined') {
            return false;
        }
        const portalBody = document.querySelector(".portal-low");
        if (!portalBody) return null

        return createPortal(
            <BottomDialog 
                className='outline-dialog-c'
                show={this.props.show}
                theme="empty"
                bghide={true}
                onClose={this.props.close}
            >
                <div className="title-bar">
                    <span className="title">课程提纲</span>
                    <span className="info">点击课程提纲可快速定位到相应位置</span>

                    <span className="btn-close icon_down" onClick={this.props.close}></span>
                </div>
                <div id='outline-list-client' className="outline-main">
                    <ul className='outline-list'>
                        {
                            this.props.outlineList.map(item => {
                                return <li className={this.state.markId == item.id ? 'on':''} key={`outline-item-${item.id}`} onClick={() => { this.gotoOutline(item) }}>
                                    <pre className="main-content"><code>{htmlTransferGlobal(item.content)}</code></pre>
                                </li>
                            })
                        }    
                    </ul>
                </div>
            </BottomDialog>
            ,
            portalBody
        );
    }
}

function mapStateToProps (state) {
    return {
        outlineList: state.thousandLive.outlineList,
        topicId: state.thousandLive.topicInfo.id,
        totalSpeakList: state.thousandLive.totalSpeakList,
	}
}

const mapActionToProps = {
};

export default connect(mapStateToProps, mapActionToProps)(OutlineListDialogClient);
