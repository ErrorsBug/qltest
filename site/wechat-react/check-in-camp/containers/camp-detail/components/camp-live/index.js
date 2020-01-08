import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { imgUrlFormat, locationTo } from 'components/util';
import { followLive } from '../../../../actions/mine';
import { setCampBasicInfo } from '../../../../model/camp-basic-info/actions';

const defaultLiveLogo = 'https://img.qlchat.com/qlLive/liveCommon/normalLogo.png';
@autobind
class CampLive extends Component{

    /**
     * 关注或取关训练营所属直播间
     */
    async handleFollowBtnClick(e){
        e.stopPropagation();
        e.preventDefault();

        const result = await this.props.followLive({liveId: this.props.liveId, status: 'Y'});
        if (result.state.code === 0) {
            setCampBasicInfo({
                isFollow: true
            });
        }
    }

    render(){
        const {liveId, client, liveName, headImage, isFollow} = this.props;
        return (
            <div className="check-in-camp-live">
            {
                client === 'C' ?
                    <div className="live-info fx-mg">
                        <a href={`/wechat/page/live/${liveId}`}>
                            <div className="live-info-wrap">
                                <div className="live-desc">
                                    <div className="live-icon" style={{
                                        backgroundImage: `url(${imgUrlFormat(headImage || defaultLiveLogo, '@62w_62h_1e_1c_2o')})`,
                                    }}
                                    />
                                    <div className='title'>{liveName}</div>
                                </div>
    
                                {
                                    !isFollow  ? 
                                    <div className="follow-btn" onClick={this.handleFollowBtnClick}>
                                        <div className="add-icon" />
                                        <div className="btn-text">关注</div>
                                    </div> :
                                    <span className="link-icon icon_enter" />
                                }
                            </div>
                        </a>
                    </div>
                :
                    <div className="live-info">
                        <a href={`/wechat/page/live/${liveId}`}>
                            <div className="live-info-wrap icon_enter">
                                <div className="live-desc">
                                    <div className="live-icon" style={{
                                        backgroundImage: `url(${imgUrlFormat(headImage || defaultLiveLogo, '@62w_62h_1e_1c_2o')})`,
                                    }}
                                    />
                                    <div className='title'>{liveName}</div>
                                </div>
                                <span className="link-icon icon_enter" />
                            </div>
                        </a>
                    </div>             
            }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    liveId: state.campBasicInfo.liveId,
    client: state.campAuthInfo.allowMGLive ? 'B' : 'C',
    liveName: state.campBasicInfo.liveName,
    headImage: state.campBasicInfo.liveHeadImage,
    isFollow: state.campBasicInfo.isFollow,
});

const mapActionToProps = {
    followLive,
};

export default connect(mapStateToProps, mapActionToProps)(CampLive);