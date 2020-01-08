import React, { useState } from "react";

import "./style.scss";

const Tab = ({ children }) => {
    const [curIndex, setCurIndex] = useState(0); // 当前tab索引
    return (
        <div className="takeincome-tab-container">
            {React.Children.count(children) > 0 && (
                <div className="tab-bar">
                    {React.Children.map(children, (child, index) => (
                        <div
                            className={`tab ${
                                index === curIndex ? "active" : ""
                            }`}
                            onClick={() => {setCurIndex(index)}}
                        >
                            {child.props.title}
                        </div>
                    ))}
                </div>
            )}
            {React.Children.map(children, (child, index) => (
                <div className="tab-item-container" hidden={index !== curIndex}>
                    {child}
                </div>
            ))}
        </div>
    );
};

const TabItem = ({ children }) => {
    return children;
};

export { Tab, TabItem };
