import React, { useState } from 'react';

const navs = [  '粉丝','关注' ]

function Header({ switchNav, focusNum, fansNum, tabIdx }) {
    return (
        <div className="fan-nav-box">
            { navs.map((item, index) => (
                <div 
                    key={ index } 
                    data-log-name={ "关注粉丝" }
                    data-log-region={"un-community-fan-nav"}
                    data-log-pos={ index } 
                    className={ `on-log on-visible fan-nav-item ${ index === tabIdx ? 'action' : '' }` }
                    onClick={ () => {
                        if(index !== tabIdx){
                            switchNav(index)
                        }
                    } }
                    >
                    <span>{ item } { index == 1 ? focusNum : fansNum }</span>
                </div>
            )) }
        </div>
    )
}

export default  Header