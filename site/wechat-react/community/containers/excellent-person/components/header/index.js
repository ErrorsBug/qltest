import React from 'react'
import { locationTo,getCookie } from 'components/util';

function Header(props) {
    return (
        <div className="ct-person-header" onClick={() => {props.headImgUrl && locationTo(props.headImgUrl)}}>
            <img src={ props.headImg }/>
        </div>
    )
}

export default Header