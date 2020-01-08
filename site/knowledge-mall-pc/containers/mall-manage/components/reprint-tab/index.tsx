import * as React from 'react'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import { apiService } from '../../../../components/api-service'

import styles from './style.scss'

import { Tabs, Modal, Pagination } from 'antd'
const TabPane = Tabs.TabPane

import ReprintBar from './components/reprint-bar'
import ReprintTable from './components/reprint-table'
import { TableEmpty } from '../empty-table-placeholder'

import { IReprintChannelItem, IChannelTypeItem } from '../../../../models/reprint.model'

import {
    fetchReprintChannelList,
    updateReprintChannelList,
    clearReprintChannelList,
    fetchChannelTypes,

    PostUpOrDownShelf,
    PostDeleteCourse,
} from '../../../../actions/reprint';

import { setReprintInfo, setPromotionInfo } from '../../../../actions/course';
import { setPromotionModalShow, } from '../../../../actions/common';

export interface ReprintTabProps {
    liveId: string
    reprintChannelList: Array<IReprintChannelItem>
    channelTypes: Array<IChannelTypeItem>

    fetchReprintChannelList: (params: any) => Promise<Array<IReprintChannelItem>>
    fetchChannelTypes: (params: any) => Promise<Array<IChannelTypeItem>>

    updateReprintChannelList: (params: any) => void
    clearReprintChannelList: () => void
    PostUpOrDownShelf: (params: any) => void
    PostDeleteCourse: (params: any) => any
    locationTo: (url: string) => void
    setPromotionInfo: any;
    setReprintInfo: any;
    setPromotionModalShow: any;
}

@autobind
class ReprintTab extends React.Component<ReprintTabProps, any> {

    state = {
        /* 当前选中的分类id */
        activeId: 0,

        channelTypes: [],

        noone: false,
        loading: false,

        channelList: [],
        totalCount: 0,
        page: 1,
        size: 5,

        // 搜索关键词
        searchText: '',
    }

    componentDidMount() {
        // this.fetchChannelTypes()
        if (this.props.liveId) {
            this.fetchReprintChannels(this.props.liveId)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.liveId && nextProps.liveId !== this.props.liveId) {
            this.fetchReprintChannels(nextProps.liveId);
        }
    }

    async fetchChannelTypes() {
        const result = await apiService.post({
            url: '/h5/channel/getChannelTags',
            body: {
                liveId: this.props.liveId,
                type: 'all',
            }
        })
        if (result.state.code === 0) {
            this.setState({ channelTypes: result.data.channelTagList })
        }
    }

    /* 请求转载课程数据 */
    async fetchReprintChannels(liveId) {
        try {
            const { page, size, activeId } = this.state

            const result = await apiService.post({
                url: '/h5/selfmedia/relayChannels',
                body: {
                    isRelay: "Y",
                    liveId,
                    page: { page, size },
                    tagId: activeId,
                }
            })

            if (result.state.code === 0) {
                const { liveChannels, totalCount } = result.data
                this.setState({
                    totalCount,
                    channelList: liveChannels,
                    noone: totalCount === 0,
                })
                return result.data.liveChannels
            }

            if (!result.length) {
                this.setState({ noone: true })
            }
        } catch (error) {
            console.error('请求转载课程列表数据失败: ', error)
        } finally {
            this.setState({ loading: false })
        }
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

    async onTagClick(item: IChannelTypeItem) {
        this.setState({ activeId: item.id }, () => {
            this.fetchReprintChannels(this.props.liveId)
        })
    }

    /* 点击立即推广按钮 */
    onPromoteClick(course) {
        const {
            tweetId,
            liveName, 
            id, 
            name, 
            selfMediaPercent,
            headImage, 
            selfMediaProfit,
            amount,
            liveId,
            discount,
            discountStatus,
            chargeMonths,
        } = course;
        const shareUrl = `${window.location.origin}/live/channel/channelPage/${id}.htm`;
        const percent = selfMediaPercent;
        const data = {
            businessImage: headImage,
            businessId: id,
            businessName: name,
            amount: discountStatus == 'Y' ? discount : amount,
        }
        this.props.setReprintInfo({
            tweetId,
            reprintLiveId: liveId,
            reprintLiveName: liveName,
            reprintChannelId: id,
            reprintChannelName: name,
            reprintChannelImg: headImage,
            reprintChannelAmount: amount,
            reprintChannelDiscount: discount,
            selfMediaPercent: selfMediaPercent,
            selfMediaProfit: selfMediaProfit,
            discountStatus,
            chargeMonths, 
        })

        this.props.setPromotionInfo({shareUrl, percent, data,});
        this.props.setPromotionModalShow('Y');
    }

    /* 点击下架按钮 */
    onDownShelfClick(id: string) {
        Modal.confirm({
            title: '确定要下架此课程?',
            content: '下架后，该系列课将不再展示在您的知识店铺，已购买学员可正常学习',
            onOk: () => { this.upDownShelf(id, 'down') },
        })
    }

    /* 点击上架按钮 */
    onUpShelfClick(id: string) {
        Modal.confirm({
            title: '确定要重新上架此课程？',
            onOk: () => { this.upDownShelf(id, 'up') },
        })
    }

    /* 上下架课程 */
    async upDownShelf(id: string, type: string) {
        const result = await apiService.post({
            url: '/h5/selfmedia/upOrDown',
            showError: true,
            body: { channelId: id, type },
        })
        if (result.state.code === 0) { 
            const { channelList } = this.state
            channelList.find(item => {
                if (item.id === id) {
                    item.upOrDown = type
                    return true
                }
                return false
            })
            this.setState({ channelList })
        }
    }

    /* 点击删除按钮 */
    onDeleteClick(id: string) {
        Modal.confirm({
            title: '确定要从列表中删除此课程?',
            content: '删除后，您已使用推广的链接将失效，请权衡',
            onOk: () => { this.deleteCourse(id) },
        })
    }

    /* 删除课程 */
    async deleteCourse(id: string) {
        const result = await apiService.post({
            url: '/h5/selfmedia/remove',
            showError:true,
            body: {
                channelId: id,
                liveId:this.props.liveId,
            },
        })

        if (result.state.code === 0) {
            let { channelList,totalCount } = this.state
            channelList = channelList.filter(item => item.id !== id)
            this.setState({ channelList })
        }
    }

    onSelectCourseBtnClick() {
        this.props.locationTo('/pc/knowledge-mall/index')
    }

    onPageChange(page) {
        this.setState({ page }, () => {
            this.fetchReprintChannels(this.props.liveId)
        })
    }

    // 输入搜索关键词
    inputSearchText(e) {
        this.setState({
            searchText: e.target.value.trim()
        });
    }

    // 监听搜索框的回车按键
    handleKeyUp(e){
        if (e.keyCode === 13) {
            this.onSearchRelayChannels();
        }
    }

    // 搜索转载课程
    onSearchRelayChannels() {
        this.setState({
            page: 1
        }, async () => {
            this.setState({ loading: true });
            const result = await apiService.post({
                url: '/h5/selfmedia/relayChannels',
                body: {
                    liveId: this.props.liveId,
                    channelName: this.state.searchText,
                    page: { 
                        page: this.state.page,
                        size: this.state.size,
                    },
                }
            });
            if (result.state.code === 0) {
                const { liveChannels, totalCount } = result.data
                this.setState({
                    totalCount,
                    channelList: liveChannels,
                    noone: totalCount === 0,
                })
            }
            this.setState({ loading: false });
        });
    }

    render() {
        const { activeId, noone,totalCount,page,size,channelList } = this.state

        return (
            [
                <ReprintBar
                    activeId={activeId}
                    tagList={this.tagList}
                    onTagClick={this.onTagClick}
                    key='bar'
                />,
                <div key='content'>
                    {
                        noone
                            ?
                            <TableEmpty
                                tips='推广篮子空空如也~快去挑选课程吧!'
                                buttonText='去选课'
                                onButtonClick={this.onSelectCourseBtnClick}
                                key='empty'
                            />
                            :
                            [
                                <ReprintTable
                                    list={channelList}
                                    onPromoteClick={this.onPromoteClick}
                                    onDownShelfClick={this.onDownShelfClick}
                                    onUpShelfClick={this.onUpShelfClick}
                                    onDeleteClick={this.onDeleteClick}
                                    key='table'
                                />,
                                <Pagination
                                    key='pagi'
                                    current={page}
                                    pageSize={size}
                                    total={totalCount}
                                    onChange={this.onPageChange}
                                    style={{ margin: '20px 0' }}
                                />
                            ]
                    }
                </div>,
                <div key="searchBox" className="search-box">
                    <input type="text" className="search-text" placeholder="课程标题" value={this.state.searchText} onChange={this.inputSearchText} onKeyUp={this.handleKeyUp} />
                    <i className="search-icon" onClick={this.onSearchRelayChannels}></i>
                </div>
            ]
        )
    }
}

function mapStateToProps(state) {
    return {
        channelTypes: state.reprint.channelTypes,
        reprintChannelList: state.reprint.reprintChannelList,
    }
}

const mapActionToProps = {
    fetchReprintChannelList,
    updateReprintChannelList,
    clearReprintChannelList,
    fetchChannelTypes,
    PostUpOrDownShelf,
    PostDeleteCourse,
    setReprintInfo,
    setPromotionInfo,
    setPromotionModalShow
}

export default connect(mapStateToProps, mapActionToProps)(ReprintTab)
