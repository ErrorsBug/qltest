
const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import BEndCannelIntro from './b-end';
import CEndCannelIntro from './c-end';

import {
	isFromLiveCenter,
	// initCEndSourseInject,
	getVal,
	locationTo,
} from 'components/util';

import {
	fillParams
} from 'components/url-utils';

/**
 * 根据C端来源跳转到新版或旧版的中间组件
 */
class ChannelIntroDispatcher extends Component {
    
    component = null;

    constructor(props, context) {
        super(props, context);

	    if(typeof window !== 'undefined'){
		    if(this.props.power.liveId){
			    // B端进旧版页面
			    this.component = <BEndCannelIntro {...props}/>
		    }else{
			    // C端进新版页面
			    this.component = <CEndCannelIntro {...props}/>
		    }
	    }
    }

    render() {
        return this.component;
    }
}

function mapStateToProps (state) {
    return {
	    power: getVal(state, 'channel.power', {})
    }
}

const mapActionToProps = {
    
};

module.exports = connect(mapStateToProps, mapActionToProps)(ChannelIntroDispatcher);
