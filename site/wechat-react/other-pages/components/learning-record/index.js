import React from "react";
import "./style.scss";

class LearningRecord extends React.PureComponent {
    
    timer = null;
    aniCount = 0;

    state = {
        // 奖励任务文本索引
        index: 0
    }
    componentDidMount() {
        // const contentRect = this.contentRef.getBoundingClientRect();
        // const wrapperRect = this.wrapRef.getBoundingClientRect();
        // if(contentRect.width - wrapperRect.width > 0 ) {
        //     this.timer = setInterval(() => {
        //         if(this.aniCount%3==0) {
        //             this.contentRef.style.transition = 'none';
        //         } else if (this.aniCount%3==1) {
        //             this.contentRef.style.left = '0';
        //         } else {
        //             this.contentRef.style.transition = 'all 2s';
        //             this.contentRef.style.left = `-${contentRect.width - wrapperRect.width}px`;
        //         }
        //         this.aniCount++;
        //     },2000);
        // }
        setInterval(() => {
            this.setState({
                index: (this.state.index + 1) % 2
            })
        },2000);
    }

    componentWillUnmount() {
        if(this.timer !== null) {
            clearInterval(this.timer);
        }
    }

    addUpFormatter(addUp) {
        if(addUp < 60) {
            return  '1分钟'
        } else if(addUp >= 60 && addUp < 3600) {
            return `${Math.floor(addUp / 60)}分钟`;
        } else if(addUp >=3600) {
            const hours = Math.floor(addUp / 3600);
            const min = Math.floor((addUp % 3600) / 60);
            return `${hours}小时${min}分钟`;
        }
    }

    render() {
        const { odd, listenInfo, award} = this.props;
        return (
            <div className={["learning-record-wrap", Math.ceil(odd) ? "w" : "b"].join(" ")}>
                <div className="learning-record">
                    <div className="addup">
                        <div className="total-time">
                        {`${this.addUpFormatter(listenInfo.learnTotalTime)}`}
                        </div>
                        <div className="addup-listen">
                            累计听课
                            <span className="carousel" onClick={this.props.onClickPoint}>
                                <span className="looper" ref={ref => {this.wrapRef = ref}}>
                                    <span className="content" ref={ref => {this.contentRef = ref}}>
                                        {
                                            award && (this.state.index % 2 === 0 ? `满${award['time']}小时` : `奖${award['point']}学分` )     
                                        }
                                    </span>
                                </span>
                                <i className="icon-arrow"></i>
                            </span>
                        </div>
                    </div>
                    <span className="separator" />
                    <div className="listen-class">
                        <div className="box today-listen">
                            <div className="title">
                                {Math.floor(listenInfo.todayLearnTime / 60)}分钟
                            </div>
                            <div className="desc">今日听课</div>
                        </div>
                        <div className="box not-learn-yet">
                            <div className="title">{listenInfo.notFinishCount}门</div>
                            <div className="desc">未学完</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default LearningRecord;
