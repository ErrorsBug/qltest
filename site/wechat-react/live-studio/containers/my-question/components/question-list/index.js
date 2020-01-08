import React, { Component } from 'react';
import {
    imgUrlFormat,
    formatMoney,
    timeBefore,
} from 'components/util'

export function QuestionList(props) {
    console.log(props.list)
    return <ul className='co-question-list'>
        {
            props.list.map((item, index) => {
                return <li
                    key={`question-list-${index}`}
                    onClick={() => { location.href=`/live/whisper/question.htm?questionId=${item.id}` }}
                >
                    <header>
                        <div className="user">
                            <img src={imgUrlFormat(item.questionHeadUrl, '@210h_210w_1e_1c_2o')} alt="" />
                            <span className="name">{item.questionName}</span>
                        </div>
                        <span className='charge'>￥{formatMoney(item.money, 1)}</span>
                    </header>
                    <main>
                        {item.content}
                    </main>
                    <footer>
                        <time>{item.questionTimeView}</time>
                        {
                            (() => {
                                switch (item.questionStatus) {
                                    case 'begin':
                                        return <span className="to-be-answered">待回答</span>
                                        break;
                                    case 'ended':
                                        return <span className="answered">已回答</span>
                                        break;
                                    case 'refund':
                                        return <span className="overtime">未在指定时间内回答，已退款</span>
                                        break;
                                    default:
                                        return null
                                        break;
                                }
                            })()
                        }
                    </footer>
                </li>
            })
        }
    </ul>
}