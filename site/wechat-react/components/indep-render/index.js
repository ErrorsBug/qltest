import React from 'react';
import { render as _render , unmountComponentAtNode } from 'react-dom';
import classNames from 'classnames';
import { MiddleDialog } from 'components/dialog';
/**
 * 脱离主react树，独立渲染组件
 * @author jiajun.li 20190122
 */



/**
 * @param {element} ele react组件
 * @param {element} container dom容器
 * @return {function} 销毁方法
 */
export function render(ele, container) {
    if (typeof document === 'undefined') return function destroy() {};
    container || (container = document.querySelector('#app>div'));
    let div = document.createElement('div');
    container.appendChild(div);
    _render(ele, div);
    return function destroy() {
        unmountComponentAtNode(div);
        div.remove();
        div = null;
    }
}



export function renderFun(fun) {
    return new Promise((resolve, reject) => {
        let _destroy;
        
        const destroy = function() {
            _destroy && _destroy();
            _destroy = null;
            resolve();
        }

        _destroy = render(fun({
            destroy
        }));
    })
}



/**
 * @param {object} options
 *  @param {function} onConfirm
 *  @param {function} onCancel 集合点击遮罩、点击关闭按钮、点击取消按钮
 *  其他配置同MiddleDialog
 */
export function modal(options = {}) {
    return new Promise((resolve, reject) => {
        let _destroy;
        let result;
        
        const destroy = function() {
            _destroy && _destroy();
            _destroy = null;
            resolve(result);
        }
        const onCancel = function () {
            if (typeof options.onCancel === 'function') {
                result = options.onCancel();
            }
            destroy();
        }
        const onBtnClick = function (btn) {
            if (typeof options.onBtnClick === 'function') {
                result = options.onBtnClick(btn);
            }
            if (btn === 'confirm') {
                if (typeof options.onConfirm === 'function') {
                    result = options.onConfirm();
                }
                destroy();
            } else if (btn === 'cancel') {
                onCancel(btn);
            }
        }
        _destroy = render(<MiddleDialog show 
            buttonTheme="line"
            {...options}
            className={classNames(options.className)}
            onClose={onCancel}
            onBtnClick={onBtnClick}
        />);
    })
}