import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

class TopicShareList extends Component {
    render() {
        var topicItem = this.props.shareList.map((shareItem,index)=>{
            const time = shareItem.receiveTimeStamp || shareItem.createTimeStamp;
            return (
                <dd className='share-dd' key={`topic-share-item-${index}`}>
                    <div className="top-flex-box">
                        <a className='logo' href={`${shareItem.shareUrl}`}>
                            <img src={`${shareItem.logo}@300w_300h_1e_1c_2o`} alt=""/>
                        </a>
                        <span className="info-box">
                            <h3 className="title">{shareItem.businessName}</h3>
                            <p className="p-one"></p>
                            <h4 className="p-two">{dayjs(time).format('YYYY-MM-DD HH:mm')} 成为课代表 </h4>
                        </span>
                    </div>
                    <div className="bottom-btn-bar">
                        <a href={`/topic/share/shareinviter/${shareItem.businessId}.htm?shareKey=${shareItem.shareKey}&type=topic`} className="btn-two">获取推广链接</a>
                    </div>
                </dd>

            )

        })
        return (
            <dl className='share-dl'>
                {topicItem}
            </dl>
        );
    }
}

TopicShareList.propTypes = {

};

export default TopicShareList;