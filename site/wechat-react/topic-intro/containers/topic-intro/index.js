const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import BEndTopicIntro from './b-end';
import CEndTopicIntro from './c-end';
import { isQlchat } from 'components/envi';

import { fetchUserPower } from '../../actions/topic-intro'

import {
	isFromLiveCenter,
	// initCEndSourseInject,
	getCookie,
	getVal,
	locationTo,
} from 'components/util';

import {
	fillParams
} from 'components/url-utils';

/**
 * 根据C端来源跳转到新版或旧版的中间组件
 */
class TopicIntroDispatcher extends Component {
    
    state = {
	    component: null
    };

    constructor(props, context) {
        super(props, context);
	    //
	    // if(typeof window !== 'undefined'){
		 //    // C端来源注入
		 //    initCEndSourseInject();
	    // }
    }

    async componentDidMount(){
		
		if (isQlchat()) { 
			// C端来源进新版页面
			this.setState({
				component: <CEndTopicIntro {...this.props}/>
			})
		} else if(!getCookie('userId')){
    		// 未登录用户直接进旧页面
		    this.setState({
			    component: <BEndTopicIntro {...this.props}/>
		    })
	    }else{
		    await this.props.fetchUserPower({
			    topicId: this.props.location.query.topicId
		    });
		    // if(this.props.power.allowMGLive || this.props.power.allowSpeak || !isFromLiveCenter()){
		    if(this.props.power.allowMGLive || this.props.power.allowSpeak){
				// 非C端来源进旧版页面
			    this.setState({
					component: <BEndTopicIntro {...this.props}/>
			    })
		    }else{
				// C端来源进新版页面
			    this.setState({
				    component: <CEndTopicIntro {...this.props}/>
			    })
		    }
	    }
	}

    render() {
        return this.state.component;
    }
}

function mapStateToProps (state) {
    return {
    	power: getVal(state, 'topicIntro.power', {}),
    }
}

const mapActionToProps = {
	fetchUserPower
};

module.exports = connect(mapStateToProps, mapActionToProps)(TopicIntroDispatcher);
