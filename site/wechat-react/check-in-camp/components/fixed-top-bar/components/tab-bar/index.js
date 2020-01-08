import React, { Component } from 'react';
import { autobind } from 'core-decorators';

@autobind
export default class TabBar extends Component {
    constructor(props) {
        super(props)
    }
    

    render() {
        return (
            <div className={`component-tab-bar ${this.props.className} ${this.props.hide ? 'component-tab-bar-hide' : ''} `}>
                {
                    this.props.tabList.map(tab => {
                        const isActive = tab.type === this.props.activeTabType
                        return (
                            <div 
                                id={tab.type}
                                className={`component-tab-item ${isActive ? 'component-active-tab-item' : '' }`} 
                                key={tab.type}
                                onClick={(e) => this.props.onTabClick(e, tab.type)}
                            >
                                {tab.title}    
                            </div>
                        )
                    })
                }
                <div className="active-line" style={{width:this.props.activeLineWidth, left: this.props.activeLineLeft}}></div>
            </div>
        )
    }
}

