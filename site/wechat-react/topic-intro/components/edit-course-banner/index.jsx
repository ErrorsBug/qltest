import * as React from 'react';
export class EditCourseBanner extends React.Component {
    render() {
        return (<div className="edit-course-banner_DFETG">
                <div className="banner-text">
                    {this.props.type == 'headImage' ? '在线设计头图，操作简单、轻松美化' : '一键使用课程介绍模版，提高购买转化率'}
                </div>
                <div className="btn-details" onClick={this.props.onDetails}>
                    查看
                </div>
            </div>);
    }
}
EditCourseBanner.defaultProps = {
    onDetails: () => { }
};
