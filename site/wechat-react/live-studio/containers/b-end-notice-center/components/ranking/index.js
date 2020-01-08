import React from "react";

export default function Ranking(props) {
    const starList = new Array(5).fill(0);
    return (
        <div className="ranking">
            <span className="label">{props.label || "评价分数"}：</span>
            <ul className="stars-list">
                {starList.map((_, index) => {
                    return (
                        <li
                            key={index}
                            className={[
                                "star",
                                index > props.rank - 1 ? "active" : null
                            ].join(" ")}
                        />
                    );
                })}
            </ul>
        </div>
    );
}
