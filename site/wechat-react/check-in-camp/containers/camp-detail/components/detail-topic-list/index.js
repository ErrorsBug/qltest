import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getVal } from 'components/util';
import { autobind } from 'core-decorators';
import DetailTopicItem from '../detail-topic-item';
import BottomDialog from '../../../../components/dialog/bottom-dialog';
import { campTopicsModel } from '../../../../model/';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const { requestDeleteCampTopic, requestSetDisplayCampTopic, requestEndCampTopic } = campTopicsModel;

@autobind
export class DetailTopicList extends Component {
    static propTypes = {

    }

    constructor(props) {
        super(props)
        
        this.state = {
            showBottomDialog: false,
            currentTopic: {
                index: '',
                title: '',
                topicId: '',
                displayStatus: '',
                style: '',
                status: '',
            }
        }
    }

    setBottomDialogDisplay(isShow) {
        this.setState({ showBottomDialog: isShow });
    }

    showOperationDialog() {
        this.setBottomDialogDisplay(true);
    }

    hideOperationDialog() {
        this.setBottomDialogDisplay(false);
    }

    setCurrentTopic({index, title, topicId, displayStatus, style, status }) {
        // console.log(topicId)
        this.setState({ 
            currentTopic: { index, title, topicId, displayStatus, style, status }
        });
    }

    setTopicDisplay(status) {
        this.hideOperationDialog();
        const { topicId } = this.state.currentTopic;
        requestSetDisplayCampTopic({topicId, status})
    }

    showDeleteConfirmDialog() {
        window.simpleDialog({
            msg: '确定删除该课程？',
            onConfirm: this.onDeleteConfirm,
        })
    }

    onDeleteConfirm() {
        const { topicId } = this.state.currentTopic;
        requestDeleteCampTopic({topicId});
        this.hideOperationDialog();
    }

    showEndConfirmDialog() {
        window.simpleDialog({
            msg: '确定结束该课程？',
            onConfirm: this.onEndCourse,
        })
    }

    onEndCourse() {
        const { topicId } = this.state.currentTopic;
        requestEndCampTopic({topicId});
        this.hideOperationDialog();
    }

    render() {
        // console.log(this.props.campTopicList)
        const { title, displayStatus, status, style } = this.state.currentTopic;
        const isShowEndCourse = status === 'beginning' && style !== 'graphic' && style !== 'audioGraphic' && style !== 'videoGraphic';
        // console.log(status)
        return (
            <div className="detail-topic-list-container">
                 <BottomDialog
                    show={this.state.showBottomDialog}
                    onClose={this.hideOperationDialog}
                    showCloseBtn={true}
                    className="topic-bottomDialog"
                >
                    <div className="topic-bottomDialog-container">
                        <div className="base-flex title ">
                            <span>课程</span>{title}
                        </div>
                        {
                            displayStatus === 'Y' ?
                            <div className="base-flex oper" onClick={() => this.setTopicDisplay('N')}>隐藏该课程</div> :
                            <div className="base-flex oper" onClick={() => this.setTopicDisplay('Y')}>显示该课程</div>
                        }
                        {/* <div className="oper base-flex">移出训练营</div> */}
                        {
                            isShowEndCourse ? 
                            <div className="base-flex oper delete" onClick={this.showEndConfirmDialog}>结束课程（不可恢复）</div> :
                            <div className=" base-flex oper delete" onClick={this.showDeleteConfirmDialog}>删除课程(不可恢复)</div>
                        }
                    </div>
                </BottomDialog>
                <div className="title"><span className="block"></span>课程列表</div>
                <ReactCSSTransitionGroup
                    transitionName="detail-topic-item"
                    transitionEnter={false}
                    transitionLeaveTimeout={300}
                >
                    {
                        this.props.campTopicList.map((item, index) => {
                            return <DetailTopicItem 
                                index={index}
                                key={ `topic-item-${item.topicId}` }
                                id={item.topicId}
                                chargeType={ item.type }
                                status={ item.status }
                                startTime={ item.startTimeStamp }
                                timeNow={ +new Date }
                                topicStyle={ item.style }
                                logo={ item.backgroudUrl }
                                browseNum={ item.browseNum }
                                title={ item.topicName }
                                topicId={ item.topicId }
                                displayStatus={ item.displayStatus}
                                allowMGLive={this.props.allowMGLive}
                                showOperationDialog={this.showOperationDialog}
                                setCurrentTopic={this.setCurrentTopic}
                                style={item.style}
                            />
                        })
                    }
                    {
                        this.props.campTopicList && this.props.campTopicList.length == 0 ?
                        <div className="blank-intro">暂无课程~</div> :
                        null
                    }
               </ReactCSSTransitionGroup>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    name: getVal(state, 'campBasicInfo.name'),
    campTopicList: getVal(state, 'campTopics.campTopicList', []),
    allowMGLive: getVal(state, 'campAuthInfo.allowMGLive', false),
})

const mapDispatchToProps = {
   
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailTopicList)
