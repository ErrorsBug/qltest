import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { locationTo } from 'components/util';
import Redpoint from "components/redpoint";

class QuickEnterBar extends Component {
    state={
        showAll: false
    }
    componentDidMount(){
    }


    showRealNameDialog(){
        this.props.showRealNameDialog && this.props.showRealNameDialog();
    }
    render() {
        const {
            showAll
        } = this.state
        return (
            [
            <div className={`quick-enter-bar${!showAll ? ' brief' : ''}`}>
                <div className="quick-enter-bar-list">
                    <div className="quick-enter btn-create-topic on-log "
                        log-region="create-topic" 
                        onClick={()=>{
                            if(!this.props.isRealName&&this.props.isPop){
                                window.toast('实名认证');
                                this.showRealNameDialog();
                                return false;
                            }else if(this.props.beginCountGt){
                                window.toast('正在进行的话题最多可创建50个');
                                return false;
                            }
                            locationTo(`/wechat/page/topic-create?liveId=${this.props.liveId}`)
                        }}
                    >
                        单课
                    </div>
                    <div className="quick-enter btn-create-channel on-log"
                        log-region="create-channel"
                        onClick={()=>{locationTo(`/wechat/page/channel-create?liveId=${this.props.liveId}`)}}>
                        系列课
                    </div>
                    <div className="quick-enter btn-create-camp on-log"
                        log-region="create-camp"
                        onClick={()=>{locationTo(`/wechat/page/check-in-camp/new-camp/${this.props.liveId}`)}}>
                        打卡课
                    </div>
                    <div className="quick-enter btn-create-knowledge on-log"
                        log-region="CreateShortvideo"
                        onClick={()=>{locationTo(`/wechat/page/short-knowledge/create?liveId=${this.props.liveId}`)}}>
                        短知识
                        <Redpoint pointContent='new'
                            pointStyle={'font-red-point'}
                            pointWrapStyle="function-red" 
                            // pointNpval={`短知识`} 
                            />
                    </div> 
                    <div className="quick-enter btn-reprint on-log"
                        log-region="media-market"
                        onClick={()=>{locationTo(`/wechat/page/live-studio/media-market?selectedLiveId=${this.props.liveId}`)}}>
                        转载课
                    </div>
                    <div className="quick-enter btn-homework on-log"
                        log-region="homework"
                        onClick={()=>{locationTo(`/wechat/page/homework/create?liveId=${this.props.liveId}`)}}>
                        作业
                    </div>
                </div>
                <div className="quick-enter-bar-list pc">
                    <p className="tips-text">电脑端-管理后台特有功能</p>
                    <div className="quick-enter btn-exam on-log"
                        log-region="exam"
                        onClick={this.props.showPcManageBox}>
                        考试
                    </div>
                    <div className="quick-enter btn-form on-log"
                        log-region="form"
                        onClick={this.props.showPcManageBox}>
                        表单
                    </div> 
                    <div className="quick-enter btn-community on-log"
                        log-region="media-market"
                        onClick={this.props.showPcManageBox}>
                        社群
                    </div>
                    <div className="quick-enter btn-training on-log"
                        log-region="training"
                        onClick={this.props.showPcManageBox}>
                        训练营
                    </div>
                </div>
            </div>,
            <div className="flex flex-center">
            <span 
                className={`show-all-btn on-log ${showAll ? 'up' : 'down'}`} 
                data-log-region = "show-all-btn"
                data-log-pos = "create"
                onClick={() => {
                    this.setState({
                        showAll: !showAll
                    })
                }}>{showAll ? '收起' : '展开'}</span></div>
            ]
        );
    }
}

QuickEnterBar.propTypes = {

};

export default QuickEnterBar;