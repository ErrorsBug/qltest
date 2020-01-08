import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { debounce } from 'core-decorators';
import { loadavg } from 'os';

export class OperComponent extends Component {
    static propTypes = {

    }

    render() {
        return (
            <div>
                operation
            </div>
        )
    }
}

const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps)(OperComponent)
