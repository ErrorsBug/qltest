import * as React from 'react';
import { connect } from 'react-redux';
import * as styles from './style.scss';
import { Link } from 'react-router';
import MiddleModal from '../modal';
import { autobind } from 'core-decorators';
import { YorN } from '../../models/course.model';
import { userInfo, } from '../../models/user.model';
import { Menu, Dropdown, Button } from 'antd';
import { setLoginModalShow, setLiveListModalShow } from "../../actions/common";
import { searchCourse } from "../../actions/filter";
import { locationTo, delCookie, imgUrlFormat } from '../util';
import { updateFilterConditions } from "../../actions/filter";
import { updateCourseList } from "../../actions/course";

interface setShow {
    (show: YorN): void;
}
export interface CommonHeaderProps {
    liveInfo: any;
    userInfo: userInfo;
    curTabId: string;
    agentInfo: any;
    setLoginModalShow:setShow;
    setLiveListModalShow:setShow;
    userMgrLiveList: any;
    userIdentity: any;
    agentId: string;
    liveId: string;
    searchCourse: (params: any) => boolean;
}

export interface CommonHeaderState {
    show: YorN;
    searchText: string;
}

const tempSrc = "https://img.qlchat.com/qlLive/userHeadImg/B5B81FD3-D2FC-4415-AA14-8220E44710AC-I5X76YJKAZ.jpg@132w_132h_1e_1c_2o";

@autobind
class CommonHeader extends React.Component<CommonHeaderProps, CommonHeaderState> {
    
    constructor(props) {
        super(props);
        this.state = {
            show: 'N',
            searchText: '',
        }
    }

    data = {
        urlList:[{
            title: "商城首页",
            id: "index",
            url: "/pc/knowledge-mall/index",
        },{
            title: "转载管理",
            id: "manage",
            url: "/pc/knowledge-mall/manage",
        },{
            title: "我的画像",
            id: "user-portrait",
            url: "/pc/knowledge-mall/user-portrait",
        }]
    }

    componentDidMount() {
        this.setState({ show: 'Y' })
    }

    onModalClose(e) {
        this.setState({ show: 'N'})
    }

    onLinkClick(e, item) {
        if (!this.props.userInfo.userId) {
            this.props.setLoginModalShow('Y')
            e.preventDefault();
            return
        }

        let { id } = item;
        if (id === 'manage' && this.props.userIdentity === 'super-agent' ) {
            e.preventDefault();
            // console.log(111)
            locationTo(`/video/admin/live/home/agents/income-cash?liveId=${this.props.liveInfo.liveId}`);
            return
        }
    }

    onLoginInClick() {
        this.props.setLoginModalShow('Y')
    }
    
    showLiveListModal() {
        this.props.setLiveListModalShow("Y");
    }

    // 清除cookie，退出登录
    logout() {
        locationTo(['/loginOut.htm?url=/pc/knowledge-mall/index']);
    }

    inputSearchText (e) {
        this.setState({
            searchText: e.currentTarget.value
        })
    }
    /**
     * 监听搜索框的回车按键事件
     */
    handleKeyUp(e){
        if (e.keyCode === 13) {
            this.searchCourse();
        }
    }

    /** 
     * 搜索课程 
     */
    async searchCourse(){
        const { searchText } = this.state;
        if (!searchText) {
            return false;
        }
        const result = await this.props.searchCourse({
            agentId: this.props.agentId || '',
            liveId: this.props.liveId,
            channelName: this.state.searchText,
            pageSize: 20,
            pageNum: 1
        });
        if (result.state.code === 0) {
            const conditions = {
                categorySelected: 'all',
                sortBy: '',
                sortOrder: '',
                onlyViewRelayCourse: false,
                viewTopTenCourses: false,
                page: 2,
                noMore: result.data.channelList.length < 20
            }
            this.setState(conditions);
            this.props.updateFilterConditions(conditions);
            this.props.updateCourseList(result.data.channelList);
        }
    }

    render() {
        // console.log(this.props.setLoginModalShow)
        const userId = this.props.userInfo.userId
        const curUserHeadImg = this.props.userInfo.headImgUrl;
        const curUserName = this.props.userInfo.name;
        const liveUserName = this.props.liveInfo.nickName;
        const liveUserHeadImg = this.props.liveInfo.headImg;
        const { creatorList, managerList } = this.props.userMgrLiveList;
        const menu = (
            <Menu>
                {
                    (creatorList.length + managerList.length) > 1 ||  managerList.length == 1 ?
                    <Menu.Item>
                        <div className={styles.menuItem} onClick={this.showLiveListModal}>切换账号</div>
                    </Menu.Item>
                    :null
                }
                <Menu.Item>
                    <div className={styles.menuLogout} onClick={this.logout}>退出登录</div>
                </Menu.Item>
            </Menu>
        );
        // console.log(this.props.agentInfo.isExist == 'Y')
        return (
            <div className={styles.headerContainerWrap}>
                <div className={styles.headerContainer} >
                    <div className={styles.left}>
                        <div className={styles.logo}></div>
                        <div className={styles.title}>
                            <div className={styles.text}>{this.props.agentInfo.isExist == 'Y' ? this.props.agentInfo.agentName : '知识通商城'}</div>
                            <div className={styles.sologan}>传播智慧，高分成，高转化</div>
                        </div>
                        <div className={styles.searchBox}>
                            <input type="text" className={styles.searchText} placeholder="课程标题/关键词搜索" value={this.state.searchText} onChange={this.inputSearchText} onKeyUp={this.handleKeyUp} />
                            <i className={styles.searchIcon} onClick={this.searchCourse}></i>
                        </div>
                    </div>
                    {/* <div className={styles.mid}>
                        
                    </div> */}
                    <div className={styles.right}>
                        <div className={styles.nav}>
                            {
                                this.data.urlList.map(item => {
                                    let {id, title} = item;

                                    let url = item.url + window.location.search;;
                                    if (id === 'manage' && this.props.userIdentity === 'super-agent' ) {
                                        url = `/video/admin/live/home/agents/income-cash?liveId=${this.props.liveInfo.liveId}`;
                                        title = '我的代理后台'
                                    }
                                    return (
                                        <Link
                                            onClick={(e) => this.onLinkClick(e, item)}
                                            key={id}
                                            to={url} 
                                            className={id === this.props.curTabId ? styles.active : ''} 
                                            style={{ display: 'inline-block' }}>
                                            {title}
                                        </Link>
                                    )
                                })
                            }
                        </div>
                        {
                            userId ? 
                            <Dropdown overlay={menu} placement="bottomRight">
                                <div className={styles.login}>
                                        <div className={styles.headImg} style={{ backgroundImage: `url(${imgUrlFormat(liveUserHeadImg || curUserHeadImg,"?x-oss-process=image/resize,m_fill,limit_0,h_60,w_60") })`}} ></div>
                                    <div className={styles.name}>{liveUserName || curUserName}</div>
                                    <div className={styles.triangle}></div>
                                </div>
                            </Dropdown> :
                            <div className={styles.loginBtn} onClick={this.onLoginInClick}>登录</div>
                        }
                    </div>
                    {/* <MiddleModal 
                        show={this.state.show} 
                        header={{
                            show: 'Y', 
                            title: '微信扫一扫登录', 
                            type: 'SMALL'
                        }}
                        onClose={this.onModalClose}
                        confirmBtn={{
                            text: '继续选课',
                            show: 'Y',
                            onClick: () => {}
                        }}
                        cancelBtn={{
                            text: '查看转载课',
                            show: 'Y',
                            onClick: () => {}
                        }}
                    /> */}
                </div>
            </div>
        );
    }
}

const mapState2Props = state => {
    return {
        liveInfo: state.common.liveInfo,
        userInfo: state.common.userInfo,
        agentInfo: state.common.agentInfo,
        userMgrLiveList: state.common.userMgrLiveList,
        userIdentity: state.common.userIdentity,
        liveId: state.common.liveInfo.liveId,
        agentId: state.common.agentInfo.agentId,
    };
}
const mapActionToProps = { 
    setLoginModalShow,
    setLiveListModalShow,
    searchCourse,
    updateFilterConditions,
    updateCourseList
}

export default connect(mapState2Props,mapActionToProps)(CommonHeader);
