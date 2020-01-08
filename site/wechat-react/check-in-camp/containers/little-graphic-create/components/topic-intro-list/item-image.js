import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { imgUrlFormat } from 'components/util';


const ItemImage = props => {
    let { item } = props;
    
    let delImg = () => {
        if (!props.edit) {
            return false;
        }
        window.confirmDialog('确定删除该图片吗？', () => {
            props.delItem(props.item.id,'img')
        }, ()=> {});
       
    }

    let onClickImg = async () => {
        if (!props.edit) {
            return false;
        }
        props.addTextItem(item.id);
        props.imFocus(item.id)
       
    }

    return (
        <div className={`item-image ${props.edit?'editing':''}`} >
            <span className="main">
                <span 
                    onClick={onClickImg}
                    className={`img-box ${props.focusId == item.id ? 'i-m-focus' : ''}`}
                >
                    <img
                        className={`intro-image`}
                        src={item.type == 'imageId' ? item.localId : `${imgUrlFormat(item.content, '?x-oss-process=image/resize,w_800,limit_1')}` }
                    />
                
                </span>    

                {
                    props.edit?
                        <span className="btn-del icon_cross" onClick={delImg}></span>
                    :null    
                }
            </span>    
        </div>
    );
}

ItemImage.propTypes = {

};

export default ItemImage;