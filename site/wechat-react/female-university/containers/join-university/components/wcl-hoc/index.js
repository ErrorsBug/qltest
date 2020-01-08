import React, { Component } from 'react'
import { getUrlParams, fillParams } from 'components/url-utils';

const WCLHoc = (WrappedComponent) => {
    return class extends Component {
        get urlData(){
            return getUrlParams('', '')
        }
        componentDidMount() {
            const urlData = sessionStorage.getItem('urlData')
            let arr = Object.keys(this.urlData);
            if(!!arr.length){
                sessionStorage.setItem('urlData', JSON.stringify(this.urlData))
            }
        }
        render() {
            return (
                <WrappedComponent { ...this.props } />
            )
        }
    }
}

export default WCLHoc