import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const CouponStatusBar = props => {
    return (
        <section className='coupon-status-bar'>
            {
                props.tabs.map((item, index) => (
                    <span key={`tab-item-${index}`} 
                        className={classnames({ active: item.active })}
                        onClick={ props.onTabClick.bind(null, index) }>
                        { item.name }
                        { item.num != 0 && `(${item.num})` }
                    </span>
                ))
            }
        </section>
    );
};

CouponStatusBar.propTypes = {
    // tab list
    tabs: PropTypes.array.isRequired,
    // call this function when tab item was clicked
    onTabClick: PropTypes.func,
};

CouponStatusBar.defaultProps = {
    tabs: [],
    onTabClick: () => null
}

export default CouponStatusBar;






// function methodName (path) {
//     return new Promise(function (resolve, reject) {

//         // 直接用
//         fs.mkdir(path, function (err, data) {
//             // 直接用
//             console.log(path);

//             if (err) {
//                 // 调用reject就会被.catch捕获
//                 reject(err);
//             } else {
//                 // 调用resolve就会被.then捕获
//                 resolve(data);
//             }
//         })
//     });
// }

// methodName('/path/to/abc.txt')

// // 调用方法一、
// methodName(args)
//     .then(function (data) {
//         // 这里可以拿到resolve(data)传进来的data
//     })
//     .catch(function (err) {
//         // 这里可以拿到reject(err)传进来的err
//     })

// // 调用方法二、  对这个有映像就行，之后想这么用的时候再看一下
// try {
//     // resolve(data) 就是这个data
//     var data = await methodName(args);
// } catch (err) {
//     // 错误处理，reject(err) 就是这个err
// }
