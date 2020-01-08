import React from 'react';
import PortalCom from '../../../../components/portal-com';

export default function ShadowLayout({ onClick }) {
    return <PortalCom parentNode=".scroll-content-container" className="un-shadow-box" onClick={ onClick }></PortalCom>
}