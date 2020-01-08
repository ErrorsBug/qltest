import * as React from 'react';
import { autobind } from 'core-decorators'
import moment from 'moment'

import { Table } from 'antd'
import { TableEmpty } from '../../../empty-table-placeholder'
import { IPromoteOrder } from '../../../../../../models/promote.model'
import { imgUrlFormat } from '../../../../../../components/util'

import styles from './style.scss'

export interface PromoteTableProps {
    list: Array<IPromoteOrder>
    loading: boolean
}

@autobind
class PromoteTable extends React.Component<PromoteTableProps, any> {

    state = {
    }

    columns = [
        {
            title: '购买课程',
            dataIndex: '',
            key: 'courseName', 
            render: (item: IPromoteOrder) => {
                return <div className={styles.course}>
                    <img src={imgUrlFormat(item.channelHeadImg, "?x-oss-process=image/resize,m_fill,limit_0,h_66,w_110")} alt="" />
                    <p>{item.channelName}</p>
                </div>
            }
        }, {
            title: '购买人',
            dataIndex: '',
            key: 'customer',
            render: (item: IPromoteOrder) => {
                return <div className={styles.customer}>
                    <img src={imgUrlFormat(item.purchaserHeadImg, "?x-oss-process=image/resize,m_fill,limit_0,h_30,w_30")} alt="" />
                    <p>{item.purchaserName}</p>
                </div>
            }
        }, {
            title: '购买价格',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => {
                return <p className={styles["normal-text"]}>￥{amount}</p>
            }
        }, {
            title: '我的分成',
            dataIndex: 'percent',
            key: 'percent',
            render: (percent: number) => {
                return <p className={styles["normal-text"]}>{percent}%</p>
            },
        }, {
            title: '我的收益',
            dataIndex: 'money',
            key: 'money',
            render: (money: number) => {
                return <p className={styles["normal-text"]}>￥{money}</p>
            }
        }, {
            title: '购买时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (createTime: number) => {
                return [
                    <div className={styles.createtime} key='date'>
                        {moment(createTime).format('YYYY.MM.DD')}
                    </div>,
                    <div className={styles.createtime} key='time'>
                        {moment(createTime).format('HH:mm:ss')}
                    </div>,
                ]
            }
        },
    ]

    render() {
        const { list, loading } = this.props

        return (
            <Table
                className={styles['promote-table']}
                dataSource={list}
                columns={this.columns}
                pagination={false}
                loading={loading}
            />
        );
    }
}

export default PromoteTable
