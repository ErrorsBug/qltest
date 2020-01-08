import React from 'react';
import PropTypes from 'prop-types';

const SelectIcon = ({active = false}) => {
    return (
        active ? 
            <img src={ require('../../img/selected.png') } alt="" />
            :
            <img src={ require('../../img/noselect.png') } alt="" />
    );
};

SelectIcon.propTypes = {
    active: PropTypes.bool,
};

export default SelectIcon;