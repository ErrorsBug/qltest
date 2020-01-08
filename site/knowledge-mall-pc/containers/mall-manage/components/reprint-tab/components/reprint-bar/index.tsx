import * as React from 'react';
import styles from './style.scss'
import { connect } from 'react-redux'
import { IChannelTypeItem } from '../../../../../../models/reprint.model'
import classNames from 'classnames'

export interface ReprintBarProps {
    activeId: number
    tagList: Array<IChannelTypeItem>
    onTagClick: (item: IChannelTypeItem) => void
}

function ReprintBar(props: ReprintBarProps) {
    return <div className={styles.container}>
        {
            props.tagList.map((item, index) => {
                return <div
                    key={item.id}
                    className={classNames(styles.item, { [styles.active]: item.id === props.activeId })}
                    onClick={() => { props.onTagClick(item) }}
                >
                    {item.name}
                </div>
            })
        }
    </div>
}

export default ReprintBar
