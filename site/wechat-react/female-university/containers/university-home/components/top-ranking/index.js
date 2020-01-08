import React, { PureComponent } from 'react'
import { autobind } from 'core-decorators'
import ReactSwiper from 'react-id-swiper'
import PublicTitleImprove from '../../../../components/public-title-improve'
import { locationTo } from 'components/util';

const RankItem = ({ headTitle, nodeCode, lists = [], bgObj, idx }) => {
    const status = Object.is(nodeCode, "QL_NZDX_SY_RANK_COURSE_BG") ? "course" : "book"
    return (
        <div className="un-top-item on-log on-visible" 
            
            data-log-name={ headTitle }
            data-log-region="un-top-ranking"
            data-log-pos={ idx }
            onClick={ () => locationTo(`/wechat/page/university/top-ranking?rankStatus=${ status }`)}>
            <div className="un-top-head" style={{ backgroundImage: `url(${ bgObj.keyA })`}}>
                <p>每日更新</p>
                <h3>{ headTitle }</h3>
            </div>
            <div className="un-top-cont" >
                <div className="un-top-bg"  style={{ backgroundImage: `url(${ bgObj.keyD })`}}></div>
                <div className="un-top-bgCl" style={{ background: `linear-gradient(${ bgObj.keyC })`}}></div>
                <div className="un-top-lists">
                    { lists.slice(0,3).map((item, index) => (
                        <div className="un-top-list" key={ item.id }>
                            <span>{ index + 1 }</span>
                            <div className="un-top-info">
                                <div>
                                    { Object.is(status, 'book') && <h4>{ item.title }</h4> }
                                    <p className={ Object.is(status, 'course') ? 'two' : '' }>{ Object.is(status, 'course') ? item.title : item.desc }</p> 
                                </div>
                            </div>
                        </div>
                    )) }
                </div>
                <div className="un-top-more"><span>查看榜单</span></div>
            </div>
        </div>
    )
}

@autobind
export default class extends PureComponent{
    render() {
        const opts = {
            slidesPerView: 1.35,
        }
        const { rankList,  rankCourseList, rankBookList, rankBookBg, rankCourseBg, isTitle, title, decs, btm } = this.props;
        return (
            <div className="un-top-rank" style={{marginBottom: `${ Number(btm || 48) / 78 }rem`  }}>
                { isTitle && <PublicTitleImprove
                    className='un-top-title'
                    title={ title }
                    region="un-must-more"
                    decs={ decs }
                    handleMoreLink={ this.handleMoreLink } /> }
                { !!rankList.length && (
                    <ReactSwiper {...opts}>
                        { rankList.map((item, index) => (
                            <div key={ item.id }>
                                <RankItem 
                                    idx={ index }
                                    headTitle={ item.title } 
                                    nodeCode={ item.nodeCode } 
                                    bgObj={ Object.is(item.nodeCode, 'QL_NZDX_SY_RANK_COURSE_BG') ? rankCourseBg : rankBookBg }
                                    lists={ Object.is(item.nodeCode, 'QL_NZDX_SY_RANK_COURSE_BG') ? rankCourseList : rankBookList } />
                            </div>
                        )) }
                    </ReactSwiper>
                ) }
            </div>
        )
    }
}