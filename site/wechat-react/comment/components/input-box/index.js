import React from 'react';



export default class InputBox extends React.Component {
    constructor(props) {
        super(props);
        props.initialValue && (this.state.value = props.initialValue);
    }

    state = {
        value: '',
    }

    render() {
        const { value } = this.state;

        return <div className="comment-input-box" onClick={this.onClickMask} ref={r => this.bgDom = r}>
            <div className="input-wrap">
                <div className="input-bg">
                    <input type="text"
                        autoFocus="autofocus"
                        value={value}
                        onChange={this.onChange}
                        placeholder={this.props.placeholder}
                    />
                </div>
                <div className={`btn-send${value ? ' active' : ''}`} onClick={this.onClickSend}>发送</div>
            </div>
        </div>
    }

    onClickSend = () => {
        if (!this.state.value) return;
        typeof this.props.onSend === 'function' && this.props.onSend(this.state.value);
    }

    onChange = e => {
        this.setState({value: e.target.value});
    }

    onClickMask = e => {
        if (e.target === this.bgDom) {
            typeof this.props.onBlur === 'function' && this.props.onBlur();
        }
    }
}