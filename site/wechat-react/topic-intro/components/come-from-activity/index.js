import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { locationTo } from 'components/util';

class ComeFromAct extends Component {
    state = {
        show:false
    }

    componentDidMount() {
        this.init();
    }
    init(){
        if (typeof window == 'undefined') {
            return 
        }
        let referrer = document.referrer;
        if (/packageCode/.test(referrer)) {
            this.setState({
                show:true
            })
        }


    }

    gotoAct() {
        let referrer = document.referrer;
        let search = referrer.replace(/.*\?/, '');
        locationTo(referrer)
    }
    
    render() {
        if (!this.state.show) {
            return null
        }
        return (
            <div className='come-from-act on-log on-visible' data-log-region="back-activity" onClick={this.gotoAct}></div>
        );
    }
}

ComeFromAct.propTypes = {

};

export default ComeFromAct;