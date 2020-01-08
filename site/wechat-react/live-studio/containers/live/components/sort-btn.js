import React from 'react';

export default ({onClick, region}) => {
    return <div className="live-main-sort-btn on-log on-visible" data-log-region={region} onClick={onClick}>
        <div className="">课程排序</div>
        <div className="sort-btn">
            <img src={require('../img/sort.png')} alt=""/>
        </div>
    </div>
}