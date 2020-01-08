const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import { connect } from 'react-redux';

import {
    changeChannelRepresentStatus,
} from '../../../actions/channel-distribution';
import { deleteTopicAuthShare } from '../../../actions/distribution';


class RepresentListItemNotuse extends Component {
    state = {

    }

    //删除该推广
    changeRepresentStatus = () => {
        window.confirmDialog('确定删除该授权吗？', async () => {
            const { id, businessId, shareId, topicType, changeChannelRepresentStatus, deleteTopicAuthShare,deleteAuthItem, index, usestatus } = this.props;
            const res = await (businessId && topicType ? deleteTopicAuthShare(shareId) :  changeChannelRepresentStatus(id, 'D'));
            if (res.state.code == 0) {
                window.toast(res.state.msg || '操作成功');
                deleteAuthItem(index, usestatus);
            }
            else {
                window.toast(res.state.msg || '操作失败，请稍后再试！');
            }
        }, function() {});
    }

    render() {
        const { businessId, topicType, key, id, shareId, shareEarningPercent, shareKey, onAuth } = this.props;

        return (
            <li className='represent-list-item notuse' key={key}>
                <img className='portrait' src="//img.qlchat.com/qlLive/liveCommon/normalLogo.png@132h_132w_1e_1c_2o"/>
                <div className='right-part'>
                    <div className='info'>
                        <p className='represent-state'>
                            <span className='name'>未使用</span>
                            <span className='operate delete' onClick={()=>{this.changeRepresentStatus()}}>删除</span>
                        </p>
                        <p className='division'>分成比例{shareEarningPercent}%</p>
                    </div>
                    <div className='btn-send' onClick={()=>{onAuth(businessId && topicType ? shareId : id, shareEarningPercent, shareKey)}}>发送分销授权</div>
                </div>
            </li>
        );
    }
}

function mapStateToProps(state) {
    return {
        channelInfo:state.channel.channelInfo
    };
}

const mapActionToProps = {
    changeChannelRepresentStatus,
    deleteTopicAuthShare,
};

module.exports = connect(mapStateToProps, mapActionToProps)(RepresentListItemNotuse);

export default connect(mapStateToProps, mapActionToProps)(RepresentListItemNotuse);