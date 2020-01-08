import { api } from './common';

export const INIT_ADDRESS_PERMISSIO = "INIT_ADDRESS_PERMISSIO"
export const INIT_MY_ADDRESS_INFO = 'ACTIVITY/INIT_ADDRESS_INFO';
export const INIT_ADDRESS_FONT_OBJECT = 'INIT_ADDRESS_FONT_OBJECT';


export function initAddressPermission (data) {
    return {
        type: INIT_ADDRESS_PERMISSIO,
        data
    }
};
export function initMyAddressInfo (data) {
    return {
        type: INIT_MY_ADDRESS_INFO,
        data
    }
};
export function initAddressFontObject (data) {
    return {
        type: INIT_ADDRESS_FONT_OBJECT,
        data
    }
};



export function giftAvailable (param) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/activity/giftAvailable',
            body: {...param},
            method: 'POST',
		});
        return result 
    }
};
export function choseGift (param) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/activity/choseGift',
            body: {...param},
            method: 'POST',
		});
        return result 
    }
};
export function giftCourseList (param) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/activity/giftCourseList',
            body: {...param},
            method: 'POST',
		});
        return result 
    }
};
export function giftValidate (param) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/isBuyCourse',
            body: {...param},
            method: 'POST',
		});
        return result 
    }
};

export function configsByCode (param) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/activity/configsByCode',
            body: {...param},
            method: 'POST',
		});
        return result 
    }
};



export function saveAddress (param) {
    return async (dispatch, getStore) => {
        const result = await api({
            dispatch,
            getStore,
            showLoading: false,
            url: '/api/activity/saveAddress',
            body: {...param},
            method: 'POST',
		});
        return result 
        
        dispatch(initMyAddressInfo({
            ...param
        }))
    }
};



