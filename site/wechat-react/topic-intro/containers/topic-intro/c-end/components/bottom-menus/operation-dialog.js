import React from 'react';
import {locationTo} from 'components/util';


const OperationDialog = props => {
    return (
        <main className="icons-container-topic-c">
            <ul>
                {
                    // 非转播话题 + (系列课内单节购买|普通收费话题)
                    (
                        props.topicInfo.isRelay == "N" &&
                        (
                            (props.topicInfo.type == "charge" && !props.topicInfo.channelId && !props.topicInfo.campId) ||
                            (props.topicInfo.channelId && props.topicInfo.isSingleBuy == "Y")
                        )
                    ) &&
                    [
                        <li key='share' onClick={() => { locationTo(`/wechat/page/topic-distribution-set/${props.topicId}`) }}>
                            <div>
                                <img src={ require('../../img/ope-icon-share.png') } />
                                <span>分销推广</span>
                            </div>
                        </li>,
                        <li key='coupon' onClick={()=>{locationTo(`/live/coupon/codeList.htm?topicId=${props.topicId}`)}}>
                            <div>
                                <img src={ require('../../img/ope-icon-coupon.png') } />
                                <span>优惠券</span>
                            </div>
                        </li>    
                    ]

                }
                {
                    // 非转播话题+非音视频话题 + (系列课内单节购买|单课))
                    (
                        props.topicInfo.isRelay == "N" && !/(audio|video)$/.test(props.topicInfo.style) &&
                        (
                            (!props.topicInfo.channelId && !props.topicInfo.campId) ||
                            (props.topicInfo.channelId && props.topicInfo.isSingleBuy == "Y")
                        )
                    ) &&
                    <li onClick={()=>{locationTo(`/relay/setup.htm?topicId=${props.topicId}`)}}>
                        <div>
                            <img src={ require('../../img/ope-icon-uplist.png') } />
                            <span>上架转播</span>
                        </div>
                    </li>

                }
                {
                    // 非转播话题
                    props.topicInfo.isRelay == "N" &&
                    <li onClick={()=>{locationTo(`/wechat/page/channel-topic-statistics?businessId=${props.topicId}&businessType=topic`)}}>
                        <div>
                            <img src={ require('../../img/ope-icon-stat.png') } />
                            <span>数据统计</span>
                        </div>
                    </li>

                }
            <ul>
            </ul>
                <li onClick={()=>{locationTo(`/wechat/page/topic-intro-edit?topicId=${props.topicId}`)}}>
                    <div>
                        <img src={ require('../../img/ope-icon-edit.png') } />
                        <span>课程编辑</span>
                    </div>
                </li>
                <li onClick={props.showPushTopicDialog}>
                    <div>
                        <img src={ require('../../img/ope-icon-push.png') } />
                        <span>推送通知</span>
                    </div>
                </li>
                <li onClick={()=>{locationTo(`/wechat/page/join-list/topic?id=${props.topicId}`)}}>
                    <div>
                        <img src={ require('../../img/ope-icon-signup.png') } />
                        <span>报名管理</span>
                    </div>
                </li>
                <li onClick={()=>{locationTo(`/live/topic/profile/jump.htm?topicId=${props.topicId}&type=audio`)}}>
                    <div>
                        <img src={ require('../../img/ope-icon-voice.png') } />
                        <span>录制语音介绍</span>
                    </div>
                </li>
                {   
                    ( props.topicInfo.status === 'beginning' && props.topicInfo.isRelay !== 'Y' && !/(audioLive|videoLive|videoGraphic|audioGraphic)$/.test(props.topicInfo.style))&& 
                    <li className='on-log on-visible'
                        data-log-region="manage-guest"      
                        onClick={()=>{locationTo(`/wechat/page/guest-list?topicId=${props.topicId}&liveId=${props.liveId}`)}}>
                        <div>
                            <img src={ require('../../img/ope-icon-guest.png') } />
                            <span>嘉宾管理</span>
                        </div>
                    </li>
                }
                
            </ul>

            <div className="close-button" onClick={ props.hideOperationDialog }>关闭</div>
        </main>
    );
};

OperationDialog.defaultProps = {
    hideOperationDialog: () => {}
}

export default OperationDialog;