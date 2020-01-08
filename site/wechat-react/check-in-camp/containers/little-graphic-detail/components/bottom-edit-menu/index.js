import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Detect from 'components/detect';
import { autobind } from 'core-decorators';
import {locationTo} from 'components/util';

@autobind
class BottomEditMenu extends Component {

    gotoCheckIn(){
        if (this.props.payStatus === 'N') {
            locationTo(`/wechat/page/camp-detail?campId=${this.props.campId}`);
            return;
        }
        if (this.props.isBegin === 'N') {
            window.toast('打卡暂未开始');
            return false;
        }
        if (this.props.isEnd === 'Y') {
            window.toast(`打卡已经结束`);
            return false;
        }
        locationTo(`/wechat/page/camp-detail?campId=${this.props.campId}#checkInPage=true`);
    }

    render() {
        return (
            <div className='bottom-menu'>
                {
                    this.props.allowMGLive ?
                        <div
                            className="btn-edit"
                            onClick={() => { locationTo(`/wechat/page/check-in-camp/create-little-graphic/${this.props.liveId}/${this.props.campId}?topicId=${this.props.topicId}`) }}
                        >
                            编辑
                    </div>
                    :
                    null
                }
                {
                    (this.props.affairStatus == 'Y' || this.props.allowMGLive) ?
                        <div className="btn-enter" onClick = {()=>{locationTo(`/wechat/page/camp-detail?campId=${this.props.campId}`)}}>进入打卡详情</div>
                    :
                        <div className="btn-enter" onClick = {this.gotoCheckIn}>{this.props.payStatus === 'Y' ? '去打卡' : '参与打卡'}</div>
                }
                
                
            </div>
        );
    }
}

BottomEditMenu.propTypes = {

};

const mapStateToProps = (state) => ({
    isBegin: state.campBasicInfo.dateInfo.isBegin,
    isEnd: state.campBasicInfo.dateInfo.isEnd,
    payStatus: state.campUserInfo.payStatus,
});

export default connect(mapStateToProps)(BottomEditMenu);