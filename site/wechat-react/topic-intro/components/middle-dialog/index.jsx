import * as React from "react";
import classnames from "classnames";
export class MiddleDialog extends React.Component {
    constructor(props) {
        super(props);
        this.onClose = () => {
            this.props.onClose();
        };
        this.state = {
            visible: props.show
        };
    }
    componentDidMount() { }
    render() {
        if (!this.props.show) {
            return null;
        }
        return (<div className="middle-dialog-wrap_FASDF">
                <div className="middle-dialog_FASDF" onClick={this.onClose}>
                    <div className={classnames("middle-dialog-wrap", this.props.className)} onClick={e => {
            e.stopPropagation();
        }}>
                        {this.props.children}
                    </div>
                </div>
            </div>);
    }
}
MiddleDialog.defaultProps = {
    className: "",
    show: false,
    onClose: () => { }
};
