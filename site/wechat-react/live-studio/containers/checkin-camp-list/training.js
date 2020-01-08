import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';
import TagCourseList from './tag-course-list';

class TrainingList extends Component {
    state = {
        businessType: this.props.location.pathname.indexOf('live-channel-list') >= 0 ? 'channel' : 'camp',
    }

    render(){
        return (
            <Page title={this.state.businessType === 'channel' ? '系列课列表' : '训练营列表'} className="p-train-list">
                <TagCourseList
                    liveId={this.props.params.liveId}
                    businessType={this.state.businessType}
                    power={this.props.power}
                    clientRole={this.props.clientRole}
                    tagItemRegion={this.state.businessType === 'channel' ? 'channel-tag-item' : 'train-tag-item'}
                />
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
    power: state.live.power,
    clientRole: state.live.power.allowMGLive ? 'B' : 'C',
});

const mapActionToProps = {
};

export default connect(mapStateToProps, mapActionToProps)(TrainingList);