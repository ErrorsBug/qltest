import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import { formatDate, imgUrlFormat, locationTo } from 'components/util';

import {
    preview,
    fetchTestList,
} from '../../actions/camp'

function mstp(state) {
    return {
    }
}

const matp = {
    preview,
    fetchTestList
}


class Preview extends Component {

    constructor(props){
        super(props);
        this.topicId = this.props.location.query.topicId
    }

    state = {
        imgSrc: "",
        hasAnswered: "N",
        
        showBtn: false,
    }

    componentDidMount = async () => {
        // console.log(this.topicId);
        this.getPreviwInfo()
        this.getTestList()
    }

    getPreviwInfo = async () => {
        const result = await this.props.preview(this.topicId)
        if(result && result.data && result.data.topic && result.data.topic.id) {
            this.setState({
                hasAnswered: result.data.topic.hasAnswered,
                imgSrc: result.data.topic.preImg
            })
        }
    }

    getTestList = async () => {
        const result = await this.props.fetchTestList(this.topicId)
        if(result && result.data && result.data.preparations && result.data.preparations.length > 0) {
            this.setState({
                showBtn: true
            })
        }
    }

    linkToTest = () => {
        if(this.state.hasAnswered == "Y") {
            locationTo('/wechat/page/camp-preparation-test-result?topicId=' + this.props.location.query.topicId)
        } else {
            locationTo('/wechat/page/preparation-test?topicId=' + this.props.location.query.topicId)
        }
    }

    render() {
        return (
            <Page title={'课前预习'} className='camp-preview-container'>
                <div className={this.state.showBtn ? "photo-con show-btn" : "photo-con"}>
                    <img src={this.state.imgSrc} alt=""/>
                </div>
                {
                    this.state.showBtn && <div className="preparation-test-btn" onClick={this.linkToTest}></div>
                }
            </Page>
        );
    }
}

export default connect(mstp, matp)(Preview);
