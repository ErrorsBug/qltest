import React from "react";

class TryListenBtn extends React.Component {
    render() {
        return (
            <div
                className={"try-listen-btn_FETGS on-log" + this.props.className}
                data-log-region="play-btn"
                data-log-pos="2"
                onClick={() => {
                    location.href = `/topic/details?topicId=${
                        this.props.auditionOpenCourse.id
                    }`;
                }}
            >
                <img src={require("./icon-play.png")} />
                <span>试听</span>
            </div>
        );
    }

    static defaultProps = {
        className: ""
    };
}

export default TryListenBtn;
