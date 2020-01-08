import React, { Component } from 'react';
import PropTypes from 'prop-types';
import errorCatch from 'components/error-boundary'


function BuyButton({ onClick = () => {} }) {
    return (
        <div className="buy-button on-log on-visible" onClick={onClick} data-log-region="audition" data-log-pos="buy">
            购买专辑
        </div>
    );
}

function InviteButton({ count = 0, total = 0, onClick = () => {} }) {
    return (
        <div className="invite-button on-log on-visible" onClick={onClick} data-log-region="audition" data-log-pos="share">
            邀请{count}/{total}
        </div>
    );
}

@errorCatch()
class TryListenStatusBar extends Component {

    
    componentDidUpdate(preProps, preStates) {
        if (preProps && preProps.total !== this.props.total) {
            typeof _qla != 'undefined' && _qla.collectVisible();
        }
    }
    
    render() {

        let {
            count = 0,
            total = 0,
            onClick = () => { }
        } = this.props;

        if (!count && !total) return null
        return (
            <div className="try-listen-status-bar">
                <div className="content">
                    <img
                        className="icon-playing"
                        src={require("./assets/icon-playing.svg")}
                    />
                    <span>
                        {count < total
                            ? `试听中，邀${total}位好友免费听下一课`
                            : "试听中，收听完整专辑"}
                    </span>
                </div>
                {count < total ? (
                    <InviteButton count={count} total={total} onClick={onClick} />
                ) : (
                    <BuyButton onClick={onClick} />
                )}
            </div>
        );
    }
}

TryListenStatusBar.propTypes = {

};

export default TryListenStatusBar;



