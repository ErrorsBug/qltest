const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { findDOMNode } from 'react-dom';
import Page from 'components/page';
import { locationTo } from 'components/util';
import { share } from 'components/wx-utils';

// actions
import { getSimpleChannel,saveChannelPurcaseNote } from '../../actions/channel';
import { isLiveAdmin } from '../../actions/live';

class ChannelPurcaseNote extends Component {
    constructor(props){
        super(props);
    }

    state = {
        count: 0,
        length: 300,
        channelId: this.props.location.query.channelId,
    }

    componentDidMount() {

        // share({
        //     title: '',
        //     timelineTitle: '',
        //     desc: '',
        //     timelineDesc: '', // 分享到朋友圈单独定制
        //     imgUrl: ''
        // });
        this.getExtendInfo();
    }

    async getExtendInfo(){
        let result  = null;
        result = await this.props.getSimpleChannel(this.state.channelId);
        if(result != null){
            let notice = '';
            if(result.data.channel.purchaseNotes){
                notice = result.data.channel.purchaseNotes
            } else {
                const liveId = result.data.channel.liveId;
                const liveAdminInfo = await this.props.isLiveAdmin(liveId);
                if (liveAdminInfo.data && liveAdminInfo.data.isLiveAdmin === 'Y') {
                    notice = "1. 该课程为付费系列课程，按课程计划定期更新，每节课程可在开课时直播学习，也可反复回听 \n2. 购买课程后关注我们的服务号，可在菜单里进入听课 \n3. 该课程为虚拟内容服务，购买成功后概不退款，敬请原谅 \n4. 如有其它疑问，可点击左下角“咨询”按钮，与内容供应商沟通后再购买";
                } else {
                    notice = "1. 该课程为付费系列课程，按课程计划定期更新，每节课程可在开课时直播学习，也可反复回听 \n2. 购买课程后关注千聊公众号，可在菜单【已购买课程】里进入听课 \n3. 该课程为虚拟内容服务，购买成功后概不退款，敬请原谅 \n4. 如有其它疑问，可点击左下角“咨询”按钮，与内容供应商沟通后再购买";
                }
            }
            let area = findDOMNode(this.refs.area)
            area.value = notice
            this.setState({
                count: notice.length
            })
        }
    }

    changeNotice(e){
        let value = e.currentTarget.value
        if(value.length<=300){
            this.setState({
                count: value.length
            })
        }else{
            this.setState({
                count: 300
            })
            e.currentTarget.value = value.substring(0, this.state.length);
        }

    }
    saveClick(){
        if(this.state.count<10){
            window.toast('字数不少于10个字');
        }else {
            this.saveNote()
        }
    }
    async saveNote(){
        let purchaseNotes = findDOMNode(this.refs.area).value
        await this.props.saveChannelPurcaseNote(this.state.channelId,purchaseNotes)
        this.back()
    }

    back(){
        setTimeout(() => {
            history.go(-1)
        },200)
    }

    render() {

        return (
            <Page title="购买须知" className='channel-purcase-notice'>
                <div className="content">
                    <textarea
                        className="textarea"
                        id="textarea"
                        placeholder="请填写购买须知"
                        ref="area"
                        onChange={this.changeNotice.bind(this)}
                    ></textarea>
                    <div className="count">
                        <span>{this.state.count}</span>/300
                    </div>
                </div>
                <div className="bottom">
                    <div className="cancel" onClick={this.back.bind(this)}>取消</div>
                    <div className="save" onClick={this.saveClick.bind(this)}>保存</div>
                </div>
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {

    }
}

const mapActionToProps = {
    getSimpleChannel,
    saveChannelPurcaseNote,
    isLiveAdmin,
}

module.exports = connect(mapStateToProps, mapActionToProps)(ChannelPurcaseNote);
