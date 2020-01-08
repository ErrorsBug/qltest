import * as React from 'react';

import './style.scss'

interface Props {
    /** 当前进度 */
    progress: number

    /** 当前分数 */
    curScore: number

    /** 总分数 */
    totalScore: number
}

export default class ProgressBar extends React.Component<Props, {}> {

    get num() {
        let num = this.props.totalScore - this.props.curScore;
        return num > 0 ? num : 0;
    }

    render() {
        return ([
            // progress bar
            <section className="progress-container" key='progress-bar'>
                {
                    this.props.progress < 70 &&
                        <span className='progress-bowl' style={{ left: `${this.props.progress}%` }}>
                            <img src={ require('./images/bowl-mini.png') }/>
                            <span className='progress-text'>{ this.props.curScore }碗</span>
                        </span>
                }

                <span className='cur-progress-wrap'>
                    <span className='cur-progress' style={{ width: `${this.props.progress}%` }}></span>
                </span>

                <span className='full-percent'>
                    <span className='full-text'>{ this.props.totalScore }碗</span>
                    <img src={ require('./images/bowl-100percent.png') } className='bowl-100percent'/>
                </span>
            </section>,

            // progress info
            <p className='progress-text' key='progress-text'>
                还差<span>{ this.num }</span>碗饭，就能领走电热饭盒
            </p>
        ])
    }
}