import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import { formatDate, imgUrlFormat, locationTo, normalFilter } from 'components/util';
import { findDOMNode } from 'react-dom';
import { autobind } from 'core-decorators';

/**action */
import {
    getFailReason,
    saveFailReason,
} from '../../actions/camp'

import { isIOS } from 'components/envi'

@autobind
class CampPayFail extends Component {

    constructor(props){
        super(props);
        this.orderCode = this.props.location.query.orderCode;
    }

    state = {
        typeList: [],

        activeId: null,

        reasonText: '',
    }

    componentDidMount() {
        this.getFailReason()
    }

    textareaHandle = (e) => {
        let value = e.target.value
        this.setState({
            reasonText: value
        })
        if(value.length>300){
            this.setState({
                reasonText: value.substring(0, 300)
            })
        }
    }
    async getFailReason(){
        const result = await this.props.getFailReason();
        const other = [{id: '0' , content: '其他'}];
        if(result.state.code === 0){
            this.setState({typeList: result.data.dataList.concat(other)})
        }
    }
    reasonChoseHandle = (id) => {
        let dataList = this.state.typeList

        dataList.map((item) => {
            if(item.id == id) {
                item.active = true
            } else {
                item.active = false
            }
        })

        this.setState({
            activeId: id,
            typeList: dataList,
        },()=>{
            if(this.state.activeId === '0'){
                !isIOS() && setTimeout(()=>{
                    findDOMNode(this.refs.payFailContainer).scrollTop = 9999;
                    // document.querySelector('textarea').focus()
                },400)
            }
        })

    }
    async saveReason(){
        let remark = this.state.activeId==='0'?this.state.reasonText:'';
        if(this.state.activeId === null){
            window.toast('您还未选择')
        }else{
            if(this.state.activeId==='0'&&!this.state.reasonText.trim()){
                window.toast('您还未输入原因')
            }else{
                const result = await this.props.saveFailReason(this.state.activeId,remark,this.props.location.query.orderCode);
                if(result.state.code === 0){
                    locationTo('/wechat/page/camp/'+ this.props.location.query.campId)
                }
            }            
        }
    }

    render() {

        return (
            <Page title={'支付失败'} className='camp-pay-fail-page'>

                <div className="container" ref="payFailContainer">
                    <div className='pay-header'>
                        <div className="error-logo"></div>
                        <p className="success">支付失败，请确认原因</p>
                        <p className="des">让我们提供更好的服务</p>
                    </div>

                    <div className="reason-list">
                        {
                            this.state.typeList.map((item) =>
                                <div
                                    className={`reason-item${item.active ? " active" : ""}`}
                                    key={item.id}
                                    onClick={() => { this.reasonChoseHandle(item.id) }}
                                >
                                    <div className="radio"><span></span></div>
                                    <div className="content">{item.content}</div>
                                </div>
                            )
                        }
                    </div>


                    {
                        this.state.activeId === '0' &&
                        <div className="textarea-con" ref="textarea">
                            <textarea 
                                value={this.state.reasonText} 
                                onChange={this.textareaHandle}
                                autoFocus="autofocus"
                            ></textarea>
                        </div>
                    }
                </div>


                <div className="commit-btn on-log" 
                    onClick={()=>{this.saveReason()}} 
                    data-log-order_code={this.props.location.query.orderCode}
                    data-log-region="fail-course-submit"
                >提交</div>
            </Page>
        );
    }
}


function mstp(state) {
    return {
        sysTime: state.common.sysTime,
    }
}

const matp = {
    getFailReason,
    saveFailReason,
}

export default connect(mstp, matp)(CampPayFail);
