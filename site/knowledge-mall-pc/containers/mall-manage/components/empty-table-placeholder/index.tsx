import * as React from 'react'
import styles from './style.scss'
import { Button } from 'antd'

interface IPlaceholderProps{
    tips: string
    buttonText: string
    onButtonClick: (e: any) => void
}

export function TableEmpty(props: IPlaceholderProps){
    return <div className={styles.empty}>
        <img src={require('../../img/empty-basket.png')} alt="" />
        <p className={styles.tips}>{props.tips}</p>
        <Button
            type='primary'
            onClick={props.onButtonClick}
            className={styles.btn}
            ghost
        >{props.buttonText}</Button>
    </div>    
}