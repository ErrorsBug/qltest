import React from 'react';
import {locationTo} from 'components/util';


const OperationDialog = props => {
    // 按钮曝光打点
    setTimeout(() => {
        typeof _qla != 'undefined' && _qla.collectVisible();
    }, 500);

    return (
        <main className="icons-container-topic-b">
            <ul>
                {
                    (
                        props.topicInfo.isRelay == "N" &&
                        (props.topicInfo.type == "charge" && !props.topicInfo.channelId && !props.topicInfo.campId) 
                    ) &&
                    <li className='on-log on-visible'
                        data-log-region="auto-share"       
                        key='share' onClick={() => { locationTo(`/wechat/page/topic-distribution-set/${props.topicId}`) }}>
                        <div>
                            <img src={ require('../../img/ope-icon-share.png') } />
                            <span>分销推广</span>
                        </div>
                    </li>
                }
                {
                    // 非转播话题 + (系列课内单节购买|普通收费话题)
                    (
                        props.topicInfo.isRelay == "N" &&
                        (
                            (props.topicInfo.type == "charge" && !props.topicInfo.channelId && !props.topicInfo.campId) 
                            ||
                            (props.topicInfo.channelId && props.topicInfo.isSingleBuy == "Y")
                        )
                    ) &&
                    <li className='on-log on-visible'
                        data-log-region="topic-coupon-list"       
                        key='coupon' onClick={()=>{locationTo(`/wechat/page/coupon-code/list/topic/${props.topicId}`)}}>
                        <div>
                            <img src={ require('../../img/ope-icon-coupon.png') } />
                            <span>优惠券</span>
                        </div>
                    </li>  
                }
                {
                    // 非转播话题+非音视频话题 + (系列课内单节购买|单课))
                    (
                        props.topicInfo.isRelay == "N" && !/(audio|video|audioLive|videoLive)$/.test(props.topicInfo.style) &&
                        (
                            (!props.topicInfo.channelId && !props.topicInfo.campId) ||
                            (props.topicInfo.channelId && props.topicInfo.isSingleBuy == "Y")
                        )
                    ) &&
                    <li className='on-log on-visible'
                        onClick={() => { locationTo(`/relay/setup.htm?topicId=${props.topicId}`) }}
                        data-log-region="upload-to-relay"    
                    >
                        <div>
                            <img src={ require('../../img/ope-icon-uplist.png') } />
                            <span>上架转播</span>
                        </div>
                    </li>

                }
                {
                    // 非转播话题
                    props.topicInfo.isRelay == "N" &&
                    <li className='on-log on-visible'
                        data-log-region="topic-data-analysis"    
                        onClick={()=>{locationTo(`/wechat/page/channel-topic-statistics?businessId=${props.topicId}&businessType=topic`)}}>
                        <div>
                            <img src={ require('../../img/ope-icon-stat.png') } />
                            <span>数据统计</span>
                        </div>
                    </li>

                }
            <ul>
            </ul>
                <li className='on-log on-visible'
                    data-log-region="edit-course"        
                    onClick={()=>{locationTo(`/wechat/page/topic-intro-edit?topicId=${props.topicId}`)}}>
                    <div>
                        <img src={ require('../../img/ope-icon-edit.png') } />
                        <span>课程编辑</span>
                    </div>
                </li>
                <li className='on-log on-visible'
                    data-log-region="show-push-topic-dialog"        
                    onClick={props.pushTopic}>
                    <div>
                        <img src={ require('../../img/ope-icon-push.png') } />
                        <span>推送通知</span>
                    </div>
                </li>
                <li className='on-log on-visible'
                    data-log-region="goto-join-list"  
                    onClick={()=>{locationTo(`/wechat/page/join-list/topic?id=${props.topicId}`)}}>
                    <div>
                        <img src={ require('../../img/ope-icon-signup.png') } />
                        <span>报名管理</span>
                    </div>
                </li>
                <li className='on-log on-visible'
                    data-log-region="profile-audio"      
                    onClick={()=>{locationTo(`/live/topic/profile/jump.htm?topicId=${props.topicId}&type=audio`)}}>
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

            <div className="close-button on-log" 
                data-log-region="topic"
                data-log-pos="finish"
            onClick={ props.hideOperationDialog }>关闭</div>
        </main>
    );
};

OperationDialog.defaultProps = {
    hideOperationDialog: () => {}
}

export default OperationDialog;