import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import LiveVDialog from 'components/dialogs-colorful/live-v';
import PyramidDialog from 'components/dialogs-colorful/pyramid';
import TeacherCupDialog from 'components/dialogs-colorful/teacher-cup';
import NewRealNameDialog from 'components/dialogs-colorful/new-real-name';
import CompanyDialog from 'components/dialogs-colorful/company'

import Spokesperson from 'components/dialogs-colorful/spokesperson';
import HotHeart from 'components/dialogs-colorful/hot-heart';

import fetch from 'isomorphic-fetch';

/**
 * 直播间徽章列表
 * ！！所有逻辑取自历史代码
 * @author lijiajun 20180601
 * 
 * 所有徽章：
 * (虚拟)
 * notidentity  直播间未实名认证
 * (真实)
 * identity     直播间实名认证
 * livev        直播间加V
 * livet        教师节认证
 * dai          代言人
 * hot          热心拥趸
 * doctor
 * pyramid
 * 
 * 直播间身份是否认证：
 * h5/live/identityStatus
 * unwrite=未填写， auditing已填写审核中，audited=已审核，auditBack=审核驳回
 */


export default class SymbolList extends Component {
    static propTypes = {
        liveId: PropTypes.any,
        power: PropTypes.object,
        symbolList: PropTypes.array,
    }

    static defaultProps = {
        symbolList: [],
        power: {},
    }

    state = {
        isShowWin_identity: false,
        isShowWin_livev: false,
        isShowWin_pyramid: false,
        isShowWin_livet: false,
        isShowWin_doctor: false,
        isShowWin_dai: false,
        isShowWin_hot: false,
        isShowWin_company: false,
        identityStatus: '',
        isRealName: false,
        oldReal: 'unwrite',
        checkUserStatus: 'no'
    }
    render() {
        let { symbolList, power } = this.props,
            symbolMap = {};

        // symbolList = [
        //     {
        //         key: 'identity'
        //     },
        //     {
        //         key: 'livev'
        //     },
        //     {
        //         key: 'livet'
        //     },
        //     {
        //         key: 'hot'
        //     },
        //     {
        //         key: 'dai'
        //     },
        //     {
        //         key: 'pyramid'
        //     },
        //     {
        //         key: 'doctor'
        //     },
        // ]

        symbolList.forEach(item => symbolMap[item.key] = item);

        return (
            <div className="co-live-info-symbol-list">
                {
                    // symbolMap['identity'] ?
                    //     <SymbolItem onClick={this.onClickItem} type='identity' /> :
                    //     power.allowMGLive && <SymbolItem onClick={this.onClickItem} type='notidentity' />
                }
                {
                    this.props.isCompany && <SymbolItem onClick={this.onClickItem} type='company' />
                }
                {
                    symbolMap['livev'] && <SymbolItem onClick={this.onClickItem} type='livev' />
                }
                {
                    // 有代言人不显示热心群众
                    symbolMap['dai'] ?
                        <SymbolItem onClick={this.onClickItem} type='dai' /> :
                        symbolMap['hot'] && <SymbolItem onClick={this.onClickItem} type='hot' />
                }
                {
                    // 有金字塔不显示教师节
                    symbolMap['pyramid'] ?
                        <SymbolItem onClick={this.onClickItem} type='pyramid' /> :
                        symbolMap['livet'] && <SymbolItem onClick={this.onClickItem} type='livet' />

                }
                {
                    symbolMap['doctor'] && <SymbolItem onClick={this.onClickItem} type='doctor' />
                }
                

                {
                    this.state.isShowWin_identity && createPortal(
                        // <NewRealNameDialog
                        //     show={true}
                        //     onClose={this.closeWin_identity}
                        //     realNameStatus={this.state.identityStatus}
                        //     liveId={this.props.liveId}
                        // />
                        <NewRealNameDialog
                            show = {true}
                            onClose = {this.closeWin_identity}
                            realNameStatus = {this.state.oldReal || 'unwrite'}
                            checkUserStatus = { this.state.checkUserStatus }
                            isClose={ !this.state.isRealName }
                            liveId = {this.props.liveId}/>
                        ,
                        document.getElementById('app')
                    )
                }

                {
                    this.state.isShowWin_livev && createPortal(
                        <LiveVDialog
                            show={true}
                            onClose={this.closeWin_livev}
                        />,
                        document.getElementById('app')
                    )
                }

                {
                    this.state.isShowWin_pyramid && createPortal(
                        <PyramidDialog
                            show={true}
                            onClose={this.closeWin_pyramid}
                        />,
                        document.getElementById('app')
                    )
                }

                {
                    this.state.isShowWin_livet && createPortal(
                        <TeacherCupDialog
                            show={true}
                            onClose={this.closeWin_livet}
                        />,
                        document.getElementById('app')
                    )
                }

                {
                    this.state.isShowWin_doctor && createPortal(
                        <TeacherCupDialog
                            show={true}
                            onClose={this.closeWin_doctor}
                        />,
                        document.getElementById('app')
                    )
                }

                {
                    this.state.isShowWin_dai && createPortal(
                        <Spokesperson
                            show={true}
                            onClose={this.closeWin_dai}
                        />,
                        document.getElementById('app')
                    )
                }

                {
                    this.state.isShowWin_hot && createPortal(
                        <HotHeart
                            show={true}
                            onClose={this.closeWin_hot}
                        />,
                        document.getElementById('app')
                    )
                }
                { 

                    this.state.isShowWin_company && createPortal(
                        <CompanyDialog 
                            show = { true }
                            enterprisePo={this.props.enterprisePo}
                            onClose = {this.closeCompany}
                        />,
                        document.getElementById('app')
                    )
                }
            </div>
        )
    }

    onClickItem = type => {
        if (type === 'notidentity') {
            this.onClickItem_notidentity();
        } else if (type) {
            this.setState({ [`isShowWin_${type}`]: true });
        }
    }

    onClickItem_notidentity = async () => {
        if (this.state.identityStatus) return this.setState({ isShowWin_identity: true });

        if (this._isGettingIdentityStatus === true) return;
        this._isGettingIdentityStatus = true;

        const getReal = fetch(`/api/wechat/live/getRealStatus?liveId=${this.props.liveId}&type=topic`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
            credentials: 'include'
        }).then((res) => res.json()).then((res) => (res.data || {}))
        const checkReal = fetch(`/api/wechat/live/checkUser?liveId=${this.props.liveId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
            credentials: 'include'
        }).then((res) => res.json()).then((res) => (res.data || {}));
        const res = await Promise.all([getReal,checkReal])
        if(!!res.length){
            const newReal = res[1].status || 'no';
            const oldReal = res[0].status || 'unwrite';
            this.setState({
                checkUserStatus: newReal,
                oldReal: oldReal,
                isShowWin_identity: true,
                isRealName: Object.is(newReal, 'pass') || (Object.is(newReal,'no') && Object.is(oldReal, 'audited')),//unwrite=未填写， auditing=已填写审核中，audited=已审核，auditBack=审核驳回
            });
        } 
        this._isGettingIdentityStatus = false;
    }

    closeWin_identity = () => {
        this.setState({ isShowWin_identity: false });
    }

    closeWin_livev = () => {
        this.setState({ isShowWin_livev: false });
    }
    closeCompany = () => {
        this.setState({
            isShowWin_company: false 
        })
    }

    closeWin_pyramid = () => {
        this.setState({ isShowWin_pyramid: false });
    }

    closeWin_livet = () => {
        this.setState({ isShowWin_livet: false });
    }

    closeWin_doctor = () => {
        this.setState({ isShowWin_doctor: false });
    }

    closeWin_dai = () => {
        this.setState({ isShowWin_dai: false });
    }

    closeWin_hot = () => {
        this.setState({ isShowWin_hot: false });
    }
}


class SymbolItem extends Component {
    render() {
        return (
            <i className={`symbol-item s-${this.props.type}`} onClick={this.onClick}></i>
        )
    }

    onClick = e => {
        e.preventDefault();
        e.stopPropagation();
        this.props.onClick && this.props.onClick(this.props.type);
    }
}
