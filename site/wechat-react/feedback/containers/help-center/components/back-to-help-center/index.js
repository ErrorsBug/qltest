import React from 'react';
import { getUrlParams } from 'components/url-utils';
import { locationTo } from 'components/util';
import { fillParams } from 'components/url-utils';
import { isQlchat } from 'components/envi';

const isApp = isQlchat()

export default class BackToHelpCenter extends React.PureComponent {
    render() {
        return !isApp ? 
        <div className="p-help-cen-back-to-cen">
            <div className="btn on-log"
                onClick={this.onClick}
                data-log-region="back-to-help-center"
            >返回帮助中心</div>
            {
                this.props.hasIndex &&
                <div className="btn on-log"
                    onClick={this.onClickBackToIndex}
                    data-log-region="back-to-index"
                >返回首页</div>
            }
        </div> : null
    }

    onClick = () => {
        const urlParams = getUrlParams();
        // if (urlParams.hcstep > 0) {
        //     history.go(-urlParams.hcstep);
        // } else {
            locationTo(fillParams({
                role: urlParams.role,
            }, '/wechat/page/help-center'));
        // }
    }

    onClickBackToIndex = () => {

        if (this.props.liveId) {
            locationTo(`/wechat/page/live/${this.props.liveId}`)
        } else {
            locationTo('/wechat/page/recommend');
        }
    }
}