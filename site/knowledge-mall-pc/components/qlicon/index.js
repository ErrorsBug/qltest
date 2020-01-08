import './index.scss';
import React, { Children } from 'react';
import { Icon } from 'antd';
import classNames from 'classnames';


/**
 * 传入qltype参数使用qlicon
 * 传入type参数使用anticon 
 */
const Qlicon = props => {
  let { qltype, ..._props } = props;

  if (qltype) {
    return <i className={classNames('qlicon qlicon-' + qltype, {
      'qlicon-spin': _props.spin
    })}>{_props.children}</i>
  }

  return (
      <Icon {..._props}/>
  );
};


export default Qlicon;
