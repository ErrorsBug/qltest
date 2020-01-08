import { autobind } from "core-decorators";
import * as React from "react";
import { Component, CSSProperties } from "react";
import { isFunction } from "util";

interface CurtainProps {
    className?: string;
    style?: CSSProperties;
    closeBtnClass?: string;
    isOpen?: boolean;
    showCloseBtn?: boolean;
    maskClosable?: boolean;
    onClose?: any;
}

@autobind
export default class Curtain extends Component<CurtainProps, any> {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            closeBtnOffset: {
                top: 10,
                right: 10
            }
        };
    }

    curtainContainer;

    curtainContentBoxRect: any = {};

    componentDidMount() {
        const { isOpen } = this.props;
        this.setState({
            isOpen: !!isOpen
        });
    }

    componentWillReceiveProps(np) {
        const { isOpen, showCloseBtn = true } = np;
        this.setState(
            {
                isOpen: !!isOpen
            },
            () => {
                const el = document.querySelector(
                    ".curtain-container > .curtain-content-box"
                );

                // 对关闭按钮的位置进行动态设置
                if (el && showCloseBtn) {
                    // 获取curtain内容区位置
                    const currentBoxRect = el.getBoundingClientRect();
                    const { top, width } = currentBoxRect;
                    const {
                        top: boxTop,
                        width: boxWidth
                    } = this.curtainContentBoxRect;
                    // 可视区宽度
                    const viewPortWidth =
                        document
                            .querySelector(".curtain-container")
                            .getBoundingClientRect().width || window.innerWidth;

                    if (!(top == boxTop && width == boxWidth)) {
                        const {
                            width: btnWidth = 0,
                            height: btnHeight = 0
                        }: any =
                            document.querySelector(
                                ".curtain-container>img.curtain-container-close-btn"
                            ) || {};
                        const newTop = top - btnHeight - 20; // 距离内容区上方20px
                        const newRight = (viewPortWidth - width - btnWidth) / 2; // 距离内容区右侧按钮一半宽度

                        // 默认按钮的基本可视偏移量为：top: 10, right: 10
                        const defaultTop = 10;
                        const defaultRight = 10;

                        this.setState({
                            closeBtnOffset: {
                                top: newTop < defaultTop ? defaultTop : newTop,
                                right:
                                    newRight < defaultRight
                                        ? defaultRight
                                        : newRight
                            }
                        });

                        this.curtainContentBoxRect = currentBoxRect;
                    }
                }
            }
        );
    }

    handleCurtainClose = () => {
        const { onClose } = this.props;
        this.setState({
            isOpen: false
        });
        isFunction(onClose) && onClose();
    };

    handleCurtainClick = e => {
        e.persist();
        e.preventDefault();
        const { maskClosable = true, onClose } = this.props;
        if (
            e.target.className === this.curtainContainer.className &&
            maskClosable
        ) {
            this.setState({
                isOpen: false
            });
            isFunction(onClose) && onClose();
        }
    };

    handleRef = node => {
        if (node) {
            node.addEventListener(
                "touchmove",
                e => {
                    e.preventDefault();
                },
                // prop passive for mobile devices!!
                { passive: false }
            );
            this.curtainContainer = node;
        }
    };

    render() {
        const {
            className,
            style,
            closeBtnClass,
            showCloseBtn = true
        } = this.props;
        const { isOpen, closeBtnOffset } = this.state;

        return (
            isOpen && (
                <div
                    className={`curtain-container ${className || ""}`}
                    ref={this.handleRef}
                    onClick={this.handleCurtainClick}
                    style={style}
                >
                    {showCloseBtn && (
                        <img
                            className={`curtain-container-close-btn ${closeBtnClass ||
                                ""}`}
                            src={require("./assets/icon-close.png")}
                            style={closeBtnOffset}
                            onClick={() => this.handleCurtainClose()}
                        />
                    )}
                    <div
                        className={`curtain-content-box ${
                            showCloseBtn ? "with-close-btn" : ""
                        }`}
                    >
                        {this.props.children}
                    </div>
                </div>
            )
        );
    }
}
