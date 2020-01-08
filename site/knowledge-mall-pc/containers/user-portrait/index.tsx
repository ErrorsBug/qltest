import * as React from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import classNames from 'classnames';
import CommonHeader from '../../components/common-header';

import StoreInfo from './components/store-info';
import WechatInfo from './components/wechat-info';
import FansPortrait from './components/fans-portrait';
import TeamStatus from './components/team-status';
import ActivePlatform from './components/active-platform';
import AddPlatformModal from './components/add-platform-modal';

import { Button, message } from 'antd';

import styles from './style.scss';

import { fetchTagsList, fetchPortraitInfo, savePortraitInfo, emptyTagsSelected, fetchWechatCategoryList } from '../../actions/portrait';

import { setLiveInfo } from '../../actions/common';

export interface UserPortraitProps {
    liveId: string;
    storeInfo: any;
    wechatInfo: any;
    fansTags: any[];
    teamTags: any[];
    activePlatforms: any[];
    fansRemark: string;
    tagsSelected: any[];
    showPlatformModal: string;
    fetchTagsList: (type: string, liveId?: string) => void;
    fetchPortraitInfo: (liveId?: string) => void;
    savePortraitInfo: (params: any) => any;
    setLiveInfo: (params: any) => any;
    emptyTagsSelected: () => void;
    fetchWechatCategoryList: () => void;
}

@autobind
class UserPortrait extends React.Component<UserPortraitProps, any> {
    state = {
        // 是否处于请求状态
        pending: false,
    }

    data = {
        // 微信号规则
        wechatAccountPattern: /^[a-zA-Z][a-zA-Z\d_\-]{5,19}$/,
        // 手机号基础规则
        mobilePhonePattern: /^\d{11}$/,
    }

    get liveId(){
        return this.props.liveId || '';
    }

    async saveUserPortrait() {
        if (this.state.pending) {
            return false;
        } else {
            this.setState({pending: true});
        }
        const {account, phone, name, followers, category, allCategories, contacts} = this.props.wechatInfo;
        // 验证微信号的合理性
        if (account && !this.data.wechatAccountPattern.test(account)) {
            message.error('请填写一个合理的微信号哦~');
            this.setState({pending: false});
            return false;
        }
        // 验证手机号码的合理性
        if (phone && !this.data.mobilePhonePattern.test(phone)) {
            message.error('请填写一个合理的手机号码哦~');
            this.setState({pending: false});
            return false;
        }
        // 验证是否有选择粉丝画像的标签
        let hasSelectedFansTags = false;
        const fansTags = this.props.fansTags;
        const tagsSelected = this.props.tagsSelected;
        for (let i = 0; i < fansTags.length; i++) {
            const tagsList = fansTags[i].items;
            for (let j = 0; j < tagsList.length; j++) {
                if (tagsSelected.indexOf(String(tagsList[j].itemId)) > -1) {
                    hasSelectedFansTags = true;
                    break;
                }
            }
            if (hasSelectedFansTags) {
                break;
            }
        }
        if (!hasSelectedFansTags) {
            message.error('请完善粉丝画像信息');
            this.setState({pending: false});
            return false;
        }
        const result = await this.props.savePortraitInfo({
            liveId: this.liveId,
            itemIds: this.props.tagsSelected.join(','),
            diyRemark: this.props.fansRemark,
            activePlatforms: [...this.props.activePlatforms],
            wxopenInfo: {
                appName: name,
                appAccount: account,
                appFansNum: followers,
                appCategory: category,
                linkman: contacts,
                mobile: phone
            }
        });
        if (result.state.code === 0) {
            message.success('用户画像保存成功');
            if (!this.liveId) {
                const {liveId, liveName, headImg, nickName} = result.data;
                this.props.setLiveInfo({liveId, liveName, headImg, nickName});
            }
        }
        this.setState({pending: false});
    }

    componentDidMount() {
        // 先将reducer中的tagsSelected清空, 防止出现重复的tagId
        this.props.emptyTagsSelected();
        // 再请求接口获取tags数据
        this.props.fetchTagsList('fans_personas');
        this.props.fetchTagsList('team_status');
        // 获取公众号分类数据
        this.props.fetchWechatCategoryList();
        // 如果当前用户名下有直播间，则获取相应信息
        if (this.props.liveId) {
            this.props.fetchPortraitInfo(this.props.liveId);
        }
    }

    componentWillReceiveProps(nextProps) {
        // 用户切换直播间，获取相应信息
        if (this.props.liveId != nextProps.liveId) {
            this.props.fetchPortraitInfo(nextProps.liveId);
        }
    }

    render() {
        return (
            <div>
                <CommonHeader curTabId="user-portrait"/>
                <div className={styles.mainContainer}> 
                    {/* 店铺信息 */}
                    <StoreInfo storeInfo={{...this.props.storeInfo}}/>
                    {/* 公众号信息 */}
                    <WechatInfo wechatInfo={{...this.props.wechatInfo}}/>
                    {/* 粉丝画像 */}
                    <FansPortrait fansTags={[...this.props.fansTags]} fansRemark={this.props.fansRemark} tagsSelected={[...this.props.tagsSelected]}/>
                    {/* 团队状况 */}
                    <TeamStatus teamTags={[...this.props.teamTags]} tagsSelected={[...this.props.tagsSelected]}/>
                    {/* 活跃平台 */}
                    <ActivePlatform activePlatforms={[...this.props.activePlatforms]}/>
                    {/* 保存画像信息按钮 */}
                    <section className={styles.saveUpdatedContainer}>
                        <Button className={styles.saveUpdatedButton} onClick={this.saveUserPortrait} type="primary" size="large" loading={this.state.pending}>保存更新</Button>
                    </section>
                    {/* 添加平台弹窗 */}
                </div>
                <AddPlatformModal show={this.props.showPlatformModal}/>
            </div>
        );
    }
}

const mapState2Props = state => {
    return {
        liveId: state.common.liveInfo.liveId,
        storeInfo: state.portrait.storeInfo,
        wechatInfo: state.portrait.wechatInfo,
        fansTags: state.portrait.fansTags,
        teamTags: state.portrait.teamTags,
        tagsSelected: state.portrait.tagsSelected,
        fansRemark: state.portrait.fansRemark,
        activePlatforms: state.portrait.activePlatforms,
        showPlatformModal: state.portrait.showPlatformModal,
    }
}

const mapAction2Props = {
    fetchTagsList,
    fetchPortraitInfo,
    savePortraitInfo,
    setLiveInfo,
    emptyTagsSelected,
    fetchWechatCategoryList,
}

export default connect(mapState2Props, mapAction2Props)(UserPortrait);
