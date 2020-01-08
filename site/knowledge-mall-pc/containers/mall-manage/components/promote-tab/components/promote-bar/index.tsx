import * as React from 'react';
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'

import styles from './style.scss'
import { ICourseTagItem } from '../../../../../../models/course.model'

import { Button, Input, DatePicker } from 'antd'
import { Moment } from 'moment';
import moment from 'moment'
const { RangePicker } = DatePicker

import {
    updateQueryName,
    updateQueryDate,
} from '../../../../../../actions/promote'

export interface PromoteBarProps {
    queryName: string
    queryDate: Array<Moment>
    downloadLink: string

    updateQueryName: (name: string) => void
    updateQueryDate: (date: Array<Moment>) => void
    onConsultClick: () => void
    onExportClick: () => void
}

@autobind
class PromoteBar extends React.Component<PromoteBarProps, any> {

    state = {
        name: '',
        DateRange: new Array<Moment>(moment().subtract(1, 'months'), moment()),
    }

    onNameChange(e) {
        this.setState({ name: e.target.value })
    }

    onDateChange(e) {
        this.setState({ DateRange: e })
    }
    
    updateQuery() {
        const { name, DateRange } = this.state
        this.props.updateQueryName(name)
        this.props.updateQueryDate(DateRange)
    }

    onConsultClick() {
        this.updateQuery()
        setImmediate(() => {
            this.props.onConsultClick()
        })
    }

    onExportClick(e:any) {
        this.updateQuery()
        const [start, end] = this.state.DateRange
        const minDate = moment(end).subtract(31,'days')
        
        if (start.valueOf() < minDate.valueOf()) {
            (window as any).message.warn('只能导出一个月内的数据')
            e.preventDefault && e.preventDefault()

            return
        }
    }

    disabledDate(current) {
        return current && current > moment().endOf('day');
    }

    render() {
        const { name } = this.state

        return (
            <div className={styles.container}>
                <div className={styles.inputs}>
                    购买人：
                    <Input style={{ width: 164, marginRight: 30 }} placeholder='购买人姓名' value={name} onChange={this.onNameChange} />
                    交易时间：
                    <RangePicker
                        onChange={this.onDateChange}
                        disabledDate={this.disabledDate}
                        defaultValue={[moment().subtract(1, 'months'), moment()]}
                    />
                </div>
                <div className={styles.buttons}>
                    <Button type='primary' onClick={this.onConsultClick}>查询</Button>
                    <a href={this.props.downloadLink} target="_blank" onClick={this.onExportClick}>
                        <Button type='primary' ghost style={{ marginLeft: 20 }}>导出</Button>
                    </a>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        queryName: state.promote.queryName,
        queryDate: state.promote.queryDate,
    }
}

const mapActionToProps = {
    updateQueryName,
    updateQueryDate,
}

export default connect(mapStateToProps, mapActionToProps)(PromoteBar)
