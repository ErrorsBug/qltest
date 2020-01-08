import React from 'react';
import PropTypes from 'prop-types';
import FileInput from 'components/file-input';

const MediaItem = props => {
    return (
        <div className={`media-item on-log${props.onVisible ? ' on-visible' : ''}`}
            onClick={props.upload ? () => {} : props.onClick}
            data-log-region={props.logRegion || "media-menu"}
            data-log-pos={props.logPos || "media-item"}
            data-log-name={props.label}
            >
            <span className={props.icon + ' media-icon'}>
                {
                    props.children
                }
            </span>
            <span className='media-label'>{props.label}</span>
            {
                props.upload &&
                    <div className='media-file-uploader'>
                        <FileInput
                            className='media-file-input'
                            onChange={props.onClick}
                            {...props.uploadOptions}
                        />
                    </div>
            }
        </div>
    );
};

MediaItem.propTypes = {
    icon: PropTypes.string,
    label: PropTypes.string,
    onClick: PropTypes.func,
    upload: PropTypes.bool,
    uploadOptions: PropTypes.object,
};

export default MediaItem;
