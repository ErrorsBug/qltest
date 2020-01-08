import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'components/switch'

const BASE_ADMIN_FUNCS = ["course_table", "vip", "whisper_question", "introduce"];

function getMenuItemImg(code) {
    let img;
    switch(code){
        case "introduce":
            img = "introduction"
            break;
        case "whisper_question":
            img = "question"
            break;
        case "vip":
            img = "member"
            break;
        case "course_table":
            img = "timetable"
            break;
        default:
            img = code;
    }
    return `https://img.qlchat.com/qlLive/liveCommon/moduleIcon/icon-${img}.png`;
}


const functionMenu = props => {
    const filterSwitches = props.switches;
    return (
        <section className='option-list'>
            <header>功能入口</header>
            <ul className='switch-list'>
                {
                    filterSwitches.map((item, index) => {
                        return <li key={`switches-${index}`}>
                            {
                                item.icon?
                                <img src={item.icon}/>
                                :
                                <img src={getMenuItemImg(item.code)}/>
                            }
                            <span>{item.name}</span>
                            <Switch
                                active={item.isShow==='Y'}
                                size='md'
                                onChange={() => { props.onSwitchesChange(item.code) }}
                                className='switch'
                            />
                        </li>
                    })
                }
            </ul>
            <footer className='to-be-continue'>更多功能入口持续开放，敬请期待...</footer>
        </section>
    );
};

functionMenu.propTypes = {
    
};

export default functionMenu;