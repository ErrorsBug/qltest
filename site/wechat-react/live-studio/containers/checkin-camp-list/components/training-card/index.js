import React, { Component } from 'react';
import PropType from 'prop-types';
import { locationTo } from 'components/util';

class TrainingCard extends Component {
    render(){
        const {
            camp,
            clientRole,
            displayBottomActionSheet,
        } = this.props;
        const {
            id,
            headImage: poster,
            name,
            status,
            communityStatus
        } = this.props.camp;
        return (
            <div className="checkin-camp-card2">
                <div className="checkin-camp-container flex flex-row">
                    <div 
                        className="checkin-camp-poster on-log flex-no-shrink" 
                        data-log-region="checkin-camp-list"
                        data-log-pos={this.props.index + 1} 
                        onClick={() => {locationTo(`/wechat/page/training-intro?campId=${id}`)}}
                    >
                        <div className="c-abs-pic-wrap">
                            <img src={poster + '?x-oss-process=image/resize,m_fill,limit_0,w_220,h_138'} />
                        </div>
                        {
                            status === 'N' && <span className="hide-icon icon_hidden"></span>
                        }
                        { communityStatus == 'Y' && <span className="community-sign">群</span> }
                    </div>
                    <div className="checkin-camp-detail training-detail flex-grow-1 flex flex-col jc-between">
                        <div 
                            className="checkin-camp-name elli-text on-log on-visible" 
                            data-log-region="checkin-camp-list"
                            data-log-pos={this.props.index + 1} 
                            onClick={() => {locationTo(`/wechat/page/training-intro?campId=${id}`)}}
                        >
                            {name}
                        </div>
                       
                        <div className="training-desc flex flex-row flex-vcenter jc-between">
                           <div>共{camp.periodCount}期&nbsp;&nbsp;|&nbsp;&nbsp;火热招生中</div>
                           {
                                clientRole === 'B' && 
                                <div className="checkin-camp-arrange on-log on-visible" 
                                    data-log-region="checkin-camp-list-option" 
                                    data-log-pos={this.props.index + 1}  
                                    onClick={() => {displayBottomActionSheet(camp, this.props.index)}}>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

TrainingCard.propTypes = {
    camp: PropType.object.isRequired,
    sysTime: PropType.number.isRequired,
    clientRole: PropType.string.isRequired,
    displayBottomActionSheet: PropType.func,
    isShowAuthNum: PropType.string,
    isSHowAffairCount: PropType.string,
}

TrainingCard.defaultProps = {
    isShowAuthNum: 'Y',
    isSHowAffairCount: 'Y',
}

export default TrainingCard;