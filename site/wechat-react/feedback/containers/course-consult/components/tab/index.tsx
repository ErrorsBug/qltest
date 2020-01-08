import * as React from "react";
import { Indicator } from "../../../../components/indicator"

class Tab extends React.Component<
    {
        current: "channel" | "topic";
        onSwitch: (key: string) => void;
        channelCount?: Number;
        topicCount?: Number;
    },
    {
        onSwitch: (e: Event) => void;
    }
> {
    onSwitch = e => {
        let { key } = e.currentTarget.dataset;
        this.props.onSwitch(key);
    };
    render() {
        return (
            <div className="tab-container">
                <div
                    className="tab-unit"
                    onClick={this.onSwitch}
                    data-key="channel"
                >
                    <div className="tab-unit-inner">
                        <span
                            className={
                                "text " +
                                (this.props.current == "channel"
                                    ? "text-active"
                                    : "")
                            }
                        >
                            系列课
                            {this.props.current == "channel" ? (
                                <div className="active" />
                            ) : null}
                        </span>
                        {this.props.channelCount ? (
                            <Indicator
                                className="indicator-wrap"
                                count={this.props.channelCount}
                            />
                        ) : null}
                    </div>
                </div>
                <div
                    className="tab-unit"
                    onClick={this.onSwitch}
                    data-key="topic"
                >
                    <div className="tab-unit-inner">
                        <span
                            className={
                                "text " +
                                (this.props.current == "topic"
                                    ? "text-active"
                                    : "")
                            }
                        >
                            单课
                            {this.props.current == "topic" ? (
                                <div className="active" />
                            ) : null}
                        </span>
                        {this.props.topicCount ? (
                            <Indicator
                                className="indicator-wrap"
                                count={this.props.topicCount}
                            />
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }

    static defaultProps = {
        current: "channel",
        onSwitch: () => {},
        channelCount: 0,
        topicCount: 0
    };
}

export { Tab };
