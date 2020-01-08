import React, { Component } from 'react'
import classnames from 'classnames'

const sortDatas = ['最近更新', '报名最多' , '好评优先']

export default ({ onSort,sortIdx = 0 }) => {
  return (
    <div className="f-sort-box">
      { sortDatas.map((item, idx) => (
        <span className={ classnames({ 'active': sortIdx === idx }) } onClick={ () =>  onSort(idx) }>{ item }</span>
      )) }
    </div>
  )
}