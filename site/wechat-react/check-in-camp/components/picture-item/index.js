import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getVal } from 'components/util';
import { autobind } from 'core-decorators';

@autobind
export class PictureItem extends Component {
    static propTypes = {
       
    }

    render() {
        return (
            <div className="components-picture-item-container">
                
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(PictureItem)
