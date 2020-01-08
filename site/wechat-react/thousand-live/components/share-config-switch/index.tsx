import * as React from "react";
import Switch from "components/switch";
import './style.scss'

interface Props {
    flag: string; // 是否开启分享
    onSwitch: () => void; // 切换开关
}

export default function ShareConfigSwitch({ flag, onSwitch, className }) {
    return (
        <div className={["share-config-switch-wrap", className ? className : null].join(' ')}>
            <div className="share-config-switch">
                <div className="config-header">
                    <p className="title">学员分享上墙</p>
                    <Switch
                        className="switch sc-switch"
                        active={flag === "Y"}
                        onChange={onSwitch}
                    />
                </div>
                <p className="desc">
                    开启后，学员分享课程，会在评论区自动生成一条记录“课不错，刚分享了”，鼓励更多用户传播课程
                </p>
            </div>
        </div>
    );
}
