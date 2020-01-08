import React from 'react';

class Switch extends React.PureComponent {
    onClick = () => {
        this.props.onClick(!this.props.status);
    };
    render() {
        let { status } = this.props;
        return (
            <div className={'switch_RIERI ' + (status ? 'switch-on_RIERI' : '')} onClick={this.onClick}>
                <div className="radius_RIERI" />
            </div>
        );
    }
}
export { Switch };
