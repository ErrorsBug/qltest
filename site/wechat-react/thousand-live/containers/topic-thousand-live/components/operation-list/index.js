import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class OperationList extends PureComponent {
    render() {
        return (
            <ul className="operation-list">
                <li className="up icon_up_3 on-log"
                    onClick={this.props.loadFirstMsg}
                    data-log-region="operation-menu"
                    data-log-pos="up-btn"
                    ></li>
                <li className="down icon_down_3 on-log"
                    onClick={this.props.loadLastMsg}
                    data-log-region="operation-menu"
                    data-log-pos="down-btn"
                    ></li>
                {
                    this.props.allowSpeak ?
                    <li className="opt-button on-log"
                        onClick={this.props.showControlDialog}
                        data-log-region="operation-menu"
                        data-log-pos="opt-btn"
                        data-log-name="操作"
                        >操作</li> :
                    null
                }
            </ul>
        );
    }
}

OperationList.propTypes = {

};

export default OperationList;
