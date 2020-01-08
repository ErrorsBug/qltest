import React, { Component } from 'react';
import { locationTo, imgUrlFormat, digitFormat } from 'components/util';

class HotLives extends Component {
    render() {
        return (
            <div className='hot-lives'>
                <div className="title">
                    <span className="red-spot"></span>
                    <span className="text">热门直播间</span>
                    <span className="red-spot"></span>
                </div>

                <div className="live-list">
                    <div className="flex-wrap">
                            <div className="live-container">
                                {
                                    this.props.hotLives.map((item, index) => {
                                        if (index < 8) {
                                            return (
                                                <div key={`hot-live-${index}`} className="live-item on-log on-visible"
                                                    onClick={e => {
                                                        if (!item.url) {
                                                            locationTo(`/wechat/page/live/${item.id}?pro_cl=center`);
                                                        } else {
                                                            locationTo(item.url);
                                                        }
                                                    }}
                                                    data-log-region="live_list"
                                                    data-log-pos={index}
                                                    data-log-tag_id={this.props.tagId}
                                                    data-log-business_id={item.id}
                                                    data-log-name={item.name}
                                                    data-log-business_type={'live'}>
                                                    <div className="head-img"><img className="img" src={imgUrlFormat(item.logo, "?x-oss-process=image/resize,m_fill,limit_0,h_100,w_100")} /></div>
                                                    <div className="live-name">{item.name}</div>
                                                    <div className="focus-num">{digitFormat(item.fansNum)}关注</div>
                                                </div>
                                            )
                                        }
                                    })
                            }
                            <div className="live-item-trail"></div>
                        </div>
                    </div>
                </div>


            </div>
        );
    }
}



export default HotLives;
