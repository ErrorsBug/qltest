import React, { Component } from 'react';
import MyFocusBar from './my-focus-bar'
import {Link} from 'react-router'

class EmptyTimeLine extends Component {
    render() {
        return (
            <div className="empty">
                <MyFocusBar
                    myLives={this.props.myLives}
                    myAdminLives={this.props.myAdminLives}
                    myFocusLives={this.props.myFocusLives}
                    mineFocusList={this.props.mineFocusList}
                    userType={this.props.userType}
                    routerGotoHandle={this.props.routerGotoHandle}
                />
                <img src="//img.qlchat.com/qlLive/liveCommon/empty-page-empty.png" alt="" className="empty-img" />
                <div className="no-time-line">暂无关注的直播间动态</div>
                <div className="btn-con">
                    <Link to="/wechat/page/recommend">
                        <div className="recommend-btn">查看推荐课程</div>
                    </Link>
                </div>

            </div>
        );
    }
}


export default EmptyTimeLine;