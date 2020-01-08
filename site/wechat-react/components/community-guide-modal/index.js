import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MiddleDialog from 'components/dialog/middle-dialog';
import { getDomainUrl } from 'common_actions/common';
import { locationTo } from 'components/util';

class CommunityGuideModal extends Component {

    data = {
        // 群二维码页面域名
        domain: '',
    }

    async getDomain() {
        try {
            let result = await getDomainUrl({
                type: 'activityCommunity'
            })();
            if (result.state.code == 0) {
                this.data.domain = result.data.domainUrl;
            } else {
                window.toast(result.state.msg);
            }
        } catch (error) {
            console.error(error)
        }
    }

    componentDidMount = async () => {
        this.getDomain();
    }

    render() {
        const { show, onClose, type, groupName } = this.props;
        return (
            <MiddleDialog
                className="community-guide-modal"
                show={show}
                bghide={true}
                onClose={onClose}
            >
                <section className="guide-tip">
                    <div className="tip-1">
                        {type == 'joinCommunity' && '加入社群'}
                        {type == 'followLive' && '关注成功'}
                    </div>
                    <div className="tip-2">
                        {type == 'joinCommunity' && '加入直播间社群了解课程'}
                        {type == 'followLive' && '您可以加入直播间社群'}
                    </div>
                </section>
                <section className="community-group">
                    <img className="group-thumbnail" alt="" src={require('./img/thumbnail.png')} />
                    <div className="tip-3">{groupName}</div>
                    <div className="tip-4">(限时进群中)</div>
                    <div className="join-button-wrapper"><div className="join-button" role="button" onClick={() => {
                        locationTo(`${this.data.domain}wechat/page/community-qrcode?liveId=${this.props.liveId}&communityCode=${this.props.communityCode}`);
                    }}>免费加入社群</div></div>
                </section>
                <div className={`header-icon ${type == 'followLive' ? 'success-icon' : 'group-icon'}`}></div>
            </MiddleDialog>
        )
    }
}

CommunityGuideModal.propsType = {
    show: PropTypes.bool,
    type: PropTypes.oneOf(['followLive', 'joinCommunity']),
    onClose: PropTypes.func,
    groupName: PropTypes.string,
    liveId: PropTypes.oneOfType(['string', 'number']),
    communityCode: PropTypes.oneOfType(['string', 'number']),
}

CommunityGuideModal.defaultProps = {
    show: false,
    type: 'joinCommunity',
    onClose: () => {},
    groupName: '',
    liveId: '',
    communityCode: '',
}

export default CommunityGuideModal;