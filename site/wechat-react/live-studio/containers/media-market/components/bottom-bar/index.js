import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class BottomBar extends Component {
    static propTypes = {
        barList: PropTypes.array,
        activeTab: PropTypes.string,
        onChange: PropTypes.func,
    }

    static defaultProps = {
        barList: [],
        activeTab: '',
        onChange: () => {}
    }

    constructor(props) {
        super(props)
    }
    
    onClick(tab) {
        this.props.onChange(tab.id);
    }

    render() {
        return (
            <div className="bottom-bar">
                {
                    this.props.barList.map(tab => {
                        const isActive = tab.id === this.props.activeTab;

                        return (
                            <div key={tab.id} className="info" onClick={() => this.onClick(tab)}>
                                <div className={`icon-bottom ${isActive ? tab.activeIcon : tab.icon}`}></div>
                                <div className={`title ${isActive ? 'active' : ''}`}>{tab.title}</div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}
