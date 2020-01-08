
import React, {Component} from 'react';
import { connect } from 'react-redux';
import Page from 'components/page';
import { locationTo } from 'components/util';
import TagCategory from './components/tag-category'

// actions
import {
    getLivecenterTags,
    saveUserTag
} from '../../actions/recommend';

class ChooseUserTag extends Component {
    state={
        // 标签列表
        tagCategoryList: null,
        // 选中标签
        selectTagList: {}
    }

    componentDidMount() {
        this.initTagCategoryList()
        
	    setTimeout(() => {
		    typeof _qla != 'undefined' && _qla.bindVisibleScroll('choose-user-tag');
	    }, 1000);
    };

    async initTagCategoryList () {
        const res = await this.props.getLivecenterTags()
        const selectTagList = {}
        // 添加全部按钮
        res.map( item => {
            const { childenList } = item
            if (childenList && childenList.length > 0) {
                selectTagList[item.id] = []
                let isAll = 'Y'
                childenList.map( c => {
                    if (c.select == 'Y') {
                        selectTagList[item.id].push(c.id)
                    } else {
                        isAll = 'N'
                    }
                })

                item.childenList = [
                    {
                        id: 0,
                        name: '全部',
                        level: 2,
                        parentId: item.id,
                        select: isAll
                    },
                    ...childenList
                ]
            } else {
                item.childenList = null
            }
        })

        this.setState({
            tagCategoryList: res,
            selectTagList
        })

    }

    chooseItem (item, index) {
        const { selectTagList } = this.state
        const tagCategoryListTemp = [...this.state.tagCategoryList]
        const isSelect = item.select == 'Y' ? 'N' : 'Y'
        const tagList = []
        let isAll = 'Y'
        tagCategoryListTemp[index].childenList.map( tag => {
            if (item.id == 0 || tag.id === item.id) {
                tag.select = isSelect
            }

            if (tag.id !== 0) {
                if (tag.select == 'Y') {
                    tagList.push(tag.id)
                }
                tag.select !== isSelect && (isAll = 'N')
            }
        })

        selectTagList[item.parentId] = tagList
        tagCategoryListTemp[index].childenList[0].select = isAll == 'Y' ? isSelect : 'N'
        
        this.setState({
            tagCategoryList: tagCategoryListTemp,
            selectTagList
        })
        console.log(this.selectTagListArr)
    }

    get selectTagListArr () {
        const { selectTagList } = this.state
        let list = []
        for (let k in selectTagList) {
            list = list.concat(selectTagList[k])
        }
        return list
    }

    async saveTag () {
        const res = await this.props.saveUserTag({
            tagIdList: this.selectTagListArr
        })

        if (res.state.code === 0) {
            window.toast('保存成功')
            if (history.length === 1) {
                locationTo('/wechat/page/recommend');
            } else {
                history.back();
            }
        } else {
            window.toast(res.msg)
        }

        if (typeof localStorage !== 'undefined') {
            try {
                localStorage.setItem('CLEAN_RECOMMEND_GYL', 1);
            } catch (e) {}
        }
    }
    
	// ABtest
	get testAB () {
        let userId = Number(this.props.userId)
        return userId % 2 === 0
	}

    renderBtn () {
        const count = this.selectTagListArr.length
        if (count == 0) {
            return <div className="save-btn disable">至少选择三个标签</div>
        } else if (count >= 3) {
            return <div className="save-btn on-log" data-log-region="btn-commit" onClick={this.saveTag.bind(this)}>保存</div>
        } else {
            return <div className="save-btn disable">还差{ 3 - count }个标签哦</div>
        }
    }

    render() {

        const { tagCategoryList } = this.state

        return (
            <Page title={`偏好选择`} className="choose-user-tag">
                <div className="page-container">
                
                    <div className="page-header">
                        <p className="title">选择你感兴趣的内容</p>
                        <p className="desc">选择后，将优先推荐相关内容给你哦</p>
                    </div>
                    {
                        tagCategoryList && tagCategoryList.map( (item, index) => item.childenList && (
                            <TagCategory 
                                data={item}
                                index={index}
                                key={`tag-category-${index}`}
                                onSelect={this.chooseItem.bind(this)}
                                />
                        ))
                    }

                </div>
                
                <div className="page-footer">
                    {
                        this.renderBtn()
                    }
                </div>
            </Page>
        );
    }
}

ChooseUserTag.propTypes = {

};

function mapStateToProps (state) {
    return {
        userId: state.common.cookies.userId
    }
}

const mapActionToProps = {
    getLivecenterTags,
    saveUserTag
}

module.exports = connect(mapStateToProps, mapActionToProps)(ChooseUserTag);
