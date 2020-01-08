import React, { Component } from 'react';
import PropTypes from 'prop-types';

class EndRateRound extends Component {
    get rotate(){
        let rotate = this.props.rate/100*360;
        if(rotate>180){
            rotate = rotate - 180;
        }
        return rotate
    }
    get activeColor(){
        let color = this.props.rate > 50? (this.props.bgColor || '#BBBBBB') : (this.props.activeColor || '#fff');
        return color
    }

    render() {
        return (
            <div className="round-wrap" style={{borderColor: `${this.props.bgColor || '#BBBBBB'}`}}>
                <div className="center" style={{background: this.props.bgColor || '#BBBBBB'}}></div>
                <div className="left" style={{background: this.props.activeColor || '#fff'}}></div>
                <div className="right" style={{background: this.activeColor, transform: `rotateZ(${this.rotate}deg)`}}></div>
            </div>
        );
    }
}

EndRateRound.propTypes = {

};

export default EndRateRound;