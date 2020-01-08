import React from 'react';
import { setLocalStorage, getLocalStorage } from 'components/util';
import { collectVisible } from 'components/collect-visible';


export default class WinAppDiversion extends React.Component {
    render() {
        return <div className="win-app-diversion">
            <div className="bg"></div>
            <div className="entity-wrap">
                <div className="block">
                    <div className="icon_cancel" onClick={this.props.onClickClose}></div>
                </div>
                <div className="entity on-log on-visible"
                    data-log-region="app-diversion-img"
                    data-log-pos={this.props.activity.id}
                    onClick={this.props.onClickImg}
                    style={{backgroundImage: `url(${this.props.activity.h5BoxImage})`}}   
                ></div>
                <div className="block"></div>
            </div>
        </div>
    }

    componentDidMount() {
        collectVisible();
    }

    static ifCanShow = function (id) {
        const ls = getLs(id);
        if (ls.closeTimes > 5) return false;
        if (Date.now() - ls.lastCloseTime < 43200000) return false;
        return true;
    }

    static handleClose = function (id) {
        const ls = getLs(id);
        ls.closeTimes++;
        ls.lastCloseTime = Date.now();
        setLocalStorage(getLsKey(id), ls);
    }
}



function getLsKey(id) {
    return `NO_WIN_APP_DRIVERSION_${id}`;
}


function getLs(id) {
    const ls = getLocalStorage(getLsKey(id)) || {};
    ls.closeTimes >= 0 || (ls.closeTimes = 0);
    ls.lastCloseTime >= 0 || (ls.lastCloseTime = 0);
    return ls;
}

