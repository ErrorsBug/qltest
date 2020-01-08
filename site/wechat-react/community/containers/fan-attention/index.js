import React, { Component , Fragment } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import { getUrlParams } from 'components/url-utils';
import Header from './components/header'
import FanInfo from '../../components/fan-info'
import ScrollToLoad from 'components/scrollToLoad'
import PortalCom from '../../components/portal-com';
import { getListFocus, getListFans, postFocus, postUnFocus, getUfwUserInfo, getFocusStatus } from '../../actions/community'
import { getCookie } from 'components/util';
import EmptyStatus from '../../components/empty-status';  
import { bindAppKaiFang } from '../../actions/common';
import ShowQrcode from '../../components/show-qrcode'


@autobind
class FanAttention extends Component {
    state = {
        isMore: false,
        lists: [],
        focusNum: 0,
        fansNum: 0,
        tabIdx: Number(getUrlParams('tabIdx')) || 0,
        isShow: false,
        noData: false,
        isShowQrcode:false,
        pubBusinessId:null
    }
    page = {
        page: 1,
        size: 20,
    }
    params = {}
    isLoading = false;
    componentDidMount() { 
        this.initData();
        this.inintUserInfo();
        bindAppKaiFang()
    }
    get userId(){
        return getUrlParams('userId')||getCookie('userId')
    }
    // 获取用户信息
    async inintUserInfo() {
        const { focusNum, fansNum } = await getUfwUserInfo({ ideaUserId: this.userId })
        this.setState({
            focusNum: focusNum || 0,
            fansNum: fansNum || 0
        })
    }

    // 初始化数据
    async initData(flag) {
        let res = {  };
        const params = {...this.page, source: 'ufw', }
        if(this.state.tabIdx == 1) {
            params.followerId =this.userId
            res = await getListFocus(params)
        } else {
            params.followId =this.userId
            res = await getListFans(params)
        }
        const { dataList } = res;
        if(!!dataList && dataList.length >=0 && dataList.length < this.page.size){
            this.setState({
                isMore: true
            })
        } 
        this.page.page += 1;
        const data = flag ? dataList : [...this.state.lists, ...dataList]
        if(!data.length) {
            this.setState({
                noData: true
            })
        }
        this.setState({
            lists: data
        })
    }

    // 导航切换
    switchNav(idx) {
        this.page.page = 1;
        this.setState({ isMore: false, tabIdx: idx, noData: false },() => {
            this.initData(true);
        });
    }

    // 下拉加载
    async loadNext (next) {
        if(this.isLoading || this.state.isMore) return false;
        this.isLoading = true;
        await this.initData();
        this.isLoading = false;
        next && next();
    }

    // 处理关注状态提交
    async onFocusStatus(followId, flag) {
        const params = {
            source: 'ufw',
            followId: followId,
        }
        if(flag) {
            this.params = params
            this.setState({
                isShow: true
            })
        } else {
            params.notifyStatus = 'Y'
            const res = await postFocus(params); // 关注
            if(res) {
                this.switchNav(this.state.tabIdx);
                this.inintUserInfo();
                window.toast('关注成功')
                this.setState({
                    pubBusinessId:followId,
                    isShowQrcode:true
                })
            }
        }
    }

    async unFocus() {
        const res = await postUnFocus(this.params); // 取消关注
        if(res) {
            this.switchNav(this.state.tabIdx);
            this.inintUserInfo();
        } else {
            window.toast('取消关注失败')
        }
        this.params = {}
        this.onCancal();
    }
    onCancal() {
        this.setState({
            isShow: false
        })
    }
    closeQrcode(){
        this.setState({
            isShowQrcode:false
        })
    }
    render(){
        const { isMore, lists, focusNum, fansNum, tabIdx, isShow, noData, isShowQrcode, pubBusinessId } =  this.state;
        return (
            <Fragment>
            <Page title="粉丝关注" className="un-fan-box">
                <Header switchNav={ this.switchNav} focusNum={ focusNum } fansNum={ fansNum } tabIdx={ tabIdx } />
                <div className="un-fan-cont">
                    <ScrollToLoad
                        className={"un-fan-scroll"}
                        toBottomHeight={300}
                        noMore={ isMore }
                        noneOne={ noData }
                        emptyMessage={tabIdx === 1?'暂无粉丝':'暂无关注'}
                        loadNext={ this.loadNext }
                        >
                        <div>
                            { lists.map((item, index) =>{ 
                                return (
                                    <FanInfo isGuest={getCookie('userId')!=this.userId} key={index} isFans={ tabIdx === 0 } onFocusStatus={ this.onFocusStatus } { ...item } />
                                    ) 
                                })
                             } 
                        </div> 
                    </ScrollToLoad>
                </div>
                { isShow && (
                    <PortalCom className="un-fan-dialog">
                        <div>
                            <h4>确认不再关注？</h4>
                            <div className="un-fan-btns">
                                <div className="un-dan-cancel" onClick={ this.onCancal }>取消</div>
                                <div className="un-dan-sure" onClick={ this.unFocus }>确认</div>
                            </div>
                        </div>
                    </PortalCom>
                ) }
            </Page>
            {
                isShowQrcode&&<ShowQrcode close={this.closeQrcode} pubBusinessId={pubBusinessId}/>
            }
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
});

const mapActionToProps = {
};

module.exports = connect(mapStateToProps, mapActionToProps)(FanAttention);