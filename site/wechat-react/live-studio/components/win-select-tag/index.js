import React from 'react';
import { request } from 'common_actions/common';
import { modal } from 'components/indep-render';




export default class WinSelectTag extends React.Component {
    state = {
        isShow: false,
        tagList: undefined,
        curTagId: undefined,
    }

    render() {
        if (!this.state.isShow) return false;

        const tagList = this.getTagList();

        return <div className="c-mask-view ls-win-select-tag">
            <div className="c-mask-view-bg"
                onClick={this.hide}
            ></div>
            <div className="c-mask-view-body bottom">
                <div className="w-header">
                    <div className="title">{this.props.title}</div>
                    <div className="btn on-log"
                        data-log-region={this.props.region}
                        data-log-pos="tag-manage"
                        onClick={this.props.onClickManage}>分类管理</div>
                    <div className="btn on-log"
                        data-log-region={this.props.region}
                        data-log-pos="tag-add"
                        onClick={this.onClickNewTag}>新建分类</div>
                </div>

                <div className="w-list">
                    {
                        tagList && tagList.map((item, index) => {
                            const isCur = item.id == this.state.curTagId
                            || item.id == 0 && !this.state.curTagId; // 未选的时候归到0分类

                            return <div key={index}
                                className={`tag-item${isCur ? ' current' : ''}`}
                                onClick={() => this.onClickItem(item)}
                            >
                                <div className="name">{item.name}</div>
                                <i className="icon_checked"></i>
                            </div>
                        })
                    }
                </div>
                
                <div className="w-footer">
                    <div className="btn-add" onClick={this.onClickSubmit}>确定</div>
                </div>
            </div>
        </div>
    }

    // 点击新建分类
    onClickNewTag = () => {
        const tagList = this.getTagList();
        if (tagList && tagList.length >= 30) return window.toast('最多只能创建30个分类');
        this.promptNewTag();
    }

    // 输入新建分类名
    promptNewTag = (value = '') => {
        return modal({
            className: 'common-confirm',
            buttons: 'cancel-confirm',
            title: '请输入新建分类名称',
            children: <input type="text" placeholder="请输入名称"
                defaultValue={value} onChange={e => value = e.target.value} onBlur={() => {window.scrollTo(0, 0)}}
            />,
            onConfirm: () => {
                value = value.trim();

                if (!value) return;
                if (value.length > 10) {
                    window.toast('分类名称不能超过10个字');
                    return this.promptNewTag(value);
                }

                window.loading(true);
                return request.post({
                    url: '/api/wechat/transfer/h5/businessTag/addOrEditTag',
                    body: {
                        liveId: this.props.liveId,
                        name: value,
                        businessType: this.props.businessType,
                    }
                })
                    .then(res => {
                        this.updateTagList([...this.state.tagList, res.data.tag]);
                        window.toast('操作成功');
                        return true;
                    }).catch(err => {
                        window.toast(err.message);
                    }).finally(() => {
                        window.loading(false);
                    })
            }
        })
    }

    onClickSubmit = () => {
        if (this.state.curTagId == this.props.tagId) return this.hide();
        window.loading(true);
        request.post({
            url: '/api/wechat/transfer/h5/businessTag/moveIntoTag',
            body: {
                liveId: this.props.liveId,
                businessType: this.props.businessType,
                businessId: this.props.businessType !== "liveCamp" ? this.props.business.id : this.props.business.campId,
                tagId: this.state.curTagId,
            }
        }).then(res => {
            window.toast('操作成功');
            this.props.onChange(this.state.curTagId);
        }).catch(err => {
            window.toast(err.message);
            console.error(err);
        }).finally(() => {
            window.loading(false);
        })
    }

    onClickItem = tag => {
        if (tag.id == (this.state.curTagId || 0)) return;
        this.setState({
            curTagId: tag.id,
        })
    }

    // 获取当前分类列表数据源，props或state，根据props上是否有监听事件决定
    getTagList = () => {
        return this.state.tagList;
    }

    updateTagList = list => {
        this.setState({
            tagList: list,
        })
    }

    show = () => {
        this.setState({
            isShow: true,
            curTagId: this.props.tagId,
        })
        this.fetchTagList();
    }

    hide = () => {
        this.setState({
            isShow: false,
            curTagId: undefined,
        })
    }

    fetchTagList = () => {
        if (this.state.tagList) return;
        window.loading(true);
        request.post({
            url: '/api/wechat/transfer/h5/businessTag/tagList',
            body: {
                liveId: this.props.liveId,
                businessType: this.props.businessType,
                type: 'all',
            }
        }).then(res => {
            const list = res.data.tagList || [];
            this.setState({
                tagList: [{
                    id: 0,
                    name: '暂不分类',
                }].concat(list)
            })
        }).catch(err => {
            window.toast(err.message);
            console.error(err);
        }).finally(() => {
            window.loading(false);
        })
    }
}