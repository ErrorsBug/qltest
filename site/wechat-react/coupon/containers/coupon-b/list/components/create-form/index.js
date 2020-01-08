import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'components/date-picker'
import dayjs from 'dayjs'

const CreateForm = props => {
    const formatToday = dayjs().format('YYYY/MM/DD')
    const {
        money, minMoney, codeNum, overTime, remark,
        onMoneyChange, onMinMoneyChange, onCodeNumChange, onRemarkChange,
    } = props

    return (
        <form className='co-create-vip-coupon-form'>
            <fieldset>
                <label htmlFor="money">优惠金额</label>
                <div className="input-wrap">
                    <input
                        type="number"
                        name='money'
                        placeholder='请输入优惠金额（元）'
                        value={money}
                        onChange={onMoneyChange}
                    />
                    {
                        money !== '' && money != null &&
                        <div className="clear" onClick={props.clearMoney}></div>
                    }
                </div>
            </fieldset>

            <fieldset>
                <label htmlFor="num">设置领取人数</label>
                <div className="input-wrap">
                    <input
                        type="number"
                        name='num'
                        placeholder='最多设置9999'
                        value={codeNum}
                        onChange={onCodeNumChange}
                    />
                    {
                        codeNum !== '' && codeNum != null &&
                        <div className="clear" onClick={props.clearCodeNum}></div>
                    }
                </div>
            </fieldset>

            <fieldset>
                <label htmlFor="time">设置优惠券使用截止时间</label>
                <DatePicker
                    mode='date'
                    title="选择时间"
                    onChange={props.onDatePickerSelect}
                >
                    <div className="input-wrap">
                        <div
                            onClick={props.blurInput}
                            className={`mock-input ${overTime ? '' : 'placeholder'}`}>
                            {overTime?dayjs(overTime).format('YYYY-MM-DD'):'不填则可永久使用'}
                        </div>
                        {
                            overTime !== '' && overTime != null &&
                            <div className="clear" onClick={props.clearOverTime}></div>
                        }                        
                    </div>
                </DatePicker>
            </fieldset>

            <fieldset>
                <label htmlFor="money">设置满多少则可使用</label>
                <div className="input-wrap">
                    <input
                        name='money'
                        placeholder='请输入满减价格（元），不填则无限制'
                        value={minMoney}
                        onChange={onMinMoneyChange}
                    />
                    {
                        minMoney !== '' && minMoney != null &&
                        <div className="clear" onClick={props.clearMoney}></div>
                    }
                </div>
            </fieldset>

            <fieldset>
                <label htmlFor="remark">备注</label>
                <div className="input-wrap">
                    <input
                        type="text"
                        name='remark'
                        placeholder='请填写备注，非必填项'
                        value={remark}
                        onChange={onRemarkChange}
                    />
                    {
                        remark !== '' && remark != null &&
                        <div className="clear" onClick={props.clearRemark}></div>
                    }
                </div>
            </fieldset>
        </form>
    );
};

CreateForm.propTypes = {
    
};

export default CreateForm;