import * as React from 'react';
import { render } from 'react-dom';
import { autobind } from 'core-decorators';

// components
import _ReactMobilePicker from 'react-mobile-picker';
import Page from '../../components/page';
import Confirm from '../../components/dialog/confirm';

import { validLegal } from '../../utils/util';
import api from '../../utils/api';
import * as ui from '../../utils/ui'

import * as _province from "./assets/province.json";
import * as _city from './assets/city.json';
import * as _area from "./assets/area.json";

import './style.scss'

const ReactMobilePicker = _ReactMobilePicker as any
const province = _province as any
const city = _city as any
const area = _area as any

import { IInitData } from "../fission-incr-fans/interfaces";

interface IArea {
    city: string,
    name: string,
    id: string,
}

interface ICity {
    province: string,
    name: string,
    id: string,
}

interface IProvince {
    name: string,
    id: string,
}

interface IState {
    /** 当前选中的地区 */
    valueGroups: {
        [x: string]: any
        province: string
        city: string
        area: string
    }

    /** 级联地区选择列表 */
    optionGroups: {
        [x: string]: any
        province: Array<IProvince>
        city: Array<ICity>
        area: Array<IArea>
    }

    /** 是否显示地区选择弹框 */
    showBottomDialog: boolean

    /** 地区选择的接口 */
    selectorResult: string
}


@autobind
class AddressForm extends React.Component<{}, IState> {

    private curProvince: IProvince = province
    private curCity: ICity = city[province[0].id][0]
    private curArea: IArea = area[city[province[0].id][0].id][0]

    private nameInput: HTMLInputElement
    private phoneInput: HTMLInputElement
    private streetInput: HTMLTextAreaElement

    /** 收货信息弹框 */
    private addressInfoConfirm: Confirm;

    state = {
        valueGroups: {
            province: province[0].name,
            city: city[province[0].id][0].name,
            area: area[city[province[0].id][0].id][0].name,
        },
        optionGroups: {
            province: province.map((item: IProvince) => item.name),
            city: city[province[0].id].map((item: ICity) => item.name),
            area: area[city[province[0].id][0].id].map((item: IArea) => item.name),
        },

        showBottomDialog: false,

        selectorResult: '',
    }

    componentDidMount() {

    }
    
    onShowAreaSelector() {
        this.setState({
            showBottomDialog: true,
        });
    }
    
    onHideAreaSelector() {
        this.setState({
            showBottomDialog: false,
        });
    }

    onCommitSelector() {
        const result = `${this.state.valueGroups.province} ${this.state.valueGroups.city} ${this.state.valueGroups.area}`

        this.setState({
            showBottomDialog: false,
            selectorResult: result,
        });
    }

    /**
     * 选中某个item的时候，级联地区选择器的核心处理方法
     */
    onChangeArea(name: string, value: string) {
        let curCity: Array<ICity>
        let curArea: Array<IArea>

        if (name === 'province') {
            this.curProvince = province.find((item: IProvince) => item.name == value)
            this.curCity = city[this.curProvince.id][0]
            this.curArea = area[this.curCity.id][0]
            
            curCity = city[this.curProvince.id].map((item: ICity) => item.name)
            curArea = area[this.curCity.id].map((item: IArea) => item.name)
        } else if (name === 'city') {
            this.curCity = city[this.curProvince.id].find((item: ICity) => item.name == value)
            
            curCity = this.state.optionGroups.city
            curArea = area[this.curCity.id].map((item: IArea) => item.name)
        } else {
            curCity = this.state.optionGroups.city
            curArea = this.state.optionGroups.area
        }

        this.setState((state: IState) => {
            return {
                valueGroups: {
                  ...state.valueGroups,
                  [name]: value
                },
                optionGroups: {
                    ...state.optionGroups,
                    city: curCity,
                    area: curArea,
                }
            }
        });
    }

    async onConfirmSubmit() {
        this.addressInfoConfirm.hide();

        const initData: IInitData = (window as any).INIT_DATA
        const name = this.nameInput.value
        const mobile = this.phoneInput.value
        const address = this.state.selectorResult
        const street = this.streetInput.value;

        ui.loading(true);

        const result = await api('/api/activity/assist/saveInfo', {
            method: 'POST',
            body: {
                activityId: initData.actid,
                name,
                mobile,
                address: address + street,
            }
        });

        ui.loading(false);

        if (result.state.code === 0) {
            ui.toast(result.state.msg);

            setTimeout(() => {
                window.location.href = `/wechat/page/activity/fissionIncrFans?actid=${initData.actid}`;
            }, 1000);
        } else {
            ui.toast(result.state.msg);
        }
    }

    onSubmit() {
        const initData: IInitData = (window as any).INIT_DATA
        const name = this.nameInput.value
        const mobile = this.phoneInput.value
        const address = this.state.selectorResult
        const street = this.streetInput.value

        if (!name) {
            ui.toast('名字不能为空');
            return;
        }

        if (!validLegal('phoneNum', '手机号码', mobile, '', '', '')) {
            ui.toast('手机号码不合法');
            return;
        }

        if (!address) {
            ui.toast('请选择收货地址');
            return;
        }

        if (!street) {
            ui.toast('请求输入街道信息');
            return;
        }

        this.addressInfoConfirm.show();
    }

    render () {
        return (
            <Page title='填写收货地址' className='address-form-page'>
                <aside className='mini-title'>收货信息</aside>

                <ul className='form-content'>
                    <li>
                        <span className='label'>收货人姓名</span>
                        <input className='content' type="text" placeholder="请填写收货人姓名" ref={dom => this.nameInput = dom}/>
                    </li>
                    <li>
                        <span className='label'>手机号码</span>
                        <input className='content' type="tel" placeholder="请填写手机号码" ref={dom => this.phoneInput = dom}/>
                    </li>
                    <li>
                        <span className='label'>所在地区</span>
                        <span className='content' onClick={ this.onShowAreaSelector }>
                            { this.state.selectorResult }

                            <img src={ require('./images/arrow-enter.png') } className='icon-enter'/>
                        </span>
                    </li>
                </ul>

                <textarea className='street-area' placeholder='请填写详细街道地址' ref={dom => this.streetInput = dom}></textarea>

                <span className='submit-btn' onClick={ this.onSubmit }>确认提交</span>

                <section className={`bottom-dialog ${this.state.showBottomDialog ? '' : 'hide'}`}>
                    <aside className='bg' onClick={ this.onHideAreaSelector }></aside>

                    <main>
                        <header className='btn-group'>
                            <span onClick={ this.onHideAreaSelector }>取消</span>
                            <span onClick={ this.onCommitSelector }>确认</span>
                        </header>

                        <ReactMobilePicker
                            valueGroups={this.state.valueGroups}
                            optionGroups={this.state.optionGroups}
                            itemHeight={60}
                            height={400}
                            onChange={this.onChangeArea}
                        />
                    </main>
                </section>

                <Confirm
                    ref={ el => this.addressInfoConfirm = el }
                    buttons='confirm'
                    confirmText='我知道了'
                    title='收货信息已提交'
                    content='奖品预计会在5个工作日安排发出，请耐心等待'
                    onConfirm={ this.onConfirmSubmit }
                />
            </Page>
        )
    }
}

render(<AddressForm />, document.getElementById('app'));