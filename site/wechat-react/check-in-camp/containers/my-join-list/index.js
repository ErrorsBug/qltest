import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { autobind,throttle } from 'core-decorators';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import { MiddleDialog } from 'components/dialog';
import CheckinCampCard from './join-item';
import { fetchJoinList,changeJoinStatus } from '../../actions/mine';
import Switch from 'components/switch';

@autobind
class CheckInCampJoinList extends Component {
    state = {
        // 列表数据是否经加载完毕
        noMore: false,
        // 列表数据是否为空
        noneOne: false,
        // 参与训练营的列表数据
        joinList: [],
        // 训练营总数
        totalCount: 0,
        // 弹出显示
        isShow: false,
        // 训练营id
        campId: '',
        // 状态
        active:false,
        // 
        pushStatus: '',
    }

    data = {
        // 页码
        page: 1,
        // 每页加载的记录条数
        pageSize: 20,
    }

    get liveId(){
        return this.props.location.query.liveId;
    }

    /**
     * 加载打卡训练营数据
     * @param {*function} next 
     */
    async loadMoreCheckinCamp(next){
        const page = {
            page: this.data.page++,
            size: this.data.pageSize,
        }
        const result = await this.props.fetchJoinList({page, liveId: this.liveId});
        if (result.state.code === 0) {
            if (this.data.page === 2) {
                this.setState({
                    totalCount: result.data.campCount
                });
            }
            const list = result.data.campList || [];
            if (list.length == 0 && page.page == 1) {
                this.setState({
                    noneOne: true
                });
            } else if (list.length < this.data.pageSize) {
                this.setState({
                    noMore: true
                });
            }
            // 将新加载的训练营数据推入数组
            if (list.length) {
                this.setState((prevState) => {
                    return {
                        joinList: [
                            ...prevState.joinList,
                            ...list,
                        ]
                    }
                });
            }
        } else {
            window.toast(result.state.msg);
        }
        next && next();
    }

    componentDidMount(){
        // 加载第一页的打卡训练营数据
        this.loadMoreCheckinCamp();
    }

    // 关闭弹出
    close(flag){
        this.setState({
            isShow:false,
            active:false,
            campId:'',
            pushStatus:''
        })
    }

    // 显示弹出
    getDislogChange(campId,pushStatus){
        this.setState({
            campId:campId,
            active: Object.is(pushStatus,"Y"),
            isShow:true,
            pushStatus: pushStatus

        })
    }
    
    // 打卡状态变化
    @throttle(100)
    bindSwitch(e){
        this.setState({
            active: e
        })
    }
    async onSure(){
        const obj = {
            campId:this.state.campId,
            pushStatus: this.state.active ? 'Y' : 'N',
        }
        if(Object.is(this.state.pushStatus,obj.pushStatus)) {
            this.close();
            return false;
        };
        const { state:{ code,msg } } = await this.props.changeJoinStatus(obj);
        if(Object.is(code,0)){
            this.state.joinList.forEach((item) => {
                if(Object.is(item.campId,obj.campId)){
                    item = Object.assign(item,obj)
                }
                return item;
            })
            this.setState({
                joinList:this.state.joinList
            })
        }else{
            window.toast(msg);
        }
        this.close();
    }

    render(){
        const {
            noneOne,
            noMore,
            totalCount,
            joinList,
            active,
        } = this.state;
        const { sysTime } = this.props;
        return (
            <Page title="我的打卡列表" className="check-in-camp-join-list-container">
                <div className="my-join-list">我参与的打卡({totalCount})</div>
                <ScrollToLoad
                    className='dd check-in-camp-join-list'
                    toBottomHeight={500}
                    loadNext={this.loadMoreCheckinCamp}
                    noneOne={noneOne}
                    noMore={noMore}>
                {
                    joinList.map((camp, index) => (
                        <CheckinCampCard
                            key={`camp-${index}`}
                            camp={camp}
                            onChangeDialog={() => this.getDislogChange(camp.campId,camp.pushStatus)}
                            sysTime={sysTime} />
                    ))
                }
                </ScrollToLoad>

                <MiddleDialog
                    show={this.state.isShow}
                    theme='empty'
                    bghide
                    titleTheme={'white'}
                    buttons='cancel-confirm'
                    title="通知设置"
                    className="join-dialog"
                    onClose={ () => this.close() }>
                    <div className="join-box">
                        <div className="join-cont">
                            <div className="join-switch">
                                <p>打卡提醒设置</p>
                                <Switch className="ad" active={active} onChange={() => this.bindSwitch(!active) } />
                            </div>
                            <div className="join-text">系统将于每天早上9:00提醒你打卡</div>
                        </div>
                        <div className="join-btns">
                            <button className="btn" onClick={ () => this.close() }>取消</button>
                            <button className="btn btn-red" onClick={ this.onSure }>确认</button>
                        </div>
                    </div>
                </MiddleDialog>
            </Page>
        )
    }
}

const mapStateToProps = (state) => ({
    sysTime: state.common.sysTime,
});

const mapActionToProps = {
    fetchJoinList,
    changeJoinStatus,
};

export default connect(mapStateToProps, mapActionToProps)(CheckInCampJoinList);

