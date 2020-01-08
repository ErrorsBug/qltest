import React from 'react';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Protal from 'components/protal';




export default class SlideInFromBottom extends React.Component {
    static propTypes = {
        in: PropTypes.bool,
        onClickBg: PropTypes.func,
    }

    static defaultProps = {
        enterTimeout: 300,
        exitTimeout: 200,
    }

    state = {
        in: false,
        renderContent: false,
    }

    _in = false

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.in !== undefined) {
            const nextIn = !!nextProps.in;
            if (nextIn != this._in) {
                this._in = nextIn;
                this.toggleDisplay(nextIn);
            }
        }
    }

    toggleDisplay = bool => {
        if (bool) {
            this.setState({
                renderContent: true
            }, () => {
                setTimeout(() => {
                    this.setState({
                        in: true,
                    })
                })
            });
        } else {
            this.setState({
                in: false
            });
        }
    }

    render() {
        if (!this.state.renderContent) return false;

        const tranTime = (this.state.in ? this.props.enterTimeout : this.props.exitTimeout) / 1000;

        return <Protal>
            <CSSTransition
                in={this.state.in}
                classNames="slide-in-from-bottom"
                timeout={{enter: this.props.enterTimeout, exit: this.props.exitTimeout}}
                unmountOnExit
                onEntered={this.props.onEntered}
                onExited={this.onExited}
            >
                <div className="slide-in-from-bottom">
                    <div className="sifb-bg" onClick={this.props.onClickBg}
                        style={{WebkitTransitionDuration: `${tranTime}s`, transitionDuration: `${tranTime}s`}}
                    ></div>
                    <div className={classNames('sifb-entity', this.props.entityClassName)}
                        style={{WebkitTransitionDuration: `${tranTime}s`, transitionDuration: `${tranTime}s`}}
                    >
                        {
                            this.props.header &&
                            <div className="sifb-header">
                                <h2>{this.props.header}</h2>
                                {
                                    this.props.onClickHeaderClose &&
                                    <i className="icon_cross" onClick={this.props.onClickHeaderClose}></i>
                                }
                            </div>
                        }
                        {
                            typeof this.props.children === 'function'
                                ?
                                this.props.children()
                                :
                                this.props.children
                        }
                    </div>
                </div>
            </CSSTransition>
        </Protal>
    }

    onExited = () => {
        this.setState({renderContent: false});
    }
}
