import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DownloadSoftware extends Component {
    state = {
        showBox:false,
    }
    componentDidMount() {
        if (!sessionStorage.getItem('hideDown')) {
            this.setState({
                showBox:true,
            })
        }
    }
    

    closeBox=()=>{
        this.setState({
            showBox:false
        })
        sessionStorage.setItem('hideDown','Y')
    }

    render() {
        if (!this.state.showBox) {
            return null;
        }
        return (
            <div className='download-live-software'>
                <div className="img-box">
                    <img src={require('./img/bg-download.png')} />
                </div>    
                <div className="btn-close" onClick={this.closeBox}></div>
            </div>
        );
    }
}

DownloadSoftware.propTypes = {

};

export default DownloadSoftware;