
/**
 * 给函数绑定一个后置方法，执行完当前函数后执行
 *
 * @param {Function} afterfn
 * @returns
 */
Function.prototype.after = function (afterfn) {
    const __self = this;
    return async function () {
        const ret = await __self.apply(this, arguments);
        afterfn.apply(this, arguments);

        return ret;
    }
};

/**
 * 传递一个同一个类下的函数属性名，绑定到当前方法，当前方法执行完后将会执行该方法
 *
 * @param {string} afterFn
 * @returns
 */
function bindAfter(afterFn) {
    return (target, key, descriptor) => {
        target[key] = target[key].after(target[afterFn])
        return () => { }
    }
}

/**
 * 作为装饰器使用，装饰带有修改操作的函数
 * 装饰的函数在执行完后会执行saveSession方法将修改后的数据保存到session
 */
export const bindAfterSave = bindAfter('saveSession')

