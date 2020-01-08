import React, {Component} from 'react';
import PropTypes from 'prop-types';

class PageNotFound extends Component {
    render() {
        return (
            <div>
                页面没有找到
            </div>
        );
    }
}

PageNotFound.propTypes = {
    msg: PropTypes.string,
};

export default PageNotFound;
