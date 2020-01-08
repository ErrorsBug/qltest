import * as React from 'react';
import { render } from 'react-dom';
import { autobind } from 'core-decorators';

// components
import TabContentDetail from '../tab-content-detail';
import TabContentGoodMan from '../tab-content-good-man';
import TabContentLuckyMan from '../tab-content-lucky-man';

import './style.scss'

export interface IProps {
    
}

@autobind
export default class PageManContent extends React.Component<IProps, {}> {

    pageContent: HTMLElement = null;

    state = {
        tabs: [
            {
                name: '奖品详情',
                active: true,
                component: <TabContentDetail />
            },
            {
                name: '最近帮忙好友',
                active: false,
                component: <TabContentGoodMan />
            },
            {
                name: '近期中奖用户',
                active: false,
                component: <TabContentLuckyMan />
            },
        ]
    }

    swichTab(index: number) {
        this.setState({
            tabs: this.state.tabs.map((item, i) => ({ ...item, active: i === index }))
        })
    }

    render() {
        return (
            <section className="page-main-content" ref={ dom => this.pageContent = dom }>
                <header className='tab-bar'>
                    <ul>
                        {
                            this.state.tabs.map((item, index) => (
                                <li 
                                    key={ `tab-item-${index}` }
                                    className={ item.active ? 'active' : '' }
                                    onClick={ this.swichTab.bind(this, index) }>
                                    { item.name }
                                </li>
                            ))
                        }
                    </ul>
                </header>

                <main className="tab-content">
                    { this.state.tabs.find(item => item.active).component }
                </main>
            </section>
        )
    }
}