import React, { Component } from 'react';
import VipDetailsCustom from './vip-details-custom'; 
import VipDetailsGeneral from './vip-details-general'; 


module.exports = function VipDetails(props) {
    if (props.location.query.id) {
        return <VipDetailsCustom {...props}/>
    } else {
        return <VipDetailsGeneral {...props}/>
    }
};