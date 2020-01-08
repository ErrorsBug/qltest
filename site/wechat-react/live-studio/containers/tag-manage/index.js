import React from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';
import { request } from 'common_actions/common';
import { renderFun, modal } from 'components/indep-render';



class PageContainer extends React.Component {
    state = {
        tagList: undefined,
    }

    get type() {
        return this.props.location.query.type;
    }

    async componentDidMount() {
        await Promise.resolve();

        this.fetchTagList();
    }

    render() {
        let { tagList } = this.state;
        return (
            <Page title="分类管理" className="p-ls-tm">
                <div className="scroll-wrap">
                    {
                        this.props.location.query.type === 'camp'
                            ?
                            <div className="desc">
                                <p>训练营可选择已添加的分类。</p>
                                <p>若该分类下没有训练营，则该分类在直播间主页不显示。</p>
                            </div>
                            :
                            <div className="desc">
                                <p>新建或编辑系列课时，可选择已添加的分类。</p>
                                <p>若该分类下没有系列课，则该分类在直播间主页不显示。</p>
                            </div>
                    }

                    <div className="tag-list">
                        {
                            tagList && tagList.map((item, index) => {
                                return <div key={index}
                                    className="tag-item"
                                >
                                    <div className="index">{index + 1}</div>
                                    <div className="name">{item.name}</div>
                                    <div className="btn-operate"
                                        onClick={() => this.showOperateMenu(index)}
                                    >
                                        <i className="icon_more"></i>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </div>

                <div className="footer">
                    <div className="btn-add on-log" onClick={this.onClickAdd}
                        data-log-region="train-management"
                        data-log-pos="add-item">添加分类</div>
                </div>
            </Page>
        )
    }

    showOperateMenu = (index) => {
        renderFun(({destroy}) =>
            <div className="c-mask-view ls-tm-actionsheet">
                <div className="c-mask-view-bg"
                    onClick={destroy}
                ></div>
                <div className="c-mask-view-body bottom">
                    <div>
                        <div className="as-item"
                            onClick={() => {
                                this.promptEditTag(index).then(res => res && destroy())
                            }}
                        >
                            编辑
                        </div>

                        <div className="as-item"
                            onClick={() => {
                                this.confirmDelete(index).then(res => res && destroy())
                            }}
                        >
                            删除
                        </div>

                        {
                            index == 0
                                ? 
                                <div className="as-item disabled">上移</div>
                                :
                                <div className="as-item"
                                    onClick={() => {
                                        this.moveTag(index, -1).then(res => res && destroy())
                                    }}
                                >
                                    上移
                                </div>
                        }

                        {
                            index == this.state.tagList.length - 1
                                ? 
                                <div className="as-item disabled">下移</div>
                                :
                                <div className="as-item"
                                    onClick={() => {
                                        this.moveTag(index, 1).then(res => res && destroy())
                                    }}
                                >
                                    下移
                                </div>
                        }
                    </div>

                    <div key='cancel'
                        className="as-item btn-cancel"
                        onClick={destroy}
                    >
                        取消
                    </div>
                </div>
            </div>
        )
    }

    onClickAdd = () => {
        const tagList = this.state.tagList;
        if (tagList && tagList.length >= 30) return window.toast('最多只能创建30个分类');
        this.promptNewTag();
    }

    promptNewTag = (value = '') => {
        return modal({
            className: 'common-confirm',
            buttons: 'cancel-confirm',
            title: '请输入新建分类名称',
            children: <input type="text" onBlur={() => window.scrollTo(0, 0)} placeholder="请输入名称"
                defaultValue={value} onChange={e => value = e.target.value}
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
                        liveId: this.props.location.query.liveId,
                        name: value,
                        businessType: this.props.location.query.type,
                    }
                })
                    .then(res => {
                        this.setState({
                            tagList: [...this.state.tagList, res.data.tag]
                        })
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

    promptEditTag = (index, value = '') => {
        const tag = this.state.tagList[index];

        return modal({
            className: 'common-confirm',
            buttons: 'cancel-confirm',
            title: '编辑分类',
            children: <input type="text" placeholder="请输入名称"
                defaultValue={value || tag.name} onChange={e => value = e.target.value}
            />,
            onConfirm: () => {
                value = value.trim();

                if (!value || value === tag.name) return;
                if (value.length > 10) {
                    window.toast('分类名称不能超过10个字');
                    return this.promptEditTag(index, value);
                }

                window.loading(true);
                return request.post({
                    url: '/api/wechat/transfer/h5/businessTag/addOrEditTag',
                    body: {
                        liveId: this.props.location.query.liveId,
                        name: value,
                        businessType: this.props.location.query.type,
                        id: tag.id,
                    }
                })
                    .then(res => {
                        this.setState({
                            tagList: this.state.tagList.map((item, i) => i != index ? item : {
                                ...tag,
                                name: value,
                            })
                        })
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

    confirmDelete = (index) => {
        const tag = this.state.tagList[index];

        return modal({
            className: 'common-confirm',
            buttons: 'cancel-confirm',
            children: <span style={{color: '#666'}}>确定删除“<span style={{color: '#333'}}>{tag.name}</span>”分类吗？</span>,
            onConfirm: () => {
                window.loading(true);
                return request.post({
                    url: '/api/wechat/transfer/h5/businessTag/deleteTag',
                    body: {
                        businessType: this.props.location.query.type,
                        id: tag.id,
                    }
                })
                    .then(res => {
                        this.setState({
                            tagList: this.state.tagList.filter((item, i) => i != index)
                        })
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

    moveTag = (index, count) => {
        const tag = this.state.tagList[index];
        const type = count >= 0 ? 'down' : 'up';

        window.loading(true);
        return request.post({
            url: '/api/wechat/transfer/h5/businessTag/moveTag',
            body: {
                businessType: this.props.location.query.type,
                id: tag.id,
                type,
            }
        })
            .then(res => {
                const _tagList = [...this.state.tagList];
                const item = _tagList.splice(index, 1)[0];
                if (type === 'up') {
                    _tagList.splice(index - 1, 0, item);
                } else {
                    _tagList.splice(index + 1, 0, item);
                }
                this.setState({
                    tagList: _tagList
                })
                window.toast('操作成功');
                return true;
            }).catch(err => {
                window.toast(err.message);
            }).finally(() => {
                window.loading(false);
            })
    }

    fetchTagList = () => {
        window.loading(true);
        const map = {topic: "topic", liveCamp:"liveCamp", training: "training", channel:"channel"};


        request.post({
            url: '/api/wechat/transfer/h5/businessTag/tagList',
            body: {
                liveId: this.props.location.query.liveId,
                businessType: this.props.location.query.type,
                type: 'all',
            }
        }).then(res => {
            const list = res.data.tagList || [];
            this.setState({
                tagList: list
            })
        }).catch(err => {
            window.toast(err.message);
            console.error(err);
        }).finally(() => {
            window.loading(false);
        })
    }
}



export default connect()(PageContainer)


