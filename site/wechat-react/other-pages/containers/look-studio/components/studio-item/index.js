import React from 'react'
import { locationTo } from 'components/util';

const StudioItem = ({ logo, name, introduce, id }) => (
    <div className="sudio-item" onClick={ () => locationTo(`/wechat/page/live/${ id }`) } >
        <div className="sudio-item-pic">
            <img src={ logo } />
        </div>
        <div className="sudio-item-g">
            <div>
                <h4>{ name }</h4>
                <p>{ introduce }</p>
            </div>
        </div>
    </div>
)

export default StudioItem;