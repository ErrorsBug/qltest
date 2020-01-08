import * as React from "react";
import { formatDate } from "../../../components/util";
import { Indicator } from "../indicator";
class Card extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            textEllipsis: true,
            visibility: false
        };
    }
    componentDidMount() {
        setTimeout(() => {
            let ele = document.querySelector(".right-area .title");
            if (ele.scrollHeight <= ele.clientHeight) {
                this.setState({
                    textEllipsis: false
                });
            }
            this.setState({
                visibility: true
            });
        }, 0);
    }
    componentDidUpdate() {
        let ele = document.querySelector(".right-area .title");
        if (ele.scrollHeight <= ele.clientHeight) {
            this.setState({
                textEllipsis: false
            });
        }
        else {
            this.setState({
                textEllipsis: true
            });
        }
    }
    render() {
        return (<div className={"course-consult-card " + this.props.className} onClick={this.props.onClick} data-log-region={this.props.dataLogRegion} data-log-pos={this.props.dataLogPos} isVisible={this.props.dataLogVisible}>
                <div className="course-consult-card-inner">
                    <div className="left-area">
                        <div className="img" style={{
            backgroundImage: `url(${this.props.headImage})`
        }}/>
                    </div>
                    <div className="right-area">
                        <div className="title">
                            {this.props.name}
                            {this.state.textEllipsis ? (<div className="overflow-dot">···</div>) : null}
                        </div>
                        <div className="date">
                            {formatDate(this.props.beginTime, "yyyy-MM-dd hh:mm")}
                        </div>
                    </div>
                    {this.props.count ? (<div className="indicator-wrap">
                            <Indicator count={this.props.count}/>
                        </div>) : this.props.count == 0 ? (<div className="indicator-wrap">
                            <span className="no-new-consult">暂无新留言</span>
                        </div>) : null}
                </div>
            </div>);
    }
}
Card.defaultProps = {
    className: '',
    headImage: ''
};
export { Card };
