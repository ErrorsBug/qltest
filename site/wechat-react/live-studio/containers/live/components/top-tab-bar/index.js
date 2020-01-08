import React from "react";

const Tab = ({ tabs, currentTab, show, onTab }) => {
    if (!show) return null;
    return (
        <div className="live-main-top-tab-bar">
            {tabs &&
                tabs.map(tab => {
                    return (
                        <div
                            key={tab.ele}
                            className={[
                                "on-log onvisible",
                                "tab",
                                currentTab === tab.ele ? "active" : null
                            ].join(" ")}
                            data-log-region={tab.region}
                            onClick={() => {
                                onTab(tab.ele);
                            }}
                        >
                            {" "}
                            {tab.name}
                        </div>
                    );
                })}
        </div>
    );
};

export default Tab;