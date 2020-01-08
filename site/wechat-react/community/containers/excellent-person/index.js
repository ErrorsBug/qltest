import React, { Component , Fragment} from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import Page from 'components/page';
import { getUrlParams } from 'components/url-utils';
import { locationTo,getCookie } from 'components/util';
import FanInfo from './components/fan-info'
import ScrollToLoad from 'components/scrollToLoad'
import Header from './components/header'
import TagNav from './components/tag-nav'
import { getListFocus, getListFans, postFocus, postUnFocus, getUfwUserInfo, getFocusStatus ,getListStudentCategory, getListStudentByCategory,getSingleStudentInfo} from '../../actions/community'
import { getMenuNode } from '../../actions/home'
import { fillParams } from 'components/url-utils';
import { share } from 'components/wx-utils';
import appSdk from 'components/app-sdk';
import ShowQrcode from '../../components/show-qrcode'
import ChToUniversity from '../../components/ch-to-university'; 



@autobind
class ExcellentPerson extends Component {
    state = {
        isMore: false,
        lists: [],
        // focusNum: 0,
        noData: false,
        excellentNodeMsg:{},
        tagNavList : [],
        currentActiveTag:{},
        alumniList:[],
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
        // this.initData();
        getMenuNode({nodeCode:"QL_NZDX_SY_RMHT_YXXY"}).then(({menuNode}) => {
            this.setState({
                excellentNodeMsg:menuNode || {}
            },() => {
                this.initShare();
            })
        })
        this.initCategory()
    }

    get ideaUserId(){ 
        return getUrlParams('studentId','')|| getCookie('userId')
    }

    /**
     * @desc:获取类目，再拿第一个类目的id,获取该类目下的分类数据
     */
    initCategory() {
        return getListStudentCategory().then(({data}) => {
            this.setState({
                tagNavList:Array.isArray(data.dataList) ? data.dataList : []
            })
            if(Array.isArray(data.dataList) && data.dataList.length){
                this.setState({
                    currentTag: data.dataList[0]
                })
                this.setState({
                    currentActiveTag: data.dataList[0]
                })
                this.initCategoryDetail(data.dataList[0].id)
            }
        })
    }
    /**
     * @desc:根据种类id获取分类数据
     * @param:bussinessId
     */
    initCategoryDetail(businessId) {
        businessId = businessId ? businessId : this.state.currentActiveTag.id

        return getListStudentByCategory({
            source:'ufw',
            businessId:businessId,
            userId:this.ideaUserId,
            ...this.page
        }).then(({data}) => {
            if(!!data.dataList && data.dataList.length >=0 && data.dataList.length < this.page.size){
                this.setState({
                    isMore: true
                })
            }
            const renderList =this.page.page>1? [...this.state.alumniList, ...data.dataList] : data.dataList
            if(!renderList.length) {
                this.setState({
                    noData: true
                })
            }
            this.page.page += 1;
            this.setState({
                alumniList: renderList
            })
            return true
        })
    }
    
    // 初始化数据
    async initData() {
        // let res = {  };
        // const params = {...this.page, source: 'ufw', }
        // if(this.state.tabIdx == 1) {
        //     params.followerId =this.userId
        //     res = await getListFocus(params)
        // } else {
        //     params.followId =this.userId
        //     res = await getListFans(params)
        // }
        // const { dataList } = res;
        // if(!!dataList && dataList.length >=0 && dataList.length < this.page.size){
        //     this.setState({
        //         isMore: true
        //     })
        // } 
        // this.page.page += 1;
        // const data = flag ? dataList : [...this.state.lists, ...dataList]
        // if(!data.length) {
        //     this.setState({
        //         noData: true
        //     })
        // }
        // this.setState({
        //     lists: data
        // })
    }
    
    /**
     * 
     * @param {*} index 点击当前栏目的在数组中的下标
     */
    handleTabChange(index){
        this.page.page = 1
        this.setState({
            alumniList: [],
            noData:false,
            isMore:false,
            currentActiveTag:this.state.tagNavList[index]
        })
        let bussinessId = this.state.tagNavList[index].id
        this.initCategoryDetail(bussinessId)
        
        // 手动触发打点日志
        typeof _qla != 'undefined' && _qla('click', {
            region:'community-excellent-person-tab',
            pos:index+1
        });
    }

    //根据目标的id获取目标的状态：followId目标的id,index目标处于数组的下标
    async handlerSingleStudentInfo(followId,index){
        getSingleStudentInfo({
            source:'ufw',
            followId:followId,
            userId:this.ideaUserId
        }).then(({data}) => {
            let changeData = [...this.state.alumniList]
            changeData[index] = data.dto
            this.setState({
                alumniList:changeData,
            })
            if(data.dto.isFocus === 'Y'){
                this.setState({
                    pubBusinessId:followId,
                    isShowQrcode:true
                })
            }
        })
    }

    // 下拉加载
    async loadNext (next) {
        if(this.isLoading || this.state.isMore) return false;
        this.isLoading = true;
        this.initCategoryDetail().then(()=>{
            this.isLoading = false;
            next && next();
        })
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

    initShare() {
        const { shareParams, shareConfig } = this.props;
        let title = this.state.excellentNodeMsg.title || '千聊女子大学-优秀校友';
        let desc = this.state.excellentNodeMsg.keyA || '追寻有能量的人，发现我的能量';
        let shareUrl = fillParams({...shareParams , wcl:'university_share'}, location.href,[])
        let imgUrl = 'https://img.qlchat.com/qlLive/activity/image/7U9OO2L5-Y1W6-WRND-1570504679615-PRIR25AIRY3R.jpg'
        // h5 分享
        share({
            title: title,
            timelineTitle: title,
            desc: desc,
            timelineDesc: desc,
            imgUrl: imgUrl,
            shareUrl: shareUrl
        });

        // app分享
        appSdk.shareConfig({
            title: title,
            desc: desc,
            thumbImage: imgUrl,
            content: shareUrl,
            success: (res) => {
                console.log('分享成功！res:', res);
            }
        })
    }

    closeQrcode(){
        this.setState({
            isShowQrcode:false
        })
    }
    
    render(){
        const { isMore, noData, isShowQrcode, pubBusinessId } = this.state;
        return (
            <Fragment>
                <Page title={this.state.excellentNodeMsg.title} className="ct-person-box">
                    <ScrollToLoad
                        id="scrolling-box"
                        className={"ct-person-scroll"}
                        toBottomHeight={300}
                        noMore={ isMore }
                        noneOne={ noData }
                        loadNext={ this.loadNext }
                        >
                        <Header headImg={this.state.excellentNodeMsg.keyB} headImgUrl={this.state.excellentNodeMsg.keyC}/>
                        <div className="ct-person-cont">
                            <TagNav tagNavList={ this.state.tagNavList } changeTag={this.handleTabChange}/>
                            <div className="ct-person-list">
                                { this.state.alumniList.map((item, index) => (
                                    <FanInfo key={index} {...item} handlerSingleStudentInfo={this.handlerSingleStudentInfo} zIndex={index}/>
                                )) }
                            </div>
                        </div>
                    </ScrollToLoad>
                    <ChToUniversity 
                        initClick={()=>{ locationTo(`/wechat/page/university/community-center`)}}
                        imgUrl="https://img.qlchat.com/qlLive/business/WO6I8XW1-8V4O-GT1E-1571020407965-PABC7DAHRGJA.png"/>
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

module.exports = connect(mapStateToProps, mapActionToProps)(ExcellentPerson);