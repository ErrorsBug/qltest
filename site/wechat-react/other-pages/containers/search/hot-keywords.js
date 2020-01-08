import React from 'react';
import { request } from 'common_actions/common';
import CollectVisible from 'components/collect-visible';


// 珊瑚过来的不支持热搜
export default class HotKeywords extends React.Component {
    state = {
        hotwords: [],
    }

    async componentDidMount() {
        const { isUniversity } =  this.props
        request({
            url: '/api/wechat/search/hot',
            body: {
                platform: 'H5',
                functionArea: isUniversity ? 'UNIVERSITY' : 'MASTER'
            },
            sessionCache: true,
        }).then(res => {
            if (res.state.code) throw Error(res.state.msg);

            let data = res.data.dataList || [];
            data = data.slice(0, 10);
            
            this.setState({
                hotwords: data
            })
        }).catch(err => {
            console.error(err);
        })
    }

    render() {
        let hotwords = this.state.hotwords;
        if (!hotwords.length) return false;

        return <CollectVisible>
            <div className="hot-and-history hot-search">
                <h1>{this.props.title || '热门搜索'}</h1>
                <div className={'main ' + (hotwords.length ? 'on-visible' : '')} data-log-region="hot-list">
                    <div className="main-content">
                    {
                        hotwords.map((item, index) => {
                            return <div key={index}
                                className={`on-log${index < 3 ? ' icon-hot' : ''}`}
                                data-log-region="hot-item"
                                data-log-pos={item.keyword}
                                onClick={() => this.props.onClickItem(item)}
                            >
                                <span>{item.keyword}</span>
                            </div>
                        })
                    }
                    </div>
                </div>
            </div>
        </CollectVisible>
    }
}
