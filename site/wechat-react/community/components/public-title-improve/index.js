import React  from 'react'
import classnames from 'classnames'

const PublicTitleImprove = ({ className='', region ,title ,url, moreTxt, decs, handleMoreLink }) => {
    return (
        <div className={ classnames('public-title-improve',className) }>
            <div className="public-title-head">
                <h3>{ url ? <img src={ url }/> : title }</h3>
                { moreTxt && <div className="go-more-list on-log on-visible" 
                    data-log-name={ title }
                    data-log-region={ region }
                    data-log-pos="0"
                    onClick={ handleMoreLink }>{ moreTxt }</div> }
            </div>
            { decs && <div className="public-title-decs">{ decs }</div> }
        </div>
    )
}

export default PublicTitleImprove