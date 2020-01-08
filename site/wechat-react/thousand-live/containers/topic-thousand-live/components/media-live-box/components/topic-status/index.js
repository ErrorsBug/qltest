import React from 'react';

const TopicStatus = (props) => {
    return (
        <span className={`status ${props.conversion ? 'conversion' : props.liveStatus}`}>
            {
                props.liveStatus == 'beginning'?
                    props.pushLiveStatus ==  1?          
                    <svg version="1.1" id="Layer_1" x="0px" y="0px"
                        width="22px" height="20px" viewBox="0 0 24 24" >
                        <rect x="0" y="0" width="5" height="7" fill="#fff">
                        <animateTransform  attributeType="xml"
                            attributeName="transform" type="scale"
                            values="1,1; 1,3; 1,1"
                            begin="0s" dur="0.8s" repeatCount="indefinite" />       
                        </rect>

                        <rect x="9" y="0" width="5" height="7" fill="#fff">
                        <animateTransform  attributeType="xml"
                            attributeName="transform" type="scale"
                            values="1,1; 1,3; 1,1"
                            begin="0.2s" dur="0.8s" repeatCount="indefinite" />       
                        </rect>
                        <rect x="18" y="0" width="5" height="7" fill="#fff">
                        <animateTransform  attributeType="xml"
                            attributeName="transform" type="scale"
                            values="1,1; 1,3; 1,1"
                            begin="0.4s" dur="0.8s" repeatCount="indefinite" />       
                        </rect>
                    </svg>
                    :            
                    <svg version="1.1" id="Layer_1" x="0px" y="0px"
                        width="22px" height="20px" viewBox="0 0 24 24" >
                        <rect x="0" y="0" width="5" height="12" fill="#fff">
                        </rect>
                        <rect x="9" y="0" width="5" height="22" fill="#fff">
                        </rect>
                        <rect x="18" y="0" width="5" height="17" fill="#fff">
                        </rect>
                    </svg>  
                :null    
            }
        </span>
    );
};

export default TopicStatus;


