import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import { Confirm } from 'components/dialog';
import Switch from 'components/switch';

import validator from 'components/validator';

import { changeTopicType } from 'actions/live';

@autobind
class DialogTopicTypeChange extends PureComponent {

    constructor(props) {
        super(props);
    }

    state = {
        switchStatus: false,
        inputMoney: '',
    }

    show() {
        this.refs.dialog.show();
    }

    hide() {
        this.refs.dialog.hide();
    }

    async onBtnClick(tag) {
        if (tag === 'confirm') {
            if (isNaN(Number(this.state.inputMoney))) {
                window.toast('请输入正确的金额');
                return;
            }

            if (Number(this.state.inputMoney) < 1) {
                window.toast('金额设置不能小于￥1');
                return;
            }

            const { topicId } = this.props;

            const result = await changeTopicType(topicId, this.state.switchStatus ? 'Y' : 'N', this.state.inputMoney * 100);

            window.toast(result.state.msg);

            if (result.state.code == 0) {
                this.hide();
                this.props.onChangeComplete(result.data.liveTopic);
            }
        }
    }

    onChangeSwitch() {
        this.setState({
            switchStatus: !this.state.switchStatus
        });
    }

    onChangeMoney(e) {
        const val = e.target.value;
        this.setState({
            inputMoney: val
        });
    }

    render() {
        return (
            <Confirm
                ref='dialog'
                title='切换直播类型'
                buttons={ 'cancel-confirm' }
                className='dialog-change-topic-type'
                onBtnClick={ this.onBtnClick }
            >
                <div className='dialog-change-topic-type-wrap'>
                    <section className='icon-group-wrap'>
                        <div className='icon-left'>
                            <img src={ require('../img/icon-change-topic-left.png') } />
                            <span>公开/加密直播</span>
                        </div>
                        <img src={ require('../img/icon-change-topic-line.png') } />
                        <div className='icon-right'>
                            <img src={ require('../img/icon-change-topic-right.png') } />
                            <span>收费直播</span>
                        </div>
                    </section>

                    <section className='input-wrap'>
                        <label htmlFor="money-input" >金额（元）</label>
                        <input 
                            id="money-input" 
                            type="text" 
                            placeholder="请填写金额（后续可以修改）"
                            ref={ input => this.moneyInput = input }
                            onChange={ this.onChangeMoney }
                            value={ this.state.inputMoney } />
                    </section>

                    <section className='save-old-user-warp'>
                        <header>是否保留报名用户</header>
                        <small>即是否允许以前报名的老用户免费进入</small>
                        <Switch
                            active={ this.state.switchStatus }
                            className='save-old-user-switch'
                            size='sm'
                            onChange={ this.onChangeSwitch }
                        />
                    </section>

                    <section className='attention-wrap'>
                        <header>注意</header>
                        <ul>
                            <li>切换直播类型为不可逆操作，请谨慎操作</li>
                        </ul>
                    </section>
                </div>
            </Confirm>
        );
    }
}

DialogTopicTypeChange.propTypes = {
};

export default DialogTopicTypeChange;