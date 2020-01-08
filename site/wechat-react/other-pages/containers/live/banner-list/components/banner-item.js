import React, {useState}from 'react';
import PropTypes from 'prop-types';

import { locationTo, imgUrlFormat } from 'components/util';
import Picker from 'components/picker'

import FileInput from 'components/file-input';

const LinkInput = ({
    businessId,                                
    channelList,
    topicList,
    vipList,
    trainingList,
    liveCampList,
    onSelect,
    typeArr,
    type,
    id,
    link,
    onUrlChange,
    onSelectPage,
    onVipChange,
    liveId,
    sortNum
}) => {
    let pageConf;
    switch(type) {
        case "topic":    
            pageConf = typeArr.find(item => item.value === 'topic');
            return topicList && (
                <Picker
                    col={1}
                    data={topicList}
                    value={[`${businessId}`]}
                    title="请选择"
                    onChange={(bid) => {onSelect && onSelect(type, sortNum, bid, pageConf.getUrl(bid[0]))}}
                >
                    <div className="text">
                    {!businessId && <span className="placeholder">请选择课程类型链接</span>}
                        {
                            topicList &&
                            topicList.find(item => item.topicId == businessId) &&
                            topicList.find(item => item.topicId == businessId).name
                        }
                        {
                            topicList &&
                            !topicList.find(item => item.topicId == businessId) &&
                            !!businessId &&
                            <span>课程不存在</span>
                        }
                    </div>
                </Picker>
            );
        case "channel":
            pageConf = typeArr.find(item => item.value === 'channel');
            return channelList && (
                <Picker
                    col={1}
                    data={channelList}
                    value={[`${businessId}`]}
                    title="请选择"
                    onChange={(bid) => {onSelect && onSelect(type,sortNum, bid, pageConf.getUrl(bid[0]))}}
                >
                    <div className="text">
                    {!businessId && <span className="placeholder">请选择课程类型链接</span>}
                    {
                        channelList &&
                        channelList.find(item => item.id == businessId)&&
                        channelList.find(item => item.id == businessId).name || " "
                    }
                    {
                        channelList &&
                        !channelList.find(item => item.id == businessId)&&
                        !!businessId &&
                        <span>课程不存在</span>
                    }
                    </div>
                </Picker>
            );
        case "liveCamp":
            pageConf = typeArr.find(item => item.value === 'liveCamp');
            return liveCampList && (
                <Picker
                    col={1}
                    data={liveCampList}
                    value={[`${businessId}`]}
                    title="请选择"
                    onChange={(bid) => {onSelect && onSelect(type,sortNum, bid, pageConf.getUrl(bid[0]))}}
                >
                    <div className="text">
                    {!businessId && <span className="placeholder">请选择课程类型链接</span>}
                    {
                        liveCampList &&
                        liveCampList.find(item => item.id == businessId)&&
                        liveCampList.find(item => item.id == businessId).name || " "
                    }
                    {
                        liveCampList &&
                        !liveCampList.find(item => item.id == businessId)&&
                        !!businessId &&
                        <span>课程不存在</span>
                    }
                    </div>
                </Picker>
            );
        case "training":
            pageConf = typeArr.find(item => item.value === 'training');
            return trainingList && (
                <Picker
                    col={1}
                    data={trainingList}
                    value={[businessId]}
                    title="请选择"
                    onChange={(bid) => {onSelect && onSelect(type,sortNum, bid, pageConf.getUrl(bid[0]))}}
                >
                    <div className="text">
                    {!businessId && <span className="placeholder">请选择课程类型链接</span>}
                    {
                        trainingList &&
                        trainingList.find(item => item.id == businessId)&&
                        trainingList.find(item => item.id == businessId).name || " "
                    }
                    
                    {
                        trainingList &&
                        !trainingList.find(item => item.id == businessId)&&
                        !!businessId &&
                        <span>课程不存在</span>
                    }
                    </div>
                </Picker>
            );
        case "page":
            pageConf = typeArr.find(item => item.value === 'page');
            return (
                <Picker
                    col={1}
                    data={pageConf.options}
                    value={[`${businessId}`]}
                    title="请选择"
                    onChange={([val]) => {onSelectPage && onSelectPage(sortNum,pageConf.getUrl(val,liveId), val)}}
                >
                    <div className="text">
                    {!businessId && <span className="placeholder">请选择课程类型链接</span>}
                    {
                        pageConf.options.find(item => item.value == businessId) &&
                        pageConf.options.find(item => item.value == businessId).label
                    }
                    </div>
                </Picker>
            )
        case "vip":
            pageConf = typeArr.find(item => item.value === 'vip');
            return (
                <Picker
                    col={1}
                    data={vipList}
                    value={[`${businessId}`]}
                    title="请选择"
                    onChange={([bid]) => {onVipChange && onVipChange(sortNum, bid, pageConf.getUrl(bid,liveId))}}
                >
                    <div className="text">
                        {!businessId && <span className="placeholder">请选择课程类型链接</span>}
                        {
                            vipList &&
                            vipList.find(item => item.id == businessId) &&
                            vipList.find(item => item.id == businessId).name
                        }
                        {
                            vipList &&
                            !vipList.find(item => item.id == businessId) &&
                            !!businessId &&
                            <span>课程不存在</span>
                        }
                    </div>
                </Picker>
            )
        case "none":
            return <div className="text">不跳转</div>
        case "link":
            return (
                <input 
                type="text" 
                value={link || ""}
                placeholder="请输入链接"
                onChange={(e) => {onUrlChange && onUrlChange(sortNum, e.target.value)}}
                onBlur={() => {window.scrollTo(0,0)}}
                />
            );
        default:
            return null;
    }
}



const BannerItem = ({
    liveId,
    index,
    title,
    type,
    imgUrl,
    link,
    sortNum,
    arrSize,
    onDelete,
    onUp,
    onDown,
    onUpdate,
    typeArr,
    onTypeChange,
    id,
    channelList,
    topicList,
    vipList,
    trainingList,
    liveCampList,
    onCourseSelect,
    onUrlChange,
    businessId,
    onSelectPage,
    onVipChange,
    onChangeFile
}) => {
    return (
        <div className='banner-item-contaienr'>
            <div className="banner-item">
                <div className="options">
                    <div className="op">
                        <div className="load">
                            {
                                (!imgUrl || imgUrl === "") ?
                                "上传图片" :
                                "重新上传"
                            }
                            <FileInput
                                className = "input-image"
                                onChange={(e) => {onChangeFile && onChangeFile(sortNum, e)}}
                            />
                        </div>
                        <div className="" onClick={() => {onDelete && onDelete(sortNum)}}>删除</div>
                    </div>
                    <div className="move">
                    {
                        sortNum != 1 && 
                        <div className="move-btn" onClick={ () => onUp(sortNum) }>上移</div>
                    }
                    {
                        sortNum != arrSize && 
                        <div className="move-btn" onClick={ () => onDown(sortNum) } >下移</div>
                    }
                    </div>
                </div>
                <div className="banner-box">
                    {
                        imgUrl ? 
                        <div className='banner-wrap' 
                            style={
                                {
                                    backgroundImage: `url(${imgUrlFormat(imgUrl, '@690w_200h_1e_1c_2o') })`
                                }
                            }>
                        </div> 
                        :
                        <div className='placeholder-info'>
                        <p className='info-1'>
                            <img src={ require('../../img/image-icon.png') } alt="" />
                        </p>
                        <p className='info-2'>建议尺寸：690×200</p>
                    </div>

                    }
                    <div className="input-wrap">
                        <FileInput
                            onChange={(e) => {onChangeFile && onChangeFile(sortNum, e)}}
                        />
                    </div>
                </div>

                <div className="input-list">
                    <div className="input-item">
                        <div className="label">课程类型</div>
                        <div className="value">
                            <i className="arrow">
                                <img src={require('../../img/select-icon.png')} alt=""/>
                            </i>
                            <Picker
                                col={1}
                                data={typeArr}
                                value={[type]}
                                title="选择课程类型"
                                onChange={(e) => {onTypeChange(e, sortNum)}}
                            >
                                <div className="text">
                                    {
                                        typeArr 
                                        && typeArr.find(item => item.value === type)
                                        && typeArr.find(item => item.value === type).label
                                    }
                                    {!type &&  <span className="placeholder">请选择课程类型</span>}
                                </div>
                            </Picker>
                        </div>
                    </div>
                    <div className="input-item">
                        <div className="label">跳转链接</div>
                        <div className={`value ${ type==="none" ? "disabled" : ""}`}>
                            {
                                (type === "topic" || 
                                type === "channel" || 
                                type === "liveCamp" || 
                                type === "training" || 
                                type === "vip" || 
                                type === "page") &&
                                <i className="arrow">
                                    <img src={require('../../img/select-icon.png')} alt=""/>
                                </i>
                            }
                                <LinkInput 
                                    liveId={liveId}
                                    businessId={businessId}
                                    link={link}
                                    id={id}
                                    channelList={channelList}
                                    topicList={topicList}
                                    vipList={vipList}
                                    trainingList={trainingList}
                                    liveCampList={liveCampList}
                                    onSelect={onCourseSelect}
                                    typeArr={typeArr}
                                    onUrlChange={onUrlChange}
                                    onSelectPage={onSelectPage}
                                    type={type}
                                    onVipChange={onVipChange}
                                    sortNum={sortNum}
                                />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

BannerItem.propTypes = {
    title: PropTypes.string,
    type: PropTypes.string,
    imgUrl: PropTypes.string,
    sortNum: PropTypes.number,
    onDelete: PropTypes.func,
    onUp: PropTypes.func,
    onDown: PropTypes.func,
    onUpdate: PropTypes.func,
};

export default BannerItem;
