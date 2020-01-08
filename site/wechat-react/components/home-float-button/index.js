import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { locationTo } from "components/util";
import { autobind } from 'core-decorators';

@autobind
class HomeFloatButton extends Component {
    constructor(props) {
        super(props);
        this.state={
            style:'normal',// 'normal' | 'top' 
        }
    }
    componentDidMount(){
        console.log(this.props)
    }

    gotoHome(e) {
        e.stopPropagation();
        e.preventDefault();
        setTimeout(() => {
            locationTo('/wechat/page/recommend');
        }, 500);

    }

    
    render() {
        return (
            <div className={`btn-home-float on-log ${this.props.style=='normal'||this.state.style=='normal'?'icon_home':''} ${this.props.style||this.state.style} ${this.props.scrolling=='Y'?'scrolling':(this.props.scrolling=='S'?'scrolling-stop':'')}`} 
                onClick={this.gotoHome}
                data-log-region="btn-goto-home"
            >
            </div>
        );
    }
}

HomeFloatButton.propTypes = {
    style: PropTypes.string,
    scrolling: PropTypes.string,
};

export default HomeFloatButton;