import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { imgUrlFormat } from 'components/util';

/**
 * 从channel/index抽取出来的组件，暂无徽章
 */

export default class LiveFollowInfo extends Component {
    static propTypes = {
        liveInfo: PropTypes.object,
        onClickFollow: PropTypes.func,
        isAdmin: PropTypes.bool,
    }

    render() {
        let { liveInfo, isAdmin } = this.props;
        let { entity } = liveInfo;

        if (!entity.id) return false;

        return (
            <div className="__live-info">
                <a href={`/wechat/page/live/${entity.id}`}>
                    <div className="live-info-wrap">
                        <div className="live-desc">
                            <div className="live-icon" style={{
                                backgroundImage: `url(${imgUrlFormat(entity.logo, '@62w_62h_1e_1c_2o')})`,
                            }}
                            />
                            <div className='title'>{entity.name}</div>
                        </div>

                        {isAdmin ?
                            <span className="link-icon icon_enter"></span> :
                                liveInfo.isFollow ?
                                    <div onClick={this.onClickFollow} className="follow-btn followed">
                                        <div className="btn-text">已关注</div>
                                    </div>
                                    :
                                    <div onClick={this.onClickFollow} className="follow-btn">
                                        <div className="add-icon" />
                                        <div className="btn-text">关注</div>
                                    </div>
                        }
                    </div>
                </a>
            </div>
        )
    }

    onClickFollow = e => {
        e.preventDefault();
        this.props.onClickFollow && this.props.onClickFollow();
    }

}
