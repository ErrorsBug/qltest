import React, { useState, useEffect } from 'react'
import { listChildren, nodeData } from '../actions/books'

export function useRequest (nodeCode) {
    const [lists, setLists] = useState([])
    const initData = async () => {
        const { data } =  await listChildren({ nodeCode: nodeCode})
        const arr = data?.dataList || []
        setLists(arr)
    }
    useEffect(() => {
        initData();
    }, [])
    return { lists }
}


export function useNodeData (nodeCode, page = { page: 1, size: 4 }) {
    const [lists, setLists] = useState([])
    const initData = async () => {
        const { dataList } =  await nodeData({ ...page, nodeCodeList: [nodeCode], })
        if(dataList && !!dataList.length) {
            const arr = dataList[0]?.dataList || []
            setLists(arr)
        }
    }
    useEffect(() => {
        initData();
    }, [])
    return { lists }
}

