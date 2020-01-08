import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router';
import {
    changeChannelRepresentStatus,
} from '../../../actions/channel-distribution';
import { changeLiveTopicRepresentStatus, deleteTopicAuthShare } from '../../../actions/distribution';

class RepresentListItemUsed extends Component {
    state = {
        status: null,
        representtype:null,
    }
    
    data = {
        changeToStatus: this.props.status=='Y'?'N':'Y',
    }

    componentWillMount() {
        // console.log(this.props);
        this.setState({
            status: this.props.status,
            representtype:this.props.representtype,
        });
    }

    //改变课代表状态
    changeRepresentStatus = e => {
        e.stopPropagation();
        e.preventDefault();
        
        const { changeToStatus } = this.data;
        
        window.confirmDialog('确定把该课代表'+ (changeToStatus == 'Y' ? '激活' : '冻结') + '吗？', async () => {
            const { id, shareId, businessId, topicType, changeChannelRepresentStatus, changeLiveTopicRepresentStatus } = this.props;
            // 判断是否为话题类型
            const res = await (businessId && topicType ? changeLiveTopicRepresentStatus(shareId, 'topic') : changeChannelRepresentStatus(id, changeToStatus));
            if (res.state.code == 0) {
                window.toast(res.state.msg || '操作成功');
                this.setState({
                    status: changeToStatus
                })
                this.data.changeToStatus = changeToStatus == 'Y' ? 'N' : 'Y';
            }
            else {
                window.toast(res.state.msg || '操作失败，请稍后再试！');
            }
        }, function() {});
    }

    //删除该推广
    setRepresentDel(e) {
        e.stopPropagation();
        e.preventDefault();
        let self = this;
        window.confirmDialog('确定删除该授权吗？', async function() {
            const { id, shareId, businessId, topicType, index, usestatus, changeChannelRepresentStatus, deleteAuthItem, deleteTopicAuthShare } = self.props;
            let res;
            // 判断是否为话题类型
            if (businessId && topicType) {
                res = await deleteTopicAuthShare(shareId)
            }
            else {
                res = await changeChannelRepresentStatus(id, 'D');
            }
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
        const { id, shareId, businessId, topicType, channelInfo } = this.props;

        const isTopic = businessId && topicType;

        const link = `/wechat/page/distribution-represent-detail-list/${isTopic ? businessId : channelInfo.channelId}?shareId=${isTopic ? shareId : id}&type=none&businessType=${isTopic ? 'topic' : 'channel'}`;

        return (
            <li className='represent-list-item used' key={this.props.key}>
                <Link to={link}>
                    <div className='portrait'>
                        <img src={this.props.headUrl?this.props.headUrl:'//img.qlchat.com/qlLive/liveCommon/normalLogo.png@132h_132w_1e_1c_2o'}/>
                    </div>
                    
                    <div className='right-part'>
                        <div className='info'>
                            <p className='represent-state'>
                                <span className='name'>{this.props.userName}</span>
                                <span className={this.state.status=='Y'?'operate frozen':'operate active'} onClick={this.changeRepresentStatus.bind(this)}>{this.state.status=='Y'?'冻结':'激活'}</span>
                                {this.state.status!='Y'&&this.state.representtype=="auth"?<span className='operate del' onClick={this.setRepresentDel.bind(this)}>删除</span>:null}
                            </p>
                            <p className='division'>分成比例{this.props.shareEarningPercent}%</p>
                            <p className='recommand-state'>推荐了<span className='recommand-num'>{this.props.invitedCount}</span>人过来听课</p>
                        </div>
                        {!!this.props.income && <div className='recommand-money'>+{this.props.income}</div>}
                    </div>
                </Link>
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
    changeLiveTopicRepresentStatus,
    deleteTopicAuthShare
};

module.exports = connect(mapStateToProps, mapActionToProps)(RepresentListItemUsed);

export default connect(mapStateToProps, mapActionToProps)(RepresentListItemUsed);