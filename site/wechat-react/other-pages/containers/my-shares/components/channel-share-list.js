
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

class ChannelShareList extends Component {
    render() {
        var channelItem = this.props.shareList.map((shareItem,index)=>{
            return (
                <dd className='share-dd'>
                    <div className="top-flex-box">
                        <a className='logo' href={`/live/channel/channelPage/${shareItem.businessId}.htm`}>
                            <img src={`${shareItem.channelLogo}@300w_300h_1e_1c_2o`} alt=""/>
                        </a>
                        <span className="info-box">
                            <h3 className="title">{shareItem.channelName}</h3>
                            <p className="p-one"></p>
                            <h4 className="p-two">{shareItem.receiveTime?dayjs(shareItem.receiveTime).format('YYYY-MM-DD HH:mm'):dayjs(shareItem.createTime).format('YYYY-MM-DD HH:mm')} 成为课代表 </h4>
                        </span>
                    </div>
                    <div className="bottom-btn-bar">
                        <a href={`/wechat/page/represent-auth?channelId=${shareItem.businessId}&shareKey=${shareItem.shareKey}&type=channel`} className="btn-two">获取推广链接</a>
                    </div>
                </dd>

            )

        })
        return (
            <dl className='share-dl'>
                {channelItem}
            </dl>
        );
    }
}

ChannelShareList.propTypes = {

};

export default ChannelShareList;