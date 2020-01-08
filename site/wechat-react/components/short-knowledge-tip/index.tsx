import * as React from "react";

interface Props {
    borC: BOrC;
}

enum BOrC {
    B = "B",
    C = "C"
}

const ShortKnowledgeTip: React.SFC<Props> = ({ borC }) => {
    return (
        <div className="short-knowledge-tip_FDGDS">
            {borC == BOrC.B ? (
                <div className="short-tip">
                    <img src={require('./assets/background.png')} />
                    <span>
                        嘿~视频邀请卡上线啦
                    </span>
                </div>
            ) : (
                <div className="short-tip">
                    <img src={require('./assets/background.png')} />
                    <span>
                        老师上传了视频邀请卡哦~
                    </span>
                </div>
            )}
        </div>
    );
};

export default ShortKnowledgeTip;
