import React, { Component } from 'react'
import { createPortal } from 'react-dom'
import classnames from 'classnames'

export default class extends Component{
    render() {
        const { children, className, parentNode, onClick } = this.props;
        const cls = classnames('protal-box', className);
        const node = document.querySelector(`${ parentNode || '.portal-high' }`);
        if( !node ) return null;
        return createPortal(
            <div className={ cls } onClick={ (e) => { 
                onClick && onClick(e) } }>{ children }</div>,
            node
        )
    }
}
