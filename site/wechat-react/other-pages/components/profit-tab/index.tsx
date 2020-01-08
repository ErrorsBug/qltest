import * as React from "react";

import "./style.scss";

const { useState, useEffect, useCallback } = React;

interface Props {
    className?: string;
}

const TabBar = ({ className, children, onSwitchTab }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    useEffect(() => {
        onSwitchTab && onSwitchTab(activeIndex);
    }, [activeIndex]);

    return (
        <div className={["profit-tab", className ? className : null].join(" ")}>
            <div className="profit-tab-list">
                <div className="profit-tab-bar">
                    {React.Children.toArray(children).map((child, index) => {
                        return (
                            <div
                                onClick={() => {
                                    setActiveIndex(index);
                                }}
                                className={[
                                    "tab",
                                    index === activeIndex ? "active" : null
                                ].join(" ")}
                            >
                                {child.props.title}
                            </div>
                        );
                    })}
                </div>
                <div className="divider">
                    <span></span>
                </div>
                {React.Children.toArray(children).map((child, index) => {
                    return (
                        <div
                            key={index}
                            className={[
                                "tab-item",
                                activeIndex === index ? "active" : null,
                                className ? className : null
                            ].join(" ")}
                        >
                            {child}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
const Tab = props => {
    return <>{props.children}</>;
};

// const ProfitTab = ({ className }: Props) => {
//     const [activeIndex, setActiveIndex] = useState(0);
//     return (
//         <div className={["profit-tab", className ? className : null].join(" ")}>
//             <TabBar activeIndex={activeIndex} onSwitchTab={setActiveIndex}>
//                 <Tab title="收益明细">2222</Tab>
//                 <Tab title="提现明细">333</Tab>
//             </TabBar>
//         </div>
//     );
// };

export {
    TabBar as ProfitTabBar,
    Tab as ProfitTab
};