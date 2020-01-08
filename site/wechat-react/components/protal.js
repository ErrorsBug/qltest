import React from 'react';
import { createPortal } from 'react-dom';



export default class Protal extends React.Component {
    componentDidMount() {
        let wrap = this.props.getWrap && this.props.getWrap() || document.querySelector('#app>div') || document.body;
        if (wrap) {
            const container = document.createElement('div');
            wrap.appendChild(container);
            this._container = container;
            this.forceUpdate();
        }
    }

    componentWillUnmount() {
        this._container && this._container.remove();
    }

    render() {
        if (this._container) {
            return createPortal(this.props.children, this._container);
        }
        return null;
    }
}
