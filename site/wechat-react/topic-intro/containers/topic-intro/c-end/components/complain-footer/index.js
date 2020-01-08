import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ComplainFooter extends Component {
    state = {
        url:'',
    }
    componentDidMount() {
        this.setState({
            url:window.location.href
        })
    }
    
    render() {
        // 专业版不显示
        return (
            <div className="complain-footer">
                {
                    this.props.isLiveAdmin.isLiveAdmin == 'N'?
                    <div>  
                        <span className="qlchat"></span>
                        <i onClick={()=>{}}>千聊提供技术支持</i>
                        <a href={`/wechat/page/complain-reason?topicId=${this.props.topicId}&link=${encodeURIComponent(this.state.url)}`} className="qianliao-complain">
                            <span>投诉举报</span>
                            </a>
                    </div>      
                    :null    
                }    
            </div>
        );
    }
}

ComplainFooter.propTypes = {

};

export default ComplainFooter;