import React, { Component } from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';

import { locationTo } from 'components/util';
import { request } from 'common_actions/common';


class BendManage extends Component {
    state = {
        config: [
            {
                id: 'consult',
                title: '留言咨询',
                attrs: {
                    'data-log-region': 'consult-manage',
                },
            },
            {
                id: 'comment',
                title: '课程评论',
                attrs: {
                    'data-log-region': 'comment-manage',
                },
            },
        ]
    }

    componentDidMount() {
        // 优先读缓存的
        try {
            const key = '__BEND_COMMENT_UNREAD_NUM_CACHE';
            const cache = JSON.parse(sessionStorage.getItem(key));
            if (cache && Date.now() - cache.time < 30000) {
                sessionStorage.removeItem(key);
                const config = [...this.state.config];
                config[1] = {
                    ...config[1],
                    unread: cache.num,
                }
                this.setState({config})
                return;
            }
        } catch(e) {}

        request({
            url: '/api/wechat/comment/getLiveCommentNum',
            method: 'POST',
            body: {
                liveId: this.props.location.query.liveId,
            }
        }).then(res => {
            if (res.state.code) throw Error(res.state.msg);

            if (res.data.num) {
                const config = [...this.state.config];
                config[1] = {
                    ...config[1],
                    unread: res.data.num,
                }
                this.setState({config})
            }
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        return <Page title="课程咨询管理" className="comment-b-manage">
            <div>
                {
                    this.state.config.map((item, index) => 
                        <div key={index}
                            className={`entry-item on-log ${item.id}`}
                            onClick={() => this.onClickItem(index)}
                            {...item.attrs}
                        >
                            <div className="img"></div>
                            <div className="title">{item.title}</div>
                            {
                                item.unread > 0 &&
                                <div className="unread">{item.unread > 999 ? '999+' : item.unread}</div>
                            }
                            <i className="icon_enter"></i>
                        </div>
                    )
                }
            </div>
        </Page>
    }

    onClickItem = index => {
        if (index === 0) {
            locationTo(`/wechat/page/live/message/${this.props.location.query.liveId}`);
        } else {
            setTimeout(() => {
                this.props.router.push(`/wechat/page/comment/bend-course-list?liveId=${this.props.location.query.liveId}`);
            }, 10)
        }
    }
}




function mapStateToProps(state) {
    return {
        
    }
}

const mapActionToProps = {
}

module.exports = connect(mapStateToProps, mapActionToProps)(BendManage);