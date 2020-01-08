import React from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import CourseItem from './course-item'

import {
    formatMoney,
    digitFormat,
    locationTo,
    imgUrlFormat,
} from 'components/util';

const Courses = props => {
    return (
        <ul className='topics'>
            {
                props.list.map((item, index) => {
                    return <CourseItem
                            index={index}
                            key={`course-item-${index}`}
                            data={item}
                            {...item}
                            config={props.config}
                            timeNow={props.timeNow}
                            power={props.power}
                        />
                })
            }
        </ul>
    );
};

function mstp(state) {
    return {
        timeNow: state.common.sysTime,
        power: state.live.power,
    }
}

const matp = {

}


export default connect(mstp, matp)(Courses)
