import * as React from "react";

/**
 * 用于分销推广页面（topic-distribution-set）拉人返现和自动分销的选择
 */
class DownCard extends React.Component<{
    className?: string;
    selected?: boolean;
    title: string;
    info: string;
    onClick(): void;
}> {
    state = {
        show: false
    };

    render() {
        return (
            <div className={"down-card_FGET " + this.props.className}>
                <div className="down-card-header" onClick={this.props.onClick}>
                    <div>
                        <div
                            className={
                                (this.props.selected ? "selected " : "") +
                                "circle-dot "
                            }
                            onClick={this.props.onClick}
                        >
                            {this.props.selected ? (
                                <img
                                    src={require("./assets/right.svg")}
                                    style={{
                                        width: "100%",
                                        height: "100%"
                                    }}
                                />
                            ) : null}
                        </div>
                        <div className="down-card-title">
                            {this.props.title}
                        </div>
                    </div>
                    <div className="down-card-info">{this.props.info}</div>
                    <img
                        className="arrow-img"
                        src={require("./assets/arrow.svg")}
                        style={{
                            transition: "transform 0.1s linear 0s",
                            transform: this.props.selected
                                ? `rotate(90deg)`
                                : ""
                        }}
                    />
                </div>
                {this.props.selected ? (
                    <div className="down-card-body">{this.props.children}</div>
                ) : null}
            </div>
        );
    }
}

export default DownCard;
