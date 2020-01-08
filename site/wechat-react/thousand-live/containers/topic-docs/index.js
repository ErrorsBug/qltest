import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Page from 'components/page';
import { getUrlParams } from 'components/url-utils';
import ScrollView from 'components/scroll-view';
import { Confirm, BottomDialog } from 'components/dialog';
import * as actionsTopicDocs from '../../actions/topic-docs';
import { doPay } from 'common_actions/common';
import { getCookie, formatMoney, formatDate } from 'components/util';
import { docStat } from 'thousand_live_actions/thousand-live-common';

/**
 * 1.话题共享文档页vue->react迁移
 * 2.查看按钮改下载按钮，删除下载状态的修改
 * 
 * 旧地址https://m.qlchat.com/topic/common.html?#/document/2000001020531360
 */

class TopicDocs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topicId: getUrlParams('topicId'),

            userData: {
                id: '',
                role: '',
            },
            
            docList: {
                page: {
                    page: 1,
                    size: 10
                },
                status: '',
                data: null,
                message: '',
            },

            currentDoc: null, // 当前操作文档
            inputAmount: '',
            canDownload: true,

            isShowSettingWindow: false,
        }
    }

    componentDidMount() {
        this.getDocList();
        
        wx.ready(() => {
            wx.hideOptionMenu();
        });
    }


    render() {
        let { userData, docList } = this.state;

        return (
            <Page title="共享文件" className="topic-docs-page">
                {
                    docList.data && docList.data.length === 0 ?
                    <p className="loading-tip" v-show="isEmpty">没有文档数据</p> :
                    <ScrollView onScrollBottom={this.getDocList}>
                        <ul className="document-list">
                        {
                            docList.data && docList.data.map((item, index) => {
                                return <FileItem 
                                        key={item.fileId} 
                                        item={item}
                                        userData={userData}
                                        openTipWindow={this.openTipWindow}
                                        startDownload={this.startDownload}
                                        openSettingsWindow={this.openSettingsWindow}
                                        doPay={this.doPay} />
                            })
                        }
                        </ul>

                        <div className="load-more-status" onClick={this.getDocList}>
                            <span>
                                {
                                    docList.status === 'pending' ? '加载中' :
                                    docList.status === 'end' ? '到底啦' : '加载更多'
                                }
                            </span>
                        </div>
                    </ScrollView>
                }
                
                {/* 温馨提示 */}
                <Confirm
                    ref={r => this.tipWindow = r}
                    className="tip-window"
                    buttons="confirm"
                    onBtnClick={this.closeTipWindow}
                    onClose={this.closeTipWindow}>
                    <div className="content">查看前需要加载一会儿文件，请耐心等待</div>
                </Confirm>

                {/* 设置 */}
                <BottomDialog
                    className="setting-window"
                    show={ this.state.isShowSettingWindow }
                    theme={ 'list' }
                    items={
                        [
                            {
                                key: 'edit-price',
                                content: '<span><i class="icon_edit"></i>修改价格</span>',
                                show: true,
                            },
                            {
                                key: 'delete',
                                content: '<span><i class="icon_trash"></i>删除文件<span class="color-danger">（不可恢复）</span></span>',
                                show: true,
                            }
                        ]
                    }
                    title={this.state.currentDoc && this.state.currentDoc.name}
                    titleLabel={'文件名'}
                    close={ true }
                    onClose={ this.closeSettingsWindow }
                    onItemClick={ this.onClickSettingWindowItem }
                />

                {/* 删除 */}
                <Confirm
                    ref={r => this.delWindow = r}
                    className="tip-window"
                    onBtnClick={this.confirmDelWindow}>
                    <div className="content">确认要删除文件吗</div>
                </Confirm>

                {/* 修改价格 */}
                <Confirm
                    ref={r => this.priceWindow = r}
                    className="edit-price"
                    title="修改价格"
                    close={true}
                >
                    <div className="content">
                        <div className="input-wrap">
                            <input type="number" value={this.state.inputAmount} placeholder="请输入下载的收费金额" onChange={this.onChangeInputAmount}/>
                            <span>（元）</span>
                        </div>

                        {/* <div className="input-wrap">
                            <span>支持文件下载</span>
                            
                            <span className={'switch btn-can-download' + (this.state.canDownload ? ' active' : '')}
                                onClick={this.switchCanDownload}>
                                <i></i>
                            </span>
                        </div> */}
                    </div>
                    <footer slot="footer" className="footer">
                        <span className="btn-confirm" onClick={this.comfirmModify}>确定</span>
                    </footer>
                </Confirm>
            </Page>
        );
    }

    startDownload = item => {
        this.props.docStat(item.id).then((res) => {
            if (res.state.code == 0) {
                let list = this.state.docList.data.map(i => {
                    if (i.id == item.id) {
                        i.downloadCount += 1;
                    }
                    return i;
                })
                let docList = {...this.state.docList, data:list };
                this.setState({
                    docList: docList
                })
            }
        })
        this.props.getDocAuthor({
            amount: item.amount,
            docId: item.id
        }).then(res => {
            if (res.state.code) throw Error(res.state.msg);
            window.location.href = item.convertedUrl + `?auth_key=${res.data.authKey}`

        }).catch(err => {
            window.toast(err.message);
        })
    }

    openTipWindow = item => {
        this.setState({
            currentDoc: item
        })
        this.tipWindow.show();
    }

    closeTipWindow = () => {
        this.tipWindow.hide();

        let item = this.state.currentDoc;
        this.props.getDocAuthor({
            amount: item.amount,
            docId: item.id
        }).then(res => {
            if (res.state.code) throw Error(res.state.msg);
            window.location.href = `/static/common/pdf-viewer/viewer.html?url=${item.convertedUrl}&authKey=${res.data.authKey}`

        }).catch(err => {
            window.toast(err.message);
        })
    }

    openSettingsWindow = item => {
        this.setState({
            currentDoc: item,
            isShowSettingWindow: true
        })
    }

    closeSettingsWindow = () => {
        this.setState({
            isShowSettingWindow: false
        })
    }

    onClickSettingWindowItem = type => {
        if (type === 'delete') {
            this.openDelWindow();
        } else if (type === 'edit-price') {
            this.openPriceWindow();
        }
    }

    openDelWindow = () => {
        this.delWindow.show();
    }

    openPriceWindow = () => {
        this.priceWindow.show();
        this.setState({
            inputAmount: formatMoney(this.state.currentDoc.amount),
            canDownload: this.state.currentDoc.download === 'Y'
        })
    }

    onChangeInputAmount = e => {
        let v = e.target.value;

        // 只能输如数字和.
        v = v.replace(/[^0-9\.]/g, '');

        // 最多只能输入两位小数
        let match = v.match(/(\d*\.?\d{0,2})/);
        if (match) {
            v = match[1];
        }

        this.setState({
            inputAmount: v
        })
    }

    switchCanDownload = () => {
        this.setState({
            canDownload: !this.state.canDownload
        })
    }

    comfirmModify = () => {
        const val = this.state.inputAmount
        if (val === '') {
            window.toast('输入的金额不能为空')
            return
        } else if (val > 5000 || val < 0) {
            window.toast('输入的金额应该在0~5000之间')
            return
        }

        if (val <= 5000 && val >= 0) {
            this.props.modifyDocPrice({
                amount: Math.round(val * 100),
                downloadStatus: this.state.canDownload ? 'Y' : 'N',
                docId: this.state.currentDoc.id
            }).then(res => {
                if (res.state.code) throw Error(res.state.msg);
                window.toast('修改成功');
                this.priceWindow.hide();
                
                let _doc = res.data.topicDocPo,
                    docListData = this.state.docList.data;

                docListData = docListData.map(item => {
                    if (item.id == _doc.id) {
                        return Object.assign(item, _doc)
                    }
                    return item
                })

                this.setState({
                    docList: {
                        ...this.state.docList,
                        data: docListData
                    },
                    isShowSettingWindow: false,
                })
            }).catch(err => {
                window.toast(err.message)
            })
        } else {
            window.toast('请输入正确的金额')
            return
        }
    }

    doPay = item => {
        let { topicId, userData } = this.state;
        this.props.doPay({
            docId: item.id,
            type: 'DOC',
            byUserId: userData.id,
            topicId,
            total_fee: item.amount,
            callback: res => {
                window.location.reload();
            }
        })
    }

    // 获取文件列表
    getDocList = () => {
        if (/pending|end/.test(this.state.docList.status)) return;

        let { topicId, docList } = this.state,
            page = {...docList.page};

        this.setState({
            docList: {
                ...docList,
                status: 'pending'
            }
        })
 
        this.props.getDocList(topicId, page)
            .then(res => {
                if (res.state.code) throw Error(res.state.msg);

                let status = 'success';
                if (res.data.topicDocs.length < page.size) {
                    status = 'end';
                } else {
                    page.page ++;
                }

                // 如果已付款，则将item里面的download设置为Y否则为N
                try {
                    res.data.topicDocs.forEach(item => {
                        let curItem = null

                        let flag = (res.data.myDocList || []).some(docItem => {
                            if (docItem.docId === item.id) {
                                curItem = docItem
                                return true
                            }

                            return false
                        })

                        if(flag == true) {
                            item.status = 'Y'
                            item.amount = curItem.amount
                        } else {
                            item.status = 'N'
                        }
                    })
                } catch (error) {
                    console.log(error);
                }

                this.setState({
                    userData: {
                        id: getCookie('userId'),
                        role: res.data.role
                    },
                    docList: {
                        ...this.state.docList,
                        data: (this.state.docList.data || []).concat(res.data.topicDocs),
                        status,
                        page
                    }
                })
            })
            .catch(err => {
                window.toast(err.message);
                this.setState({
                    docList: {
                        ...this.state.docList,
                        status: 'error',
                        message: err.message
                    }
                })
            })
    }

    confirmDelWindow = type => {
        if (type !== 'confirm') return;
        let id = this.state.currentDoc.id;

        this.props.deleteDocument(id)
            .then(res => {
                if (res.state.code) throw Error(res.state.msg);
                window.toast('删除成功');
                window.location.reload();
            })
            .catch(err => {
                window.toast(err.message);
            })
            .then(() => {
                this.delWindow.hide();
            })
    }
}



class FileItem extends Component {
    render() {
        let { item } = this.props;
        return (
            <li className="file-item">
                <header className="item-header">
                    <img className="doc-type" src={item.icon} alt="" />
                    <div className="doc-category">
                        <span className="doc-name">{item.name}</span>
                        <aside className="divide"></aside>
                        <span className="doc-ft">
                            <span className="doc-size">{toSize(item.size)}</span>
                            <span className="download-num"><i className="icon_eye_2"></i>{item.downloadCount}人下载</span>
                        </span>
                    </div>
                </header>

                <section className="item-content">
                    <span className="create-name">{item.createName}</span>
                    <span className="create-time">上传时间 {formatDate(item.createTime, 'yyyy-MM-dd hh:mm:ss')}</span>
                </section>

                {this.renderFooter()}
            </li>
        )
    }

    renderFooter() {
        let { userData, item } = this.props;

        // C端看到的footer
        if (userData.role === 'visitor') {
            if (item.status === 'Y' && item.amount !== 0) {
                return <footer className="item-footer">
                    <section className="footer-already-pay">
                        <span className="pay-money">已支付 ￥{formatMoney(item.amount)}</span>
                        {/* {item.download === 'Y' ? <span className="download_btn" onClick={this.startDownload}><i className="icon_download2"></i>下载</span> : false} */}
                        <span className="btn btn-watch" onClick={this.startDownload}>下载</span>
                    </section>
                </footer>
            } else if (item.amount === 0) {
                return <footer className="item-footer">
                    <section className="footer-free">
                        <span className="pay-free">免费</span>
                        {/* {item.download === 'Y' ? <span className="download_btn" onClick={this.startDownload}><i className="icon_download2"></i>下载</span> : false} */}
                        <span className="btn btn-watch" onClick={this.startDownload}>下载</span>
                    </section>
                </footer>
            } else if (item.status === 'N' && item.amount !== 0) {
                return <footer className="item-footer">
                    <section className="footer-no-pay">
                        <span className="need-text">支付<span className="need-money">￥{formatMoney(item.amount)}</span></span>
                        <span className="need-tip">即可下载</span>
                        <span className="btn btn-pay" onClick={this.doPay}>购买</span>
                    </section>
                </footer>
            }
        }

        // B端看到的footer
        if (userData.role === 'creater' || userData.role === 'manager') {
            if (item.amount === 0) {
                return <footer className="item-footer">
                    <section className="footer-free">
                        <span className="pay-free">免费</span>
                        <span className="download_btn" onClick={this.startDownload}><i className="icon_download2"></i>下载</span>
                        <span className="btn btn-setting" onClick={this.openSettingsWindow}>设置</span>
                    </section>
                </footer>        
            } else {
                return <footer className="item-footer">
                    <section className="footer-chart">
                        <span className="need-money">￥{formatMoney(item.amount)}</span>
                        <span className="download_btn" onClick={this.startDownload}><i className="icon_download2"></i>下载</span>
                        <span className="btn btn-setting" onClick={this.openSettingsWindow}>设置</span>
                    </section>
                </footer>
            }
        }

        // 嘉宾
        if (userData.role === 'guest') {
            // 嘉宾创建的
            if (userData.id === item.createBy) {
                if (item.amount === 0) {
                    return <footer className="item-footer">
                        <section className="footer-free">
                            <span className="pay-free">免费</span>
                            <span className="download_btn" onClick={this.startDownload}><i className="icon_download2"></i>下载</span>
                            <span className="btn btn-setting" onClick={this.openSettingsWindow}>设置</span>
                        </section>
                    </footer>
                } else {
                    return <footer className="item-footer">
                        <section className="footer-chart">
                            <span className="need-money">￥{formatMoney(item.amount)}</span>
                            <span className="download_btn" onClick={this.startDownload}><i className="icon_download2"></i>下载</span>
                            <span className="btn btn-setting" onClick={this.openSettingsWindow}>设置</span>
                        </section>
                    </footer>
                }
                
            // 不是嘉宾创建的
            } else {
                if (item.status === 'N' && item.amount !== 0) {
                    return <footer className="item-footer">
                        <section className="footer-no-pay">
                            <span className="need-text">支付<span className="need-money">￥{formatMoney(item.amount)}</span></span>
                            <span className="need-tip">即可下载</span>
                            <span className="btn btn-pay" onClick={this.doPay}>购买</span>
                        </section>
                    </footer>
                } else if (item.amount === 0) {
                    return <footer className="item-footer">
                        <section className="footer-free">
                            <span className="pay-free">免费</span>
                            {/* {item.download === 'Y' ? <span className="download_btn" onClick={this.startDownload}><i className="icon_download2"></i>下载</span> : false} */}
                            <span className="btn btn-watch" onClick={this.startDownload}>下载</span>
                        </section>
                    </footer>
                } else if (item.status === 'Y' && item.amount !== 0) {
                    return <footer className="item-footer">
                        <section className="footer-already-pay">
                            <span className="pay-money">已支付 ￥{formatMoney(item.amount)}</span>
                            {/* {item.download === 'Y' ? <span className="download_btn" onClick={this.startDownload}><i className="icon_download2"></i>下载</span> : false} */}
                            <span className="btn btn-watch" onClick={this.startDownload}>下载</span>
                        </section>
                    </footer>
                }
            }
        }

        return false;
    }

    openTipWindow = () => {
        this.props.openTipWindow(this.props.item);
    }

    startDownload = () => {
        this.props.startDownload(this.props.item);
    }

    openSettingsWindow = () => {
        this.props.openSettingsWindow(this.props.item);
    }

    doPay = () => {
        this.props.doPay(this.props.item);
    }
}



function toSize(val) {
    if (val < 1024) {
        return String(val) + 'b';
    }
    if (val < 1048576) {
        return (val / 1024).toFixed(1) + 'k';
    }
    return (val / 1048576).toFixed(1) + 'm';
}




function mapStateToProps(state) {
    return {
        
    }
}

const mapActionToProps = {
    docStat,
    doPay,
    ...actionsTopicDocs
}

module.exports = connect(mapStateToProps, mapActionToProps)(TopicDocs);