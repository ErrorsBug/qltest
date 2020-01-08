import React, { useState, useEffect, useCallback, useRef } from 'react'
import Picture from 'ql-react-picture'
import { digitFormat, locationTo } from 'components/util';
import { categoryList } from '../../../../actions/books'

function TabLift ({ curId, handleSelectCategory }) {
    const [ id, setId ] = useState(curId)
    const [ lists, setLists ] = useState([])
    const actionRef = useRef(null)
    const handleAction = useCallback((value) => {
        if(value != id) {
            setId(value)
            handleSelectCategory(value)
            setTimeout(() => {
                actionRef && actionRef.current.scrollIntoView({
                    block: 'center',
                    behavior: 'smooth'
                })
            },50)
        }
    },[ id ])
    const initData = async () => {
        const { dataList } = await categoryList({ disPlayAll: "Y" })
        const arr = dataList || []
        if(!curId && dataList) {
            const mId = arr[0].id
            setId(mId)
            handleSelectCategory(mId)
        }
        setLists(arr)
    }
    useEffect(() => {
        initData()
    }, [ ])
    return (
        <div className="ba-tab-left on-log on-visible"
            data-log-region="ba-tab-left"
            data-log-pos="0"
            data-log-name="左侧导航"
        >
            { lists.map((item, index) => (
                <p 
                    data-log-region="ba-tab-left"
                    data-log-pos={index}
                    data-log-name={ item.name }
                    key={ index } 
                    ref={ id == item.id ? actionRef : null }
                    className={ `on-log on-visible ${ id == item.id ? 'action' : '' }` } 
                    onClick={ () => handleAction(item.id) }>
                        <span>{item.name}</span>
                </p>
            )) }
        </div>
    )
}
export default TabLift