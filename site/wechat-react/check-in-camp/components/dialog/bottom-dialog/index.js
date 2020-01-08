import React, { Component, Fragment } from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

@autobind
export default class BottomDialog extends Component {
    static propTypes = {
        show: PropTypes.bool.isRequired,
        showCloseBtn: PropTypes.bool,
        className: PropTypes.string,
    }

    
    onClose(e) {
        this.props.onClose();
    }

    render() {
        if (typeof document == 'undefined') {
            return null;
        }
        const portalBody = document.querySelector(".portal-high");
        if (!portalBody) return null

        return (
            <Fragment>
                {
                    ReactDOM.createPortal(
                        <ReactCSSTransitionGroup
                            transitionName="component-dialog-background"
                            transitionEnterTimeout={300}
                            transitionLeaveTimeout={300}
                        >
                            {
                                this.props.show ? 
                                <div 
                                    className="component-dialog-bg"
                                    onClick={this.onClose}
                                /> :
                                null
                            }
                        </ReactCSSTransitionGroup>,
                    portalBody)
                }
                {
                    ReactDOM.createPortal(
                        <ReactCSSTransitionGroup
                            transitionName="component-bottom-dialog-content"
                            transitionEnterTimeout={300}
                            transitionLeaveTimeout={300}
                        >  
                            {
                                this.props.show ?
                                <div className={`component-bottom-dialog-content ${this.props.className}`}>
                                    <div className="main-content">
                                        {this.props.children}
                                    </div>
                                    { 
                                        this.props.showCloseBtn ?
                                        <div className="close-btn" onClick={this.onClose}>取消</div> :
                                        null
                                    }
                                </div> :
                                null
                            }
                        </ReactCSSTransitionGroup>,
                    portalBody)
                }
            </Fragment>
        )
    }
}
