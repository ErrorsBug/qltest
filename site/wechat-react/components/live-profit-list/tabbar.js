import React from 'react';
import PropTypes from 'prop-types';

function ProfitListTabbar(props) {
    return (
        <ul className="co-profit-list-tabbar">
            {
                props.tabs.map((tab, index) => {
                    return <li
                        key={index}
                        className={tab.value === props.active ? "active" : ""}
                        onClick={() => { props.onTabClick(tab.value) }}
                    >
                        <span>{tab.text}</span>
                    </li>
                })
            }
        </ul>
    );
};

ProfitListTabbar.propTypes = {
    tabs: PropTypes.array.isRequired,
    onTabClick: PropTypes.func.isRequired,
    active: PropTypes.string.isRequired,
};

export default ProfitListTabbar;