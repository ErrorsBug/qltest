import React from 'react';
import Picture from 'ql-react-picture';
import { locationTo } from 'components/util';

const CollegaList = ({ academyList, btm }) => {
    return (
        <div className="un-collega-box" style={{marginBottom: `${ Number(btm || 48) / 78 }rem`  }}>
            { academyList.map((item, index) => (
                <div 
                    data-log-name={ item.title }
                    data-log-region="un-college-item"
                    data-log-pos={ index }
                    onClick={ () => locationTo(`/wechat/page/university/college-detail?nodeCode=${ item.nodeCode }`) } 
                    key={ index }
                    className="un-collega-item flex-col-3 on-log on-visible">
                    <img src={ item.keyA } />
                </div>
            )) }
        </div>
    )
}

export default CollegaList