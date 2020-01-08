import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { autobind } from 'core-decorators';
import {createPortal} from 'react-dom'
@autobind
class ChargeStyle extends Component {

    state = {
        show: false,
        select: 'absolutely'
    }

    constructor(props) {
        super(props);
    }

    show (){
        this.setState({
            show: true
        })
    }

    componentDidMount() {
        
    }

    // 点击完成按钮
    complete(){
        this.setState({show: false})
        this.props.selectChargeStyle(this.state.select)
    }

    // 类型选择
    selectStyle(e){
        this.setState({
            select: e.currentTarget.dataset.type
        })
    }

    render() {
        const {
            show,
            select
        } = this.state
        return (
                <div className="charge-style-container">
                    <ReactCSSTransitionGroup
                        transitionName="black"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={300}>
                    {
                        show && 
                        <div className="black" onClick={()=>{this.setState({show: false})}}></div>
                    }
                    </ReactCSSTransitionGroup>
                    <ReactCSSTransitionGroup
                        transitionName="charge-style-tst"
                        transitionEnterTimeout={300}
                        transitionLeaveTimeout={300}>
                    {
                        show && 
                        <div className="charge-style">
                            <div className="header">选择收费类型</div>
                            <div className="style-list" data-type="absolutely" onClick={this.selectStyle}>
                                <span className="name">固定收费</span>
                                <div className={`img ${select === 'absolutely' ? 'checked' : 'unchecked'}`}></div>
                            </div>
                            <div className="style-list" data-type = "flexible" onClick={this.selectStyle}>
                                <span className="name">按时收费</span>
                                <div className={`img ${select === 'flexible' ? 'checked' : 'unchecked'}`}></div>
                            </div>
                            <div className="btn-complete" onClick={this.complete}>完成</div>
                        </div>
                    }
                    </ReactCSSTransitionGroup>
                </div>
        )
    }
}

ChargeStyle.propTypes = {

};

export default ChargeStyle;