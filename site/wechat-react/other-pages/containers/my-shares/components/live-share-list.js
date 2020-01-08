import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

class LiveShareList extends Component {
    render() {
        var listItem = this.props.shareList.map((shareItem,index)=>{
            return (
                <dd className='share-dd'>
                    <div className="top-flex-box">
                        <a className='logo' href={`/${shareItem.shareUrl}`}>
                            <img src={`${shareItem.liveLogo}@300w_300h_1e_1c_2o`} alt=""/>
                        </a>
                        <span className="info-box">
                            <h3 className="title">{shareItem.liveName}</h3>
                            <p className="p-one">{shareItem.followerCount}关注</p>
                            <h4 className="p-two">{shareItem.receiveTime?dayjs(shareItem.receiveTime).format('YYYY-MM-DD HH:mm'):dayjs(shareItem.createTime).format('YYYY-MM-DD HH:mm')} 成为课代表 </h4>
                        </span>
                    </div>
                    <div className="bottom-btn-bar">
                        <a href={`/topic/share/myshare.htm?liveId=${shareItem.liveId}`} className="btn-one">我的推广用户</a>
                        <a href={`/topic/share/shareinviter/${shareItem.businessId}.htm?shareKey=${shareItem.shareKey}&type=live`} className="btn-two">获取推广链接</a>
                    </div>
                </dd>

            )

        })
        return (
            <dl className='share-dl'>
                {listItem}
            </dl>
        );
    }
}

LiveShareList.propTypes = {

};

export default LiveShareList;