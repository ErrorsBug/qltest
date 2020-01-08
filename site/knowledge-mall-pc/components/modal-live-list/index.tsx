import * as React from 'react';
import { connect } from 'react-redux';
import Modal from '../modal';
import LoginQr from '../login-qr';
import { autobind } from 'core-decorators';
import { 
    setLiveListModalShow, 
    setLiveInfo, 
    getUserIdentity,
    getAgentInfo,
    updateAgentInfo
} from "../../actions/common";
import { fetchChannelTypes } from "../../actions/reprint";
import { YorN } from '../../models/course.model';
import * as styles from './style.scss';
import { Icon } from 'antd';
import { apiService } from '../../actions/customer';

interface setLiveListModalShow {
    (show: YorN): void;
}

export interface ModalLiveListProps {
    setLiveListModalShow: setLiveListModalShow;
    showLiveListModal: YorN;
    userMgrLiveList: any;
    setLiveInfo: any;
    liveInfo: any;
    getUserIdentity: any;
    agentInfo: any;
    relayAuth: any;
    fetchChannelTypes: any;
    getAgentInfo: any;
    updateAgentInfo: any;
}

@autobind
class ModalLiveList extends React.Component<ModalLiveListProps, any> {

    state = {
        curSelectedLive: {
            liveId: null,
            liveName: null,
            nickName: null,
            isBindThird: null,
            knowledgeAccountInfo: {
                agentId: null,
                hasRelayChannel: null,
                accountStatus: null,
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.showLiveListModal === 'Y' && this.props.liveInfo.liveId) {
            this.setState({ curSelectedLive: {...this.props.liveInfo}})
        } else {
            const { creatorList, managerList } = nextProps.userMgrLiveList
            if (creatorList && creatorList.length >= 1) {
                this.setState({ curSelectedLive: {...creatorList[0]}})
            }
        }
    }

    closeModal() {
        if (!this.state.curSelectedLive.liveId) {
            window.message.error("请选择直播间");
            return;
        }
        this.props.setLiveListModalShow('N');
    }

    async confirm() {
        // console.log('aaa,', this.state.curSelectedLive)
        if (!this.state.curSelectedLive.liveId) {
            window.message.error("请选择直播间");
            return;
        }
        let agentId = this.state.curSelectedLive.knowledgeAccountInfo.agentId
        let agentInfo = {agentId: null, isExist: null, agentName: null, isSelf: null,};
        if (agentId) {
            const agentInfoRes = await this.props.getAgentInfo(agentId);
            // console.log(agentInfoRes)
            if (agentInfoRes.state.code === 0) {
                agentInfo = {...agentInfoRes.data.result, agentName: agentInfoRes.data.result.name}
            }
        }

        // if (agentInfoRes.state.code === 0) {
        //     agentInfo = 
        // }
        // console.log(this.state.curSelectedLive)
        this.props.setLiveInfo(this.state.curSelectedLive, 'Y');
        this.props.updateAgentInfo(agentInfo);
        this.props.getUserIdentity({
            liveInfo: this.state.curSelectedLive,
            agentInfo: agentInfo,
            userMgrLiveList: this.props.userMgrLiveList,
            relayAuth: 'Y'
        });
        this.props.fetchChannelTypes({liveId: this.state.curSelectedLive.liveId, type: 'all'})
        this.setLocation(this.state.curSelectedLive.liveId, agentId);
        this.closeModal();
    }

    setLocation(liveId, agentId) {
        let baseUrl = window.location.pathname;
        
        let url = baseUrl + `?selectedLiveId=${liveId}${agentId? '&agentId='+ agentId : ''}`
    
        window.history.replaceState({liveId: liveId}, null, url);
    }

    isArray(elm) {
        return Object.prototype.toString.call(elm) === "[object Array]";
    }

    handleClick(liveItem) {
        // console.log(liveItem)
        this.setState({
            curSelectedLive: {
                ...liveItem
            }
        })
    }

    render() {
        // console.log(this.props.userMgrLiveList)
        const { creatorList, managerList } = this.props.userMgrLiveList
        return (
            <Modal 
                className={styles.modalContainer}
                bgHide='N'
                header={{
                    title: '切换账号',
                    type: 'SMALL',
                    show: 'Y',
                    showCloseBtn: 'N',
                }}
                show={this.props.showLiveListModal} 
                onClose={this.closeModal}
                confirmBtn={{
                    onClick: this.confirm,
                    text: '确定',
                    show: 'Y'
                }}
            >
                <div className={styles.container}>
                    <div className={styles.contentBox}>
                        {
                            creatorList.length >= 1 ?
                            <div className={styles.title}>我创建的知识店铺</div> :
                            null
                        }
                        {
                            this.isArray(creatorList) ?
                            creatorList.map(item => {
                                const isActive = item.liveId === this.state.curSelectedLive.liveId;
                                return (
                                    <div key={item.liveId} className={`${styles.detail} ${isActive ? styles.detailActive : ''}`} onClick={() => this.handleClick(item)}>
                                        <div className={styles.left}>
                                            <div className={styles.headImg} style={{backgroundImage: `url(${item.headImg})`}}></div>
                                            <div className={styles.name}>{item.liveName}</div>
                                        </div>
                                        {
                                            isActive ?
                                            <Icon type="check-circle" style={{ fontSize: 24, color: '#c9a96e' }}/> :
                                            <div className={styles.right}></div>
                                        }
                                    </div>
                                )
                            }) : 
                            null
                        }
                    </div>
                    <div className={styles.contentBox}>
                        {
                            managerList.length >= 1? 
                            <div className={styles.title}>我管理的知识店铺</div> :
                            null
                        }
                        {
                            this.isArray(creatorList) ?
                            managerList.map(item => {
                                const isActive = item.liveId === this.state.curSelectedLive.liveId;
                                return (
                                    <div key={item.liveId} className={`${styles.detail} ${isActive ? styles.detailActive : ''}`} onClick={() => this.handleClick(item)}>
                                        <div className={styles.left}>
                                            <div className={styles.headImg} style={{backgroundImage: `url(${item.headImg})`}}></div>
                                            <div className={styles.name}>{item.liveName}</div>
                                        </div>
                                        {
                                            isActive ?
                                            <Icon type="check-circle" style={{ fontSize: 24, color: '#c9a96e' }}/> :
                                            <div className={styles.right}></div>
                                        }
                                    </div>
                                )
                            }) : 
                            null
                        }
                    </div>
                </div>   
            </Modal>
        );
    }
}

const mapState2Props = state => {
    return {
        showLiveListModal: state.common.modal.showLiveListModal,
        userMgrLiveList: state.common.userMgrLiveList,
        liveInfo: state.common.liveInfo,
        agentInfo: state.common.agentInfo,
        relayAuth: state.common.relayAuth,
    };
}

const mapActionToProps = {
    setLiveListModalShow,
    setLiveInfo,
    getUserIdentity,
    fetchChannelTypes,
    getAgentInfo,
    updateAgentInfo,
}

export default connect(mapState2Props, mapActionToProps)(ModalLiveList);
