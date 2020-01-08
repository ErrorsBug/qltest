import React, {Component} from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import { locationTo, localStorageSPListAdd, localStorageSPListDel } from 'components/util';
import { footprintList } from '../../actions/mine'
import TopTabBar from 'components/learn-everyday-top-tab-bar';
import QfuEnterBar from 'components/qfu-enter-bar'
import { BottomDialog } from 'components/dialog';
import EmptyPage from 'components/empty-page';
import CampAd from 'components/camp-ad'

function mapStateToProps (state) {
    return {
    }
}

const mapActionToProps = {
    footprintList
}

class FootPrint extends Component {

    data = {
        pageSize: 20,
        cIndex: 0,
        idList: [],
    }

    state = {
        dataList: [],
        noMore: false,

        showControlDialog: false,
        chosenItem: {},
    }

    async componentDidMount() {

        window.localStorageSPListAdd = localStorageSPListAdd

        this.initIdList()
        this.GetfootPrintList()
    }

    initIdList = () => {
        var idList = JSON.parse(window.localStorage.getItem("footPrint")) || []
        for (let index = 0; index < idList.length; index++) {
            idList[index].id = String(idList[index].id)
        }

        this.data.idList = idList


    }

    GetfootPrintList = async (next) => {
        const dataList = this.state.dataList
        const originLength = this.state.dataList.length

        const result = await this.props.footprintList({
            courseList: this.data.idList.slice(this.data.cIndex, this.data.cIndex + 20)
        })
        
        if(result && result.data && result.data.dataList && result.data.dataList.length) {
            this.data.cIndex += 20

            result.data.dataList.map((item, index) => {
                dataList.push({...item, index: originLength + index})
            })
            this.setState({
                noMore: this.data.cIndex >= this.data.idList.length,
                dataList: dataList
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

        if(window._qla) {_qla('click', {region: "foot-print",pos: "control-admin", type: 'to-similar'})}; 

        locationTo('/wechat/page/similarity-course?type=' + item.type + '&id=' + item.id )
    }

    deleteFootPrintHandle = () => {
        const item = this.state.chosenItem
        const dataList = this.state.dataList

        console.log("删除");
        console.log(item.name);
        if(window._qla) {_qla('click', {region: "foot-print",pos: "control-admin", type: 'delete-foot-print'})}; 
        
        localStorageSPListDel('footPrint', item.id, item.type)
        dataList.splice(item.index, 1)
        dataList.map((item, index) => {
            dataList[index].index = index
        })
        this.setState({dataList, showControlDialog: false})
        window.toast("删除成功", 1000, 'del')
    }

    toCourse = (item) => {
        if(item.type == "channel") {
            locationTo('/live/channel/channelPage/' + item.id + '.htm')
        } else if(item.type == "topic") {
            locationTo(`/wechat/page/topic-intro?topicId=${item.id}`)
        }
        if(window._qla) {_qla('click', {region: "foot-print",pos: "course-item", type: item.type, id: item.id})}; 
    }

    render() {
        return (
            <Page title="我的足迹" className="mine-foot-print-page">
                <TopTabBar 
                    config = {[
                        {
                            name: '看过的课程',
                            href: '/wechat/page/mine/foot-print'
                        },
                        {
                            name: '看过的直播间',
                            href: '/wechat/page/mine/look-studio'
                        },
                    ]}
                    activeIndex = {0}
                />
                
                <ScrollToLoad
                    className='collect-list'
                    loadNext={this.GetfootPrintList}
                    noMore={this.state.noMore && !!this.state.dataList.length}
                >
                    {
                        this.state.dataList.length === 0 &&
                        <EmptyPage  className="empty-portal" />
                    }
                    <QfuEnterBar
                        activeTag={'footPrint'}
                        hideBought={true}
                    />
                    {
                        this.state.dataList.map((item, index) => (
                            <div className='collect-item' key={'collect-item-' + item.id} onClick={() => {this.toCourse(item)}}>
                                <img className="headImg" src={item.headImage + "@296h_480w_1e_1c_2o"}></img>
                                <div className="info">
                                    <div className={`title${item.type == 'channel' ? " channel" : ""}`}>{item.name}</div>
                                    <div className="topicNum">共{item.topicCount}节课</div>
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
                            <div className="control-des" >找相似</div>
                        </div>

                        <div className="control-item" onClick={this.deleteFootPrintHandle}>
                            <div className="control-icon-con">
                                <div className="delete"></div>
                            </div>
                            <div className="control-des">删除</div>
                        </div>

                        <div className="btn-close" onClick={() => { this.setState({ showControlDialog: false }) }}>关闭</div>
                    </div>
                </BottomDialog>
            </Page>
        );
    }
}

module.exports = connect(mapStateToProps, mapActionToProps)(FootPrint);
