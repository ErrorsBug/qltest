import React, { PureComponent } from 'react'
import PortalCom from '../portal-com'
import { autobind } from 'core-decorators'
import { getTags, addTag, deleteTag } from '../../actions/community'
import { getCookie } from 'components/util'
import PubSub from 'pubsub-js'

@autobind
export default class EditTag extends PureComponent {
    state = {
        isShow: false,
        isInput: false,
        tags: [],
        value: '',
        hotTags: []
    }
    isLoading =  false
    hotSleTags = []
    componentDidMount() {
        this.initData();
        this.setState({
            isShow: true
        })
    }

    // 初始化请求
    async initData() {
        const [ hotTags, userTags ] = await Promise.all([
            getTags({ ideaUserId: 0,source: 'ufw', page: 1, size: 15 }),
            getTags({ ideaUserId: getCookie('userId'),source: 'ufw', page: 1, size: 5 }),
        ])
        const tags = userTags?.dataList || [];
        const curHotTags = hotTags?.dataList || [];
        const newTags = this.handleData(tags, curHotTags);
        this.setState({ 
            tags: tags,
            hotTags: newTags,
            // isInput: !tags.length
        }, () => {
            if(!tags.length) {
                // this.tagInput.focus()
            }
        })
    }

    // 处理数据
    handleData(tags, hotTags) {
        if(!!hotTags.length) {
            const tagsIds = tags.map((item) => item.name);
            return hotTags.map((item) => {
                tagsIds.includes(item.name) && (item.action = true) 
                tagsIds.includes(item.name) && (this.hotSleTags.push(item.name))
                return item
            })
        }
        return hotTags
    }

    // 监听输入标签
    onChange(e) {
        const value = e.target.value.trim();
        this.setState({
            value: value
        })
    }

    // 监听确认件
    async onKeyUp(e) {
        if (e.keyCode === 13) {
            const { value } = this.state
            if(!value) {
                window.toast('请输入关键字标签!')
                return false;
            }
            this.handleAddTag(value);
        }
    }

    // 处理标签保存
    async handleAddTag(value) {
        if(this.isLoading) return false;
        if(value.length > 10) {
            window.toast('关键字标签最多输入10个字!')
            return false;
        }
        this.isLoading = true
        const { tags } = this.state
        const res = await addTag({
            name: value,
            source: 'ufw'
        })
        if(!!res) {
            window.toast('标签保存成功')
            this.setState({
                tags: [...tags, { name: value, id: res.id } ],
                value: '',
                isInput: false
            })
        }
        this.isLoading = false
    }

    // 处理输入框是否显示
    handleInput() {
        const { isInput, tags } = this.state;
        if(tags.length >= 5) {
            window.toast('最多只能添加5个关键词标签!')
            return false
        } 
        this.setState({
            isInput: !isInput
        }, () => {
            if(this.tagInput){
                this.tagInput.focus();
            }
        })
    }

    // 保存
    onSubmit() {
        const value = this.tagInput.value;
        if(!value) {
            window.toast('请输入关键字标签!')
            return false;
        }
        window.toast('保存中...', 5000)
        this.handleAddTag(value);
    }

    // 失去标签
    onBlur() {
        const value = this.tagInput.value;
        if(!value) {
            this.setState({
                isInput: false
            })
        }
    }

    // 删除选择的标签
    async removeCurTag(id, tag) {
        this.hotSleTags = this.hotSleTags.filter((item) => !Object.is(item, tag));
        const res = await deleteTag({ id: id })
        if(!!res) {
            window.toast("删除成功")
            this.handleHotTag(id, tag, false)
        }
    }

    // 选择热门标签
    async selectHotTag(id, value) {
        if(this.hotSleTags.includes(value)) return false
        if(this.state.tags.length >= 5) {
            window.toast('最多只能添加5个关键词标签!')
            return false
        }
        await this.handleAddTag(value);
        this.hotSleTags.push(value)
        this.handleHotTag(id, value)
    }

    // 处理用户标签和热门标签：
    handleHotTag(id, value, flag = true){
        const { hotTags, tags } = this.state;
        const newHotTags = hotTags.map((item) => {
            item.name === value && (item.action = flag);
            return item
        })
        let newTags = [];
        if(flag) {
            const tag = tags.filter((item) => (Object.is(item.id, id)))
            newTags = [ ...tags, ...tag ]
        } else {
            newTags = tags.filter((item) => !(Object.is(item.id, id)))
        }
        this.setState({
            hotTags: newHotTags,
            tags: newTags
        })
    }

    // 保存标签
    async saveTag() {
        PubSub.publish('tags', this.state.tags)
        this.props.showSelectTopic();
    }
    render() {
        const { isInput, value,tags, hotTags } = this.state;
        return (
            <PortalCom className="un-tag-box">
                <div className="un-tag-blank"></div>
                <div className="un-tag-section">
                    <div className="un-tag-header"><i className="iconfont iconxiaoshanchu" onClick={ this.saveTag }></i></div>
                    <div className="un-tag-cont">
                        <div className="un-tag-lists">
                            { !!tags.length && tags.map((item, index) => (
                                <span key={ index } onClick={ () => this.removeCurTag(item.id, item.name) }>{ item.name }</span>
                            )) }
                            { isInput && (
                                <div className="un-tag-input-wd" onSubmit={ this.onSubmit }>
                                    { value }
                                    <form action="javascript:void(0);"> 
                                        <input 
                                            ref={ r => this.tagInput = r }
                                            name="tag" 
                                            type="text"
                                            value={ value }
                                            onChange={ this.onChange } 
                                            onBlur={ this.onBlur } 
                                            onKeyUp={ this.onKeyUp }  
                                            className="un-tag-input"  /> 
                                        { !!value && <button type="submit" className="iconfont iconbianzu" ></button> }
                                        
                                    </form>
                                </div>
                                
                            ) }
                            { !isInput && (
                                <p className="un-tsg-plcae" onClick={ this.handleInput }>请输入或选择形象关键词</p>
                            ) }
                        </div>
                        <div className="un-tsg-tip">最多添加5个关键词标签</div>
                        <div className="un-tag-hot">
                            <h4>为你推荐</h4>
                            <div className="un-hot-lists">
                                { hotTags.map((item, index) => (
                                    <p  key={ index } 
                                        data-log-name={ "为你推荐" }
                                        data-log-region={"un-community-hot-lists"}
                                        data-log-pos={ item.id } 
                                        onClick={ () => this.selectHotTag(item.id, item.name) } 
                                        className={ `on-log on-visible ${item.action ? 'action' : ''}` }>
                                        <em className="iconfont icontianjia"></em>
                                        { item.name }
                                    </p>
                                )) }
                            </div>
                        </div>
                    </div>
                    <div className="un-tag-btn on-log on-visible" 
                        data-log-name={ "确认" }
                        data-log-region={"un-community-tag-confirm"}
                        data-log-pos={ '0' } 
                        onClick={ this.saveTag }>确认</div>
                </div>
            </PortalCom>
        )
    }
}

