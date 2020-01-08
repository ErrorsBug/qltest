import React, { PureComponent, Fragment } from 'react';
import CommunityGuideModal from 'components/community-guide-modal';
import classnames from 'classnames';

class CommunitySuspension extends PureComponent {

    state = {
        renderToolTip: true,
        showToolTip: false,
        showModal: false,
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                showToolTip: true
            }, () => {
                setTimeout(() => {
                    this.setState({
                        renderToolTip: false
                    })
                }, 3000);
            });
        }, 1500);
    }

    render() {
        return (
            <Fragment>
                <div className={classnames('community-suspension', {
                    'member-up': this.props.isFixMemberBlock
                })} role="button" onClick={() => {
                    this.setState({
                        showModal: true
                    });
                }}>
                {
                    this.state.renderToolTip && <div className={`tooltip ${this.state.showToolTip ? 'visible-tooltip' : ''}`}>加入课程的学习群<br/>随时关注老师的课程消息!</div>
                }
                </div>
                <CommunityGuideModal 
                    show={this.state.showModal}
                    liveId={this.props.liveId}
                    type="joinCommunity"
                    groupName={this.props.groupName}
                    communityCode={this.props.communityCode}
                    onClose={() => { this.setState({ showModal: false }) }}
                />
            </Fragment>
        )
    }
}

export default CommunitySuspension;