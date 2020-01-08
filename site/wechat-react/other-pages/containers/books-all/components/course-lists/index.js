import React, { useState, useEffect, useCallback } from 'react'
import { locationTo } from 'components/util';
import BooksList from '../../../../components/books-list';
import ScrollToLoad from 'components/scrollToLoad'
import { categoryBookList } from '../../../../actions/books'

function CourseLists ({ curId }) {
    const [ lists, setLists ] = useState([]);
    const [ page, setPage ] = useState(1);
    const [ noMore, setNoMore ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ onceLoad, setOnceLoad ] = useState(false);
    const initData = async (flag) => {
        if(flag){
            window.loading(true)
        }
        const { dataList } = await categoryBookList({ tagId: curId, page: flag ? 1: page, size: 20 });
        const arr = dataList || [];
        if(!arr.length) {
            setNoMore(true)
        }
        setPage(flag ? 2 :(page + 1))
        const newLists = flag ? [] : lists;
        setLists([...newLists, ...arr])
        setTimeout(() => {
            window.loading(false)
        },300)
        if(!onceLoad) {
            setOnceLoad(true)
        }
    }
    useEffect(() => {
        setNoMore(false)
        setLoading(false)
        initData(true)
    }, [ curId ])
    const loadNext = useCallback( async (next) =>{
        if(!lists.length || noMore || loading) return false
        setLoading(true)
        await initData();
        setLoading(false)
        next && next()
    })
    return (
        <div className="ba-course-lists">
            <ScrollToLoad
                className="ba-scroll-box"
                toBottomHeight={300}
                noneOne={ onceLoad && !lists.length }
                loadNext={loadNext}
                noMore={noMore}>
                { lists.map((item, index) => (
                    <BooksList key={ index } isShowD { ...item } />
                )) }
            </ScrollToLoad>
        </div>
    )
}
export default CourseLists