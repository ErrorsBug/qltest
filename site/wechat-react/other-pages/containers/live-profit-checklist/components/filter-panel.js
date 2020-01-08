import React from 'react'
import PropTypes from 'prop-types'

import Actionsheet from 'components/dialog/bottom-dialog';

import DatePicker from 'components/date-picker'
import dayjs from 'dayjs';



function FilterPanel(props) {
    const {
        isLiveMedia, haveMediaProfit,
        showFilter, onFilterConfirm, onFilterHide,
        timeFilter, timeFilterValue, onTimeFilterChange,
        typeFilter, typeFilterValue, onTypeFilterChange,
     } = props
    return (
        <Actionsheet
            show={showFilter}
            theme='empty'
            className='filter-container'
            onClose={onFilterHide}
        >
            <main>
                <section className='filter-section'>
                    <h1 htmlFor="">按时间</h1>
                    <div>
                        {
                            timeFilter.map((item, index) => {
                                return <span key={index.toString()}>
                                    <input
                                        name='time-filter'
                                        id={'time-' + item.value}
                                        value={item.value}
                                        type="radio"
                                        checked={timeFilterValue === item.value}
                                        onChange={onTimeFilterChange}
                                    />
                                    <label htmlFor={'time-' + item.value}>{item.text}</label>
                                </span>
                            })
                        }
                    </div>
                </section>

                {
                    timeFilterValue === 'CUSTOM' &&
                    <section className='filter-section scale-block'>
                        <h1 htmlFor="">自定义时间</h1>
                        <div>
                        <DatePicker mode="datetime"
                            title="选择时间"
                            maxValue={dayjs(props.endDate)}
							value={props.startDate ? dayjs(props.startDate) : dayjs(new Date(Date.now() + 25 * 60 * 60 * 1000))}
							style="normal-time-picker"
							barClassName="input"
							onChange={props.onStartDateSelect}
							>
                                <var>{props.startDate}</var>
                        </DatePicker>
                            
                            <i>-</i>
                        <DatePicker mode="datetime"
                            title="选择时间"
							minValue={props.startDate? dayjs(props.startDate) :dayjs(new Date(Date.now() + 24 * 60 * 60 * 1000))}
							value={props.endDate ? dayjs(props.endDate) : dayjs(new Date(Date.now() + 25 * 60 * 60 * 1000))}
							style="normal-time-picker"
							barClassName="input"
							onChange={props.onEndDateSelect}
							>
                                <var>{props.endDate}</var>
                        </DatePicker>
                            
                        </div>
                    </section>
                }

                <section className='filter-section'>
                    <h1 htmlFor="">按类型</h1>
                    <div>
                        {
                            typeFilter.map((item, index) => {
                                // if (!isLiveMedia && item.value === 'KNOWLEDGE') {
                                //     return;
                                // }
                                if (!haveMediaProfit && item.value === 'MEIDA_PUT') {
                                    return;
                                }
                                return <span key={index.toString()}>
                                    <input
                                        type="radio"
                                        name='type-filter'
                                        id={'type-' + item.value}
                                        value={item.value}
                                        checked={typeFilterValue === item.value}
                                        onChange={onTypeFilterChange}
                                    />
                                    <label htmlFor={'type-' + item.value}>{item.text}</label>
                                </span>
                            })
                        }
                    </div>
                </section>
            </main>

            <footer onClick={onFilterConfirm}>确定</footer>

        </Actionsheet>
    );
};

FilterPanel.propTypes = {
    showFilter: PropTypes.bool.isRequired,
    onFilterConfirm: PropTypes.func.isRequired,
    onFilterHide: PropTypes.func.isRequired,
    onStartDateSelect: PropTypes.func.isRequired,
    onEndDateSelect: PropTypes.func.isRequired,
    timeFilter: PropTypes.array.isRequired,
    timeFilterValue: PropTypes.string.isRequired,
    typeFilter: PropTypes.array.isRequired,
    typeFilterValue: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
};

export default FilterPanel;