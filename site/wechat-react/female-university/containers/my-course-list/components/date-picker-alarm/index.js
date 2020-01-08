import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { BottomDialog } from 'components/dialog';
import PickerView from 'components/picker-view'
import Switch from 'components/switch'
import {autobind} from 'core-decorators';
import { setLearnRemind } from "../../../../actions/home";
import { formatDate } from "components/util";

@autobind
class DatePickerAlarm extends Component {

    state = {
        portalDom:null,
        timeArr: [],
        timeVal: ['am','08','30'],
        isAlarm: this.props.alertStatus === 'Y',
        isShow: this.props.isShow,
    }
    componentDidUpdate(preProps){
        if(this.props.isShow != preProps.isShow){
            this.setState({
                isShow: this.props.isShow,
                timeVal: this.timeVal,
                isAlarm: this.props.alertStatus === 'Y',
            });
        }

    }

    get timeVal (){
        let alertTimeStr = this.props.alertTimeStr;
        if(alertTimeStr){
            const timeArray = alertTimeStr.split(':');
            if(Number(timeArray[0]) >= 12){
                timeArray.unshift('pm');
                timeArray[1] = Number(timeArray[1])-12<10 ? '0'+(Number(timeArray[1])-12).toString() : (Number(timeArray[1])-12).toString();
            }else{
                timeArray.unshift('am');
                timeArray[1] =  timeArray[1];
            }
            return timeArray;
        }else{
            // let nowTime= new Date(); //alertTimeStr 未设置学习提醒的时候，默认当前时间。
            // nowTime = formatDate(nowTime, 'hh:mm');
            // let timeArray = nowTime.split(':');
            // if(Number(timeArray[0]) >= 12){
            //     timeArray.unshift('pm');
            //     if(timeArray[1] - 12 <=9){
            //         timeArray[1] = '0' + (Number(timeArray[1]) - 12).toString();
            //     }else{
            //         timeArray[1] = (timeArray[1] - 12).toString();
            //     }
            // }else{
            //     timeArray.unshift('am');
            // }
            return this.state.timeVal;
        }
    }

    componentWillMount() {
        let halfDay = [{ label: '上午', value: 'am' }, { label: '下午', value: 'pm' }];
        let timeArr = [halfDay, this.Hours, this.Mins];
        this.setState({
            timeArr,
        })
    }
    

    get Hours() {
        let hours = [];
        for (let i = 0; i < 12; i++){
            let val = i;
            if (val < 10) {
                val = "0" + val;
            }
            val = String(val);
            hours.push({ label: val, value: val })
        }
        return hours;
    }
    get Mins() {
        let mins = [];
        for (let i = 0; i < 60; i=i+15){
            let val = i;
            if (val < 10) {
                val = "0" + val;
            }
            val = String(val);
            mins.push({ label: val, value: val })
        }
        return mins;
    }
    
    componentDidMount() {
        this.setState({
            portalDom: document.querySelector('.portal-middle'),
        })
    }

    handlePickerViewChange(newValue) {
        this.setState({
            timeVal: newValue,
        });
    }

    hideDialog(){
        this.props.onClose && this.props.onClose();
    }

    async saveSetRemind(){
        let alertTime = [];
        if(this.state.timeVal[0] ==='pm'){
            alertTime.push(Number(this.state.timeVal[1])+12);
        }else{
            alertTime.push(this.state.timeVal[1]);
        }
        alertTime.push(this.state.timeVal[2]);
        const alarmObj = {
            alertStatus: this.state.isAlarm ?'Y':'N',
            alertTime: alertTime.join(':'),
        };
        let result = await setLearnRemind(alarmObj);
        this.props.changeAlarmInfo && this.props.changeAlarmInfo(alarmObj);
        window.toast('设置成功');
        this.hideDialog();
    }
    onChangeSwitch(){
        this.setState({
            isAlarm: !this.state.isAlarm,
        });
    }

    render() {
        if (!this.state.portalDom) {
            return null
        }
        return (
            createPortal(       
                <BottomDialog
                    show={this.state.isShow}
                    theme='empty'
                    bghide
                    titleTheme={'white'}
                    buttons={null}
                    close={true}
                    title="关注公众号"
                    className='my-cousrse-page-date-dialog'
                    onClose={this.hideDialog}>
                    <div className='header'>
                        <span className="title">设置学习提醒</span>
                        <Switch
                            className = "control-switch"
                            size = 'md'
                            active={ this.state.isAlarm }
                            onChange={this.onChangeSwitch}
                        />
                        <span className="btn-close icon_cross" onClick={this.hideDialog}></span>
                    </div>
                    <PickerView
                        col={3}
                        data={this.state.timeArr}
                        value={this.state.timeVal}
                        cascade={false}
                        controlled
                        onChange={this.handlePickerViewChange}
                    />
                    <div className="bottom">
                        <div className="btn-save" onClick={this.saveSetRemind}>保存设置</div>
                    </div>
                </BottomDialog>
                ,this.state.portalDom
            )
        );
    }
}

DatePickerAlarm.propTypes = {

};

export default DatePickerAlarm;