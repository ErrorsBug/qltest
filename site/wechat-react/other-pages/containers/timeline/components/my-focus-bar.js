import React, { Component } from 'react';
import myFocus from '../img/mine-focus.png'
import { locationTo, imgUrlFormat } from 'components/util'
import { Link } from 'react-router';
import Picture from 'ql-react-picture';

class MyFocusBar extends Component {
    gotoLiveHandle = (liveId) => {
        locationTo("/live/" + liveId + ".htm")
    }
    render() {
        return (
            <div className="my-focus-bar">
                <div className="my-focus-container">
                    <div className="my-focus-wrap">
                        <div className="my-focus-list">
                            <div className="my-focus-item on-log"
                                 onClick={this.props.routerGotoHandle.bind(this, "/wechat/page/timeline/mine-focus")}
                                 data-log-name="我的关注"
                                 data-log-region="mine-focus"
                            >
                                <div className="head-img mine-focus">
                                    <div className="img-wrap">
                                        <img src={myFocus} className="unbr" />
                                    </div>
                                </div>
                                <div className="name">我的关注</div>
                            </div>
                            {
                                (this.props.myAdminLives && this.props.myAdminLives.length > 0) ? 
                                    this.props.myAdminLives.map((item, idx) => {
                                        if(item) {
                                            return (
                                                <div
                                                    className="my-focus-item on-log"
                                                    key={"my-admin-item-" + idx}
                                                    onClick={this.gotoLiveHandle.bind(this, item.id)}
                                                    data-log-name="直播间"
                                                    data-log-region="my-focus-item"
                                                    data-log-pos={`my-admin-item-${idx}`}
                                                >
                                                    <div className="head-img">
                                                        <div className="img-wrap">
                                                            <div className="c-abs-pic-wrap"><Picture src={item.logo} placeholder={true} resize={{w:"120", h:"120"}} /></div>
                                                        </div>
                                                    </div>
                                                    <div className="name">{item.name}</div>
                                                </div>
                                            )
                                        }
                                    }) 

                                : ""
                            }
                            {
                                (this.props.myFocusLives && this.props.myFocusLives.length > 0) ? this.props.myFocusLives.map((item, idx) => {
                                    return (
                                        <div 
                                            className="my-focus-item on-log"
                                            key={"my-focus-item-" + idx}
                                            onClick={this.gotoLiveHandle.bind(this, item.id)}
                                            data-log-name="直播间"
                                            data-log-region="my-focus-item"
                                            data-log-pos={`my-focus-item-${idx}`}
                                        >
                                            <div className="head-img">
                                                <div className="img-wrap">
                                                    <div className="c-abs-pic-wrap"><Picture src={item.logo} placeholder={true} resize={{w:"120", h:"120"}} /></div>
                                                </div>
                                            </div>
                                            <div className="name">{item.name}</div>
                                        </div>
                                    )
                                }): ""
                            }
                            {/* <div className="my-focus-item tail"></div> */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MyFocusBar;