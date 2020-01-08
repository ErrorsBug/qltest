import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import BottomDialog from 'components/dialog/bottom-dialog'
import ConsultItem from './consult-item'
import ScrollToLoad from 'components/scrollToLoad'
import CommonTextarea from 'components/common-textarea'

import { consultList, postConsult, consultPraise } from '../../../../../actions/topic-intro';

import { getVal } from 'components/util';

@autobind
class ConsultDialog extends Component {

    state = {
        show: false,
        focus: false,
        textValue:''
    }

    componentDidMount() {
        this.fetchConsultList();
    }

    async fetchConsultList(next) {
        await this.props.loadConsultList({
            topicId: this.props.topicId,
            page: this.props.consultPage,
        });

        if (next) {
            next();
        }
    }

    /**
     * 显示咨询弹框，
     * focus为true则设置输入框为焦点
     */
    show(focus) {
        this.setState({
            show: true,
            focus: !!focus,
        });
    }

    hide() {
        this.setState({
            show: false
        });
        // 隐藏弹窗后恢复页面滚动
        this.props.changeContainerScrollState();
    }

    onInputClick(e) {
        this.setState({
            focus: true
        });
    }

    onBlur(e) {
        setTimeout(() => {
            if(this.state.textValue ==''){
                this.setState({
                    focus: false,
                });
            }
        },200)
    }
    async onConfirmConsult(e) {

        const msg = this.state.textValue

        try {
            const result = await this.props.postConsult({
                topicId: this.props.topicId,
                content: msg,
            })

            window.toast(getVal(result, 'state.msg'));
            if (getVal(result, 'state.code') === 0) {
                this.setState({
                    focus: false,
                    textValue:''
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    onChange(e){
        this.setState({
            textValue:e.target.value,
        })
    }

    render() {
        if (typeof (document) == 'undefined') {
            return false;
        }
        
        return createPortal(
            <div className={"consult-container " + (this.state.show ? '' : 'hide')}>
                <ReactCSSTransitionGroup
                            transitionName="consult-dialog-background"
                            transitionEnterTimeout={300}
                            transitionLeaveTimeout={300}
                >    
                    {
                        this.state.show?
                            <div className="cc-bg" onClick={this.hide} ></div>
                        :null    
                    }
                </ReactCSSTransitionGroup>  
                <ReactCSSTransitionGroup
                            transitionName="consult-bottom-dialog-content"
                            transitionEnterTimeout={300}
                            transitionLeaveTimeout={300}
                >  
                    {
                        this.state.show?
                        <div className="main-flex">
                        
                            <ScrollToLoad 
                                className='main-list'
                                loadNext={ this.fetchConsultList }
                                noMore={ this.props.consultNoMore }
                            >
                                <aside className='icon-close' onClick={ this.hide }>×</aside>

                                <header className='consult-header'>
                                    精选留言 <span className='consult-count'>{ this.props.consultNum }</span>
                                </header>

                                <main className={ this.state.focus ? 'focused' : '' }>
                                {
                                    this.props.consultList.map((item, index) => (
                                            <ConsultItem
                                                key={`consult-item-${index}`}
                                                { ...item }
                                                consultPraise = {this.props.consultPraise}
                                            />
                                    ))
                                }
                                </main>

                            </ScrollToLoad>
                            <footer className={'consult-footer ' + (this.state.focus ? 'focused' : '')}>
                                {/*
                                    这里需要this.state.show来判断，以保证每次都是重新
                                */}
                                {
                                    (this.state.focus && this.state.show) ?
                                        [
                                            <CommonTextarea
                                                key='consult-textarea'
                                                className='consult-input textarea'
                                                placeholder='请输入你的留言'
                                                autoFocus={true}    
                                                onChange = {this.onChange}
                                                value={this.state.textValue}
                                                onBlur={this.onBlur}
                                            />,        
                                            <span key='confirm-consult' className={`confirm-consult ${this.state.textValue.length > 0 ?'':'no-content'}`} onClick={ this.onConfirmConsult } onMouseDown={(e)=>{ e.preventDefault(); e.stopPropagation(); return false}}>发送</span>
                                        ]
                                    :
                                        <span className='consult-input' onClick={this.onInputClick} >{this.state.textValue||'请输入你的留言'}</span>
                                }
                            </footer>
                        </div>    
                        :null    
                    }
                </ReactCSSTransitionGroup>
            </div>,
            document.getElementById('app')
        );
    }
}

function mapStateToProps (state) {
    return {
        topicId: getVal(state, 'topicIntro.topicId', ''),
        liveId: getVal(state, 'topicIntro.liveId', ''),

        consultNum: getVal(state, 'topicIntro.consultNum', 0),
        consultList: getVal(state, 'topicIntro.consultList', []),
        consultPage: getVal(state, 'topicIntro.consultPage', 1),
        consultNoMore: getVal(state, 'topicIntro.consultNoMore', false)
    }
}

const mapActionToProps = {
    loadConsultList: consultList,
    postConsult,
    consultPraise,
}

export default connect(mapStateToProps, mapActionToProps, null, {
    withRef: true
})(ConsultDialog);
