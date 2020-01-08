import React, { Component, Fragment } from 'react'
import PortalCom from '../portal-com'
import { autobind } from 'core-decorators'
import ImgUpload from '../img-upload'
import Picture from 'ql-react-picture'
import { isWeixin, isPc } from 'components/envi'
import classnames from 'classnames'
import { addIdea, getTopicList,getListTopicCategory } from '../../actions/community'; 
import ScrollToLoad from 'components/scrollToLoad'
import TopicItem from '../community-topic-item'
import PubSub from 'pubsub-js'

@autobind
export default class EditIdea extends Component {
    state = {
        value: '',
        len: 0,
        imgMaxCount: 9,
        count: 9,
        isShowControll: false,
        imgs: [],
        topicName: '',
        isTopic: false,
        topicId: '',
        topicLists: [],
        isMore: false,
        tagId: ''
    }
    page = {
        page: 1,
        size: 20
    }
    txtNode = null;
    isLoading = false;

    componentDidMount() {
        this.initData();
        const ideaInfo = JSON.parse(localStorage.getItem('ideaInfo'))
        const value = localStorage.getItem('ideaTxt');
        if(!!ideaInfo || !!value) {
            const txt = ideaInfo?.text || value || '';
            this.setState({
                topicId: ideaInfo?.topicId || this.props.id,
                value: txt,
                imgs: ideaInfo?.resourceList || [],
                len: txt.length || 0
            })
        }
        this.setState({
            topicName: this.props.name,
            topicId: this.props.id
        })
        if(this.txtNode) {
            this.txtNode.focus();
        }
    }

    // 初始化数据
    async initData() { 
        const { dataList = [] } = await getListTopicCategory()
        await this.setState({
            categoryList:dataList
        }) 
        this.handleAction(0)
    }
    async getList(flag){ 
        const {categoryList,activeIndex} = this.state
        const { dataList = [] } = await getTopicList({source:'ufw',...this.page,businessId:categoryList[activeIndex]?.id});
        if(!!dataList && dataList.length >=0 && dataList.length < this.page.size){
            this.setState({
                isMore: true
            })
        } 
        this.page.page += 1;
        this.setState({
            topicLists:flag?dataList: [...this.state.topicLists, ...dataList ]
        })
    }
    // 监听输入框变化
    onChange(e) {
        e.stopPropagation();
        e.preventDefault();
        const value = e.target.value;
        if(value.length > 5000){
            window.toast(`想法字数不能超过${ 5000 }个字~`);
            return false
        }
        localStorage.setItem('ideaTxt', value);
        this.setState({ 
            value, 
            len: value.length || 0
        })
    }

    // 输入框聚焦
    onFocus() {
        if(!isPc() && isWeixin()){
            this.setState({
                isShowControll: true
            })
        }
    }

    // 输入框失去焦点
    onBlur() {
        this.txtNode.blur();
        setTimeout(() => {
            if(this.txtNode) {
                this.txtNode.scrollIntoView(true);
                this.setState({ isShowControll: false })
            }
        }, 100);
    }

    // 上传图片
    uploadHandle(file){
        const newFilte = file.map((item) =>  {
            item.type == 'imageId' && (item.url = item.serverId)
            return item
        })
        const imgs = [...this.state.imgs, ...newFilte] 
        this.setState({
            imgs: imgs,
            count: this.state.imgMaxCount - imgs.length
        })
    }

    // 删除图片
    removeImg(i) {
        const { imgs, imgMaxCount } = this.state
        imgs.splice(i, 1)
        this.setState({ imgs: imgs, count: imgMaxCount - imgs.length })
    }

    // 显示隐藏选择关联话题弹窗
    showSelectTopic() {
        this.setState({
            isTopic: !this.state.isTopic
        })
    }

    // 处理选中的话题信息
    handleSelectTopic(topic) {
        this.setState({
            isTopic: false,
            topicName: topic.name,
            topicId: topic.id
        })
    }

    // 下拉更多
    async loadNext(next) {
        if(this.isLoading || this.state.isMore) return false;
        this.isLoading = true;
        await this.getList();
        this.isLoading = false;
        next && next();
    }

    saveing=false
    // 保存想法
    async saveIdea() {
        if(this.saveing)return false
        this.saveing=true
        const { topicId, value, imgs } = this.state
        if(!value) {
            window.toast('请输入想法')
            return false
        }
        const parmas = {
            topicId,
            text: value,
            source: 'ufw',
            resourceList: imgs
        }
        window.loading&&window.loading(true)
        try {
            const res = await addIdea(parmas);
            if(!!res) {
                localStorage.removeItem('ideaInfo')
                localStorage.removeItem('ideaTxt')
                PubSub.publish('saveIdea')
                window.toast('发布成功')
                this.props.handleShowEdit(); // 
            } 
        } catch (error) {}
        this.saveing=false
        window.loading&&window.loading(false)
    }

    // 隐藏想法编辑弹窗
    hideIdeaEdit() {
        const { topicId, value, imgs } = this.state
        const parmas = {
            topicId,
            text: value,
            resourceList: imgs
        }
        localStorage.setItem('ideaInfo', JSON.stringify(parmas))
        this.props.handleShowEdit(); // 
    }
    
    // 删除话题
    removeTopic() {
        this.setState({
            topicName: '',
            topicId: ''
        })
    }

    handleAction(activeIndex){ 
        if(activeIndex==this.state.activeIndex)return false 
        this.state.activeIndex=activeIndex
        this.state.isMore=false  
        this.page.page= 1;
        this.getList(true)
    }

    render() {
        const { value, len, imgMaxCount, count, isShowControll, imgs, topicName, isTopic, isMore, topicLists, tagId,categoryList=[], activeIndex=0 } = this.state;
        const pubCls = classnames('on-log on-visible edit-idea-btn', {
            'show': !!value
        })
        return (
            <Fragment>
                <PortalCom className="un-edit-idea-box">
                    <i className="iconfont iconxiaoshanchu icon-close" onClick={ this.hideIdeaEdit }></i>
                    <div className="edit-idea-cont">
                        <div>
                            <div className="edit-idea-input">
                                <textarea 
                                    className="edit-idea-txt"
                                    name="content"
                                    value={ value } 
                                    ref={ (r) => this.txtNode = r }
                                    onChange={ this.onChange } 
                                    onFocus={ this.onFocus }
                                    onBlur={ this.onBlur }
                                    placeholder="好的想法可以获得更多的互动哦~" />
                                <i>{ len }/5000</i>
                            </div>
                            <div className="edit-idea-upload">
                                { imgs.map((item, index) => (
                                    <div className="edit-idea-img" key={ `${ item.url  }${index}` }>
                                        <div>
                                            <img src={ item.localId ? item.localId : item.url } />
                                            <span onClick={ () => {this.removeImg(index)} } className="iconfont iconxiaoshanchu"></span>
                                        </div>
                                    </div>
                                )) }
                                { imgs.length < 9 && (
                                    <div className="edit-idea-img">
                                        <ImgUpload 
                                            multiple
                                            count={ (imgMaxCount - imgs.length) }
                                            maxCount={ imgMaxCount }
                                            uploadHandle = {this.uploadHandle}
                                        >
                                            <Picture  
                                                className="edit-idea-pic"
                                                src={require('./img/icon-bg.jpg')}  
                                                resize={{ w: 200, h: 200 }}/>
                                            <div className="edit-idea-upload-btn iconfont icontianjia"></div>
                                        </ImgUpload>
                                    </div>
                                ) }
                            </div>
                            <div className="edit-idea-relation">
                                { !!topicName ? (
                                    <div className="edit-idea-unsel on-log on-visible"
                                        data-log-name={ "关联话题" }
                                        data-log-region={"un-community-idea-add-topic"}
                                        data-log-pos={ '0' } 
                                         onClick={ this.showSelectTopic }>
                                        <div>
                                            <i className="iconfont iconhuati"></i>
                                            <p > { topicName }</p>
                                            <em onClick={ (e) => { 
                                                e.preventDefault();
                                                e.stopPropagation();
                                                this.removeTopic();
                                            } }>
                                                <i  className="iconfont iconxiaoshanchu"></i>
                                            </em>
                                        </div>
                                        <em className="iconfont iconxiaojiantou"></em>
                                    </div>
                                ) : (
                                    <div className="edit-idea-unsel on-log on-visible"
                                        data-log-name={ "添加话题" }
                                        data-log-region={"un-community-idea-add-topic"}
                                        data-log-pos={ '0' }  
                                        onClick={ this.showSelectTopic }>
                                        <h4><i className="iconfont icontianjiahuati"></i> 添加话题</h4>
                                        <span>合适的话题会获得更多认同哦 <em className="iconfont iconxiaojiantou"></em></span>
                                    </div>
                                ) }
                            </div>
                        </div>
                    </div>
                    <div className={ pubCls } 
                        data-log-name={ "想法发布" }
                        data-log-region={"un-community-idea-push"}
                        data-log-pos={ '0' } 
                        onClick={ this.saveIdea }>发布</div>
                </PortalCom>
                {/* { (isShowControll) && (
                    <PortalCom className="un-idea-controll">
                        <div className="un-idea-btns">
                            <ImgUpload 
                                multiple
                                count={ count }
                                maxCount = {imgMaxCount}
                                uploadHandle = {this.uploadHandle}
                            >
                                <div className="un-idea-img"><i className="iconfont iconshangchuantupian"></i>上传图片</div>
                            </ImgUpload>
                        </div>
                        <div className="un-idea-btns">
                            <i className="iconfont icontianjiahuati"></i>
                            <p>添加话题</p>
                        </div>
                    </PortalCom>
                ) } */}
                { isTopic && (
                    <PortalCom className="un-topic-lists">
                        <div className="un-topic-blank"></div>
                        <div className="un-topic-box">
                            <div className="un-topic-header">全部话题 <i className="iconfont iconxiaoshanchu" onClick={ this.showSelectTopic }></i></div>
                            <div className="un-topic-items">
                                <div className="un-topic-tags">
                                    { categoryList?.map((item, index) => (
                                        <p 
                                            data-log-region="ba-tab-left"
                                            data-log-pos={index}
                                            data-log-name={ item?.value }
                                            key={ index } 
                                            className={ `on-log on-visible ${ activeIndex == index ? 'action' : '' }` } 
                                            onClick={ () => this.handleAction(index) }>
                                                <span>{item?.value || '测试=='}</span>
                                        </p>
                                    )) }
                                </div>
                                <div className="un-topic-1">
                                    <ScrollToLoad
                                        toBottomHeight={300}
                                        disable={ isMore }
                                        className="un-topic-scorll"
                                        loadNext={ this.loadNext }>
                                        { topicLists.map((item, index) => (
                                            <TopicItem key={ index } {...item.topicDto} handleSelectTopic={ () => this.handleSelectTopic(item.topicDto) }/> 
                                        )) }
                                        { isMore && <div className="un-topic-more">没有更多数据</div> }
                                    </ScrollToLoad>
                                </div>
                                
                            </div>
                        </div>
                    </PortalCom>
                ) }
            </Fragment>
        )
    }
}

