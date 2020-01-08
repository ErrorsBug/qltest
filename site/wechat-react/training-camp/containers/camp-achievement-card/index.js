import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import { formatDate, imgUrlFormat, locationTo } from 'components/util';

const campAchievementCard = require('./camp-achi-card-painter/index')
import {
    getExceUser
} from '../../actions/camp'

function mstp(state) {
    return {
        sysTime: state.common.sysTime,
    }
}

const matp = {
    getExceUser
}


class CampHistoryCourse extends Component {

    constructor(props){
        super(props);
        this.id = this.props.location.query.id;
    }

    state = {
        imgData: ""
    }

    componentDidMount = async () => {


        const userData = await this.props.getExceUser(this.id)
        console.log(userData.data.exceUsers[0]);

        if(userData.data.exceUsers[0]) {
            var drawer = campAchievementCard()
            var result = await drawer.call(drawer, userData.data.exceUsers[0], userData.data.trainQrData)
            this.setState({
                imgData: result
            })
        }

    }

    render() {
        return (
            <Page title={'训练营成就'} className='camp-achievement-card'>
                <div className="top-con">长按保存下方图片，跟大家分享你的成绩吧</div>
                <img className='card-con' src={this.state.imgData} alt=""/>
            </Page>
        );
    }
}

export default connect(mstp, matp)(CampHistoryCourse);
