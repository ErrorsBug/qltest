import React, {Component} from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import {locationTo} from 'components/util';
import { collectList, addCollect, cancelCollect } from '../../actions/mine'
import Picture from 'ql-react-picture'

import { BottomDialog } from 'components/dialog';
import EmptyPage from 'components/empty-page';

function mapStateToProps (state) {
    return {
    }
}

const mapActionToProps = {
    collectList, addCollect, cancelCollect
}

class CollectList extends Component {

    data = {
        pageSize: 20
    }

    state = {
        dataList: [],
        page: 1,
        noMore: false,

        showControlDialog: false,
        chosenItem: {},
    }

    async componentDidMount() {
        this.getCollectList()
    }

    getCollectList = async (next) => {
        const result = await this.props.collectList({page: {page: this.state.page, size: this.data.pageSize}})
        const dataList = this.state.dataList
        const originLength = this.state.dataList.length
        
        if(result && result.data && result.data.collections && result.data.collections.length) {
            result.data.collections.map((item, index) => {
                dataList.push({...item, index: originLength + index, collected: true})
            })
            this.setState({
                dataList,
                page: this.state.page + 1,
                noMore: result.data.collections.length < 20
            })
        } else {
            this.setState({noMore: true})
        }
        next && next()
    }

    openControlHandle = (item) => {
        this.setState({
            chosenItem: item,
            showControlDialog: true,
        })
    }

    hideControlHandle = () => {
        this.setState({
            chosenItem: {},
            showControlDialog: false,
        })
    }

    toSimilarHandle = () => {
        const item = this.state.chosenItem

        this.setState({showControlDialog: false})

        locationTo('/wechat/page/similarity-course?type=' + item.type + '&id=' + item.businessId )

        if(window._qla) {_qla('click', {region: "collect", pos: "control-admin", type: 'to-similar'})}; 
    }

    cancelCollectHandle = async () => {
        const item = this.state.chosenItem
        const dataList = this.state.dataList

        const result = await this.props.cancelCollect({
            type: item.type,
            businessId: item.businessId
        })

        if (result) {
            dataList[item.index] = {
                ...dataList[item.index],
                collected: false,
            }
            this.setState({
                dataList,
                chosenItem: {
                    ...this.state.chosenItem,
                    collected: false,
                }
            })
            window.toast("取消收藏", 1000, 'unlike')
            if(window._qla) {_qla('click', {region: "collect",pos: "control-admin", type: 'cancel-collect'})}; 
        }


    }

    collectHandle = async () => {
        const item = this.state.chosenItem
        const dataList = this.state.dataList

        const result = await this.props.addCollect({
            type: item.type,
            businessId: item.businessId
        })

        if (result) {
            dataList[item.index] = {
                ...dataList[item.index],
                collected: true,
            }
            this.setState({
                dataList,
                chosenItem: {
                    ...this.state.chosenItem,
                    collected: true,
                }
            })
            window.toast("添加收藏", 1000, 'unlike')
            if(window._qla) {_qla('click', {region: "mine-collect",pos: "control-admin", type: 'add-collect'})}; 
        }
    }

    toCourse = (item) => {
        if(item.type == "channel") {
            locationTo('/live/channel/channelPage/' + item.businessId + '.htm')
        } else if(item.type == "topic") {
            locationTo(`/topic/details?topicId=${item.businessId}`)
        }
        if(window._qla) {_qla('click', {region: "mine-collect",pos: "course-item", type: item.type, id: item.businessId})}; 
    }

    render() {
        return (
            <Page title="我的收藏" className="mine-collect-page">
                
                <ScrollToLoad
                    className='collect-list'
                    loadNext={this.getCollectList}
                    noMore={this.state.noMore && !!this.state.dataList.length}
                >
                    {
                        this.state.dataList.length === 0 &&
                        <EmptyPage emptyMessage="暂时没有收藏的课程"/>
                    }
                    {
                        this.state.dataList.map((item, index) => (
                            <div className={ `collect-item ${ Object.is(item.isBook, 'Y') ? 'collect-book' : ''} ` } key={'collect-item-' + item.businessId} onClick={() => {this.toCourse(item)}}>
                                <Picture className="headImg" src={ item.headImage } placeholder={true} resize={{w:'162',h:`${ Object.is(item.isBook, 'Y') ? '207' : '101' }`}}  />
                                {/* <img  src={ + "@296h_480w_1e_1c_2o"}></img> */}
                                <div className="info">
                                    <div className={`title${(item.type == 'channel' && !Object.is(item.isBook, 'Y')) ? " channel" : ""}`}>{item.title}</div>
                                    <div className="topicNum">{ Object.is(item.isBook, 'Y') ? '听书' : `共${item.topicCount}节课` }</div>
                                </div>
                                <div className="contrl" onClick={(e) => {e.stopPropagation(); e.preventDefault(); this.openControlHandle(item)}}></div>
                            </div>
                        ))
                    }
                </ScrollToLoad>

                
                <BottomDialog
                    className='collect-control-dialog'
                    show={this.state.showControlDialog}
                    bghide={ true }
                    theme='empty'
                    close={ true }
                    onClose={ () => {this.setState({showControlDialog: false})} }
                >
                    <div className='main'>
                        <div className="control-item" onClick={this.toSimilarHandle}>
                            <div className="control-icon-con">
                                <div className="similar"></div>
                            </div>
                            <div className="control-des">找相似</div>
                        </div>
                        {
                            this.state.chosenItem.collected ?
                                <div className="control-item" onClick={this.cancelCollectHandle}>
                                    <div className="control-icon-con">
                                        <div className="red-heart"></div>
                                    </div>
                                    <div className="control-des">取消收藏</div>
                                </div>
                                :
                                <div className="control-item" onClick={this.collectHandle}>
                                    <div className="control-icon-con">
                                        <div className="gray-heart"></div>
                                    </div>
                                    <div className="control-des">收藏</div>
                                </div>
                        }

                        <div className="btn-close" onClick={() => { this.setState({ showControlDialog: false }) }}>关闭</div>
                    </div>
                </BottomDialog>
                
            </Page>
        );
    }
}

module.exports = connect(mapStateToProps, mapActionToProps)(CollectList);
