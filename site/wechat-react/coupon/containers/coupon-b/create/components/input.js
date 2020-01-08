import React, {PureComponent} from 'react';

export default class Input extends React.Component {
    static defaultProps = {
        value: '',
        onChange: () => {},
        placeholder: '',
        className: '',
        type: 'text'
    }

    state = {
        placeholder: this.props.placeholder
    }

    emptyPlaceholder = () => {
        this.setState({
            placeholder: ''
        })
    }

    setPlaceholder = () => {
        if (!this.refs.value) {
            this.setState({
                placeholder: this.props.placeholder
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.placeholder !== this.state.placeholder) {
            this.setState({
                placeholder: nextProps.placeholder
            })
        }
    }

    render () {
        let {className, value, onChange, type} = this.props;
        let {placeholder} = this.state;
        return (
            <input className={className} refs={(input) => {
                this.refs = input.value
            }} type={type} placeholder={placeholder} defaultValue={value} onChange={onChange} onFocus={this.emptyPlaceholder} onBlur={this.setPlaceholder}/>
        )
    }
}