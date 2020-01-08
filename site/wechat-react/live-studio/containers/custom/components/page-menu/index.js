import React from 'react';
import PropTypes from 'prop-types';
import { locationTo } from '../../../../../components/util';

const PageMenu = props => {
    return (
        <section className='option-list'>
            <header>页面排版{props.isLiveAdmin === 'N' && <div className="base-warning" onClick={() => locationTo(`/topic/live-studio-intro?liveId=${props.liveId}`)}>专业版可调整顺序，立即升级<i className="arrow-icon"><img src={require('../../img/red-arrow.png')} alt=""/></i></div>}</header>
            <ul className='order-list'>
                {
                    props.menu.map((item, index) => {
                        return <li key={`order-${index}`}>
                            <div className="title">
                                <span className="name">{item.name}</span>
                                <span className="edit" onClick={() => { props.onEditClick(index, item.name)}}>点击可修改名称</span>
                            </div>
                            <div className={`order ${props.disabled ? "disabled" : ""}`}>
                                <span className="up" onClick={() => { props.onOrderChange(index, true) }}>上移</span>
                                <span className="down" onClick={() => { props.onOrderChange(index, false) }}>下移</span>
                            </div>
                        </li>
                    })
                }
            </ul>
        </section>
    );
};

PageMenu.propTypes = {

};

export default PageMenu;
