import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Redpoint extends Component {

    state={
        newPointList:{},
    }
    componentDidMount() {
        this.cheakNewPoint();
    }

    removeRedPoint(pointNpval,isNotLocalstorage){
        if(isNotLocalstorage!="Y"){ // 这个值标识做不做缓存，值为'Y'则做缓存，红点消失。否则红点一直保留 
            if(!this.state.newPointList[pointNpval]){
                this.state.newPointList[pointNpval] = new Date().getTime();
                localStorage.setItem('newPointList', JSON.stringify(this.state.newPointList));
            };
            this.cheakNewPoint();
        }
        
    }
    cheakNewPoint(){
        try{
            if (localStorage.getItem('newPointList')) {
                this.setState({
                    newPointList :JSON.parse(localStorage['newPointList']),
                });
                
            };
        }catch(e){
        };

    }

    render() {
        
        var {pointContent,pointWrapStyle,pointStyle,pointBtnStyle,pointNpval,isNotLocalstorage}=this.props;
        //,pointWidth,pointHeight,pointLeft,pointTop

        if(pointNpval&&this.state.newPointList[pointNpval]){
             return null;
        }else{
            return (
                <div className={`wrap ${pointWrapStyle||"redpoint-wrap"}`}>
                    <div className={`redpointNormal ${pointStyle||"redpoint"}`}>{pointContent}</div>
                    <b className={`background ${pointBtnStyle||"red-btn-background"}`} onClick={()=>{this.removeRedPoint(pointNpval,isNotLocalstorage)}}>
                    { this.props.children }
                    </b>
                </div>
            );
        };
    }
}

Redpoint.propTypes = {
    pointWrapStyle: PropTypes.string,
    pointContent: PropTypes.string,
    pointStyle: PropTypes.string,
    pointBtnStyle: PropTypes.string,
    pointNpval: PropTypes.string, // 缓存的key
    isNotLocalstorage: PropTypes.string // 这个值标识是否做缓存，值为'Y'则做缓存，红点消失。否则红点一直保留 
};

export default Redpoint;