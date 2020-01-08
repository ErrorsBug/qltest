import React, {Component} from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';
import ScrollToLoad from 'components/scrollToLoad';
import { locationTo, localStorageSPListAdd, localStorageSPListDel, formatMoney } from 'components/util';
import { similarCourseList } from '../../actions/mine'


function mapStateToProps (state) {
    return {
    }
}

const mapActionToProps = {
    similarCourseList
}

class SimilarList extends Component {

    constructor(props) {
        super(props);
        
        this.data.businessId = this.props.location.query.id
        this.data.businessType = this.props.location.query.type

        window.brige = this
    }

    data = {}

    state = {
        dataList: [],
    }

    async componentDidMount() {
        this.GetSimilarList()
    }

    GetSimilarList = async (next) => {
        const dataList = this.state.dataList
        const result = await this.props.similarCourseList({
            businessId: this.data.businessId,
            businessType: this.data.businessType
        })
        if(result && result.data && result.data.courses && result.data.courses.length) {
            result.data.courses.map((item, index) => {
                dataList.push(item)
            })
            this.setState({
                dataList: dataList
            })
        } else {
            this.setState({noMore: true})
        }
        next && next()
    }

    toCourse = (item) => {
        if(item.businessType == "channel") {
            locationTo('/live/channel/channelPage/' + item.businessId + '.htm')
        } else if(item.businessType == "topic") {
            locationTo(`/wechat/page/topic-intro?topicId=${item.businessId}`)
        }
        if(window._qla) {_qla('click', {region: "similar-course" ,pos: "course-item", type: item.businessType, id: item.businessId})}; 
    }

    render() {
        return (
            <Page title="相似课程" className="similarity-page">
                

                    {
                        this.state.dataList.length === 0 && <div className="empty">
                            <div className="empty-img"></div>
                            <div className="empty-des">相关度太低，暂无相似课程推荐</div>
                        </div>
                    }
                    {
                        this.state.dataList.map((item, index) => (
                            <div className='collect-item' key={'collect-item-' + item.businessId} onClick={() => {this.toCourse(item)}}>
                                <img className="headImg" src={item.headImage + '@296h_480w_1e_1c_2o'}></img>
                                <div className="info">
                                    <div className={`title${item.businessType == 'channel' ? " channel" : ""}`}>{item.name}</div>
                                    <div className="topicNum"> <span className="live-name">{item.liveName}</span> | 共{item.topicCount || 1}节课</div>
                                    <div className="learnNum"> <span className="learnNum">{item.learningNum}人在学</span>  <span className="price">￥{formatMoney(item.money)}</span> </div>
                                </div>
                            </div>
                        ))
                    }


            </Page>
        );
    }
}

module.exports = connect(mapStateToProps, mapActionToProps)(SimilarList);
