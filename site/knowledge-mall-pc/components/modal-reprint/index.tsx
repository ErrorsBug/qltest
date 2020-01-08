import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from '../modal';
import ChannelItemCard from './components/channel-item-card';
import { autobind } from 'core-decorators';
import { setReprintModalShow } from "../../actions/common";
import { reprintChannel } from "../../actions/course";
import { addChannelTypes } from "../../actions/reprint";
import classnames from 'classnames';
import * as styles from './style.scss';
import { imgUrlFormat } from "../util";
import { Switch, Icon } from 'antd';

@autobind
class ModalReprint extends Component<any, any> {

    static propTypes = {
        channelInfo: PropTypes.shape({
            tweetId: PropTypes.number,
            reprintLiveId: PropTypes.string,
            reprintLiveName: PropTypes.string,
            reprintChannelId: PropTypes.string,
            reprintChannelName: PropTypes.string,
            reprintChannelImg: PropTypes.string,
            reprintChannelAmount: PropTypes.number,
            selfMediaPercent: PropTypes.number,
            selfMediaProfit: PropTypes.number,
        }),
        channelTagList: PropTypes.array,
        setReprintModalShow: PropTypes.func,
        reprintChannel: PropTypes.func,
        showReprintModal: PropTypes.string,
        liveId: PropTypes.string,
        isBindThird: PropTypes.string,
        pushStatus: PropTypes.string,
    }

    get tagList() {
        const defaultTags = [
            {
                id: 0,
                name: '全部',
            },
        ]
        return (defaultTags as any).concat(this.props.channelTypes)
    }

    static defaultProps = {
        channelInfo: {},
        channelTagList: [],
        setReprintModalShow: () => {},
    }

    componentDidMount() {
        const pushStatus = window.localStorage.getItem("pushStatus");
        this.setState({ pushStatus })
    }

    constructor(props) {
        super(props)
        
        this.state = {
            curSelectTag: this.tagList[0].id,
            pushStatus: null,
            isTagEdit: 'N',
            newChannelTagName: '',
        }
    }

    onTagClick(tag) {
        this.setState({ curSelectTag: tag.id});
    }

    async handleSubmitBtnClick() {
        const params = {
            relayLiveId: this.props.liveId,
            sourceChannelId: this.props.channelInfo.reprintChannelId,
            tweetId: this.props.channelInfo.tweetId,
            pushStatus: this.state.pushStatus,
            tagId: this.state.curSelectTag,
        }
        // console.log(params);
        const res = await this.props.reprintChannel(params, this.props.channelInfo.index, this.props.channelInfo.reprintCallback, this.props.channelInfo);
        if(res.state.code === 0) {
            this.props.showReprintSuccessModal();
        }
        this.onClose();
    }

    changePushMsg () {
        let {pushMsg} = this.state;
        this.setState({
            pushMsg: !pushMsg
        })
    }
    
    onClose() {
        this.props.setReprintModalShow('N');
        this.setState({isTagEdit: 'N'});
    }

    onReprint() {
        // console.log('reprint')
    }

    onSwitchChange(checked) {
        this.setState({pushStatus: checked? 'Y' : 'N'});
        window.localStorage.setItem("pushStatus", checked? 'Y' : 'N')
    }

    handleTagChange(e) {
        const tag = e.target.value.trim();
        // if (tag.length <= 10) {
            this.setState({newChannelTagName: e.target.value});
        // }
    }

    setTagEdit(isTagEdit) {
        this.setState({isTagEdit,})
    }

    async addTag() {
        if (!this.state.newChannelTagName) {
            window.message.error("标签名称不能为空");
            return;
        }

        if (String(this.state.newChannelTagName).length>10) {
            window.message.error("标签字数不能超过10个字");
            return;
        }
        const result = await this.props.addChannelTypes({ channelTagName: this.state.newChannelTagName, liveId: this.props.liveId});
        if (result.state.code == 0) {
            this.setState({isTagEdit: 'N'});
        }
    }

    onKeyDown(e) {
        if (e.keyCode === 13) {
            this.addTag();
        }
    }

    openTagInputField() {
        // 最多添加10个分类
        if (this.tagList.length >= 10) {
            window.message.error("标签数量不能超过10个");
            return;
        }
        this.setTagEdit('Y')
    }

    render() {
        const { 
            tweetId,
            reprintLiveId ,
            reprintLiveName ,
            reprintChannelId ,
            reprintChannelName ,
            reprintChannelImg ,
            reprintChannelAmount,
            reprintChannelDiscount,
            selfMediaPercent,
            selfMediaProfit,
            discountStatus,
            chargeMonths,
        } = this.props.channelInfo

        const priceTag = discountStatus === 'Y' ? "特惠" : "售价";
        let priceAmount = '0';
        if (chargeMonths != 0) {
            priceAmount =  reprintChannelAmount + "/" + chargeMonths + "月";
        } else {
            priceAmount = discountStatus === 'Y' ? reprintChannelDiscount : reprintChannelAmount;
        }
        const priceTip = this.props.userIdentity === 'super-agent' ? '' : `分成比例 ${selfMediaPercent != 0 ? selfMediaPercent + '%' : '70%'}`

        // console.log(this.props.isBindThird)

        const pushStatus = this.state.pushStatus || this.props.pushStatus
        // console.log(pushStatus)
        return (
            <Modal 
                show={this.props.showReprintModal}
                className={styles.reprintModal}
                header={{
                    title: '转载课程',
                    type: 'SMALL',
                    show: 'Y',
                    showCloseBtn: 'Y',
                }}
                onClose={this.onClose}
                confirmBtn={{
                    onClick: this.handleSubmitBtnClick,
                    text: '一键转载',
                    show: 'Y'
                }}
            >   
                <div className={styles.reprintChannelDetail}>
                    <div className={styles.headImg} style={{backgroundImage: `url(${imgUrlFormat(reprintChannelImg, "?x-oss-process=image/resize,m_fill,limit_0,h_122,w_200")})`}} ></div>
                    <div className={styles.right}>
                        <div className={styles.title}>{reprintChannelName}</div>
                        <div className={styles.bottomInfo}>
                            <div className={styles.price}>{`${priceTag}：￥${priceAmount}（${selfMediaPercent}%分成）`}</div>
                            <div className={styles.income}>预计收益：<span className={styles.money}>￥{selfMediaProfit}</span></div>
                        </div>
                    </div>
                </div>
                {
                    this.props.isBindThird == 'Y' ?
                    <div className={styles.pushBox}>
                        <div className={styles.left}>
                            <div className={styles.info}>转载后立即推送通知</div>
                            <div className={styles.tips}><a href="https://mp.weixin.qq.com/s/Q5eOCFHIrWusXPeOvk3V2w" target="_blank">如何使用自己的服务号推送 <Icon type="question-circle" style={{fontSize: '14px', color: '#999'}}/></a></div>
                        </div>
                        <Switch checked={pushStatus === 'Y'} onChange={this.onSwitchChange}/>
                    </div> :
                    null
                }
                
                <div className={styles.tagBox}>
                    <div className={styles.tagHeader}>设置我的系列课分类</div>
                    <div className={styles.tagList}>
                        {
                            this.tagList.map((tag) => {
                                const isActive = this.state.curSelectTag === tag.id;
                                return <span className={`${styles.tag} ${isActive ? styles.active : ''}`} key={tag.id} onClick={() => this.onTagClick(tag)}>{tag.name}</span>
                            })
                        }
                        {
                            this.props.liveId 
                            ?
                                this.state.isTagEdit === 'Y' ?
                                <div className={styles.inputContainer}>
                                    <input className={styles.addArea} onChange={this.handleTagChange} onKeyDown={this.onKeyDown} placeholder="请输入..." />
                                    <span className={`${styles.opBtn} ${styles.cancelBtn} `} onClick={() => this.setTagEdit('N')}>取消</span>
                                    <span className={`${styles.opBtn} ${styles.saveBtn} `} onClick={this.addTag}>确定</span>
                                </div> :
                                <span className={styles.addArea} onClick={this.openTagInputField}>
                                    添加分类
                                </span>
                            :
                            null
                        }
                    </div>
                </div>
                

            </Modal>
        )
    }
}


const mapState2Props = state => {
    return {
        showReprintModal: state.common.modal.showReprintModal,
        channelInfo: state.course.reprintChannelInfo,
        liveId: state.common.liveInfo.liveId,
        isBindThird: state.common.liveInfo.isBindThird,
        pushStatus: state.common.pushStatus,
        channelTypes: state.reprint.channelTypes,
        userIdentity: state.common.userIdentity,
    };
}

const mapActionToProps = {
    setReprintModalShow,
    reprintChannel,
    addChannelTypes,
}

export default connect(mapState2Props, mapActionToProps)(ModalReprint);