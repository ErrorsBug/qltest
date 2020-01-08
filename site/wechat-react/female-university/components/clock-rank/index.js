import React from 'react'
import EmptyPage from 'components/empty-page'

function ClockRank({ list = [], style, userRank }){
    return (
        <>
            <div className="clock-rank-container" style={style}>
                <ul>
                    { !!userRank && !!userRank?.name && (
                        <li key="0">
                            <span className={`number`}>{userRank.position}</span>
                            <span className="head-img"><span><img src={ userRank.headImg } alt={userRank.name}/></span></span>
                            <span className="name">(我){userRank.name}</span>
                            <span className="score">{userRank.value}</span>
                        </li>
                    ) }
                    {list.map((item,i) => 
                        <li key={i}>
                            <span className={`number num-${i}`}>{i<=2 ? '' : item.position}</span>
                            <span className="head-img"><span><img src={ item.headImg } alt={item.name}/></span></span>
                            <span className="name">{item.name}</span>
                            <span className="score">{item.value}</span>
                        </li>)
                    }
                </ul>
                {!(!!userRank && !!userRank?.name) && !list.length && <EmptyPage emptyMessage={ "榜单数据还未生成哦~" } />}
            </div>
        </>
  );
}
export default ClockRank