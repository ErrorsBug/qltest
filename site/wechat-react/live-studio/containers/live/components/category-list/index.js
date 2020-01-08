import React from "react";
export default ({ onMore, allowMGLive, tags, selectedTag, onSwitch, type, moreRegion, categoryRegion }) => {
    if (!allowMGLive && tags && tags.length <= 0) return null;
    return (
        <div className="live-main-category-list">
            <div className="category-list-wrap">
                {allowMGLive && !(tags && tags.length > 0) && 
                    <div
                        className="category-item prl20 on-log on-visible"
                        data-log-region={moreRegion}
                        onClick={onMore}
                    >
                        <div className="add"><img src={require('./img/add.png')} alt=""/></div><div className="text">{" "}添加分类</div>
                    </div>
                }
                {tags && tags.length > 0 && (
                    <div className="category-list">
                        <div>
                            {tags && (
                                <>
                                    <div
                                        className={[
                                            "category-item on-log on-visible",
                                            selectedTag == 0 ? "active" : null
                                        ].join(" ")}
                                        data-log-region={categoryRegion}
                                        data-log-pos="0"
                                        onClick={() => {
                                            onSwitch && onSwitch(type, 0);
                                        }}
                                    >
                                        全部
                                    </div>

                                    {tags.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className={[
                                                "category-item on-log on-visible",
                                                selectedTag == item.id
                                                    ? "active"
                                                    : null
                                            ].join(" ")}
                                            data-log-region={categoryRegion}
                                            data-log-pos={index + 1}
                                            onClick={() => {
                                                onSwitch && onSwitch(type, item.id);
                                            }}
                                        >
                                            {item.name}
                                        </div>
                                    ))}
                                    <div
                                        className="pad"
                                    ></div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {allowMGLive && tags && tags.length > 0 && (
                <div className="more" onClick={onMore}>
                    <img src={require("./img/more.png")} alt="" />
                </div>
            )}
        </div>
    );
};
