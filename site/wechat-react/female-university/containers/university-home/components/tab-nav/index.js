import React from 'react';
import { locationTo } from 'components/util';

const TabNav = ({ iconList, btm }) => {
    return (
        <ul className="uni-tab-nav" style={{marginBottom: `${ Number(btm || 48) / 78 }rem`  }}>
            { iconList.slice(0,4).map((item, index) => (
                <li 
                    data-log-name={ item.keyA }
                    data-log-region="uni-home-tab"
                    data-log-pos={ index }
                    className="on-log on-visible" 
                    key={ index } 
                    onClick={ () => { item.keyC && locationTo(item.keyC) } }>
                    <img src={ item.keyB } alt=""/>
                    <span>{ item.keyA }</span>
                </li>
            )) }
        </ul>
    )
}

export default TabNav