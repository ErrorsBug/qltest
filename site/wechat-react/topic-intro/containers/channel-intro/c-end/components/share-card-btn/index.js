import React from 'react';
import PropTypes from 'prop-types';

const ShareCardBtn = props => {
    const icon = props.theme === 'type1' ? require('../../../img/horn.png') :
                 props.theme === 'type2' ? require('../../../img/sharecard.png') : ''

    return (
        <div className={'share-card-btn-container action'} onClick={props.onClick}>
            <span className='share-card-icon-wrap'>
                <img src={ icon } alt=""/>
            </span>
            <div className="share-card-label-wrap">
                <span className='share-card-label'>{ props.label }</span>
            </div>
        </div>
    );
};

ShareCardBtn.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    theme: PropTypes.oneOf(['type1', 'type2']),
    doAnimate: PropTypes.bool.isRequired,
};

ShareCardBtn.defaultProps = {
    label: '',
    onClick: () => {},
    theme: 'type1',
    doAnimate: false,
}

export default ShareCardBtn;
