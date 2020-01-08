import * as React from 'react';
import { autobind } from 'core-decorators'
import { imgUrlFormat } from '../../../../../../components/util'
import { IReprintChannelItem } from '../../../../../../models/reprint.model'
import styles from './style.scss'

import { Table,Button } from 'antd'
import {TableEmpty} from '../../../empty-table-placeholder'

export interface ReprintTableProps {
    list: Array<IReprintChannelItem>

    onPromoteClick: (course: any) => void
    onDownShelfClick: (id: string) => void
    onUpShelfClick: (id: string) => void
    onDeleteClick: (id: string) => void
}

@autobind
class ReprintTable extends React.Component<ReprintTableProps, any> {

    state = {
        loading: false,
    }

    viewTweet(url:string) {
        if (!url) {
            (window as any).message.warning('暂无推文')
            return    
        }
        window.open(url, '_blank')
    }

    columns = [
        {
            title: '课程名称',
            dataIndex: '',
            key: 'courseName',
            render: (item: IReprintChannelItem) => {
                const { chargeMonths, discountStatus, amount, discount} = item

                const amountStr = chargeMonths !== 0 ? `￥${amount}/${chargeMonths}月` : `￥${amount}`

                return <div className={styles['course-name']}>
                    <img src={imgUrlFormat(item.headImage, "?x-oss-process=image/resize,m_fill,limit_0,h_66,w_110")} alt="" className={styles.header} />
                    <div className={styles['text-section']}>
                        <p className={styles.name}>{item.name}</p>
                        <div className={styles.price}>
                            {
                                discountStatus === 'Y' &&
                                <span className={styles.tagDiscount}>特惠</span>
                            }
                            {
                                discountStatus === 'Y' ? `￥${discount}` : amountStr
                            }
                        </div>
                    </div>
                </div>
            }
        }, {
            title: '我的分成',
            dataIndex: 'selfMediaPercent',
            key: 'percent',
            render: (percent) => {
                return <p className={styles["normal-text"]}>{percent}%</p>
            }
        }, {
            title: '预计收益',
            dataIndex: 'selfMediaProfit',
            key: 'profit',
            render: (profit) => {
                return <p className={styles["normal-text"]}>￥{profit}</p>
            }
        }, {
            title: '累计订单',
            dataIndex: 'orderTotalNumber',
            key: 'order',
            render: (order) => {
                return <p className={styles["normal-text"]}>{order}</p>
            }
        }, {
            title: '累计收益',
            dataIndex: 'orderTotalMoney',
            key: 'totalProfit',
            render: (totalProfit) => {
                return <p className={styles["normal-text"]}>￥{totalProfit}</p>
            }
        }, {
            title: '状态',
            dataIndex: 'upOrDown',
            key: 'status',
            render: (upOrDown) => {
                switch (upOrDown) {
                    case 'up':
                        return <p className={styles['normal-text']}>售卖中</p>
                    case 'down':
                        return <p className={styles['grey-text']}>已下架</p>
                    default:
                        return '--'
                }
            }
        }, {
            title: '查看',
            dataIndex: '',
            key: 'view',
            render: (item: IReprintChannelItem) => {
                return [
                    <a 
                        key='tweet'
                        href={'javascript:void(0);'}
                        className={styles['view-link']}
                        onClick={() => { this.viewTweet(item.tweetUrl) }}
                    >
                        查看推文
                    </a>,
                    <a 
                        key='channel' 
                        href={`/live/channel/channelPage/${item.id}.htm`} 
                        target='_blank' 
                        className={styles['view-link']}
                    >
                        课程链接
                    </a>,
                ]
            },
        }, {
            title: '操作',
            dataIndex: '',
            key: 'options',
            render: (item: IReprintChannelItem) => {
                /* 这一步先把所有的操作按钮放进一个数组 */
                const optionElems = []
                if (item.upOrDown === 'up') {
                    optionElems.push(
                        <span key='promote' onClick={() => { this.props.onPromoteClick(item) }} className={styles['option-item']}>立即推广</span>,
                        <span key='down' onClick={() => { this.props.onDownShelfClick(item.id) }} className={styles['option-item']}>下架</span>
                    )
                } else {
                    optionElems.push(
                        <span key='up' onClick={() => { this.props.onUpShelfClick(item.id) }} className={styles['option-item']}>重新上架</span>,
                        <span key='delete' onClick={() => { this.props.onDeleteClick(item.id) }} className={styles['option-item']}>删除</span>
                    )
                }

                /* 这一步把在所有按钮中间加一个操作符 */
                let elems = []
                optionElems.forEach((item, index) => {
                    elems.push(item, <span key='splitor' className={styles.splitor}>|</span>)
                })

                /* 然后去掉最后一个操作符 */
                elems.pop()

                /** 
                 * 其实这个加入分隔符的操作用css伪元素加伪类就能搞定，不需要js，只是突然就想用js写了 
                 * todo: 删掉上面那行注释 (￣▽￣)"
                 * */
                return elems
            },
        }
    ]

    render() {
        const { list } = this.props
        const { loading } = this.state

        return (
            <Table
                rowKey='id'
                className={styles['reprint-table']}
                dataSource={list}
                columns={this.columns}
                loading={loading}
                pagination={false}
            />
        );
    }
}

export default ReprintTable