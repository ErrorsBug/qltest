import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * 用react16的形式重写了react-file-input这个包
 */
class FileInput extends Component {

    state = {
        value: '',
        styles: {
            parent: {
                position: 'relative'
            },
            file: {
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: 0,
                width: '100%',
                zIndex: 1
            },
            text: {
                position: 'relative',
                zIndex: -1
            }
        }
    }

    handleChange(e) {
        if (this.props.onChange) this.props.onChange(e);
        this.setState({
            value: e.target.value.split(/(\\|\/)/g).pop()
        });
    }

    render() {
        return (
            <div className="file-input-container" style={ this.state.styles.parent }>
                <input 
                    type = "file" 
                    name = { this.props.name } 
                    className = { this.props.className } 
                    onChange = { this.handleChange.bind(this) }
                    disabled = { this.props.disabled }
                    accept = { this.props.accept }
                    multiple = { this.props.multiple }
                    style = { this.state.styles.file }
                    />

                <input 
                    type = "text"
                    tabIndex = { -1 }
                    name = { this.props.name + '_filename' }
                    value = { this.state.value }
                    className = { this.props.className }
                    onChange = { () => {} }
                    placeholder = { this.props.placeholder }
                    disabled = { this.props.disabled }
                    style = { this.state.styles.text }
                    />
            </div>
        );
    }
}

FileInput.propTypes = {

};

export default FileInput;