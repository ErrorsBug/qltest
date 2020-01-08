const isNode = typeof window == 'undefined';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

/**
 * 根据isLiveAdmin跳转到专业版或者普通版的中间组件
 */
class liveMainDispatcher extends Component {
    
    component = null;

    constructor(props, context) {
        super(props, context);
        if (props.isLiveAdmin === 'Y') {
            const StudioLive = require('./studio-live-index');
            this.component = <StudioLive {...props} />
        } else {
            const BaseLive = require('./base-live-index');
            this.component = <BaseLive {...props} />
        }
    }

    render() {
        return this.component;
    }
}

function mapStateToProps (state) {
    return {
        isLiveAdmin: state.common.isLiveAdmin
    }
}

const mapActionToProps = {
    
}

module.exports = connect(mapStateToProps, mapActionToProps)(liveMainDispatcher);
