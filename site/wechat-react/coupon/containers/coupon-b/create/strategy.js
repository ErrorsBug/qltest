let strategies = {
    //字符最大长度
    maxLength: (value, length, errMsg) => {
        if (value.length > length) {
            return errMsg;
        }
    },
    //是负数
    negative: (value, errMsg) => {
        if (Number(value) < 0) {
            return errMsg;
        }
    },
    isNumber: (value, errMsg) => {
        if (isNaN(Number(value))) {
            return errMsg;
        }
    },
    //是小数
    isFloat: (value, errMsg) => {
        let v = Number(value);
        if (Math.floor(v) !== v) {
            return errMsg;
        }
    },
    //最大数
    maxNum: (value, max, errMsg) => {
        if (Number(value) > Number(max)) {
            return errMsg
        }
    },
    biggerThan: (value, broad, errMsg) => {
        if (value <= broad) {
            return errMsg;
        }
    },
    //非空
    isNotEmpty: (value, errMsg) => {
        if (value === '') {
            return errMsg;
        }
    },
    //判断小数位数
    floatFix: (value, fix, errMsg) => {
        if (!/(^\d*[\.]?\d{0,2}$)/.test(value)) {
            return errMsg;
        }
    }
}

export default class Validator {
    constructor() {
        this.cache = [];
    }

    add (variable, rule, errMsg) {
        var str = rule.split(":");
        this.cache.push(() => {
            var strategy = str.shift();
            str.unshift(variable);
            str.push(errMsg);
            return strategies[strategy].apply(this, str)
        })
    }

    addMultipleRules (variable, rules) {
        for (let i = 0, rule; rule = rules[i++];) {
            let strategyAry = rule.strategy.split(':');
            let errMsg = rule.errMsg;
            this.cache.push(() => {
                let strategy = strategyAry.shift();
                strategyAry.unshift(variable);
                strategyAry.push(errMsg);
                return strategies[strategy].apply(this, strategyAry)
            })
        }
    }

    start () {
        for(var i = 0, validatorFunc; validatorFunc = this.cache[i++]; ) {
            var msg = validatorFunc(); // 开始效验 并取得效验后的返回信息
            if(msg) {
                return msg;
            }
        }
    }
}