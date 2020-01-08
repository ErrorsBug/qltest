const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Page from 'components/page';
import { locationTo,refreshPageData } from 'components/util';
import { share } from 'components/wx-utils';

// actions
import {
    getChannelIntro,
} from '../../actions/channel-intro-edit';

class ChannelIntroList extends Component {

    state = {
        isSetVideo:false,
        isSetDesc:false,
        isSetLectuerInfo:false,
        isSetSuitable:false,
        isSetGain:false,
        isSetPurchaseNotes: false,
    }

    static contextTypes = {
        router: PropTypes.object.isRequired,
    }

    async loadChannelIntro(channelId){
        let result = await this.props.getChannelIntro("",channelId);
        result&&result.data&&result.data.descriptions&&this.setState({
            isSetVideo:result.data.descriptions.videoDesc?false:true,
            isSetDesc:result.data.descriptions.desc?false:true,
            isSetLectuerInfo:result.data.descriptions.lectuerInfo?false:true,
            isSetSuitable:result.data.descriptions.suitable?false:true,
            isSetGain:result.data.descriptions.gain?false:true,
            isSetPurchaseNotes: result.data.purchaseNotes?false:true,
        })
    }

    componentDidMount() {
        if(this.props.params.channelId){
            this.loadChannelIntro(this.props.params.channelId);
        }
        refreshPageData();
    }

    onBack() {
        // this.context.router.go(-1);
        // window.history.back();
        window.location.href = '/wechat/page/channel-create?channelId=' + this.props.params.channelId
    }

    render() {

        return (
            <Page title="系列课介绍" className='channel-intro-list-page'>
                <ul>
                    <li>
                        <a href={`/wechat/page/channel-intro-video-edit/${this.props.params.channelId}`} ><span className="s-one">视频简介</span><span className="s-two">{this.state.isSetVideo&&"未设置"}</span><i className="icon_enter"></i></a>
                    </li>
                    <li>
                        <a href={`/wechat/page/channel-intro-edit/${this.props.params.channelId}?type=desc`} ><span className="s-one">简介</span><span className="s-two">{this.state.isSetDesc&&"未填写"}</span><i className="icon_enter"></i></a>
                    </li>
                    <li>
                        <a href={`/wechat/page/channel-intro-edit/${this.props.params.channelId}?type=lectuerInfo`} ><span className="s-one">关于讲师</span><span className="s-two">{this.state.isSetLectuerInfo&&"未填写"}</span><i className="icon_enter"></i></a>
                    </li>
                    <li>
                        <a href={`/wechat/page/channel-intro-edit/${this.props.params.channelId}?type=suitable`} ><span className="s-one">适合人群</span><span className="s-two">{this.state.isSetSuitable&&"未填写"}</span><i className="icon_enter"></i></a>
                    </li>
                    <li>
                        <a href={`/wechat/page/channel-intro-edit/${this.props.params.channelId}?type=gain`} ><span className="s-one">你将获得</span><span className="s-two">{this.state.isSetGain&&"未填写"}</span><i className="icon_enter"></i></a>
                    </li>
                    <li>
                        <a href={`/wechat/page/channel-purcase-notice?channelId=${this.props.params.channelId}`} ><span className="s-one">购买须知</span><span className="s-two">{this.state.isSetPurchaseNotes}</span><i className="icon_enter"></i></a>
                    </li>
                </ul>

                <div className='back-button' onClick={this.onBack.bind(this)}>
                    完成
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
    getChannelIntro
}

module.exports = connect(mapStateToProps, mapActionToProps)(ChannelIntroList);
