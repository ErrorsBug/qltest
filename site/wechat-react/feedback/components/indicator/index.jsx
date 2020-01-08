import * as React from "react";
class Indicator extends React.PureComponent {
    render() {
        return (<div className={'indicator ' + this.props.className}>
                {this.props.count > this.props.maxCountDisplay
            ? this.props.maxCountDisplay + "+"
            : this.props.count}
            </div>);
    }
}
Indicator.defaultProps = {
    className: '',
    count: 0,
    maxCountDisplay: 99
};
export { Indicator };
