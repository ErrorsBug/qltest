import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { isQlchat, isAndroid } from 'components/envi';

import Page from 'components/page';
import ScrollView from 'components/scroll-view';
import { FbItemRadio, FbItemSelect, FbItemImageText } from './components/fb-item';
import SelectOrder from './components/select-order';
import CollectVisible from 'components/collect-visible';

import { request } from 'common_actions/common';
import { locationTo } from 'components/util';
import analyseUa from './analyse-ua';
import exposure from 'components/exposure';
import Detect from 'components/detect';


/**
 * 本页面创建反馈和反馈详情共用（有id参数时为反馈详情）
 */

const isApp = isQlchat()

class PageContainer extends React.Component {
    state = {
        feedbackId: undefined,
        pageTitle: '意见反馈',

        roleIndex: undefined,
        cateIndex: undefined,
        orderIndex: undefined,

        isShowWinSelectOrder: false,

        fbType: {
            status: '',
            data: undefined,
            page: {
                size: 10,
            }
        },

        orderList: {
            status: '',
            data: undefined,
            page: {
                size: 10,
            }
        },


        status: '', // 工单状态
        content: '', // 工单主内容
        businessName: '',
        images: [],
        feedbackRelayDtos: [],

        inputContent: '', // 当前编辑的内容
        inputImages: [],

        saveStatus: '', // 保存状态

        supplement: false, // 是否开启问题补充
    }

    constructor(props) {
        super(props);
        if (this.props.params.id) {
            this.state.feedbackId = this.props.params.id;
            this.state.pageTitle = '我的反馈';
        }

        this.isWechat = Detect.os.weixin;
    }

    componentDidMount() {
        if (this.props.params.id) {
            this.getFeedbackDetails();
        } else {
            this.onChangeRole(0);
            this.getOrderList().then(() => {
                if (this.state.orderList.data && this.state.orderList.data.length) {
                    this.setState({orderIndex: 0});
                }
            });
        }
    }

    render() {
        const { feedbackId } = this.state;
        const isStatic = !!feedbackId;
        const curCateList = this.getCurCateList();

        return <Page title={this.state.pageTitle} className="p-feedback">
            <ScrollView>
                <FbItemRadio
                    isStatic={isStatic}
                    title="你的身份"
                    isRequired={true}
                    config={this.roleConfig}
                    index={this.state.roleIndex}
                    onChange={this.onChangeRole}
                />
                {
                    curCateList &&
                    <FbItemSelect
                        isStatic={isStatic}
                        title="反馈类型"
                        isRequired={true}
                        placeholder="请选择问题类型"
                        config={curCateList}
                        index={this.state.cateIndex}
                        render={item => item && <span>{item.categoryName}<span className="desc">（{item.categoryContent}）</span></span>}
                        onChange={index => this.setState({cateIndex: index})}
                        onClick={this.onClickSelectCate}
                    />
                }

                {
                    isStatic && !this.state.businessName
                        ?
                        false
                        :
                        <FbItemSelect
                            isStatic={isStatic}
                            title="选择订单"
                            placeholder="若与订单相关，请选择此项"
                            config={this.state.orderList.data}
                            index={this.state.orderIndex}
                            render={item => isStatic ? this.state.businessName : item && item.businessName}
                            noActionSheet
                            onClick={this.onClickSelectOrder}
                        />
                }

                {
                    this.state.feedbackId &&
                    <FbItemImageText
                        isStatic={true}
                        title="反馈问题"
                        text={this.state.content}
                        images={this.state.images}
                        time={this.state.createTime}
                    />
                }

                {
                    this.state.feedbackRelayDtos.map((item, index) => {
                        return <FbItemImageText
                            key={'fbRelay' + index}
                            isStatic={true}
                            title={item.type === 'user' ? '问题补充' : '客服回复'}
                            className={item.type === 'user' ? '' : 'cs-reply'}
                            text={item.content}
                            images={item.images}
                            time={item.createTime}
                        />
                    })
                }

                {
                    (!this.state.feedbackId || this.state.supplement) &&
                    <FbItemImageText
                        title={this.state.feedbackId ? '问题补充' : '反馈问题'}
                        imageTitle={this.state.feedbackId ? '图片补充' : '上传图片'}
                        placeholder={this.state.feedbackId ? '请写下你想要补充的问题' : '请写下你遇到的问题'}
                        isRequired={true}
                        text={this.state.inputContent}
                        onChangeText={text => this.setState({inputContent: text})}
                        onUploadImage={this.onUploadImage}
                    />
                }

                {
                    this.state.status === 'success' &&
                    <div className="page-mark-done"></div>
                }
            </ScrollView>

            <div className="footer">
            {
                this.state.status === 'success'
                    ?
                    !isApp ? 
                        <CollectVisible>
                            <div className="backhome on-visible on-log"
                                data-log-region="btn-backhome"
                                onClick={() => locationTo('/wechat/page/recommend')}><i></i>回首页</div>
                        </CollectVisible> : null
                    :
                    this.state.feedbackId
                        ?
                        this.state.supplement
                            ?
                            <div className="btns">
                                <CollectVisible>
                                    <div className={classNames('btn on-visible on-log', {disabled: !this.getCanSave()})}
                                        data-log-region="btn-save-supplement"
                                        onClick={this.onClickSaveSupplement}
                                    >确认提交</div>
                                </CollectVisible>
                            </div>
                            :
                            <div className="btns">
                                <CollectVisible>
                                    <div className="btn white on-visible on-log"
                                        data-log-region="btn-supplement"
                                        onClick={this.onClickSupplement}>继续反馈</div>
                                    <div className="btn white on-visible on-log"
                                        data-log-region="btn-solve"
                                        onClick={this.onClickSolveFeedback}>问题已解决</div>
                                </CollectVisible>
                            </div>
                        :
                        <div className="btns">
                            <CollectVisible>
                                <div className={classNames('btn on-visible on-log', {disabled: !this.getCanSave()})}
                                    data-log-region="btn-save"
                                    onClick={this.onClickSave}
                                >{this.isWechat ? '提交并设置回复提醒' : '确认提交'}</div>
                            </CollectVisible>
                        </div>
            }
            </div>

            <SelectOrder
                in={this.state.isShowWinSelectOrder}
                onClose={() => this.setState({isShowWinSelectOrder: false})}
                orderList={this.state.orderList}
                getOrderList={this.getOrderList}
                onChange={this.onChangeOrderIndex}
                index={this.state.orderIndex}
            />
        </Page>
    }

    getCurRole = () => {
        const role = this.roleConfig[this.state.roleIndex];
        return role && role.id;
    }

    getCurCateId = () => {
        if (this.state.cateIndex >= 0) {
            const list =  this.getCurCateList();
            return list && list[this.state.cateIndex] && list[this.state.cateIndex].category;
        }
    }

    getCurCateList = () => {
        const role = this.getCurRole();
        return this.state[`cateList_${role}`] && this.state[`cateList_${role}`].data;
    }

    getCanSave = () => {
        return this.state.roleIndex >= 0 && this.state.cateIndex >= 0 && this.state.inputContent.trim();
    }

    getCurOrder = () => {
        if (this.state.orderIndex >= 0) {
            const list = this.state.orderList.data;
            return list && list[this.state.orderIndex];
        }
    }

    getUploadInputImages = () => {
        return (this.state.inputImages || []).map(item => ({
            content: item.content,
            mediaId: item.mediaId,
        }))
    }

    onUploadImage = (err, imgs) => {
        if (err) {
            window.toast('部分图片上传失败，请重新选择', 2000);
        } else {
            window.toast('图片上传成功');
        }
        this.setState({inputImages: imgs})
    }

    onClickSave = async () => {
        if (!this.getCanSave()) return;
        if (/pending/.test(this.state.saveStatus)) return;
        this.setState({
            saveStatus: 'pending',
        })
        window.loading(true);

        const ua = analyseUa();

        const body = {
            role: this.getCurRole(),
            category: this.getCurCateId(),
            content: this.state.inputContent.trim(),
            images: this.getUploadInputImages(),
            phoneModel: ua.device,
            systemVersion: ua.os,
            userAgent: navigator.userAgent,
            platform: isAndroid() ? 'androidH5' : 'iosH5'
        }

        const order = this.getCurOrder();
        if (order) {
            body.orderId = order.orderId;
            body.recordId = order.recordId;
            body.purchaseType = order.purchaseType;
        }

        request.post({
            url: '/api/wechat/transfer/h5/feedback/save',
            body,
        }).then(res => {
            window.toast('提交成功', 2000);

            this.setState({
                saveStatus: 'success',
                feedbackId: res.data.id,
                createTime: res.data.createTime,
                pageTitle: '我的反馈',
                images: this.state.inputImages,
                content: this.state.inputContent,
                inputContent: '',
                inputImages: [],
                businessName: order && order.orderId && order.businessName || ''
            })

            this.props.router.replace(`/wechat/page/feedback/${res.data.id}`)

            if (this.isWechat && res.data.subcribeUrl) locationTo(res.data.subcribeUrl); 

        }).catch(err => {
            window.toast(err.message);
            this.setState({
                saveStatus: '',
            })
        }).then(() => {
            window.loading(false);
        })
    }

    onClickSaveSupplement = () => {
        if (!this.getCanSave()) return;
        if (/pending/.test(this.state.saveStatus)) return;
        this.setState({
            saveStatus: 'pending',
        })
        window.loading(true);

        request.post({
            url: '/api/wechat/transfer/h5/feedback/relay',
            body: {
                feedbackId: this.state.feedbackId,
                content: this.state.inputContent.trim(),
                images: this.getUploadInputImages(),
            }
        }).then(res => {
            window.toast('提交成功', 2000);
            const feedbackRelayDto = res.data.feedbackRelayDto || {};

            const feedbackRelayDtos = [...this.state.feedbackRelayDtos];
            feedbackRelayDtos.push({
                images: this.state.inputImages,
                content: this.state.inputContent,
                type: feedbackRelayDto.type || 'user',
                createTime: feedbackRelayDto.createTime,
            });
            this.setState({
                saveStatus: 'success',
                supplement: false,
                feedbackRelayDtos,
                inputContent: '',
                inputImages: [],
            })

            if (this.isWechat && res.data.subcribeUrl) locationTo(res.data.subcribeUrl); 

        }).catch(err => {
            window.toast(err.message);
            this.setState({
                saveStatus: '',
            })
        }).then(() => {
            window.loading(false);
        })
    }

    roleConfig = [
        {
            name: '学生',
            id: 'student',
        },
        {
            name: '老师',
            id: 'teacher',
        },
    ]

    onClickSelectOrder = () => {
        this.setState({isShowWinSelectOrder: true});
        typeof _qla !== 'undefined' && _qla.click({region: 'select-order'});

        if (!this.state.orderList.data) this.getOrderList();
    }

    onClickSelectCate = () => {
        typeof _qla !== 'undefined' && _qla.click({region: 'select-cate'});
    }

    getOrderList = async isContinue => {
        const orderList = this.state.orderList;
        if (/pending|end/.test(orderList.status)) return;
        
        const page = {...orderList.page};
        page.page = isContinue && page.page ? page.page + 1 : 1;

        this.setState({
            orderList: {
                ...orderList,
                status: 'pending'
            }
        })
        
        return request.post({
            url: '/api/wechat/transfer/h5/live/purchaseRecord',
            body: {
                page
            }
        }).then(res => {
            const list = res.data.list || [];
            this.setState({
                orderList: {
                    ...this.state.orderList,
                    status: list.length < page.size ? 'end' : 'success',
                    data: isContinue ? (this.state.orderList.data || []).concat(list) : list,
                    page,
                }
            }, () => {
                exposure.collect();
            })

        }).catch(err => {
            window.toast(err.message);
            this.setState({
                orderList: {
                    ...this.state.orderList,
                    status: '',
                }
            })
        })
    }

    getCateList = () => {
        const role = this.getCurRole();
        if (!role) return;

        const stateKey = `cateList_${role}`;
        const dataObj = this.state[stateKey] || {
            status: '',
            data: undefined,
        }
        
        if (/pending|end/.test(dataObj.status)) return;
        this.setState({
            [stateKey]: {
                ...dataObj,
                status: 'pending',
            }
        })
        return request.post({
            url: '/api/wechat/transfer/h5/faq/categoryList',
            localCache: 3600,
            body: {
                role,
            }
        }).then(res => {
            this.setState({
                [stateKey]: {
                    ...this.state[stateKey],
                    status: 'end',
                    data: res.data.dataList || [],
                }
            })
        }).catch(err => {
            window.toast(err.message);

            this.setState({
                [stateKey]: {
                    ...this.state[stateKey],
                    status: '',
                }
            })
        })
    }

    getFeedbackDetails = () => {
        request.post({
            url: '/api/wechat/transfer/h5/feedback/info',
            body: {
                feedbackId: this.state.feedbackId,
            }
        }).then(res => {
            const data = res.data && res.data.feedbackPo || {};

            let roleIndex;
            this.roleConfig.some((item, index) => {
                if (item.id === data.role) {
                    roleIndex = index;
                    return true;
                }
            })

            this.setState({
                content: data.content,
                images: data.images || [],
                feedbackRelayDtos: data.feedbackRelayDtos || [],
                createTime: data.createTime,
                status: data.status,
                roleIndex,
                businessName: data.businessName,
            }, async () => {
                if (data.category) {
                    await this.getCateList();
                    let cateIndex;
                    const cateList = this.getCurCateList();
                    cateList && cateList.some((item, index) => {
                        if (item.category === data.category) {
                            cateIndex = index;
                            return true;
                        }
                    })
                    this.setState({
                        cateIndex
                    })
                }
            })
        }).catch(err => {
            window.toast('获取详情失败');
        })
    }

    onClickSolveFeedback = () => {
        window.loading(true);
        
        request.post({
            url: '/api/wechat/transfer/h5/feedback/success',
            body: {
                feedbackId: this.state.feedbackId,
            }
        }).then(res => {
            this.setState({
                status: 'success'
            })
        }).catch(err => {
            window.toast(err.message);
        }).then(() => {
            window.loading(false);
        })
    }

    onChangeRole = index => {
        if (index === this.state.roleIndex) return;

        typeof _qla !== 'undefined' && _qla.click({region: 'btn-role-' + this.roleConfig[index].id});

        this.setState({
            roleIndex: index,
            cateIndex: undefined,
        }, () => {
            this.getCateList();
        })
    }

    onChangeOrderIndex = index => {
        this.setState({orderIndex: index}) 
    }

    onClickSupplement = () => {
        this.setState({
            supplement: true
        }, () => {
            setTimeout(() => {
                const doms = document.querySelectorAll('.fb-item-img-text');
                if (doms && doms.length) {
                    doms[doms.length - 1].scrollIntoView();
                }
            }, 100)
        })
    }
}




export default connect(state => state)(PageContainer);
