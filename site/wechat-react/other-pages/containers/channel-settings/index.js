const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Page from 'components/page';
import { locationTo } from 'components/util';
import { share } from 'components/wx-utils';

// actions
// import { fetchCourseList, fetchBanners } from '../../actions/recommend';

class ChannelSettings extends Component {

    state = {

    }

    componentDidMount() {

        share({
            title: '',
            timelineTitle: '',
            desc: '',
            timelineDesc: '', // 分享到朋友圈单独定制
            imgUrl: ''
        });
    }

    render() {

        return (
            <Page title="系列课" className=''>
            </Page>
        );
    }
}

function mapStateToProps (state) {
    return {

    }
}

const mapActionToProps = {

}

module.exports = connect(mapStateToProps, mapActionToProps)(ChannelSettings);
