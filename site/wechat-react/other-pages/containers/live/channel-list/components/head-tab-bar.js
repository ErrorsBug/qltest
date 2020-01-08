import React from 'react';
import PropTypes from 'prop-types';

const TabBar = props => {
    return (
        <div className='channel-tab-bar'>
            <ul>
                <li key={`tab-item-${0}`}
                    onClick={props.onChangeTab.bind(this, '0')} 
                    className={`${props.activeTab == 0 ? 'active' : ''}`} >
                    
                    全部
                </li>
                {
                    props.tabItem.map((item, index) => 
                        <li key={`tab-item-${item.id}`}
                            onClick={props.onChangeTab.bind(this, item.id)} 
                            className={`${props.activeTab == item.id ? 'active' : ''}`} >
                            
                            { item.name }
                        </li>
                    )
                }
            </ul>
        </div>
    );
};

TabBar.propTypes = {
    tabItem: PropTypes.array.isRequired,

    onChangeTab: PropTypes.func,

    activeTab: PropTypes.string,
};

export default TabBar;