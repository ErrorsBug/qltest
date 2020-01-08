import React from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

class Sex extends React.PureComponent {

    state = {
        isShowOptions: false
    }

    data = {
        options: [
            {
                icon: 'boy',
                label: '男性',
                value: '1'
            },
            {
                icon: 'girl',
                label: '女性',
                value: '2'
            }
        ]
    }
    
    changeData = (value) => {
        return () => {
            this.props.changeData(this.props.index, value);
            this.setState({isShowOptions: false})
        }
    }

    get sexStr () {
        const item = this.props.item
        return item && item.content && this.data.options.find(opt => opt.value == item.content).label || ''
    }

    render () {
        const {
            item,
            placeHolder
        } = this.props
        const {
            isShowOptions
        } = this.state

        return [
            <li>
                <div className="main-flex">
                    <span className="title">
                        {item.isRequired == 'Y' && <i>*</i>}
                        {item.fieldValue}
                    </span>
                    <span className="value-box sex" onClick={() => {this.setState({isShowOptions: true})}}>
                        {this.sexStr || <span className="place-holder">{placeHolder}</span>}
                        <i className='icon_enter'></i>
                    </span>
                </div>    
            </li>,
            isShowOptions ? createPortal(
                <div className="sex-options-dialog">
                    <div className="layer" onClick={() => {this.setState({isShowOptions: false})}}></div>
                    <div className="container">
                        <div className="sex-options">
                            {
                                this.data.options.map((opt, index) => (
                                    <div className="item" key={'item-'+index} onClick={this.changeData(opt.value)}>
                                        <div className={`item-icon ${opt.icon}`}></div>
                                        <div className="item-text">{opt.label}</div>
                                    </div>
                                ))
                            }
                        </div>

                        <div className="footer">
                            <span className="btn">确定</span>
                        </div>
                    </div>
                </div>,
                document.querySelector('.portal-container')
            ) : null
        ]
    }
}

Sex.propTypes = {
    
};

export default Sex;