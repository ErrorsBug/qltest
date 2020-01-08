import React, { Component } from 'react';
import { Link } from 'react-router';

import TagCourseList from '../../checkin-camp-list/tag-course-list';
import CategoryList from './category-list';

class MiniTrainingList extends Component {
    render() {
        return (
            <TagCourseList
                liveId={this.props.liveId}
                clientRole={this.props.clientRole}
                isLiveIndex={true}
                pageSize={this.props.showNum}
                businessType="camp"
                tagItemRegion="train-tag-item"
            >
                {
                    entity =>
                        <div>
                        <div className="new-channel training-list">
                            <Link
                            to={`/wechat/page/live-studio/training-list/${this.props.liveId}`}>
                                {entity}
                            </Link>
                        </div>
                    </div>
                }
            </TagCourseList>
        )
    }
}

export default MiniTrainingList;