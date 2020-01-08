/**
 * Created by Aus on 2017/6/2.
 */
import React from 'react'
import classNames from 'classnames'
import PickerView from '../../picker-view'
import Touchable from 'rc-touchable'
import dayjs from 'dayjs'
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import {unstable_renderSubtreeIntoContainer, unmountComponentAtNode} from 'react-dom';


const monthArray = [
    {label: '1月', value: '0'},{label: '2月', value: '1'},{label: '3月', value: '2'},{label: '4月', value: '3'},
    {label: '5月', value: '4'},{label: '6月', value: '5'},{label: '7月', value: '6'},{label: '8月', value: '7'},
    {label: '9月', value: '8'},{label: '10月', value: '9'},{label: '11月', value: '10'},{label: '12月', value: '11'}
];

const hourArray = [
    {label: '0点', value: '0'},{label: '1点', value: '1'},{label: '2点', value: '2'},{label: '3点', value: '3'},
    {label: '4点', value: '4'},{label: '5点', value: '5'},{label: '6点', value: '6'},{label: '7点', value: '7'},
    {label: '8点', value: '8'},{label: '9点', value: '9'},{label: '10点', value: '10'},{label: '11点', value: '11'},
    {label: '12点', value: '12'},{label: '13点', value: '13'},{label: '14点', value: '14'},{label: '15点', value: '15'},
    {label: '16点', value: '16'},{label: '17点', value: '17'},{label: '18点', value: '18'},{label: '19点', value: '19'},
    {label: '20点', value: '20'},{label: '21点', value: '21'},{label: '22点', value: '22'},{label: '23点', value: '23'}
];

// 日期时间选择器
class DatePicker extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            defaultValue: undefined,
            selectedValue: undefined,
            animation: 'out',
            show: false,
            style: '',
        }
    }
    componentDidMount () {
        // picker 当做一个非受控组件
        const {value, style} = this.props;
        this.setState({
            defaultValue: value,
            selectedValue: value,
            style,
        });

        const doc = window.document;
        this.node = doc.createElement('div');
        doc.body.appendChild(this.node);

        document.addEventListener('touchmove', this.fixTouchBug);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.show) {
            this.getPopupDOM();
        }
        // 外部改变时间组件内部自动同步时间
        if(prevProps.value !== this.props.value && this.state.selectedValue != this.props.value){
            this.setState({
                defaultValue: this.props.value,
                selectedValue: this.props.value,
            })
        }
    }

    componentWillUnmount() {
        unmountComponentAtNode(this.node);
        window.document.body.removeChild(this.node);
        document.removeEventListener('touchmove', this.fixTouchBug);
    }
    
    // 修复滑动时整个页面跟着滑动
    fixTouchBug = (e) =>  {
        if(this.dragingFlag){
            e.preventDefault();
            e.stopPropagation();
        }
    }
    
    handlePickerViewChange (newValue) {
        // picker view回调的时候
        const {mode} = this.props;
        switch (mode) {
            case 'date':
                // 检验新日期是否合法
                // 年月一定合法 主要就是检验日
                newValue = this.checkNewValue(newValue, ['date']);
                const newDatedayjs = dayjs(new Date(Number.parseInt(newValue[0]), Number.parseInt(newValue[1]), Number.parseInt(newValue[2])));
                this.setState({selectedValue: newDatedayjs});

                break;
            case 'time':
                // 时间切换
                newValue = this.checkNewValue(newValue, ['time']);

                const newTimedayjs = dayjs(`${newValue[0]}:${newValue[1]}`, 'HH:mm');
                this.setState({selectedValue: newTimedayjs});

                break;
            case 'datetime':

                newValue = this.checkNewValue(newValue, ['date', 'time']);

                const newDateTimedayjs = dayjs(new Date(Number.parseInt(newValue[0]), Number.parseInt(newValue[1]), Number.parseInt(newValue[2]), Number.parseInt(newValue[3]), Number.parseInt(newValue[4])));
                this.setState({selectedValue: newDateTimedayjs});

                break;
            case 'year':
                this.setState({selectedValue: dayjs(newValue)});

                break;
            case 'month':
                this.setState({selectedValue: dayjs(Number.parseInt(newValue[0]) + 1, 'MM')});

                break;
        }
    }
    handleClickOpen (e) {
        if(e) e.preventDefault();

        this.setState({show: true});

        const t = this;
        let timer = setTimeout(()=>{
            t.setState({
                animation: 'in'
            });
            clearTimeout(timer);
        }, 0);
    }
    handleClickClose (e) {

        if(e) e.preventDefault();

        this.setState({animation: 'out'});

        const t = this;
        let timer = setTimeout(()=>{
            this.setState({show: false});
            clearTimeout(timer);
        }, 300);
    }
    handleCancel () {
        const {defaultValue} = this.state;
        const {onCancel} = this.props;

        this.handleClickClose();

        this.setState({selectedValue: defaultValue});

        if (onCancel) onCancel();
    }
    handleConfirm () {
        // 点击确认之后的回调
        const {selectedValue} = this.state;

        this.handleClickClose();

        // 更新默认值
        this.setState({defaultValue: selectedValue});
        if (this.props.onChange) this.props.onChange(selectedValue.$d);
    }
    resetPosition (array, newValue, index) {
        // 如果比最后一个值大 去最后一个 否则 取第一个
        // 取第一个
        if(Number.parseInt(newValue[index]) > Number.parseInt(array[array.length - 1].value)){
            newValue[index] = array[array.length - 1].value;
        } else {
            newValue[index] = array[0].value;
        }

        return newValue;
    }
    checkNewValue (newValue, mode) {
        // 检查新的值是否合法
        if(!dayjs(new Date(Number.parseInt(newValue[0]), Number.parseInt(newValue[1]), Number.parseInt(newValue[2]))).isValid()){
            // 判断哪个字段不合法
            // const wrongPosition = dayjs(newValue).invalidAt();
            // if(wrongPosition == 2) {
                const array = this.getDateArray(newValue.slice(0,2));
                if(Number.parseInt(newValue[2]) < Number.parseInt(array[0].value) || Number.parseInt(newValue[2]) > Number.parseInt(array[array.length - 1].value)){
                    newValue = this.resetPosition(array, newValue, 2);
                }
            // }
        }
        // 逐项检查新日期各项 是否在限制条件内
        // 从月份开始检查
        const {maxValue, minValue} = this.props;
        if(mode.indexOf('date') >= 0){
            if(minValue){
                if(Number.parseInt(newValue[0]) == minValue.year()){
                    const array = this.getMonthArray(newValue.slice(0,1));
                    if(Number.parseInt(newValue[1]) < Number.parseInt(array[0].value) || Number.parseInt(newValue[1]) > Number.parseInt(array[array.length - 1].value)){
                        newValue = this.resetPosition(array, newValue, 1);
                    }
                }

                if(Number.parseInt(newValue[0]) == minValue.year() && Number.parseInt(newValue[1]) == minValue.month()){
                    const array = this.getDateArray(newValue.slice(0,2));
                    if(Number.parseInt(newValue[2]) < Number.parseInt(array[0].value) || Number.parseInt(newValue[2]) > Number.parseInt(array[array.length - 1].value)){
                        newValue = this.resetPosition(array, newValue, 2);
                    }
                }

                if(mode.indexOf('time') >= 0){
                    if(Number.parseInt(newValue[0]) == minValue.year() && Number.parseInt(newValue[1]) == minValue.month() && Number.parseInt(newValue[2]) == minValue.date()){
                        const array = this.getHourArray(newValue.slice(0,3), true);
                        if(Number.parseInt(newValue[3]) < Number.parseInt(array[0].value) || Number.parseInt(newValue[3]) > Number.parseInt(array[array.length - 1].value)){
                            newValue = this.resetPosition(array, newValue, 3);
                        }
                    }

                    if(Number.parseInt(newValue[0]) == minValue.year() && Number.parseInt(newValue[1]) == minValue.month() && Number.parseInt(newValue[2]) == minValue.date() && Number.parseInt(newValue[3]) == minValue.hour()){
                        const array = this.getMinuteArray(newValue.slice(0,4), true);
                        if(Number.parseInt(newValue[4]) < Number.parseInt(array[0].value) || Number.parseInt(newValue[4]) > Number.parseInt(array[array.length - 1].value)){
                            newValue = this.resetPosition(array, newValue, 4);
                        }
                    }
                }
            }

            if(maxValue){
                if(Number.parseInt(newValue[0]) == maxValue.year()){
                    const array = this.getMonthArray(newValue.slice(0,1));
                    if(Number.parseInt(newValue[1]) < Number.parseInt(array[0].value) || Number.parseInt(newValue[1]) > Number.parseInt(array[array.length - 1].value)){
                        newValue = this.resetPosition(array, newValue, 1);
                    }
                }

                if(Number.parseInt(newValue[0]) == maxValue.year() && Number.parseInt(newValue[1]) == maxValue.month()){
                    const array = this.getDateArray(newValue.slice(0,2));
                    if(Number.parseInt(newValue[2]) < Number.parseInt(array[0].value) || Number.parseInt(newValue[2]) > Number.parseInt(array[array.length - 1].value)){
                        newValue = this.resetPosition(array, newValue, 2);
                    }
                }

                if(mode.indexOf('time') >= 0){
                    if(Number.parseInt(newValue[0]) == maxValue.year() && Number.parseInt(newValue[1]) == maxValue.month() && Number.parseInt(newValue[2]) == maxValue.date()){
                        const array = this.getHourArray(newValue.slice(0,3), true);
                        if(Number.parseInt(newValue[3]) < Number.parseInt(array[0].value) || Number.parseInt(newValue[3]) > Number.parseInt(array[array.length - 1].value)){
                            newValue = this.resetPosition(array, newValue, 3);
                        }
                    }

                    if(Number.parseInt(newValue[0]) == maxValue.year() && Number.parseInt(newValue[1]) == maxValue.month() && Number.parseInt(newValue[2]) == maxValue.date() && Number.parseInt(newValue[3]) == maxValue.hour()){
                        const array = this.getMinuteArray(newValue.slice(0,4), true);
                        if(Number.parseInt(newValue[4]) < Number.parseInt(array[0].value) || Number.parseInt(newValue[4]) > Number.parseInt(array[array.length - 1].value)){
                            newValue = this.resetPosition(array, newValue, 4);
                        }
                    }
                }

            }
        }

        if(mode.indexOf('time') >= 0){
            // 验证分钟就行
            if(minValue){
                if(Number.parseInt(newValue[0]) == minValue.hour()){
                    const array = this.getMinuteArray(newValue[0]);
                    if(Number.parseInt(newValue[1]) < Number.parseInt(array[0].value) || Number.parseInt(newValue[1]) > Number.parseInt(array[array.length - 1].value)){
                        newValue = this.resetPosition(array, newValue, 1);
                    }
                }
            }

            if(maxValue){
                if(Number.parseInt(newValue[0]) == maxValue.hour()){
                    const array = this.getMinuteArray(newValue[0]);
                    if(Number.parseInt(newValue[1]) < Number.parseInt(array[0].value) || Number.parseInt(newValue[1]) > Number.parseInt(array[array.length - 1].value)){
                        newValue = this.resetPosition(array, newValue, 1);
                    }
                }
            }
        }

        return newValue;
    }
    checkDaysByYearMonth (value) {
        const month = value.month();
        // 判断大小月
        if([0,2,4,6,7,9,11].indexOf(month) >= 0){
            // 大月 31天
            return 31;
        } else if ([3,5,8,10].indexOf(month) >= 0) {
            // 小月 30天
            return 30;
        } else {
            // 2月 判断是否闰年
            if(dayjs(value.year()+'-02').endOf('month').$D === 29){
                // 闰年 29天
                return 29;
            }

            return 28;
        }
    }
    getYearArray () {
        // 获取年数组
        const {selectedValue} = this.state;
        const {maxValue, minValue} = this.props;
        const yearArray = [];
        let currentYear = selectedValue.year();

        // 默认显示选中值前后二十年
        // 有最大最小值 根据最大最小值显示
        let earliest = minValue ? minValue.year() : currentYear - 20;
        let latest = maxValue ? maxValue.year() : currentYear + 20;

        for(let i = earliest; i <= latest; i++){
            yearArray.push({label: i + '年', value: i + ''});
        }

        return yearArray;
    }
    getMonthArray (newValue) {
        let result = monthArray.concat();
        let {selectedValue} = this.state;
        const {maxValue, minValue} = this.props;

        if(newValue){
            selectedValue = dayjs(newValue);
        }

        if(minValue){
            if(selectedValue.year() === minValue.year()) {
                result = result.filter((item) => {
                    if(minValue.month() <= Number.parseInt(item.value)) return true;
                });
            }
        }

        if(maxValue){
            if(selectedValue.year() === maxValue.year()){
                result = result.filter((item) => {
                    if(maxValue.month() >= Number.parseInt(item.value)) return true;
                });
            }
        }

        return result;
    }
    getDateArray (newValue) {
        let dayArray = [];
        let {selectedValue} = this.state;
        const {maxValue, minValue} = this.props;
        if(newValue){
            selectedValue = dayjs(new Date(newValue[0],newValue[1]));
        }
        const daysMax = this.checkDaysByYearMonth(selectedValue);

        // 先生成一个数组
        for(let i = 1; i < daysMax + 1; i++){
            dayArray.push({label: i + '日', value: i + ''});
        }

        // 根据大小值过滤
        if(minValue){
            if(selectedValue.year() == minValue.year() && selectedValue.month() == minValue.month()){
                dayArray = dayArray.filter((item)=>{
                    return Number.parseInt(item.value) >= minValue.date();
                })
            }
        }

        if(maxValue){
            if(selectedValue.year() == maxValue.year() && selectedValue.month() == maxValue.month()){
                dayArray = dayArray.filter((item)=>{
                    return Number.parseInt(item.value) <= maxValue.date();
                })
            }
        }

        return dayArray;
    }
    getHourArray (newValue, connectDate) {
        let result = hourArray.concat();
        let {selectedValue} = this.state;
        const {maxValue, minValue} = this.props;

        if(newValue){
            selectedValue = dayjs(newValue);
        }

        if(connectDate) {
            if(minValue){
                if(selectedValue.year() == minValue.year() && selectedValue.month() == minValue.month() && selectedValue.date() == minValue.date()){
                    result = result.filter((item) => {
                        return Number.parseInt(item.value) >= minValue.hour();
                    });
                }
            }

            if(maxValue){
                if(selectedValue.year() == maxValue.year() && selectedValue.month() == maxValue.month() && selectedValue.date() == maxValue.date()){
                    result = result.filter((item) => {
                        return maxValue.hour() >= Number.parseInt(item.value);
                    });
                }
            }

        } else {
            if(minValue){
                result = result.filter((item) => {
                    return Number.parseInt(item.value) >= minValue.hour();
                });
            }

            if(maxValue){
                result = result.filter((item) => {
                    return maxValue.hour() >= Number.parseInt(item.value);
                });
            }
        }

        return result;
    }
    getMinuteArray (newValue, connectDate) {
        let result = [];
        let {selectedValue} = this.state;
        const {maxValue, minValue} = this.props;
        const {timeStep} = this.props;
        const length = 60 / timeStep;

        if(newValue){
            if(newValue.length == 4){
                selectedValue = dayjs(newValue);
            } else {
                selectedValue = dayjs(newValue, 'HH');
            }
        }

        for(let i = 0; i < length; i++){
            result.push({label: timeStep * i + '分', value: timeStep * i + ''});
        }

        if(connectDate){
            if(minValue){
                if(selectedValue.year() == minValue.year() && selectedValue.month() == minValue.month() && selectedValue.date() == minValue.date() && selectedValue.hour() == minValue.hour()){
                    result = result.filter((item)=>{
                        return Number.parseInt(item.value) >= minValue.minute();
                    });
                }
            }

            if(maxValue) {
                if(selectedValue.year() == maxValue.year() && selectedValue.month() == maxValue.month() && selectedValue.date() == maxValue.date() && selectedValue.hour() == maxValue.hour()){
                    result = result.filter((item)=>{
                        return Number.parseInt(item.value) <= maxValue.minute();
                    });
                }
            }
        } else {
            if(minValue){
                if(selectedValue.hour() == minValue.hour()){
                    result = result.filter((item)=>{
                        return Number.parseInt(item.value) >= minValue.minute();
                    });
                }
            }

            if(maxValue) {
                if(selectedValue.hour() == maxValue.hour()){
                    result = result.filter((item)=>{
                        return Number.parseInt(item.value) <= maxValue.minute();
                    });
                }
            }
        }

        return result;
    }
    getDateByMode (mode) {
        let result = [];

        switch (mode) {
            case 'date':
                // 只有日期
                // 选取今年的前后20年
                const dateYearArray = this.getYearArray();

                // 判断月 只有年在限制的时候 才限制月
                const dateMonthArray = this.getMonthArray();

                // 准备日 根据值判断当月有多少天
                const dateDateArray = this.getDateArray();

                result = [dateYearArray, dateMonthArray, dateDateArray];
                break;
            case 'time':

                const timeHourArray = this.getHourArray();

                const timeMinuteArray = this.getMinuteArray();

                result = [timeHourArray, timeMinuteArray];
                break;
            case 'datetime':
                // 时间日期选择器
                const datetimeYearArray = this.getYearArray();

                const datetimeMonthArray = this.getMonthArray();

                const datetimeDateArray = this.getDateArray();

                const datetimeHourArray = this.getHourArray(undefined, true);

                const datetimeMinuteArray = this.getMinuteArray(undefined, true);
                
                result = [datetimeYearArray, datetimeMonthArray, datetimeDateArray, datetimeHourArray, datetimeMinuteArray];
                break;
            case 'year':
                // 年份选择器
                const yearArray = this.getYearArray();

                result = [yearArray];
                break;
            case 'month':
                // 月份选择
                const monthArray = this.getMonthArray();

                result = [monthArray];
                break;
        }

        return result;
    }
    getPickerView () {
        // 根据mode不同 准备不同数据
        // date picker中的picker view 应该是不级联
        const {mode} = this.props;
        const {selectedValue, show} = this.state;

        if(selectedValue != undefined && show){
            const data = this.getDateByMode(mode);

            if(mode == 'date'){
                return <PickerView
                    col={3}
                    data={data}
                    value={[selectedValue.year() + '', selectedValue.month() + '', selectedValue.date() + '']}
                    cascade={false}
                    controlled
                    onChange={this.handlePickerViewChange.bind(this)}
                       />;
            } else if (mode == 'time') {
                return <PickerView
                    col={2}
                    data={data}
                    value={[selectedValue.hour() + '', selectedValue.minute() + '']}
                    cascade={false}
                    controlled
                    onChange={this.handlePickerViewChange.bind(this)}
                       />;
            } else if (mode == 'datetime') {
                return <PickerView
                    col={5}
                    data={data}
                    value={[selectedValue.year() + '', selectedValue.month() + '', selectedValue.date() + '', selectedValue.hour() + '', selectedValue.minute() + '']}
                    cascade={false}
                    controlled
                    onChange={this.handlePickerViewChange.bind(this)}
                       />;
            } else if (mode == 'year') {
                return <PickerView
                    col={1}
                    data={data}
                    value={[selectedValue.year() + '']}
                    cascade={false}
                    controlled
                    onChange={this.handlePickerViewChange.bind(this)}
                       />;
            } else if (mode == 'month') {
                return <PickerView
                    col={1}
                    data={data}
                    value={[selectedValue.month() + '']}
                    cascade={false}
                    controlled
                    onChange={this.handlePickerViewChange.bind(this)}
                       />;
            }
        }
    }
    getPopupDOM () {
        const {show, animation, style} = this.state;
        const {title} = this.props;
        const pickerViewDOM = this.getPickerView();

        if (show) {
            unstable_renderSubtreeIntoContainer(
                this, //代表当前组件
                <div className='ql-s-picker-box '>
                    
                    <div onClick={this.handleCancel.bind(this)} className={classNames(['ql-s-picker-popup-mask', {'hide': animation == 'out'}])} />
                <div className={classNames(['ql-s-picker-popup-wrap', style , {'popup': animation == 'in'}])}>
                    <div className="ql-s-picker-popup-header">
                        <span onClick={this.handleCancel.bind(this)} className="ql-s-picker-popup-item ql-s-header-left">取消</span>
                        <span className="ql-s-picker-popup-item ql-s-header-title">{title}</span>

                        <span onClick={this.handleConfirm.bind(this)} className="ql-s-picker-popup-item ql-s-header-right">确定</span>
                    </div>
                    <div className="ql-s-picker-popup-body">
                        {pickerViewDOM}
                    </div>
                </div>
                   </div>, // 塞进传送门的JSX
                this.node // 传送门另一端的DOM node
            );
            this.dragingFlag = true;
            
        } else {
            this.dragingFlag = false;
            this.node && unmountComponentAtNode(this.node);
        }
    }
    render () {
        return (
            <div  className={classNames(['ql-s-picker-bar', this.props.barClassName ])}>
                <Touchable
                    onPress={this.handleClickOpen.bind(this)}
                >
                    {this.props.children}
                </Touchable>
            </div>
        )
    }
}

DatePicker.propTypes = {
    mode: PropTypes.string, // 模式：枚举类型：日期date 时间time 日期时间datetime 年year 月moth 默认是date
    value: PropTypes.object, // dayjs类型
    title: PropTypes.string, // 标题
    timeStep: PropTypes.number, // time模式下 时间的步长 值为60的约数如1，2，3，4，5，6，10，12，15，20，30，60
    maxValue: PropTypes.object, // 最大值 <=
    minValue: PropTypes.object // 最小值 >=
};

DatePicker.defaultProps = {
    mode: 'date',
    value: dayjs(),
    timeStep: 1
};

export default DatePicker