const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import Page from 'components/page';
import { connect } from 'react-redux';
class ChannelDistributionNone extends Component {

    state={
        type:"",
    }

    componentDidMount() {
        this.initPage();
    }

    initPage(){
        this.setState({
            type:this.props.params.type
        })
    }


    render() {
        
        return (
            <Page title='课代表专属页' className='channel-distribution-none'>
                <div >
                    {   
                        this.state.type == "freeze"?
                        <div className="distribution-text"><p>推广资格已经被课程创建者冻结</p></div>
                        :
                        this.state.type == "del"?
                        <div className="distribution-text"><p>推广资格已经被课程创建者删除</p></div>
                        :
                        this.state.type == "zero"?
                        <div className="distribution-text"><p>推广资格已经被领取完</p></div>
                        :
                        this.state.type == "geted"?
                        <div className="distribution-text"><p>你已领取过推广资格</p></div>
                        :
                        null
                    }
                    <a href={`/live/channel/channelPage/${this.props.params.channelId}.htm`} className="btn-jump-channel">跳转到当前系列课</a>
                </div>
             </Page>
        );
    }
}


function mapStateToProps(state) {
    return {
    };
}

const mapActionToProps = {
};
module.exports = connect(mapStateToProps, mapActionToProps)(ChannelDistributionNone);
