import * as React from "react";

class Indicator extends React.PureComponent<
    {
        className?: string;
        count: Number;
        maxCountDisplay?: Number;
    },
    {}
> {
    render() {
        return (
            <div className={'indicator ' + this.props.className}>
                {this.props.count > this.props.maxCountDisplay
                    ? this.props.maxCountDisplay + "+"
                    : this.props.count}
            </div>
        );
    }

    static defaultProps = {
        className: '',
        count: 0,
        maxCountDisplay: 99
    };
}

export { Indicator };
