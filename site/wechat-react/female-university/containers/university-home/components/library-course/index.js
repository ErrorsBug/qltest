import React, { PureComponent } from 'react'
import { autobind } from 'core-decorators'
import PublicTitleImprove from '../../../../components/public-title-improve'
import BooksItem from '../../../../components/books-item'
import CourseStatusHoc from '../../../../components/course-status-hoc'
import { locationTo } from 'components/util'

@CourseStatusHoc({
    page: 1,
    size: 3,
    nodeCode:"QL_NZDX_SY_TS", // 听书
    isBooks: true,
})
@autobind
export default class extends PureComponent{
    handleMoreLink() {
        locationTo(`/wechat/page/university/books-list`)
    }
    render() {
        const {  booksObj, isTitle, btm, ...otherProps } = this.props;
        return (
            <div className='un-library-box' style={{marginBottom: `${ Number(btm || 48) / 78 }rem`  }}>
                { isTitle && <PublicTitleImprove
                    className='un-library-title'
                    title={ booksObj.title }
                    moreTxt="更多"
                    region="un-library-more"
                    decs={ booksObj.decs }
                    handleMoreLink={ this.handleMoreLink } /> }
                
                <div className='un-library-list'>
                    <BooksItem 
                        isHome 
                        isOne
                        book='book'
                        isHideNum={true}
                        lists= { booksObj.lists || [] }
                        { ...otherProps } />
                </div>
            </div> 
        )
    }
}