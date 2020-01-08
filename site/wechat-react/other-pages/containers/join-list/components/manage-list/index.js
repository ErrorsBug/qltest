/*
 * @Author: shuwen.wang 
 * @Date: 2017-07-13 15:23:41 
 * @Last Modified by: shuwen.wang
 * @Last Modified time: 2017-07-17 18:46:17
 */
import React from 'react';
import PropTypes from 'prop-types';
import { imgUrlFormat } from '../../../../../components/util'
import { defaultUserPortrait } from '../../methods'

const ManageList = props => {
    let {
        id,
        userName,
        headImgUrl,
        kickOutStatus,
        blackListStatus,
    } = props.activeItem

    /* 用户头像为空则使用默认头像 */
    headImgUrl = headImgUrl || defaultUserPortrait

    return (
        <ul className='co-join-list-manage'>
            <li>
                <img className='head-img' src={imgUrlFormat(headImgUrl, '@100w_100h_1e_1c_2o')} alt="" />
                {userName}
            </li>
            <li className='option-kick' onClick={props.onKickClick}>
                {kickOutStatus === 'Y' ? '取消踢出' : '踢出'}
            </li>
            <li className='option-black' onClick={props.onBlackClick}>
                {blackListStatus === 'N' ? '加入黑名单' : '取消加入黑名单'}
            </li>
            <li className='cancel' onClick={props.onCancelClick}>取消</li>
        </ul>
    );
};

ManageList.propTypes = {

};

export default ManageList;