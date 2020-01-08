/**
 * Created by Aus on 2017/5/6.
 */
import React from 'react'
import classNames from 'classnames'
import PickerView from '../../picker-view'
import Touchable from 'rc-touchable'
import PropTypes from 'prop-types';
import {unstable_renderSubtreeIntoContainer, unmountComponentAtNode} from 'react-dom';

// 选择器组件
class Picker extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            defaultValue: undefined,
            selectedValue: undefined,
            animation: 'out',
            show: false
        }
    }
    componentDidMount () {
        // picker 当做一个非受控组件
        const { value, col } = this.props;
        
        // 防止初始化没有数据后续生成数组报错
        if (value.length < col) {
            for (let i = 0; i < col; i++){
                if (value.length < i+1) {
                    value[i] = '0';
                }
            }
        }

        this.setState({
            defaultValue: value,
            selectedValue: value
        });

        const doc = window.document;
        this.node = doc.createElement('div');
        doc.body.appendChild(this.node);

        document.addEventListener('touchmove', this.fixTouchBug);
    
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value && nextProps.value != this.state.defaultValue && nextProps.value != this.state.selectedValue) {
            this.setState({
                defaultValue: nextProps.value,
                selectedValue: nextProps.value
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.show) {
            this.getPopupDOM();
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
            // e.preventDefault && e.preventDefault();
            e.stopPropagation && e.stopPropagation();
        }
    }

    handleClickOpen (e) {

        if(e) e.preventDefault();

        this.setState({show: true});

        const t = this;
        const timer = setTimeout(()=>{
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
        const timer = setTimeout(()=>{
            t.setState({
                show: false
            });
            clearTimeout(timer);
        }, 300);
    }
    handlePickerViewChange (newValue) {
        const {onPickerChange} = this.props;

        this.setState({selectedValue: newValue});

        if(onPickerChange){
            onPickerChange(newValue);
        }
    }
    handleCancel () {
        const {defaultValue} = this.state;
        const {onCancel} = this.props;

        this.handleClickClose();

        this.setState({selectedValue: defaultValue});

        if(onCancel){
            onCancel();
        }
    }
    handleConfirm () {
        // 点击确认之后的回调
        const {selectedValue} = this.state;

        this.handleClickClose();

        this.setState({defaultChecked: selectedValue});

        if (this.props.onChange) this.props.onChange(selectedValue);
    }
    getPopupDOM () {
        const {show, animation} = this.state;
        const {cancelText, title, confirmText} = this.props;
        const pickerViewDOM = this.getPickerView();

        if (show) {
            unstable_renderSubtreeIntoContainer(
                this, //代表当前组件
                <div className={`ql-s-picker-box ${this.props.className || ''}`}>
                    <Touchable
                        onPress={this.handleCancel.bind(this)}
                    >
                        <div className={classNames(['ql-s-picker-popup-mask', {'hide': animation == 'out'}])} />
                    </Touchable>
                    <div className={classNames(['ql-s-picker-popup-wrap', {'popup': animation == 'in'}])}>
                        <div className="ql-s-picker-popup-header">
                            <Touchable
                                onPress={this.handleCancel.bind(this)}
                            >
                                <span className="ql-s-picker-popup-item ql-s-header-left">{cancelText}</span>
                            </Touchable>
                            <span className="ql-s-picker-popup-item ql-s-header-title">{title}</span>
                            <Touchable
                                onPress={this.handleConfirm.bind(this)}
                            >
                                <span className="ql-s-picker-popup-item ql-s-header-right">{confirmText}</span>
                            </Touchable>
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
    getPickerView () {
        const {col, data, cascade} = this.props;
        const {selectedValue, show} = this.state;

        if(selectedValue !== undefined && show){
            return <PickerView
                col={col}
                data={data}
                value={selectedValue}
                cascade={cascade}
                onChange={this.handlePickerViewChange.bind(this)}
                   />;
        }
    }
    render () {
        return (
            <div className={classNames(['ql-s-picker-bar', this.props.barClassName ])}>
                <Touchable
                    onPress={this.handleClickOpen.bind(this)}
                >
                    {this.props.children}
                </Touchable>
            </div>
        )
    }
}

Picker.propTypes = {
    col: PropTypes.number,
    data: PropTypes.array,
    value: PropTypes.array,
    cancelText: PropTypes.string,
    title: PropTypes.string,
    confirmText: PropTypes.string,
    cascade: PropTypes.bool,
    onChange: PropTypes.func,
    onCancel: PropTypes.func
};

Picker.defaultProps = {
    col: 1,
    cancelText: '取消',
    confirmText: '确定',
    cascade: true
};

export default Picker